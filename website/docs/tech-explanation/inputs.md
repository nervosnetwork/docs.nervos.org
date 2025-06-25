---
id: inputs
title: inputs
---

# inputs

The `inputs` field lists the Cells that this transaction consumes. Each item in `inputs` is of type `CellInput`, which references a previously created output Cell.

## Structure of CellInput

| Name              | Type       | Description                                                                                                                                                                                                    |
| ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `previous_output` | `OutPoint` | References a specific output Cell from a previous transaction.                                                                                                                                                 |
| `since`           | Uint64     | A condition that restricts when this input can be used. See [RFC: Transaction Since Precondition](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md) for more. |

### previous_output

A reference to the Cell being used as input. It consists of a transaction `hash` and an output `index` that together identify the exact output Cell.

| Name    | Type        | Description                                         |
| ------- | ----------- | --------------------------------------------------- |
| `hash`  | H256 (hash) | Hash of the transaction that this Cell belongs to.  |
| `index` | Uint32      | Index of the Cell in its transaction's output list. |

### since

The `since` field is an optional condition attached to each input in a transaction. It specifies a time constraint that must be met before the input becomes valid. A CKB node will only consider the input (and thus the entire transaction) valid if the current chain state meets or exceeds the `since` requirement.

This mechanism allows for time-locked inputs, enabling use cases like delayed payments or multi-party coordination. Transactions can include inputs from multiple parties. Each input can have its own since condition, giving each party control over when their part of the transaction becomes valid. However, if any single input’s since condition is unmet, the entire transaction will be rejected by the node.

The `since` value can be expressed using one of the following metrics:

- Block number
- Epoch number (with fraction)
- Timestamp

For technical details on encoding and evaluation rules, see [RFC0017: Transaction Since Precondition](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md).
