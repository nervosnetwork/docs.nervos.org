---
id: native-quantum-resistance
title: Native Quantum Resistance
---

# Native Quantum Resistance

As the blockchain industry matures, it faces an existential threat on the horizon: **Large-scale Quantum Computing**. While often discussed as a distant future problem, the "Harvest Now, Decrypt Later" strategy employed by attackers—where encrypted data is intercepted today to be decrypted once quantum hardware matures—makes this an urgent architectural concern.

Most major blockchains, including Bitcoin and Ethereum, rely on **Elliptic Curve Cryptography (ECC)** to derive addresses and sign transactions. A sufficiently powerful quantum computer running [Shor’s Algorithm](https://en.wikipedia.org/wiki/Shor%27s_algorithm) could effectively calculate a private key from a public key, rendering the security of these networks obsolete.

While the industry is standardizing defenses (e.g., NIST's PQC competition), the **implementation path** differs drastically between other blockchains and CKB. CKB does not merely hope to survive the quantum era, it was architected to embrace it.

## Why CKB is native quantum-resistant

Most blockchains struggle with the quantum-resistant problem with two main reasons. CKB is native quantum-resistant not because it outperforms the other blockchains in solving these two problems, but because it is designed from the first principle, which doesn't have those two problems in the first place.

### The hardcoded Cryptographic Primitives problem

The fundamental flaw in most Layer 1 blockchains is that their cryptographic primitives are **hardcoded** into the consensus protocol. This rigidity creates one massive hurdle: the "Hard Fork" crisis. If you want to upgrade to quantum-resistant cryptography, you must coordinate a hard fork with the entire network.

In Ethereum or Bitcoin, the rule "Transaction X is valid" is effectively hardwired to check a specific ECDSA signature. Changing this rule is not a software update; it is a change to the fundamental laws of that blockchain's universe.

CKB is by design a **Cryptographic Abstraction** blockchain. In CKB, the protocol does not know or care what "secp256k1" is. Cryptography is not a consensus rule; it is simply a **Lock Script** (smart contract) that runs in a virtual machine. As a contrast, Ethereum baked the hardcoded ECC into the EVM as a Precompile.

- **Other blockchains:** Act like a pocket calculator. They calculate specific math (ECC) very fast, but you cannot add new buttons.
- **Nervos CKB:** Acts like a generic CPU. If you need a new mathematical operation (like the matrix multiplications used in Lattice-based cryptography), you simply upload the code for it.

This abstraction turns Quantum Resistance from a "Governance Crisis" into a simple "User Choice." Users can choose to migrate to quantum-resistant cryptography without a hard fork. By ten years later, if there are quantum computers that can break the current cryptography, CKB users can follow the process for upgrades in the following:

1.  **Deploy:** Developers deploy a new Lock Script implementing PQC algorithms (e.g., SPHINCS+).
2.  **Adopt:** Users create new addresses referencing this script's `Code Hash`.
3.  **Migrate:** Users transfer assets from old addresses to new quantum-secure ones.

The network does not fork. Old addresses continue to function. The upgrade is permissionless and gradual.

### The Data Size Limitation

Even if a other blockchains successfully coordinates a hard fork, it still faces a physical limit: **Data Size**. Quantum-resistant signatures are orders of magnitude larger than classical ones.

- **Secp256k1 (Bitcoin/ETH):** ~64 bytes
- **ML-DSA (Dilithium):** ~2.5 KB (~40x larger)
- **SPHINCS+:** 8 KB – 49 KB (~125x - 760x larger)

Take Bitcoin as an [example](https://x.com/bensig/status/1985426927893823667), a simple consolidation of 100 UTXOs using ML-DSA signatures could result in a **250KB+ transaction**, potentially costing hundreds of thousands of dollars in fees during peak congestion.

CKB doesn't face such a problem, since the verification of signatures is done by separting the rule(Lock Script) from the proof(Witness). There are also mechanisms that grouping the same Lock Scripts so multiple inputs can share one signature in the transaction Witnesses. That makes moving 100 Cells with SPHINCS+ signatures as simple as moving 1 Cell with SPHINCS+ signature. You can learn more about this in [Script Group Execution](/docs/tech-explanation/script-group-exe) and [Witness](/docs/tech-explanation/witness).

## What CKB has achieved

### Implementation Details: SPHINCS+ on CKB

In 2023, The CKB team and Cryptape researchers have successfully implemented a production-ready **Quantum Resistant Lock Script** using **SPHINCS+**. In August 2024, NIST has finally approved SPHINCS+ as a quantum-resistant digital signature algorithm in its FIPS 205 standard. In 2025, The CKB team started to deploy SPHINCS+ Lock Script on the CKB mainnet.

- **Repository:** [cryptape/quantum-resistant-lock-script](https://github.com/cryptape/quantum-resistant-lock-script)

The Lock Script supports [12 different SPHINCS+ parameter sets](https://github.com/sphincs/sphincsplus#parameters), which can be selected by the user. It is based on the new definition of [CKB_TX_MESSAGE_ALL](https://github.com/nervosnetwork/rfcs/pull/446) to generate the signing message. By default, the Lock script is implemented as a multi-signature contract, and the single-signature process is just a special case of multi-signature.

#### Why SPHINCS+?

We selected SPHINCS+ for the reference implementation because it is a **stateless hash-based signature scheme**.

- **Safety:** It does not rely on complex number-theoretic assumptions (like Lattice problems) that could potentially be broken by future mathematical discoveries. Its security relies entirely on **Hash Functions** (like SHA-256), which are incredibly robust.
- **Statelessness:** Unlike XMSS, it does not require managing state, making it safe for the distributed nature of blockchains.

The trade-off for SPHINCS+ is signature size. However, CKB handles this gracefully using the **Witness** data structure. CKB separates the "Lock" (which defines the rules) from the "Witness" (which provides the proof). A large 20KB signature lives in the Witness field, which is flexible, rather than clogging the state-defining Lock field.

#### Performance Benchmarks

There are 3 implementations for the Lock Script:

- [A C lock script](./contracts/c-sphincs-all-in-one-lock/) using [SPHINCS+](https://github.com/sphincs/sphincsplus)
- [A Rust lock script](./contracts/sphincs-all-in-one-lock/) using [fips205](https://github.com/integritychain/fips205)
- [A hybrid lock script](./contracts/hybrid-sphincs-all-in-one-lock/) with the implementation of SPHINCS+ utilizing the sphincsplus C library and Rust glue code.

The exact cycle consumptions will slightly vary from one signature to another, a ballpark estimation of cycle consumptions(here we measure cycle consumptions for the whole script, meaning CKB transaction signing is included as well) for each NIST approved parameter set, can be located below(`M` stands for million):

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

Since the SPHINCS+ Lock Script is a production-ready implementation, there are already some experiments on building SPHINCS+ based real world applications from the CKB community.

- [Quantum-Purse](https://github.com/tea2x/quantum-purse) - A CKB quantum-safe & lightweight wallet from community

We are looking forward to more SPHINCS+ based applications and tools arised in the CKB community.

## Summary

While other blockchains rely on hope ("we will hard fork when the time comes"), CKB relies on architecture. By decoupling cryptography from consensus, CKB acts as a **future-proof vessel**—ready to absorb any cryptographic breakthrough the moment it is discovered.

| Feature             | Other Blockchains        | Nervos CKB                   |
| :------------------ | :----------------------- | :--------------------------- |
| **Cryptography**    | Hardcoded (Firmware)     | Pluggable (Software)         |
| **Upgrade Path**    | Contentious Hard Fork    | Permissionless Migration     |
| **PQC Feasibility** | Low (Block space limits) | High (Flexible Witness data) |
| **Status**          | Research / Theoretical   | **Live on Mainnet**          |
