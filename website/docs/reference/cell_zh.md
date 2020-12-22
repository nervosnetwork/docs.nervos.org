---
id: cell_zh
title: Cell 模型
---

Nervos CKB (Common Knowledge Base，共同知识库) 是一个去中心化的、安全的 layer 1 区块链网络，托管维护着网络的共同知识（Common Knowledge）。这里的共同知识指的是已经具备全球共识的状态数据。 

**Cells 是 CKB 中的主要状态单元**，也是用户所拥有的资产。它们必须遵循脚本指定的验证规则。在比特币网络中，账本中记录的是比特币的余额。而在 Nervos CKB 网络中，我们更进一步，除了存储 CKB 余额数据，还可以存储其他任意的资产状态数据。我们采用了类似比特币网络的 PoW 共识架构，在保留比特币协议的一致性与简单性的同时，将 UTXO 模型进行泛化，创造了 [Cell 模型](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571) 。

## 数据结构

**例子:**

```
{
  "capacity": "0x19995d0ccf",
  "lock": {
    "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
    "args": "0x0a486fb8f6fe60f76f001d6372da41be91172259",
    "hash_type": "type"
  },
  "type": null
}
```

Cell 的数据结构中有三个字段：

* `容量 capacity`: Capacity 字段起到两个作用：第一，它代表着当前 Cell 中所存储的 CKB 代币数量；第二，它同时也对应着当前 Cell 所能存储的信息容量的上线。容量的最小单位是 `shannon`，不过我们常用的单位是 CKByte，通常我们简写为 CKB。 1 CKB 等于 `10**8` shannons，1 CKB 也意味着 Cell 能够存储 1 字节的状态数据。有关如何计算 Cell 的总信息量大小，请参见下文。
* `lock script`:  `lock script ` 脚本用于保护 Cell：当指定的 Cell 在交易中被作为输入 Cell 使用时，Cell 中的 `lock script` 脚本就会执行。若 `lock script` 脚本在执行失败了，那么交易将被拒绝。`lock script` 的一个经典使用场景是代表着 Cell 的所有权，也就是说签名验证阶段通常包含在 Cell 中。
* `type script`：type script`脚本用于验证 Cell 结构。不管在交易中是作为输入 Cell 还是输出 Cell，Cell 中的 `type script` 脚本都会执行。由于这一特性，`type script` 通常被用于验证应用逻辑，例如创建 UDTs。

每个 Cell 都必须有 `lock script` 脚本，但是 `type script` 脚本是可选的，可以忽略。 请参考[脚本](script_zh.md)章节深入了解这两种脚本的实际格式。

### Cell 数据

除了以上的字段，Cell 还包含一个数据字段。Cell 数据是只是一系列未格式化的二进制数据。具体取决于实际的 dapp，任何数据都可以存储到 Cell 的数据字段中：

* 脚本代码， [脚本](script_zh.md) 章节会详细讲解。
* UDTs 的代币数量。
* 具体应用的相关数据统计。

For future potential, cell data is not stored directly in a cell. It is kepted in [transaction#data-structure] directly. You might find a field named `outputs_data` in each transaction. This array should have the same length with `outputs`. At each index location, the corresponding cell data could be located for each created output cell in the transaction. Conceptually, we still consider cell data as part of each output cell.

为了未来的开发潜力，Cell 数据没有直接存储在 Cell 中，数据直接保存在交易的数据结构中。在每笔交易中，你可以发现有一个名为 `outputs_data` 的字段。该字段数组的长度应该与 `outputs` 的长度相同。在每处索引位置，都可以为交易中的输出 Cell 定位到对应的 Cell 数据。但从概念上讲，我们仍然将 Cell 数据视为输出 Cell 的一部分。   

### Cell information size calculation

Each cell on Nervos CKB, must not have a lower capacity than the total size of information stored in the cell. The size of information for a cell is calculated as the sum of the following fields:

1. 8 bytes for cell capacity field.
2. 32 bytes for code hash in lock script.
3. 1 byte for hash type in lock script.
4. Actual bytes of args field in lock script.
5. If type script is present, 32 bytes for code hash in type script.
6. If type script is present, 1 byte for hash type in type script.
7. If type script is present, actual bytes of args field in type script.
8. Actual bytes of cell data.

By summing up all the above fields, we get the total size of information a cell needs. Cell capacity, when measured in `CKBytes`, respresents the maximum size of information that can be held, meaning a valid cell must ensure the CKBytes stored in capacity equal or is larger than the total size of information.

## Live Cell

Live cell refers to an unspent cell in CKB. It is similar to the concept of [UTXO](https://en.wikipedia.org/wiki/Unspent_transaction_output) in Bitcoin's terminology. The full set of live cells in CKB, is consider the full state of CKB at that particular point. Any transaction on CKB would consume some cells that were live cells just at the point before it is committed, and created new cells that are considered live cells after it is committed.

## Index-Query-Assemble Pattern

Nervos CKB is designed based on the concept of cells. A transaction, at its core, really just consumes some cells, and create another set of cells. As a result, the ability to locate and transform cells, plays a critical role in building any CKB dapps, which leads to the `index-query-assemble` pattern:

* Index: when a new block is committed to CKB, a dapp should be able to index relevant cells to its own storage for latter usage.
* Query: when a user action is requested, cells satisfying certain criteria will be queried from the dapp storage.
* Assemble: based on queried cells, a new transaction would be assembled to fulfill user requests.

We believe all CKB dapps can be decomposed into individual actions following this pattern. Here are some examples:

* In a normal CKB wallet, cells should be indexed based on lock scripts. A transfer action would first query cells from the sender, and assemble a transaction which transfer CKBytes to the receiver.
* A NervosDAO manager might index only cells related to NervosDAO. A user might then pick a NervosDAO cell and perform withdraw action, even though there is only one cell related, we can still view it as cells queried from the NervosDAO manager, and a transaction will also be assembled which performs the actual withdraw action.
* A state based dapp might choose to store the latest state in a CKB cell. The dapp will still need to track the latest live cell, which can also be viewed as an indexing operation, any action on the state will result in the latest live cell being queried, assembled into a transaction, then accepted by CKB with a new output cell containing the updated state.

### Tools

Indexing & querying plays a central role in any CKB dapps. In most cases, you don't have to build an indexer from scratch. There are several existing tools one can leverage to fulfill the job:

#### lumos

Our dapp framework, [lumos](https://github.com/nervosnetwork/lumos) already contains a ready-to-use indexer. When you are using lumos, it is very likely the indexer is already setup for you to use. Please refer to our labs for how to setup lumos.

#### ckb-indexer

A standalone [ckb-indexer](https://github.com/quake/ckb-indexer) also handles the job of indexing cells. It provides an RPC mechanism you can use to query for relevant cells. Please refer to the documentation of ckb-indexer for more details.

#### perkins-tent

If you are looking at a one-stop solution, [Perkins' Tent](https://github.com/xxuejie/perkins-tent) provides a single docker image that starts both CKB and ckb-indexer in one dockerisntance. With a single command, you should be able to start a CKB instance and be ready to use the enclosed ckb-indexer for querying tasks.
