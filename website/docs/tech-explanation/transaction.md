---
id: transaction
title: Transaction
---

import Tooltip from "@components/Tooltip";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";

# Transaction

A transaction in CKB destroys some Cells (outputs from previous transactions) and generates new ones.

<img src={"/img/tech_explanation/transaction-structure.png"} width={688} height={660} alt="Structure of Transaction" />

## Fields & Description

| Name           | Type           | Description                                                                                                                                                     |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`      | Uint32         | Transaction version distinguishes transactions in the event of a fork.                                                                                          |
| `cell_deps`    | [`CellDep`]    | An array of `outpoint` pointing to the Cells that are dependencies of this transaction. For more, see [`cell_deps`](/docs/tech-explanation/cell-deps).          |
| `header_deps`  | [`H256(hash)`] | An array of `H256` hashes pointing to block headers that are dependencies of this transaction.                                                                  |
| `inputs`       | [`CellInput`]  | An array of referenced Cell inputs. For more, see [`CellInput`](/docs/tech-explanation/cellinput).                                                              |
| `witnesses`    | [`Bytes`]      | Provided by transaction creator to ensure the successful execution of the corresponding Lock Script. For more, see [`witness`](/docs/tech-explanation/witness). |
| `outputs`      | [`Cells`]      | An array of Cells used as outputs, also can be seen as the newly generated Cells. For more, see [`outputs`](/docs/tech-explanation/outputs).                    |
| `outputs_data` | [`Bytes`]      | An array of Cell data of each output Cell. For more, see [`outputs_data`](/docs/tech-explanation/outputs-data).                                                 |

## Example

<details>
  <summary>View Full Transaction</summary>

```json
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

</details>

## Transaction States {#transaction-states}

The transaction lifecycle starts after creation and ends when it is finally confirmed or conflicts with a confirmed transaction. During this lifecycle, the transaction must be in one of the following states:

- Pending
- Confirming
- Confirmed
- Conflicting
- Conflictive
- Reverted
- Abandoned

The list excludes <Tooltip>orphan transaction</Tooltip> that depends on unknown Cells, as transaction generators typically ignore them.

Different states require different strategies as described in the following sections.

<img
alt="Transition Between Different Transaction States"
src={useBaseUrl("img/how-tos/transaction-states.png")}
width="688"
/>

### Pending Transaction

A newly created transaction starts in the **Pending** state.

The generator must store pending transactions locally and regularly send them to CKB nodes. It's essential because CKB nodes may drop transactions from their pools.

It is not recommended for the generator to use output Cells of pending transactions unless the transaction is stuck and requires a <Tooltip>fee bumping</Tooltip>. If chaining pending transactions is unavoidable, limit the chain’s length.

The transaction turns to the **Confirming** state once it appears in a block on the canonical chain.

If the pending transaction or any of its ancestor transactions[^1] has conflicting input Cells with a transaction on the canonical chain, it becomes conflicting.

User or Apps can mark a pending transaction as **Abandoned**, if they decide to give up a stuck transaction.

### Confirming Transaction

Transactions in **Confirming** state are in the chain but have not qualified as **Confirmed** yet.

The generator must store confirming transactions locally but does not need to send them to CKB nodes regularly.

Same as pending transactions, it is not recommended to use the output Cells of confirming transactions.

The block containing the transaction gives one confirmation. Each descendant block in the chain gives an extra confirmation. Although any block can be reverted theoretically, it is safe to assume that the transaction will never be reverted after a certain number, say X, of confirmations. The confirming transaction becomes **Confirmed** when it has received at least X confirmations. X depends on various factors. The generator must decide the value of X and adjust it regularly.

If a chain reorganization reverts the block containing the transaction, the transaction reverts to **Pending**.

### Confirmed Transaction

Transactions in **Confirmed** state are in the chain and has received at least X confirmations.

The generator can remove confirmed transactions from local storage or keep the latest ones as a historical reference.

The generator can freely use the output Cells of confirmed transactions.

If a chain reorganization reverts the block containing the transaction, the transaction becomes **Reverted**.

### Conflicting Transaction

A transaction is in **Conflicting** state if it conflicts with any transaction in the chain. Two different transactions conflict when:

- They have conflict input Cells;
- A transaction has conflicting input Cells with any ancestor of another transaction;
- They are descendants of a pair of conflict transactions.

The generator must store these conflicting transactions locally, because there is a chance they may become **Pending** again.

The generator should not use the output Cells of conflicting transactions.

If all blocks containing conflicting transactions have been reverted, the conflicting transactions revert to Pending.

If any conflicting transaction received X confirmations, the conflicting transactions become **Conflicted**.

### Conflictive Transaction

A transaction is in **Conflictive** state when it conflicts with an on-chain transaction that has received at least X confirmations.

The generator can remove conflictive transactions from local storage, or keep the most recent ones for reference.

The generator should not use the output Cells of conflictive transactions.

If all blocks containing conflicting transactions have been reverted, the conflictive transactions revert to **Pending**.

### Reverted Transaction

**Reverted** state is an alias of **Pending**, suggesting that the transaction was once confirmed, but has been reverted.

The generator must store and send reverted transactions regularly. The state transformations are the same as pending transactions.

### Abandoned

The generator should allow users to mark a pending or reverted transaction as **Abandoned**, when they give up the effort to commit it. But due to a timing gap, an abandoned transaction may still be already submitted to a node.

The generator must store a sufficient time range of recent abandoned transactions. Try not to delete transactions that are marked as **Abandoned**, as they might already be in **Pending** state.[^2]

Users are allowed to mark an abandoned transaction to **Pending**.

Transactions can transform from **Abandoned** to **Confirming** or **Conflicting**, like pending and reverted transactions.

[^1]: Transaction A is considered a parent of B, if B uses an output Cell of A as its input Cell. An ancestor is either the parent or an ancestor of any parent.
[^2]: If you want to accelerate the confirmation, consider using <Tooltip>RBF</Tooltip> <Tooltip>fee bumping</Tooltip> method that involves creating a new transaction using some or all of the same inputs from an unconfirmed transaction, but with a higher fee. Deleting the abandoned transaction eliminates this option. RBF has been a default feature in CKB since [v0.112.1](https://github.com/nervosnetwork/ckb/releases/tag/v0.112.1).
