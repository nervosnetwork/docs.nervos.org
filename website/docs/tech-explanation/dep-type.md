---
id: dep-type
title: "dep_type"
---

# dep_type

This field interprets the referenced Cell deps.

There are two ways to reference a Cell dep:

- For a Cell dep with `code` as `dep_type`, the dep Cell is directly included in the transaction.
- For a Cell dep with `dep_group` as `dep_type`, CKB first loads this dep Cell, assuming its content contains a list of Cell deps, then uses the extracted list of Cell deps to replace the current Cell deps, and include them in the current transaction. This provides a quicker and smaller (in terms of transaction size) way to include multiple commonly used dep Cells in one CellDep construct.
