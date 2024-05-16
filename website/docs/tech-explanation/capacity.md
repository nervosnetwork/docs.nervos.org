---
id: capacity
title: Capacity
---

Capacity is the storage limit of a Cell in a transaction. Capacity refers to both the quantity of stored tokens and the maximum amount of data the Cell can hold. The capacity of a Cell determines its ability to store various fields, including data, lock, type, and its own capacity.

Transactions must create an output Cell whose occupied capacity is less than the capacity of the referenced Cell.

```
Occupied (Cell) ≤ Cell's capacity
```

When a new Cell is generated via a transaction, one of the validation rules is `capacity_in_bytes >= len(capacity) + len(data) + len(type) + len(lock)`. This value also represents the balance of CKB tokens, similar to the [`nValue` field in Bitcoin's CTxOut](https://www.bitcoinabc.org/doc/dev/class_c_tx_out.html). For instance, if Alice owns 100 CKB, she can unlock a group of Cells with a total quantity of 100 bytes.

:::note
For Lock Script, another arg is appended to the array of CellInput to form a complete list of input parameters.
:::
