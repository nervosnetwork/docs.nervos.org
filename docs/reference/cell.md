---
id: cell
title: Cell
---

Nervos CKB (Common Knowledge Base) is a layer 1 blockchain, a decentralized and secure layer that provides common knowledge custody for the network.  Common knowledge refers to **states** that are verified by global consensus. 

**Cells are the primary state units** in CKB and are assets owned by users that must follow associated application logic specified by scripts. In Bitcoin, money is the common knowledge stored in the Bitcoin ledger. However in Nervos CKB, we want to take this one step further and store more kinds of common knowledge, hence we inherits the ideas of Bitcoin’s architecture and creates the [Cell Model](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571) from generalizing the UTXO model, retaining the consistency and simplicity of Bitcoin.

## Data Structure

**Example**

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

* `capacity`: It's the size limit of the cell. A cell's size is the total size of all fields contained in it. It is not only just the amount of the stored tokens, but also a limit on how many data the cell can store. That's where the name comes from, It is the storage capacity of the cell. 
* `lock script`: Represents the ownership of the cell. Owners of cells can transfer cells to others.
* `type script`: It's the constraints on  `data`，also store the validation logic you need in the cell transformation.

A cell also stores a piece of data, we will introduce `data`  in [Transaction outputs and outputs_data](/docs/reference/transaction#transaction-outputs-and-outputs_data) and also we will introduce `lock script` and `type script` in [Script](/docs/reference/script).


## Indexing

Any transaction must include at least one input and one output. In order to construct a transaction,we first need to locate the input, we call  it "cell collect". There are two ways to implement "cell collect":

* Use the ckb indexer service

CKB node provides indexing function to implement "cell collect" which is turned off by default. You can modify the configuration in `ckb.toml`

```
[rpc]
...
# List of API modules: ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Indexer", "Experiment"]
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment"]

```

To turn indexing feature on, please add “Indexer” to the array.

```
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment", **"Indexer"**]
`
```

After restarting the CKB node with `ckb run -C <path>`, register the address you want to index through the RPC method `[index_lock_hash](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md#index_lock_hash)`. 

* Construct the indexer service

The ckb indexer service is only for basic usage and and it is not flexible enough to accommodate additional requirements It is recommended to construct  the “cell collect” by yourself. Now we provide an example: [ckb-indexer](https://github.com/quake/ckb-indexer). You may refer to it for more details.

