---
id: Common-Gotchas
title: Common Gotchas
---

## Nervos DAO

Due to CKB's unique flexibility, it also comes with some gotchas to be aware of. Otherwise there might be risk locking your cell forever with no way to unlock them. Here, we try our best to document the gotchas we know:

* Nervos DAO only supports *absolute epoch number* as since value when withdrawing from Nervos DAO. So if you are using a lock that supports lock period, such as the system included [multi-sign script](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_multisig_all.c), please make sure to ONLY use *absolute epoch number* as lock period. Otherwise the locked Nervos DAO cell cannot be spent.
* CKB has a maturity limitation on referencing headers: a block header can only be referenced in a cell that is committed at least 4 epochs after the referenced block header. This means in situations where header deps are used, those 4 epoch limitation also applies. Nervos DAO, for example, is restricted in the following places:
   + Phase 1 transaction can only be committed 4 epochs after the fund is originally deposited.
   + Phase 2 transaction can only be committed 4 epochs after phase 1 transaction is committed.
