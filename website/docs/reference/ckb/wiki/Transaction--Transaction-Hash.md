---
title: Transaction Hash
id: Transaction--Transaction-Hash
---

Transaction is serialized via [molecule](molecule.md) in CKB. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

The transaction hash is the [ckbhash](ckbhash.md) on the serialized `raw`.

See also [Transaction Witness Hash](Transaction--Transaction-Witness-Hash.md).
