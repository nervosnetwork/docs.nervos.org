---
id: outpoint
title: OutPoint
---

# OutPoint

The transaction uses `OutPoint` in inputs to reference the previously created Cells instead of embedding them.

<Tooltip>Dep Group</Tooltip>  stores the serialized list of `OutPoint` in Cell data. Each `OutPoint` points to one of the group members.
