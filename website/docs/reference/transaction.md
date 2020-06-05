---
id: transaction
title: Transaction
---

Transactions are the most important part of the CKB blockchain. The focus of Layer 1 is on the state, so the design of CKB as Layer 1 should also lay emphasis on state. In CKB, transactions and states are merged into a single dimension. Every transaction represents a state change, resulting in **cells transition**.

The state change is represented by a transaction destroying some cells from previous transactions, and creating some new cells. The concept of state, is reflected via a set of cell(including the data included in each cell) in CKB. All state transitions in a single transaction are atomic, they will either all succeed or all fail.

We should create the transactions off-chain on the client side then transactions should be validated by CKB-VM and packaged into blocks, finally propagated to the entire network.The basic transaction structure is like this：

```
A transaction
{
     cell_deps，
     header_deps,
     inputs: 
        output cells in previous transactions，
     outputs:
        new output cells，
     outputs_data，
     witness，
    }
```

## Transaction inputs

As a transaction destroys some output cells created in previous transactions, meaning the inputs of a transaction are actually references to output cells of previous transactions. Sometimes one cell is enough, other times more than one is needed. 

### data structure

**Example**

```
"inputs": [ 
 { 
 "since": "0x0", 
 "previousOutput": { 
 "txHash": "0x4e48bffa1e3bcf64a4a868eb78258c6decb6e3e51c4fb00fedc3b0754554d710", 
 "index": "0x0" 
  } 
 } 
 ],
  
```

The transaction inputs include two parts：

* `previous_output`
    * Type is `OutPoint`
        * To build a transaction input, we use `OutPoint` to point the consumed cells.Since cell is always created by a transaction, and every new cell has its position in the transaction outputs array, we can refer to a cell by transaction hash and outputs index, so  `OutPoint` includes `tx_hash` and `index`.The transaction uses `OutPoint` in inputs to reference the previously created cells instead of embedding them.
* `since:`Since value guarding current referenced inputs.It prevents the transaction to be mined before an absolute or relative time.You may refer to [RFC：Transaction valid since](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md) for implementation details.

## Transaction outputs and outputs_data

Transaction outputs are a set of cells. Instead of holding only the token value, CKB cell can store arbitrary data as well and particularly the cell’s actual data are kept separated from outputs for the ease of CKB script handling and for the possibility of future optimizations.

### data structure

**Example**

```
"outputs": [ 
 { 
 "capacity": "0xe42c8d4800", 
 "lock": { 
 "hashType": "type", 
 "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", 
 "args": "0x6acae74132339d67654571bd675341ce049a11d2" 
 }, 
 "type": { 
 "hashType": "data", 
 "codeHash": "0x29710611424e77b6a462265e3495026c16643a352f6a7fd7bc19376b3de06fd5", 
 "args": "0x" 
   } 
  } 
 ], 
 "outputsData": [ 
 "0x636172726f" 
 ],
  
```

`outputs:`An array of cells that are used as outputs, these are the newly generated cells and may be used as inputs for other transactions. Each of the Cell has the same structure to the [Cell](cell.md).

`outputs_data:`An array of cell data for each cell output.



## Transaction cell_deps 

Transaction cell_deps are an array of `outpoint` pointing to the cells that are dependencies of this transaction. cell_deps are dependencies of a transaction, it could be used to include code that are loaded into CKB VM, or data that could be used in script execution.Only live cells which appears as outputs but not as inputs in all the previous transactions can be listed here. The cells listed are read-only. 

In CKB, [Script](script.md) is compiled into RISC-V binary. The binary is stored as the data in a cell. When `hash_type` is "Data", the script locates a cell which data hash equals the script's `code_hash`. The cell data hash, as the name suggests, is computed from the cell data. The scope is limited in the transaction, script can only find a matched cell from `cell_deps`.


### data structure

**Example**

```
 "cellDeps": [
    {
      "depType": "depGroup",
      "outPoint": {
        "txHash": "0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708",
        "index": "0x0"
      }
    },
    {
      "depType": "code",
      "outPoint": {
        "txHash": "0x98015c1806c00c989b83c56953c242b7df6915534db4534090af92ffc4b08c9e",
        "index": "0x0"
      }
    }
  ],
```

Transaction cell_deps include:

* `outPoint`
    * A cell outpoint that point to the cells used as deps.
* `depType`
    * The way to interpret referenced cell deps.A cell dep could be referenced in 2 ways:
        * `code`： the dep cell is directly included in the transaction. 
        * `dep_group`：It is a cell which bundles several cells as its members. When a `dep_group` cell is used in `cell_deps`, it has the same effect as adding all its members into `cell_deps`. 
            * for example： In ckb v0.19.0, the lock script secp256k1 is split into code cell and data cell. The code cell loads the data cell via `cell_deps`. So if a transaction needs to unlock a cell locked by secp256k1, it must add both cells in `cell_deps`. With dep group, the transaction only needs the `dep_group` cell
            * This way provides a quicker and smaller(in terms of transaction size) to include multiple commonly used dep cells in one CellDep construct.



## Transaction header_deps

Header Deps allows to read block headers. It’s an array of `H256` hashes pointing to block headers that are dependencies of this transaction. A transaction can only reference a header that is at least 4 epochs old.

For example, when you construct the Nervos DAO’s  withdraw transactions, you will need to set up the `header_deps`
because the `header_deps` contain the block header hashes in which the original Nervos DAO deposit cell and withdrawing cell are included. You may refer to [RFC: Deposit and Withdraw in Nervos DAO](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md) for more details.


### **Example**

```
"header_deps": [
    "0xaa1124da6a230435298d83a12dd6c13f7d58caf7853f39cea8aad992ef88a422"
  ],
```



## Transaction witness

In cryptography, the term “witness” is used to describe a solution to a cryptographic puzzle. In CKB, the transaction witness provided by transaction creator to make the execution of corresponding lock script success. For example, you can provide a signature to make sure a signature verification lock script passes, hence the signature is one type of witnesses, but a witness is more broadly.

### Example

```
"witnesses": [
    "0x55000000100000005500000055000000410000004a975e08ff99fa000142ff3b86a836b43884b5b46f91b149f7cc5300e8607e633b7a29c94dc01c6616a12f62e74a1415f57fcc5a00e41ac2d7034e90edf4fdf800"
  ]
```

## Transaction Fees

A transaction cannot mint capacities from the air, so a transaction must meet the following rule:

```
sum(cell's capacity for each cell in inputs)
≥ sum(cell's capacity for each cell in outputs)
```

Miners can collect the difference as a fee.

```
fee = sum(cell's capacity for each cell in inputs)
    - sum(cell's capacity for each cell in outputs)
```


 
  
  
  
  
  
  
  
 
 
 

 
 

 
 
 

 

 
