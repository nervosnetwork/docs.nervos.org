---
id: extreme-decentralization
title: Extreme Decentralization
---

Decentralization is the core value proposition of public blockchains. It ensures censorship resistance, permissionless access, and security without relying on trusted intermediaries. As the layer 1 protocol of Nervos Network, CKB is designed from the ground up to make sure this core value is not compromised.

## Decoupling: Our Approach to True Decentralization

To achieve true decentralization, a blockchain cannot function as a "do everything" platform. If a single layer attempts to maximize performance, offer developer convenience, and maintain strong security at the same time, these goals create conflicting incentives. High throughput begins to override verification needs, and shortcuts taken for developer experience frequently introduce points of centralization.

Nervos CKB addresses this by decoupling concerns across a multi-layered architecture, viewing the blockchain landscape as a continuous spectrum:

- **The Far Left:** Extreme decentralization, lowest-threshold verification, and uncompromised security.
- **The Far Right:** Developer experience, high throughput, the middleware and centralized services needed for mass adoption.

### The Last Line of Defense

CKB is positioned at the **far-left edge** of this spectrum, serving as the immutable trust anchor and the **last line of defense** for the entire network. Compromising the base layer for usability or speed would weaken the security of the entire structure.

This separation establishes a clear division of labor:

- **Layer 1 (CKB):** Focuses exclusively on being the ultimate guardian of value. Its design prioritizes maximum decentralization, security, and censorship resistance—the original spirit of crypto—above all else.
- **Layer 2 & Ecosystem:** Focuses on scalability, high performance, the developer and user experience necessary for mass adoption, free from the burden of base-layer consensus trade-offs.

This principle applies not only to code, but also for operational decisions. For example, the CKB team deliberately avoid providing centralized conveniences, such as a default, production-grade RPC service (similar to Infura in Ethereum). While such a service would make developers’ lives easier, it introduces a central point of failure. Note that the [public RPC service](/docs/getting-started/rpcs) provided by CKB exists solely for testing, and developers are strongly encouraged to run their own RPC services for their dApps. By refusing to encroach on the "service layer," CKB forces the ecosystem to build its own robust, distributed access layers, ensuring the foundation remains a neutral, decentralized settlement layer.

## How to Achieve Extreme Decentralization

Decentralization is not just about who mines the next block–it is about who can independently **verify** the chain's history. If running a node becomes too expensive due to data bloat, participation collapses into a few data centers, and the system recentralizes in practice regardless of its consensus algorithm.

CKB addresses this challenge through three radical design choices: **Sustainable State Management**, **Proof-of-Work Consensus**, and a viable **Light Client**, supported by ongoing engineering efforts to lower the barrier to running nodes.

### 1. Sustainable State Management

Most blockchains operate as "General Computation Networks" (like a world computer). Users pay a one-time fee to execute a transaction, but the resulting data (state) occupies the network's storage forever at no further cost. This leads to the **"Tragedy of the Commons"**: because storage is effectively free, the state grows indefinitely ([State Explosion](https://medium.com/nervosnetwork/state-explosion-and-the-tragedy-of-the-blockchain-commons-1fbd4837e859)). Eventually, only enterprise-grade hardware can store the chain, forcing regular users to trust third parties.

CKB takes a different approach. It adopts a "General Verification Network" architecture built on the [Cell Model](/docs/tech-explanation/cell-model), where on-chain storage is treated as a scarce resource rather than free space.

- **State as a Scarce Resource:** On-chain state is modeled as a finite resource that must be explicitly accounted for.
- **1 CKB = 1 Byte of Storage:** The native token, CKB, represents state capacity; holding 1 CKB entitles the holder to store 1 byte of data on the blockchain.
- **Targeted Inflation (State Rent):** Occupying on-chain storage requires locking CKB, which carries an opportunity cost through secondary issuance. This mechanism functions as a form of "state rent" and encourages efficient use of capacity, ensuring that developers and users store only the truly valuable data.

**Why this guarantees decentralization:**

By economically constraining the growth of the state, CKB ensures that the hardware requirements for running a full node remain low and predictable over decades. This allows users to run nodes on consumer hardware, preserving the network's permissionless nature.

Moving computation off-chain also reduces the burden on full nodes. They only need to verify the result, which is typically much faster than executing the computation itself.

### 2. Proof-of-Work (PoW) over Proof-of-Stake (PoS)

CKB utilizes [**NC-Max**](https://eprint.iacr.org/2020/1101.pdf) (a variant of Nakamoto Consensus) with a custom hash function, **Eaglesong**. While many modern blockchains rely on Proof-of-Stake (PoS), CKB adheres to PoW for decentralization-related reasons:

1.  **Permissionless Participation:** In PoW, anyone with hardware and electricity can participate. There is no need to buy tokens from existing holders to become a validator, avoiding the "rich get richer" centralization loop often criticized in PoS.
2.  **Objective Security:** PoW provides an objective measure of the chain's security (accumulated work). A new node can independently verify the valid chain with the most work without trusting any peers or checkpoints.
3.  **Cost of Attack:** Attacking a PoW network requires tangible external resources (energy and hardware), whereas attacking a PoS network involves internal resources (staked tokens).

### 3. Viable Light Client

True decentralization requires that users can verify the state of the blockchain themselves rather than relying on trusted third-party RPC nodes (like Infura or Alchemy). If a user relies on a server to tell them their balance, they are not using a blockchain; they are using a bank.

However, running a full node (downloading terabytes of history) is impossible for mobile and web users. CKB solves this with a next-generation **Light Client** protocol that brings full-node-level security to consumer devices.

#### The FlyClient Protocol & MMR

Unlike traditional SPV (Simplified Payment Verification), where clients must download linearly increasing amounts of headers, CKB implements the **FlyClient** protocol.

- **Logarithmic Scaling:** Instead of downloading every block header, the client uses a probabilistic sampling technique. It downloads only a logarithmic number of block headers to statistically verify the Proof-of-Work with near certainty.
- **Merkle Mountain Ranges (MMR):** CKB blocks include an MMR root in their headers. This cryptographic structure allows the light client to prove that any specific block is part of the valid chain history without storing the history itself.
- **Result:** A user can sync the chain in seconds with minimal bandwidth, regardless of how long the blockchain becomes.

#### WASM & In-Browser Verification

The CKB Light Client is compiled to **WebAssembly (WASM)**, enabling it to run in browser environments and other platforms that do not support traditional full node operations.

- **No Installation Required:** The light client can be embedded directly into a web wallet or dApp. When a user visits a website, the browser operates as a lightweight verification node.
- **Trustless Interaction:** Instead of relying on a server to check balances or transactions, the browser connects to the P2P network, samples block headers, and verifies data locally. 
- **Mobile Ready:** With minimal storage requirements(storing only a single block header between executions) and low CPU usage, the light client can operate efficiently on mobile devices.

#### Privacy and Sovereignty

The CKB Light Client protocol allows the client to request specific transaction data and state (Cells) related _only_ to the user.

- **Data Minimization:** The client filters data at the network level. If you own 5 UTXOs (Cells), your device only fetches and verifies the proofs for those 5 items, ignoring the rest of the global state.
- **Censorship Resistance:** Because the client connects to a randomized mesh of peers rather than a single RPC endpoint, it is extremely difficult for any single entity to block the user's access to the network.

By embedding the verification layer directly into the user's application, CKB closes the final gap in decentralization: **The user is not just a customer of the network; the user _is_ the network.**

## Summary

In summary, CKB achieves extreme decentralization through three core components:

- **Sustainable State Management**: By enforcing the rule that **1 CKB = 1 byte of storage**, CKB treats state as a scarce resource, preventing unbounded growth and keeping full nodes practical to run.
- **Proof-of-Work Consensus**: Security is anchored in permissionless participation, allowing anyone to help secure the network by contributing computing power.
- **Light Client**: Independent verification is possible on browsers and mobile devices without requiring full-node resources.
