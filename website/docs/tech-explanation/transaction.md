---
id: transaction
title: Transaction
---

# Transaction

## Example

A transaction destroys some Cells / outputs created in previous transactions and creates some new ones.

```
{
  "version": "0x0",
  "cell_deps": [
    {
      "out_point": {
        "tx_hash": "0xbd864a269201d7052d4eb3f753f49f7c68b8edc386afc8bb6ef3e15a05facca2",
        "index": "0x0"
      },
      "dep_type": "dep_group"
    }
  ],
  "header_deps": [
    "0xaa1124da6a230435298d83a12dd6c13f7d58caf7853f39cea8aad992ef88a422"
  ],
  "inputs": [
    {
      "previous_output": {
        "tx_hash": "0x8389eba3ae414fb6a3019aa47583e9be36d096c55ab2e00ec49bdb012c24844d",
        "index": "0x1"
      },
      "since": "0x0"
    }
  ],
  "outputs": [
    {
      "capacity": "0x746a528800",
      "lock": {
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "args": "0x56008385085341a6ed68decfabb3ba1f3eea7b68",
        "hash_type": "type"
      },
      "type": null
    },
    {
      "capacity": "0x1561d9307e88",
      "lock": {
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "args": "0x886d23a7858f12ebf924baaacd774a5e2cf81132",
        "hash_type": "type"
      },
      "type": null
    }
  ],
  "outputs_data": [
    "0x",
    "0x"
  ],
  "witnesses": ["0x55000000100000005500000055000000410000004a975e08ff99fa0001
    42ff3b86a836b43884b5b46f91b149f7cc5300e8607e633b7a29c94dc01c6616a12f62e74a1
    415f57fcc5a00e41ac2d7034e90edf4fdf800"
  ]
}
```

## Fields & Description

| Name           | Type           | Description                                                                                                                         |
| -------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `version`      | Uint32         | Transaction version distinguishes transactions in the event of a fork.                                                              |
| `cell_deps`    | [`CellDep`]    | An array of `outpoint` pointing to the Cells that are dependencies of this transaction. For more, see `CellDep`, `cell_deps` below. |
| `header_deps`  | [`H256(hash)`] | An array of `H256` hashes pointing to block headers that are dependencies of this transaction.                                      |
| `inputs`       | [`CellInput`]  | An array of referenced Cell inputs. For more, see `CellInput` below.                                                                |
| `outputs`      | [`Cells`]      | An array of Cells used as outputs, also can be seen as the newly generated Cells. For more, see `outputs` below.                    |
| `outputs_data` | [`Bytes`]      | An array of Cell data of each output Cell. For more, see `outputs_data` below.                                                      |
| `witness`      | [`Bytes`]      | Provided by transaction creator to ensure the successful execution of the corresponding Lock Script. For more, see `witness` below. |
