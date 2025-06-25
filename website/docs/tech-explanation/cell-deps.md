---
id: cell-deps
title: "cell_deps"
---

# Cell_deps

`cell_deps` allows Scripts in the transaction to access referenced Live Cells. These Cells are read-only and must be live at the time of execution. Each item in the `cell_deps` array is of type `CellDep`.

## Structure of CellDep

| Name        | Type                  | Description                                                                                                      |
| ----------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `out_point` | `OutPoint`            | Points to a specific Live Cell that the transaction depends on. This Cell might contain executable code or data. |
| `dep_type`  | `code` or `dep_group` | Tells CKB how to interpret the dependency.                                                                       |

### out_point

Identifies a specific output Cell. Its type is `OutPoint`, which consists of a transaction `hash` and an output `index`.

| Name    | Type        | Description                                         |
| ------- | ----------- | --------------------------------------------------- |
| `hash`  | H256 (hash) | Hash of the transaction that this Cell belongs to.  |
| `index` | Uint32      | Index of the Cell in its transaction's output list. |

### dep_type

Defines how the dependency Cell should be used:

- `code`: The Cell at `out_point` is loaded directly. Its content (usually code) is available to CKB-VM during Script execution.
- `dep_group`: The Cell at `out_point` is a dep group. It contains a list of `OutPoint`s. CKB reads this list and loads each referenced Cell as if they were individual `cell_deps`. This makes `dep_group` a compact way to include multiple dependencies using a single reference.
