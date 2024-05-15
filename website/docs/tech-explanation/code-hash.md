---
id: code-hash
title: code_hash
---

`code_hash` represents the hash of the ELF-formatted RISC-V binary that contains a CKB Script. For efficiency, the Script itself is stored in a dep Cell attached to the current transaction. Depending on the `hash_type` value, the `code_hash` should either match the hash of the Cell data, or that of the Type Script in the dep Cell. During transaction verification, the actual binary is loaded into a CKB-VM instance when specified.
