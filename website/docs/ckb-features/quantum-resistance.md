---
id: native-quantum-resistance
title: Native Quantum Resistance
---

# Native Quantum Resistance

As the blockchain industry matures, it faces an existential threat on the horizon: **Large-scale Quantum Computing**. While often framed as a future concern, the "Harvest Now, Decrypt Later" strategy employed by attackers—where encrypted data is intercepted today to be decrypted once quantum hardware matures—makes this an urgent architectural consideration that must be addressed early.

Most major blockchains, including Bitcoin and Ethereum, rely on **Elliptic Curve Cryptography (ECC)** for address derivation and transaction signatures. A sufficiently powerful quantum computer running [Shor’s Algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm) could effectively derive private keys from public keys, undermining the security assumptions of these systems.

While the industry is working toward standardized defenses (e.g., NIST's PQC competition), the **implementation path** differs fundamentally between CKB and most other blockchains. Quantum resistance is an architectural property, not a retrofit.

## Why CKB is Native Quantum-Resistant

Most blockchains struggle with quantum resistance for two primary reasons: [hardcoded cryptographic primitives](#problem-1-the-hardcoded-cryptographic-primitives) and [data size limitations](#problem-2-the-data-size-limitation). CKB's approach to quantum resistance does not rely on incrementally addressing these constraints, but on an architecture designed from first principles to avoid them.

### Problem 1: The Hardcoded Cryptographic Primitives

A core limitation of many Layer 1 blockchains is that cryptographic primitives are **hardcoded** into the consensus protocol. This rigidity creates a significant constraint: upgrading to quantum-resistant cryptography typically requires coordinating a network-wide hard fork.

In blockchains like Ethereum or Bitcoin, the rule "Transaction X is valid" is effectively hardwired to check a specific ECDSA signature. Changing this rule is not a software update; it is a change to the fundamental protocol of that blockchain.

CKB, by contrast, is designed as a **Cryptographic Abstraction** blockchain. In CKB, the protocol itself does not depend on any specific cryptographic algorithm such as secp256k1. Cryptography is not embedded in consensus rule; instead, it is implemented as a [Lock Script](/docs/tech-explanation/lock-script) (smart contract) that runs in a virtual machine. As a contrast, Ethereum embeds the hardcoded ECC directly into the EVM as a precompiled contracts.

- **Most other blockchains:** Function like a specialized calculator. They efficiently compute a fixed set of cryptographic operations, but extending them requires modifying the system itself.
- **Nervos CKB:** Functions more like a generic CPU. New cryptographic constructions (such as lattice-based schemes) can be introduced by deploying new Scripts, without alterning fundamental protocols.

This abstraction reframes quantum resistance from a governance-driven protocol change into a user-level choice. Users can adopt quantum-resistant cryptography without requiring a hard fork. In the future, if quantum computers disrupt current encryption technology, CKB supports the following upgrade path:

1.  **Deploy:** Developers deploy a new Lock Script that implements post-quantum cryptographic algorithm (e.g., SPHINCS+).
2.  **Adopt:** Users create new addresses reference the new Script's `code_hash`.
3.  **Migrate:** Users transfer assets from old addresses to the new quantum-resistant addresses.

The network does not fork. Old addresses continue to function. The upgrade is permissionless and can occur gradually over time.

### Problem 2: The Data Size Limitation

Even if other blockchains successfully coordinate a hard fork, they still face a physical limit: **Data Size**. Quantum-resistant signatures are significantly larger than classical ones, which directly impacts transaction size and fees.

- **Secp256k1 (Bitcoin/ETH):** ~64 bytes
- **ML-DSA (Dilithium):** ~2.5 KB (~40x larger)
- **SPHINCS+:** 8 KB – 49 KB (~125x - 760x larger)

Using Bitcoin as an [example](https://x.com/bensig/status/1985426927893823667), consolidating 100 UTXOs with ML-DSA signatures could produce a transaction exceeding **250KB**, potentially resulting in very high transaction fees during periods of network congestion.

Nervos CKB does not face such a problem because the verification of signatures is done by separting the rule (Lock Script) from the proof(Witness). In addition, CKB supports grouping inputs that share the same Lock Scripts, allowing multiple inputs to be verified with a single signature stored in the transaction's Witnesses.

As a result, moving 100 Cells with SPHINCS+ signatures can require no more signature data than transferring a single Cell using the same scheme. Further details are available in the documentation on [Script Group Execution](/docs/tech-explanation/script-group-exe) and [Witness](/docs/tech-explanation/witness).

## What CKB has achieved

### Implementation Details: SPHINCS+ on CKB

In 2023, the CKB team and Cryptape researchers implemented a production-ready **Quantum Resistant Lock Script** using **SPHINCS+**. In August 2024, NIST formally approved SPHINCS+ as a quantum-resistant digital signature algorithm under in its FIPS 205 standard. In 2025, the CKB team started deploying the SPHINCS+ Lock Script on the CKB mainnet.

- **Repository:** [cryptape/quantum-resistant-lock-script](https://github.com/cryptape/quantum-resistant-lock-script)

- **Security Audit:** The code has completed a security audit conducted by ScaleBit.

The Lock Script supports [12 different SPHINCS+ parameter sets](https://github.com/sphincs/sphincsplus#parameters), which can be selected by users. It is based on the new definition of [CKB_TX_MESSAGE_ALL](https://github.com/nervosnetwork/rfcs/pull/446) for signing message generation. By default, the Lock Script is implemented as a multi-signature Script, with single-signature usage treated as a special case.

#### Why SPHINCS+?

The CKB team selected SPHINCS+ as the reference implementation because it is a **stateless, hash-based digital signature scheme**.

- **Safety:** SPHINCS+ does not rely on number-theoretic assumptions (such as lattice-based constructions) that may be affected by the future mathematical advances. Its security relies solely on **Hash Functions** (like SHA-256), which are incredibly robust.
- **Stateless design:** Unlike stateful schemes such as XMSS, SPHINCS+ does not require state tracking, which simplifies key management and reduces operational risk in distributed blockchain environments.

The primary trade-off of SPHINCS+ is signature size. CKB addresses this through its **Witness** data structure. CKB separates the "Lock" (which defines the rules) from the "Witness" (which provides the proof). Large signatures—such as a 20 KB SPHINCS+ signature—are stored in the Witness, which is flexible and transaction-scoped, rather than in the state-defining Lock Script.

#### Performance Benchmarks

There are 3 implementations for the Lock Script:

- [A Lock Script in C](https://github.com/cryptape/quantum-resistant-lock-script/blob/main/contracts/c-sphincs-all-in-one-lock) using [SPHINCS+](https://github.com/sphincs/sphincsplus)
- [A Lock Script in Rust](https://github.com/cryptape/quantum-resistant-lock-script/blob/main/contracts/sphincs-all-in-one-lock) using [fips205](https://github.com/integritychain/fips205)
- [A hybrid Lock Script](https://github.com/cryptape/quantum-resistant-lock-script/blob/main/contracts/hybrid-sphincs-all-in-one-lock) with the implementation of SPHINCS+ utilizing the sphincsplus C library and Rust glue code.

The exact cycle consumptions will slightly vary from one signature to another, a ballpark estimation of cycle consumptions (here we measure cycle consumptions for the whole Script, meaning CKB transaction signing is included as well) for each NIST approved parameter set, can be located below(`M` stands for million):

|                       | 128s bit | 128f bit | 192s bit | 192f bit | 256s bit | 256f bit |
| --------------------- | -------- | -------- | -------- | -------- | -------- | -------- |
| pubkey size           | 32       | 32       | 48       | 48       | 64       | 64       |
| signature size        | 7856     | 17088    | 16224    | 35664    | 29792    | 49856    |
| sha2 simple (C)       | 11.5M    | 32.2M    | 17.6M    | 49.4M    | 25.7M    | 49.7M    |
| sha2 simple (Hybrid)  | 11.6M    | 34.5M    | 18.5M    | 49.4M    | 25.7M    | 49.0M    |
| sha2 simple (Rust)    | 21.9M    | 59.2M    | 31.5M    | 87.1M    | 45.3M    | 92.6M    |
| shake simple (C)      | 20.5M    | 60.4M    | 31.7M    | 91.9M    | 46.5M    | 91.5M    |
| shake simple (Hybrid) | 20.8M    | 62.0M    | 31.7M    | 89.9M    | 48.1M    | 92.4M    |
| shake simple (Rust)   | 37.6M    | 111.6M   | 53.3M    | 156.6M   | 76.5M    | 157.6M   |

In general, the `s` variants take longer to generate a signature, but takes less cycles to verify. The `f` variants are fast in signature generation but takes longer cycles to verify.

### Community Applications and Tools

As the SPHINCS+ Lock Script is production-ready, members of the Nervos CKB community have begun experimenting with SPHINCS+-based, real-world applications.

- [Quantum-Purse](https://github.com/tea2x/quantum-purse) - A CKB quantum-safe & lightweight wallet developed by the community

Additional SPHINCS+-based applications and tools are expected to emerge as adoption within the CKB ecosystem continues to grow.

## Summary

Rather than depending on future governance actions to introduce new cryptography, CKB relies on architectural separation. By decoupling cryptographic mechanisms from consensus rules, Nervos CKB acts as a **future-proof vessel**—ready to accommodate any cryptographic changes wihout protocol-level disruption.

| Feature             | Other Blockchains        | Nervos CKB                   |
| :------------------ | :----------------------- | :--------------------------- |
| **Cryptography**    | Hardcoded in protocol    | Pluggable via Scripts        |
| **Upgrade Path**    | Network-wide hard fork   | Permissionless migration     |
| **PQC Feasibility** | Low (Block space limits) | High (Flexible Witness data) |
| **Status**          | Research / Theoretical   | **Live on Mainnet**          |
