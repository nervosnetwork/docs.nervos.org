---
id: Transaction--Transaction-Witness-Hash
title: Transaction Witness Hash
---

Transaction is serialized via [molecule](molecule.md) in CKB. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

The transaction witness hash is the [ckbhash](ckbhash.md) on the serialized transaction.

See also [Transaction Hash](Transaction--Transaction-Hash.md).
