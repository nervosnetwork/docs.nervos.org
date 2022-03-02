---
id: cell
title: Cell
---

Nervos CKB (Common Knowledge Base) is a layer 1 blockchain, a decentralized and secure layer that provides common knowledge custody for the network.  Common knowledge refers to **states** that are agreed via global consensus.

**Cells are the primary state units** in CKB and assets owned by users. They must follow associated validation rules specified by scripts. In Bitcoin, money is the typical common knowledge stored in the Bitcoin ledger. Nervos CKB, however, takes one step further to store arbitrary common knowledge. We starts from Bitcoin's general architecture, and creates the [Cell Model](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571) by generalizing from the UTXO model, while at the same time retaining the consistency and simplicity of Bitcoin.

## Data Structure

**Example:**

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

A Cell has three fields：

* `capacity`: Capacity serves 2 purposes: on one hand, it represents the amount of CKB tokens stored in the cell, on the other hand, it also sets the limit on how much information the cell can store. The basic unit for capacity is `shannon`, a bigger unit `CKByte`, or just `CKB` is also used. 1 CKB equals `10**8` shannons, 1 CKB also means the cell can store 1 byte of information. See below for how to calculate the total information size of a cell.
* `lock script`: A script used to guard the cell: when the specified cell is used as an input cell in a transaction, the lock script included in a cell will be executed. The transaction will be rejected when the lock script fails in execution. One typical use case for lock script, is to represent the ownership of a cell, meaning a signature verification phase is usually included in the cell.
* `type script`: A script used to validate cell structure. The type script of a cell will be executed both when the cell is included as an input cell, as well as when the cell is created as an output cell. Due to this nature, type script is typically used to validate dapp logic, such as creating UDTs.

Each cell must have a lock script, while type script is optional, and can be omitted. Please refer to [Script](script.md) for the actual format of lock and type script.

### Cell data

In addition to the above fields, each cell also contains a cell data field. Cell data is just a series of unformatted binary data. Depending on each dapp, anything could be stored in the cell data part:

* Script code as explained in [Script](script.md).
* Token amount for User Defined Token cells.
* Latest game stats for an on-chain fantasy game.

For future potential, cell data is not stored directly in a cell. It is kept directly in the [Transaction](transaction.md#data-structure). You might find a field named `outputs_data` in each transaction. This array should have the same length with `outputs`. At each index location, the corresponding cell data could be located for each created output cell in the transaction. Conceptually, we still consider cell data as part of each output cell.

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
