---
id: polyjuice_zh
title: Polyjuice 的技术细节
---
[Polyjuice](https://github.com/nervosnetwork/polyjuice) 是一个以太坊兼容层，在 CKB 上实现了以太坊的大部分功能，包括在 CKB-VM 上运行 EVM 合约。我们相信，我们已经实现了 EVM 的全功能兼容，这也是 CKB-VM 的强大之处。通过 polyjuice 我们想展示，在 Nervos CKB 上使用账户模型是完全可能的。这种灵活性将带来无限可能性。

## 基础概念

### 账户

账户分两类：合约账户和 EoA 账户。

**合约账户**

Polyjuice 中的合约账户是一个由 Polyjuice `类型脚本（type script）` 约束的 Cell。`类型脚本（type script）` 的 `args` 是一个`type_id`值，所以 `类型脚本（type script）` 是唯一的。Cell 数据的前 32 个字节是合约的`存储根 stogage root`（sparse-merkle-tree）。Cell 数据的第二个 32 字节是合约的`code_hash`（blake2b(code)）。由于我们希望每个人都能使用该合约，所以我们默认使用总是成功的 `锁脚本（lock script）`。我们也可以使用任何`锁脚本（lock script）`进行访问控制或其他目的。

**EoA 账户**

Polyjuice 的 EoA 账户是默认被 secp256k1 sighash 的 `锁脚本（lock script）` 锁定的所有 `可用 Cell（live cell）`。账户的 id 就是 `锁脚本（lock script）` 的 args。


### 合约

Polyjuice 中的合约与以太坊合约几乎相同。你可以用 Solidity、Vyper 或 Assembly 编写你的合约，然后编译成 EVM 字节码。也有一些小的差异。由于不可能从当前区块中读取区块信息，我们反而从最近的区块中读取区块信息。最近的意思是包括交易输入的最新的区块。


```
max(block_number(inputs))
```

它将影响以下操作码：

- `BLOCKHASH` 
- `COINBASE` 
- `TIMESTAMP`
- `NUMBER`
- `DIFFICULTY`
- `GASLIMIT`

`DIFFICULTY` 值指的是[Nervos CKB](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md#dynamic-difficulty-adjustment-mechanism) 的难度。这里的 `GASLIMIT` 是一个常量值，等于 `int64_t `（9223372036854775807）的最大值。交易费用取决于交易的规模以及 [cycles](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.zh.md)，所以 gas 限制在 Polyjuice 中是无意义的。

`COINBASE` 的返回值和  `SELFDESTRUCT` 受益人地址是 `锁脚本（lock script）` 哈希的前 20 字节，如下：

```
blake2b(lock_script)[0..20]
```

### 程序 program 

程序（program ）就是一个带参数的 `CREATE` 或 `CALL`。由于 polyjuice 支持合约调用合约，所以一个polyjuice 交易可以包含多个程序，这些程序将被序列化并放入见证（witness）中。

### 生成器

Polyjuice 生成器可以通过 JSONRPC API 生成 Polyjuice 交易，如下：

```
fn create(sender: H160, code: Bytes) -> TransactionReceipt;
fn call(sender: H160, contract_address: H160, input: Bytes) -> TransactionReceipt;
```

### 验证器

Polyjuice 验证器是一个 `类型脚本（type script）`，用于验证合约 Cell 的转换。

### 索引器

索引器是 Polyjuice 的一个模块，用于索引 CKB 区块中的所有 Polyjuice 交易。合约元数据，修改以及 Polyjuice 交易的所有日志都会被保存。另外，所有可用 Cell（live cell）s 也会索引，以便运行生成器（编译 Polyjuice 交易）

## 设计细节

### 如何组织 CKB 交易中的 Cells？

<img src="../assets/essay/polyjuice-transaction-structure.jpg" width = "600"/>

如果图片不够清晰，请查看：
 **[组织交易中的 Cells](https://github.com/TheWaWaR/polyjuice/blob/docs/docs/assets/polyjuice-transaction-structure.pdf)**

### CKB 交易生成过程

<img src="../assets/essay/polyjuice-how-generator-works.jpg" width = "600"/>

如果图片不够清晰，请查看：
**[CKB 交易生成过程](https://github.com/TheWaWaR/polyjuice/blob/docs/docs/assets/polyjuice-how-generator-works.pdf)**

### CKB 交易验证过程

<img src="../assets/essay/polyjuice-how-validator-works.jpg" width = "600"/>

如果图片不够清晰，请查看：
 **[CKB 交易验证过程](https://github.com/TheWaWaR/polyjuice/blob/docs/docs/assets/polyjuice-how-validator-works.pdf)**

### 通过 ckb-vm syscalls 通讯

在生成器和索引器中，我们使用 syscalls 处理程序执行过程中的发出的事件。当前使用的 syscalls 如下：

- 2177 用于 ckb_debug，当你想调试生成器的时候有所帮助。
- 3075 用于返回 EVM 结果。
- 3076 用于日志
- 3077 用于保存`SELFDESTRUCT` 受益人地址。
- 3078 用于处理 CALL 和 CREATE 操作码。
- 3079 用于返回合约的代码大小给 EVM。
- 3080 用于返回合约的代币段给 EVM。

## 实现细节

### 如何进行合约创建？

发送者（EoA账户）或合约中 CREATE 指令可以完成合约的创建。在生成器中，创建的 Cell 将被分配一个type_id `类型脚本（type script）`，合约的 `code hash` 将被保存在账户存储根哈希值旁边的数据字段中。在验证器中， `类型脚本（type script）`将检查合约的 `code hash` 是否与数据字段中的 `code_hash` 匹配。

### 如何进行合约销毁？

只有在执行 `SELFDESTRUCT` 操作码时才会发生合约销毁。在生成器中，将销毁后的合约 Cell 作为输入消耗，然后把一个输出 Cell 作为受益 Cell，受益地址就是对应的 secp256k1 sighash `锁脚本（lock script）`。

### 如何生成合约间调用的 CKB 交易？

当在 EVM 中调用 CALL 或 CREATE 操作码时，我们将这种操作成为合约间调用的交易。当调用 CALL 操作码，当调用 CALL 操作码时，生成器从数据库或保存状态（合约已经从数据库中加载）中按目的地加载合约代码和最新的存储内容并执行。当 EVM 启动后执行 CREATE 操作码时，生成器会像创建合约一样放置一个输出 Cell。

### 如何验证合约间调用交易？

EoA 账户创建或调用的第一个合约我们称之为**入口**合约，其他合约如果有，我们称之为普通合约。在入口合约中只允许有一个程序，它对普通合约程序的所有调用必须符合顺序和计数。所有正常合约对子正常合约的程序的调用必须检查它们是否符合要求。由于多个合约可以调用一个合约，所以正常合约不能检查计数。正常合约只检查自己的程序，入口合约会检查当前 CKB 交易中所有被调用的限制序列的程序。

### 如何核实合约发送者（EoA 账户）？

由于 EVM 的执行会用到发送者信息，所以我们要求发送者在 Polyjuice 交易中签名，并将签名放入见证中。签名内容必须包括两部分。

1. 交易哈希
2. 所有合约相关的见证（witness）

与合约相关的见证被序列化为 `WitnessArgs` molecule 结构的一部分，信息位于 input_type（合约调用/销毁）字段或 output_type（合约创建）字段。

### 如何处理日志？

在验证器中，日志直接被忽略了。当生成器生成 Polyjuice 交易时，日志被保存下来，并作为交易收据的一部分返回。当索引器处理 Polyjuice 交易时，日志会被保存到数据库中，供用户查询。

 在生成器和索引器中，日志是由 LOG 操作码触发的，然后：

1. 回调函数 `emit_log` 被触发
2. emit_log 函数附带 `topics` 和 `data` 作为参数，调用一个日志系统调用（log syscall）
3. Rust 的系统调用（syscall）处理函数被调用，参数被提取并保存。

