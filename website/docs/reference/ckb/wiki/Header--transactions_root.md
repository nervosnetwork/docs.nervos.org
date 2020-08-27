---
id: Header--transactions_root
title: Header transactions_root
---

The field `transactions_root` in header is

```
ckbhash(T || W)
```

> [ckbhash](ckbhash.md) is the hash function, `||` denotes binary concatenation.

T is the root of a [CKB Merkle Tree](CKB-Merkle-Tree.md), which items are the [transaction hashes](Transaction--Transaction-Hash.md)  of all the transactions in the block.

W is also the root of a [CKB Merkle Tree](CKB-Merkle-Tree.md), but the items are the [transaction witness hashes](Transaction--Transaction-Witness-Hash.md) of all the transactions in the block.



