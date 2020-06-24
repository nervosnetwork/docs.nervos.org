---
id: rules
title: The General Workflow for Constructing a Transaction
---

This document will explain how to build a verifiable transaction on CKB in the simplest and most common way possible. It doesn't involve constructing validation scripts, contracts, etc.

On CKB, any transaction must have at least one input and one output. To construct a transaction, the first thing that is needed is a way to effectively locate an input and this process is referred to as “cell collect”.

## Cell Collect

It is important to first understood that CKB’s [cell model](https://docs.nervos.org/basic-concepts/cell-model.html) is very similar to the UTXO model, which means that without any pre-caching it is not possible to know the current state of any address. The information that makes up the current state of an address may be scattered across different cells in many corners of the blockchain and a cell collection method is a prerequisite to properly using CKB. The cell model of CKB is described in detail in [Cell](reference/cell.md).

Let’s take a look at how to collect cells, as there are two ways to do this:

### USING the ckb indexer service

This section introduces a simple method which can identify limited information about a specified address (such as live_cell count, transaction count, total capacity). However, this method is based on the CKB node’s indexing function and is only suitable for simple usage (it also consumes resources of the CKB node). 

This method also is not capable of cell collection according to more detailed search criteria. For example, locating a contract cell is not possible with this method. 

Regardless of these shortcomings, let's start with this method to better understand how cell collection works. By default, this feature is turned off in the CKB node. To turn it on, manually change the configuration file as outlined below and restart the CKB node.

Locate the following configuration in the `ckb.toml` file

```
[rpc]
...
# List of API modules: ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Indexer", "Experiment"]
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment"]

```

In the configuration above, the indexing service is not started. To turn this feature on, add “Indexer” to the array.

```
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment", "Indexer"]

```


After restarting the CKB node with `ckb run -C <path>`, register the address you want to index through the RPC method `[index_lock_hash](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md#index_lock_hash)`. 

*Note that the `index_from` parameter controls the point that indexing starts from: a null value begins indexing from the current chain tip (current latest block), while a value of 0 begins indexing from the genesis block.*

Wait for the index service to be rebuilt, then use the RPC interface of the indexing service to view the live_cell/transaction/capacity values of the corresponding address. You may refer to the [JSON-RPC](reference/rpc.md).

To turn the indexing service off, follow this process: unregister the watch list through RPC, shut down the service and remove the “Indexer” value from the array in the `ckb.toml` file.

### CREATING YOUR OWN CELL COLLECTION SERVICE 

**What are the advantages to creating your own cell collection service?**

We all know that a transaction includes the creation and destruction of cells (this is the simplest definition of a CKB transaction). However, due to flexibility of the cell model, any kind of meaningful data can be stored in cell data fields and various types of contracts can be expressed through type scripts. As a result, each user or use case may have different requirements for cell collection.

There are many questions to explore, each may have a different answer depending on use case:

* What is the order of cell consumption? first-in-first-out, size order, best fit model, etc.
* What kind of cell can be consumed? a specific type or any kind?
* Does any cell data or cell type require special treatment?
* Is any filtering/confirmation required after cells are selected?

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
