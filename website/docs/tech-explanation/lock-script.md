---
id: lock-script
title: Lock Script
---

# Lock Script

This defines the Script that determines the ownership of a Cell, used to govern the logic associated with Cell ownership.

A typical Lock Script references the hash value of the Cell storing the referenced signature algorithm in the `code_hash`, and stores parameters related to the public key address in the `args`.

<img src={"/img/tech_explanation/lock-script.png"} width={688} height={361} alt="Structure of Lock Script" />

When unlocking this Cell, i.e., completing the Lock Script verification, the user needs to place the signature information in the `witness`. During the verification, Lock Script verifies whether the result matches the `args` through the signature information and the indexed signature algorithm, ensuring that the transaction is indeed signed by the owner of the input Cell.

Similar to the [`scriptPubKey` in Bitcoin's CTxOut](https://doxygen.bitcoincore.org/class_c_tx_out.html), anyone who can provide unlocking parameters to successfully execute the Script can use the Cell as an input for the transfer (i.e., has ownership of the Cell).

:::note

The signature algorithm and hash function used in the Lock Script are not hardcoded by the CKB protocol. Developers are free to design and implement customized signature algorithms and hash functions in the Script. This can also be implemented in [Type Script](/docs/tech-explanation/type-script).

:::
