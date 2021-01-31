---
id: script_zh
title: Script 脚本
---

如果你接触过以太坊开发，你就会发现 CKB 使用着完全不同的验证模型：不是像以太坊一样通过创建交易去修改区块链状态，在 CKB 中，交易直接以 Cells 的形式来包含状态转换。为了改变现存 Cells 的状态，只需以原子交易的方式销毁原先的 Cells，然后创建新的 Cells。运行在 CKB VM 上的 CKB 脚本实际上就是执行交易中输入 Cells 和输出 Cells 中的一系列验证规则。

在本章节中，我们将仔细研究脚本的数据结构，并说明 `锁脚本（lock script）` 和 `类型脚本（type script）` 是如何协作确保 CKB 的验证规则有效执行的。

注意：我们需要区分一下 `脚本代码 script code` 和 `脚本 script`  两者的区别：

* `脚本代码 script code` 是指你所编写并部署到 CKB 的已编译程序。在 CKB VM 中运行以执行验证规则的二进制文件就是它。
*  `脚本 script`  是指在 Cell 数据结构中 `锁脚本（lock script）` 和 `类型脚本（type script）` 使用的脚本数据结构。

## 数据结构

 `锁脚本（lock script）` 和`类型脚本（type script）` 都使用同样的数据结构： `脚本 script` 

**Example:**

```
{
  "hash_type": "type",
  "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  "args": "0xc285e812f6a35c2479d6f5b9bbaa357dd4e60da1"
}

{
  "hash_type": "data",
  "code_hash": "0xe7f93d7120de3ca8548b34d2ab9c40fe662eec35023f07e143797789895b4869",
  "args": "0x42b5561f13c2a8f7c710843bea7d179656dc6133a98b7d763cebc6e74c8ba72a"
}
```

一个 `脚本 script`  具有三个字段：

* `code_hash`：该哈希值表示执行交易中的哪个脚本。出于空间占用的考虑，实际的脚本代码是保存在    [可用 cell（live cell）](cell#live-cell) 中的数据部分。当前交易需要通过 [cell deps](transaction) 引用该 可用 cell（live cell） 以定位和执行脚本。
* `hash_type`：当从 cell deps 中查找脚本代码时，对 `code_hash`  的一个辅助解释。

    + 如果 `hash_type` 为 `data`, `code_hash` 应该匹配 dep Cell 中数据（也是脚本代码）的 blake2b 哈希 ;
    + 如果 `hash_type` 为 `type`, `code_hash` 应该匹配 dep Cell 中 类型脚本（type script） 的 blake2b 哈希。注意 CKB 在以下情况会抛验证错误：1) 使用 `type` 作为 `hash type` 来定位脚本代码； 2) cell deps 引用的包含指定 类型脚本（type script） 的 Cell 不止一个。

     `code_hash` 和 `hash_type` 结合可以唯一确定 CKB 中的某段脚本代码 script code。
* `args`：脚本 script 的辅助参数。这就是我们在本节开头需要区分 `脚本代码 script code` 和 `脚本 script` 的原因： 借助 `args`参数,  `script`  实际上是代表着`script code`的一个实例。典型示例如下：

    + 虽然`script code`用于 secp256k1 实现，但是不同的人可以给 `args` 赋值不同的公钥，也就会对应着不同的钱包。
    + 虽然 `script code`可以提供 UDT 规范，但不同的用户可以插入不同的`args`参数实现不同类型的代币。

下面小节我们会讨论如何执行脚本来验证交易结构。

根据不同的类型，脚本会在不同的时间执行：

1. 交易中的所有输入 Cells 的 `锁脚本（lock script）` 都会被执行。
2. 交易中的所有输入 Cells 和输出 Cells 的所有 `类型脚本（type script）` 都会被执行。

只有在所有必需的脚本都成功执行时，我们才认为交易有效。任何脚本的失败都意味着交易失败。

## 执行

本章节我们只是对脚本执行流程的一个简单介绍，更详细准确的定义，可以参考一下 RFCs：

* [CKB VM](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0003-ckb-vm/0003-ckb-vm.zh.md)
* [VM Syscalls](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0009-vm-syscalls/0009-vm-syscalls.zh.md)
* [VM Cycle Limits](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.zh.md)

交易中需要执行的脚本都的在 CKB VM 实例中运行。CKB VM 的核心是 [RISC-V](https://riscv.org/) 指令集体系结构（ISA）的实现。它意味着任何兼容 RISC-V 标准的程序（更准确地说是 RV64IMC，具体请参阅 RFC）都可以在 CKB VM 中运行。常用的 [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) 格式用于打包二进制文件。

要将一个 RISC-V 程序在 CKB 上作为脚本使用，仅需创建一个新的 Cell，并把完整的程序二进制包放置在 Cell 的数据部分中。只要生成新 Cell 的交易提交到了 CKB 上，就会将该程序二进制包作为脚本代码组装到脚本中。如上所述，还会创建一个 cell dep 来引用包含脚本代码的新创建的 Cell。

在某些情况下，RISC-V ISA 是不够的，例如，脚本可能想从其所在交易中读取信息以执行验证规则，CKB 提供了一系列 `syscalls`可处理此任务。注意 `syscall` 是 RISC-V 标准 ISA 的一个概念。

为了避免死循环，CKB VM 引入了 `cycles(遍历)` 概念。每个执行的 RISC-V 指令和每个系统调用（syscall）都会消耗一定数量的 `cycles`。在共识层，CKB 对单个区块中的最大 `cycle(遍历)`次数有硬顶限制。单个区块中的所有交易中的所有脚本所消耗的`cycles（遍历）`数不得超过这个硬顶，否则该区块将被拒绝。

## 用例

`锁脚本（lock script）` 和 `类型脚本（type script）` 共享着相同的运行环境，它们可以访问其自身所在交易中的的任何信息。但由于它们的执行时间不同，所以也就应用于不同的用例。

### 锁脚本（lock script）

`锁脚本（lock script）` 更多地是代表着所有权。其传统的用例为：

* 签名验证
* 锁定期保证

你可能注意到了 `类型脚本（type script）` 可以完成 `锁脚本（lock script）` 的所有功能，也就是说 Cell 的 `锁脚本（lock script）` 可以为空，然后依赖 `类型脚本（type script）` 完成所有验证操作。但这其实跟 CKB 目前的模式是相反的。我们希望能够通过强制使用 `锁脚本（lock script）` ，来确保每个 Cell 都具备一个安全的 `锁脚本（lock script）`。

`锁脚本（lock script）` 可以视为保障你代币安全的最后一道屏障。因此，我们建议你尽可能保持 `锁脚本（lock script）` 的简单性，避免引入潜在的漏洞。

### 类型脚本（type script）

`类型脚本（type script）` 更像是 CKB 上的创新创造营，可以有如下用例：

* 用户自定义代币（UDT）的实现
* 确保 Cell 数据符合某种格式
