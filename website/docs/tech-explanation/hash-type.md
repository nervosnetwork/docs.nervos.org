---
id: hash-type
title: hash_type
---

`hash_type` defines the interpretation of the `code_hash` when looking for matching dep Cells. Each hash_type value in this fields corresponds to a specific JSON representation, hash matching method, and the compatible VM version, specified as follows:

| `hash_type` | JSON Representation | Matched by          | VM Version |
| ----------- | ------------------- | ------------------- | ---------- |
| 0           | "data"              | Data hash (blake2b) | 0          |
| 1           | "type"              | Type Script hash    | 2          |
| 2           | "data1"             | Data hash (blake2b) | 1          |
| 4           | "data2"             | Data hash (blake2b) | 2          |

Learn more about VM versions and how to choose, visit [RFC0032: CKB VM Version Selection](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0032-ckb-vm-version-selection/0032-ckb-vm-version-selection.md)
