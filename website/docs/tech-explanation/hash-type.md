---
id: hash-type
title: hash_type
---

`hash_type` defines the interpretation of the `code_hash` when looking for matching dep Cells.

- If it is 0, i.e., data, `code_hash` should match the blake2b hash of data in a dep Cell;
- if it is 1, i.e., type, `code_hash` should match the Type Script hash of a dep Cell.
