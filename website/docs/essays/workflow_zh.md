---
id: rules
title: 构造交易的一般工作流程
---

本文档将解释如何以最简单、最常见的方式在 CKB 上构造一个可验证的交易。它不涉及构造验证脚本、合约等。

在 CKB 上，任何交易都必须有至少一个输入和一个输出。要构造一笔交易，首先需要的是能够有效定位输入，这个过程被称为 "cell 收集"。

## Cell 收集

首先要了解的是，CKB 的 [cell 模型](https://docs.nervos.org/basic-concepts/cell-model.html)与 UTXO 模型非常相似，这意味着在没有任何预缓存的情况下，不可能知道任何地址的当前状态。构成地址当前状态的信息可能分散在区块链上的不同 cells 中，cell 收集方法是正确使用 CKB 的前提。CKB 的 cell 模型将在 [Cell](reference/cell_zh.md) 中详细介绍。

当前有两种方式可用于收集 cell：

### 使用 ckb 索引器服务

本节介绍一种简单的方法，可以识别指定地址的有限信息（如 live cell 数、交易数、总容量）。但是，这种方法是基于 CKB 节点的索引功能，只适合简单的使用（也会消耗CKB节点的资源）。

这种方法也不能根据更详细的搜索条件进行 cell 收集。例如，用这种方法无法找到合约 cell。

Regardless of these shortcomings, let's start with this method to better understand how cell collection works. By default, this feature is turned off in the CKB node. To turn it on, manually change the configuration file as outlined below and restart the CKB node.

我们先不管这些缺陷，先用这个方法来帮助我们理解 cell 收集的工作原理。默认情况下，这个功能在 CKB 节点中是关闭的。要打开它，请按照下面的说明手动更改配置文件，然后重新启动 CKB 节点。

在 `ckb.toml` 文件中找到下面配置项：

```
[rpc]
...
# List of API modules: ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Indexer", "Experiment"]
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment"]

```

上面示例的配置中，索引服务是没有开启的，我们将 “indexer” 加入数组中以开启索引服务。

```
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment", "Indexer"]

```

使用 `ckb run -C <path>` 命令重启 CKB 节点后，通过RPC方法 [index_lock_hash](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md#index_lock_hash) 注册你要索引的地址。

*Note that the `index_from` parameter controls the point that indexing starts from: a null value begins indexing from the current chain tip (current latest block), while a value of 0 begins indexing from the genesis block.*

*需要注意的是，`index_from` 参数控制了索引的起始点：空值从当前链尾（最新的区块）开始索引，而值为 0 的则从创世区块开始索引。*

等待索引服务重编译，然后使用索引服务的 RPC 接口查看对应地址的可用 cell/交易/容量值。可以参考 [JSON-RPC](reference/rpc.md)。

要关闭索引服务，请按照以下流程进行：通过 RPC 取消注册观察列表，关闭服务，并从`ckb.toml` 文件中的数组中删除 "Indexer"。

### 打造你自己的 Cell 收集服务 

**打造你自己的 Cell 收集服务有何优势？**

我们都知道，一笔交易包括 cell 的创建和销毁。然而，由于 cell 模型的灵活性，任何有用的数据都可以存储在 cell 数据字段中，各种类型的合约都可以通过类型脚本（type scripts）来表达。因此，每个用户或用例可能对 cell 收集有不同的要求。

有很多问题需要探讨，每个问题的背景不同，答案也不同。

* 消耗的顺序是怎样的？先进先出，根据大小排序，最佳适配原则等？
* 能消耗什么类型的 cell？是只能特定的类型还是任意类型都行？ 
* 有没有什么 cell 数据或者 cell 类型需要特殊进行处理的？
* 选定 cells 后是否需要进行过滤/确认？

The indexing service that comes with the CKB node does not address these requirements and cannot be configured to include additional requirements that may be needed in the future. The most effective approach to cell collection is to build the functionality yourself.

**How to build cell collection**

As a new block is added to the chain, the cells used as inputs to the block must be removed from the live cell set and the outputs created by the block must be added into the live cell set.

We know that short forks are always possible in PoW blockchains. When a fork negates the effects of a previously accepted block, the input and output changes from that block must be rolled back. A cache design may help to speed up synchronization, for example, caching the last *n* blocks in the chain and removing the live cells consumed in these blocks.


## Constructing a Transaction

Now that we have covered cell collection, we can start the process of constructing a transaction. There are a series of concepts that need to be explained, including the construction of witnesses, the calculation of transaction fees and the use of some small tricks. [Refer to RFC0022 - Transaction Structure for more detailed information.](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

All types are serialized based on the [molecule](https://github.com/nervosnetwork/molecule) serialization system, the core struct is:

```
table RawTransaction {
  version:        Uint32,
  cell_deps:      CellDepVec,
  header_deps:    Byte32Vec,
  inputs:         CellInputVec,
  outputs:        CellOutputVec,
  outputs_data:   BytesVec,
}

table Transaction {
  raw:            RawTransaction,
  witnesses:      BytesVec,
}
```

`cell_deps` and `inputs` are a series of pointers to live cells on the chain. The difference is that `cell_deps` are a reference (read-only) and inputs are consumed in the transaction. The index struct for these transaction inputs is:

```
struct OutPoint {
  tx_hash:        Byte32,
  index:          Uint32,
}

struct CellDep {
  out_point:      OutPoint,
  dep_type:       byte,
}
```

`tx_hash` and `index` are used to locate cells (a reference to the transaction that created them and the index number the cell appeared in the outputs). The `cell_dep` has an extra `dep_type` field, which is used to express whether the data in the cell is `code` or `dep_group`. Code stored in multiple cells can be combined using the `dep_group` functionality.

For `dep_type`:

* Use value of 0 to indicate `code`, meaning that the cell data can be used directly

* Use value of 1 to indicate a `dep group`, which means that the data in this cell is a redirect field (recursion is not allowed here). The referred `dep group` data uses `vector OutPointVec <OutPoint>` to list all needed outpoints. 

An example of `dep_group` usage: the default lock cell uses dep group functionality to divide the secp256k1 library into two cells to store the multiplication table and code. This is needed because block size is limited, if total dep data is too large to fit in one block, it can be stored in multiple cells (added in separate transactions confirmed in separate blocks) and later can be loaded together at runtime through the dep_group functionality.

`outputs` and `outputs_data` are two one-to-one lists. There is only capacity and type/lock script in the `output`. The output data is placed in the `outputs_data` corresponding to the index.

The `header_dep` is a list of past block header hashes. Header data referenced in this list can be accessed by CKB scripts during execution.

Now that the basics of the transaction structure have been explained, let's explore a slightly more complicated structure.

### script

```
table Script {
  code_hash:      Byte32,
  hash_type:      byte,
  args:           Bytes,
}
```

`code_hash` and `hash_type` are used to specify a lock cell, `args` are the parameters required by the lock script. The `hash_type` field has two possible values:

* when it is "data" represented by 0, code_hash means lock cell's data hash
* when it is "type" represented by 1, code_hash means lock cell's type script hash

It is very easy to understand what will happen when a `hash_type` value of “code” is used, but what about a value of “type”? What does this mean for contract developers?

When a value of “type” is used, the value that is specified is a cell type script hash. The default lock script of CKB is indexed by type. The dep cells of the transaction will be examined for a cell that has this value as its type script, and the data in that cell will be used as the code for type script execution. 

To see how this functionality can be used, we can take a look at the implementation of TypeID, which is used to refer to a cell by reference. You can see that the type script of the second output of the genesis block is a TypeID script. If your published library also binds this TypeID script, it will generate a unique id(code hash) for indexing the data. You can then update the content of this library without changing the typeid. Any contract that references this library (by the unique type script value) will still work even if the library is changed. This is a solution to update on-chain libraries.

### witness

Now that all `RawTransaction` fields have been set, let's take a look at the witnesses field. This field ensures that the transaction cannot tamper with other transactions, and this field also allows inclusion of temporary variables that may be needed by the contract. It consists of a series of witnesses:

```
table WitnessArgs {
  lock:                   BytesOpt,          // Lock args
  input_type:             BytesOpt,          // Type args for input
  output_type:            BytesOpt,          // Type args for output
}
```


An input requires a witness for verification. However, including a witness for every input would be inefficient if multiple inputs used the same lockscript. When each individual transaction is verified, scripts will first be separated into groups (transactions with the same script hash will be grouped together) and then executed sequentially in units of script groups.

This is equivalent to combining multiple script verifications into a single execution, reducing resource consumption and the size of witness data. This does however require the developer to be aware when writing the script that it should consider the case of validating multiple cells in this way.

The witness is a signature on the blake2b-hash of the entire transaction, including `tx_hash`, length, and a zero-ed out placeholder for witness data (once the signature is generated it will be placed in this field). The specific signing process and the convention regading how the witnesses for different script groups are arranged can be found in this [wiki](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction).

### Format and Fee

Through the above process, we have obtained a complete `Transaction` structure. At this time, to derive the absolute minimum fee that will be accepted by miners, we will need to do some backtesting (based on actual cycles consumed) and modification of the existing transaction.

### how to estimate A TRANSACTION fee?

The transaction fee is the sum of the size of the serialized transaction (molecule) and the sum of actual cycles consumed by executed instructions. The size unit is 1,000 shannons / KB (kilobyte) by default (shannon is 1/100,000,000 of CKByte).

However, miners can modify this default unit. If you need to see the real-time transaction fee estimate, you can view it through RPC using `estimate_fee_rate`.

If you want to use the lowest fee possible, you can continuously adjust the difference between the transaction’s input capacity and output capacity and regenerate the transaction until you are satisfied (using a binary search).
