---
id: capacity-mini
title: Minimum Cell Capacity (61 CKBytes)
---

Each Cell must reserve a minimum of 61 CKBytes to store its essential fields, including:

- `capacity`: 8 bytes
- `lock`: 32 bytes
- `args`: 20 bytes
- `hash_type`: 1 byte

These add up to 61 bytes. Since 1 CKByte grants the right to store 1 byte on-chain, a Cell must hold at least 61 CKBytes to cover this base storage. Allocating 62 CKBytes or more is recommended in practice to accommodate transaction fees and ensure smooth inclusion in blocks.
