---
id: dep-group
title: "dep_group"
---

# dep_group {#dep-group}

A Cell that bundles several Cells as its members. When a dep group Cell is used in `cell_deps`, it has the same effect as adding all its members into `cell_deps`.

Dep Group stores the serialized list of `OutPoint` in Cell data. Each `OutPoint` points to one of the group members.
