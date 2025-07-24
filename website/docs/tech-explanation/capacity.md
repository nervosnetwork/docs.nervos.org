---
id: capacity
title: Capacity
---

Capacity is the storage limit of a [Cell](/docs/tech-explanation/cell) in a transaction. It represents both the amount of CKB tokens stored and the maximum space available for the Cell's content—including its `data`, `lock`, `type`, and `capacity` fields.

When a transaction creates an output Cell, its occupied capacity must not exceed the `capacity` of the original input Cell:

```
Occupied (Cell) ≤ Cell's capacity
```

One of the transaction validation rules is:

```
capacity_in_bytes >= len(capacity) + len(data) + len(type) + len(lock)
```

This ensures the Cell has enough capacity to store all its fields. The `capacity` also represents the balance of CKB tokens, similar to the [`nValue` field in Bitcoin's CTxOut](https://www.bitcoinabc.org/doc/dev/class_c_tx_out.html).

For instance, if Alice owns 100 CKB, she can unlock a group of Cells with a total quantity of 100 bytes.

## Minimum Cell Capacity (61 Bytes){#capacity-mini}

Each Cell must reserve a minimum of 61 CKBytes to store its essential fields, including:

- `capacity`: 8 bytes
- `lock`: 32 bytes
- `args`: 20 bytes
- `hash_type`: 1 byte

These add up to 61 bytes. Since 1 CKByte grants the right to store 1 byte on-chain, a Cell must hold at least 61 CKBytes to cover this base storage.
:::tip
Allocating **62 CKBytes** or more is recommended in practice to accommodate transaction fees and ensure smooth inclusion in blocks.
:::
