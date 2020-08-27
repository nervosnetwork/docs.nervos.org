---
id: CKB-Merkle-Tree
title: CKB Merkle Tree
---

CKB Merkle Tree is a [CBMT](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md) using following merge function:

```
ckbhash(left || right)
```

> [ckbhash](ckbhash.md) is the hash function, `||` denotes binary concatenation.
