---
id: cell-deps
title: "Cell_deps"
---

# Cell_deps

`Cell_deps` allows Scripts in the transaction to access referenced Live Cells. Cells listed here are all live and read-only.

`Cell_deps` includes a `dep_type` field to differentiate the normal Cells, which directly provide the code, and the `dep_groups` expanded to its members inside `cell_deps`.

| Name        | Type                                 | Description                                                                                                        |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `out_point` | `OutPoint`                           | A Cell outpoint pointing to the Cells used as deps. For more, see [`out_point`](/docs/tech-explanation/out-point). |
| `dep_type`  | String, either `code` or `dep_group` | Interpreting referenced cell deps.                                                                                 |
