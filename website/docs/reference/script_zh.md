---
id: script_zh
title: Script 脚本
---

如果你接触过以太坊开发，你就会发现 CKB 使用着完全不同的验证模型：不是像以太坊一样通过创建交易去修改区块链状态，在 CKB 中，交易直接以 Cells 的形式来包含状态转换。为了改变现存 Cells 的状态，只需以原子交易的方式销毁原先的 Cells，然后创建新的 Cells。运行在 CKB VM 上的 CKB 脚本实际上就是执行交易中输入 Cells 和输出 Cells 中的一系列验证规则。

在本章节中，我们将仔细研究脚本的数据结构，并说明 `lock scripts` 和 `type scripts` 是如何协作确保 CKB 的验证规则有效执行的。

注意：我们需要区分一下 `脚本代码 script code` 和 `脚本 script`  两者的区别：

* `脚本代码 script code` 是指你所编写并部署到 CKB 的已编译程序。在 CKB VM 中运行以执行验证规则的二进制文件就是它。
*  `脚本 script`  是指在 Cell 数据结构中 `lock script` 和 `type script` 使用的脚本数据结构。

## 数据结构

 `lock script` 和`type script` 都使用同样的数据结构： `脚本 script` 

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

* `code_hash`：该哈希值表示执行交易中的哪个脚本。处于空间占用的考虑，实际的脚本代码是保存在    [live Cell](cell#live-cell) 中的数据部分。当前交易需要通过 [cell deps](transaction) 引用该 live Cell 以定位和执行脚本。
* `hash_type`：当从 cell deps 中查找脚本代码时，对 `code_hash`  的一个辅助解释。

    + 如果 `hash_type` 为 `data`, `code_hash` 应该匹配 dep Cell 中数据（也是脚本代码）的 blake2b 哈希 ;
    + if `hash_type` contains `type`, `code_hash` should instead match the blake2b hash of type script contained by a a dep cell. Note CKB will throw a validation error when a) we are locating a script code using `type` as `hash_type`; and b) more than one cell referenced by cell deps contains the specified hash of type script.

    The combination of a `code_hash` and a `hash_type`, will uniquely identify a script code in CKB.
* `args`: Auxiliary arguments for a script. This is why we need to distinguish between `script code` and `script` above: through `args`, a `script` actually represents an **instance** of a `script code`. Typical examples include:
    + While a single `script code` will be used for secp256k1 implementation, different people might include different public keys into `args` to create different `script`s, which lead to different wallets.
    + While a single `script code` might provide implementation for the [UDT](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) specification, different people might inject different `args` for different types of tokens.

We will talk about how to execute a script to validate transaction structure in sections below.

Depending on the different types, scripts will be executed at different times:

1. All lock scripts from all input cells in a transaction will be executed.
2. All type scripts(if exist) from all input cells and output cells in a transaction will be executed.

We will consider the transaction valid only when all the required scripts complete with a success status. Failure in any script will mark the transaction as invalid.

## Execution

Here we are providing a basic introduction for script execution flow, for the more precise definition, please refer to the following RFCs:

* [CKB VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md)
* [VM Syscalls](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md)
* [VM Cycle Limits](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.md)

Each script that needs to be executed from a CKB transaction, will be run in a [CKB VM](https://github.com/nervosnetwork/ckb-vm) instance. At its core, CKB VM is just an implementation of the [RISC-V](https://riscv.org/) Instruction Set Architecture(ISA). It means any RISC-V standard compliant program(RV64IMC to be more precise, see the RFCs for more details) will be accepted by CKB VM. The common [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) format is used to package a binary.

To use a RISC-V program as a script on CKB, one simply needs to create a new [cell](cell) with the full program binary in the cell's data part. One the transaction generating the new cell is committed on CKB, scripts can then be assembled to use the program as script code. As mentioned above, a cell dep entry must be also create to reference the newly created cell containing script code.

There are cases that RISC-V ISA is not be enough, for example, a script might want to read information from the enclosing transaction to enforce validation rules, CKB provides a series of `syscalls` that will handle this task. Notice `syscall` is a concept also designed and included by the RISC-V standard ISA, we are confronting to RISC-V standard specification as much as we can.

To prevent infinite loops, `cycles` are introduced to CKB VM. Each executed RISC-V instruction and each syscall made will consume certain amount of cycles. At consensus layer, CKB has a hard limit on the maximum cycles that is allowed in a single block. The total cycles consumed by all executed scripts, from all transactions included in a blocks, must not exceed this number. Otherwise the block will be rejected.

## Use Cases

Lock script and type script share the identical running environment, they can all access all the information contained in its enclosing transaction. But due to the fact they are executed in different times, they have formed into different use cases.

### Lock Script

Lock scripts are more for representing ownerships. Typical use cases for lock scripts include:

* Signature verification
* Lock period ensurance

You might notice that type script can actually replace all functionalities of a lock script, meaning a cell can use a dummy lock script that does nothing, and rely on type script for all behaviors. But that is an anti-pattern of CKB now. By making lock script mandatory, we want to ensure each cell at least uses a secure lock script.

Lock script can be viewed as the last defense to ensure that your tokens stay safe. So we do recommend to keep your lock as simple as possible, to avoid the potential of vulnerabilities.

### Type Script

Type script, on the other hand, is where innovations would more likely to happen on CKB. Some use cases of type scripts include:

* User Defined Token(UDT) implementation
* Ensuring cell data confronts to a certain format
