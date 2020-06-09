---
id: nervos-blockchain
title: Nervos Blockchain
---

## What is the Nervos Blockchain?

The Nervos blockchain, also known as the Common Knowledge Base, is the bottom-most layer in the Nervos ecosystem. It serves as a foundation to build on and provides trust to all layers built on top. It is designed to maximize decentralization while remaining minimal, flexible, and secure. Its main purpose is the reliable preservation of any data and assets stored within it.

## Multi-Layer Architecture

Trade-offs must be made when designing any decentralized system. An example of a common trade-off is between scalability, security, and decentralization. Achieving high levels of all three on a single layer is difficult to impossible, but different layers can each address different concerns.

An example of how layering helps improve this:

* Layer 1 focuses on security and decentralization, providing trust to higher layers.
* Layer 2 focuses on scalability, providing nearly instantaneous transactions for millions of users.

The two layers function together to achieve higher levels of decentralization, security, and scalability.

The Nervos blockchain represents layer 1 of the multi-layer architecture, and its core design principles prioritize security and decentralization.

## What is a CKByte?

The native token of Nervos is known as the CKByte, or CKB for short. One CKByte token entitles the holder to one byte of data storage on Nervos. The CKByte is also used to pay any fees associated with transactions and computation.

If you need to store 100 bytes of data in Nervos, you must own 100 CKBytes. While your data is occupying space on Nervos, your CKBytes will remain locked. If your data is no longer needed and you remove it from Nervos, then the 100 CKBytes can be used for other purposes.

CKBytes can also be deposited in the Nervos DAO where they gain interest in a process similar to staking.

We will cover more about the CKByte in the [Cell Model](cell-model.md) and [Economics](economics.md) sections.

## Programming on Nervos

Nervos offers smart contract programmability using a growing number of well-known general-purpose programming languages, such as Javascript, Rust, and C.

All programs on Nervos can store data and state on-chain. This makes the creation of complex applications and customized tokens a simple and straightforward process.

All code is executed in CKB-VM, a high-performance RISC-V virtual machine that provides a safe, consistent, and flexible environment for developers to utilize. Multiple instances of CKB-VM can execute different smart contracts at the same time, enabling substantial scaling improvements through massive parallelization.

We will cover more about programming on Nervos in the [Cell Model](cell-model.md) and [CKB-VM](ckb-vm.md) sections.

## Consensus

Nervos uses a Proof of Work (PoW) based consensus algorithm known as NC-MAX. PoW has repeatedly been proven to be the best in class solution for incentivized security.

Building on Bitcoin’s Nakamoto Consensus, NC-MAX dramatically increases transactions per second and decreases confirmation time without compromising on security or decentralization.

Nervos currently provides a 10x throughput increase compared to Ethereum and is expected to grow exponentially as layer 2 solutions are developed.

We will cover more about the design of Nervos’ consensus implementation in the [Consensus](consensus.md) section.
