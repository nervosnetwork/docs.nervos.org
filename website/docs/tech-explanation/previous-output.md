---
id: previous-output
title: "previous_output"
---

# previous_output

A Cell outpoint that points to the Cells used as inputs. These Cells are referred through `outpoint`, which contains the transaction `hash` of the previous transaction, as well as this Cell's `index` in its transaction's output list.

| Name    | Type        | Description                                         |
| ------- | ----------- | --------------------------------------------------- |
| `hash`  | H256 (hash) | Hash of the transaction that this Cell belongs to.  |
| `index` | Uint32      | Index of the Cell in its transaction's output list. |
