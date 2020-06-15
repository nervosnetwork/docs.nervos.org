---
id: transaction
title: Transaction
---

Transactions are the most fundamental entities for interacting with Nervos CKB. At Layer 1, we are focusing on states, the design of CKB as a Layer 1 blockchain, naturally emphasizes on states. In CKB, transactions are the only way to trigger state changes.

A state change on CKB is represented by a transaction destroying some cells from previous transactions, and creating some new cells. The concept of state, is reflected via a set of live cells(including the data included in each cell) in CKB. A transaction is atomic, it either gets accepted, or rejected. Partial transaction will never be committed to Nervos CKB>

Due to the above nature of CKB, state changes are usually calculated outside of Nervos CKB, the resulting state is then assembled into a transaction, which is then submitted, validated and finally accepted by Nervos CKB, which is then propagated to the entire network.

## Data Structure

**Example:**

```
{
  "cell_deps": [
    {
      "dep_type": "dep_group",
      "out_point": {
        "index": "0x0",
        "tx_hash": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37"
      }
    },
    {
      "dep_type": "code",
      "out_point": {
        "index": "0x0",
        "tx_hash": "0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958"
      }
    }
  ],
  "hash": "0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200",
  "header_deps": [],
  "inputs": [
    {
      "previous_output": {
        "index": "0x0",
        "tx_hash": "0x6e64c2a3f248da5115c49ef8100b3a29c4f665517626a513b340821ba8b95f80"
      },
      "since": "0x0"
    }
  ],
  "outputs": [
    {
      "capacity": "0x34e62ce00",
      "lock": {
        "args": "0x927f3e74dceb87c81ba65a19da4f098b4de75a0d",
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hash_type": "type"
      },
      "type": {
        "args": "0x6e9b17739760ffc617017f157ed40641f7aa51b2af9ee017b35a0b35a1e2297b",
        "code_hash": "0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212",
        "hash_type": "data"
      }
    },
    {
      "capacity": "0x711befb618",
      "lock": {
        "args": "0x927f3e74dceb87c81ba65a19da4f098b4de75a0d",
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hash_type": "type"
      },
      "type": null
    }
  ],
  "outputs_data": [
    "0x40420f00000000000000000000000000",
    "0x"
  ],
  "version": "0x0",
  "witnesses": [
    "0x55000000100000005500000055000000410000007926ec98874bb86143d178826253e18425e50bf85fbb4b7cf9188462e7e87bc810ac602e55b9c73890ab8306368d7d02d96234f250750269e1aa023eb5b71b5100"
  ]
}
```

There are already 2 RFCs that describe the transaction structure in great details:

* [Data Structures](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md)
* [Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)
