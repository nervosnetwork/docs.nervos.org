---
id: ckbhash
title: ckbhash
---

CKB uses [BLAKE2b](<https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2b_algorithm>) as the default hash algorithm. The specific configuration of BLAKE2b used in CKB is referred as ckbhash, characterized by:

- A 32-byte output digest size
- A personalization of `ckb-default-hash`
