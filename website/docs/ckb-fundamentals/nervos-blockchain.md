---
id: nervos-blockchain
title: Nervos Blockchain
---

## What is the Nervos Blockchain?

Nervos blockchain, also known as Common Knowledge Base, is the rock-bottom layer of the Nervos ecosystem. As the foundation, Nervos blockchain provides trust for all the layers built on top of it. It is designed to maximize decentralization while remaining minimal, flexible, and secure. Its primary objective is to reliably preserve any data and assets stored therein.

## Multi-Layer Architecture

Trade-offs are inevitable in designing any decentralized system. A common example of the trade-off concerns scalability, security, and decentralization. It is tough to achieve all three at the same high level on a single layer, but having different layers can solve different problems separately.

An example on how layering helps improve this:

- Layer 1 focuses on security and decentralization, providing trust to higher layers.
- Layer 2 focuses on scalability, providing nearly instantaneous transactions for millions of users.

These two layers function together to achieve higher levels of decentralization, security, and scalability.

The Nervos blockchain represents the layer 1 of a multi-layer architecture that prioritizes security and decentralization as core design principles.

## What is a CKByte?

The native token of Nervos is known as the CKByte, or CKB for short. One CKByte token entitles the holder to one byte of data storage on Nervos. The CKByte is also used to pay fees associated with any transactions and computations.

To store 100 bytes of data in Nervos, it is mandatory to have 100 CKBytes. If your data occupies space on Nervos, your CKBytes will remain locked. If your data is no longer needed and is removed from Nervos, the 100 CKBytes will be available for other purposes.

CKBytes can also be deposited in the Nervos DAO，where they gain rewards in a staking-like process.

Further information about CKByte will be presented in the [Cell Model](cell-model.md) and [Economics](economics.md) sections.

## Programming on Nervos

Nervos offers smart contract programmability using a growing number of well-known general-purpose programming languages, such as Javascript, Rust, and C.

All programs on Nervos can store data and state on-chain，which makes creating complex applications and customized tokens a simple and straightforward process.

All code runs in CKB-VM. CKB-VM is a high-performance RISC-V virtual machine that provides a secure, consistent and flexible environment for developers. Multiple instances of CKB-VM can execute different smart contracts concurrently, which enables substantial scaling improvements through massive parallelization.

More details about programming on Nervos will be covered in the [Cell Model](cell-model.md) and [CKB-VM](ckb-vm.md) sections.

## Consensus

Nervos uses a Proof of Work (PoW) based consensus algorithm，known as NC-MAX. PoW has been repeatedly proven to be the best in class solution for incentivize security.

Building on Bitcoin’s Nakamoto Consensus, NC-MAX dramatically increases transactions per second and decreases confirmation time without compromising security or decentralization.

Nervos currently provides a 10x throughput boost compared to Ethereum, and is expected to grow exponentially as layer 2 solutions come to the table.

More details on the design of Nervos’ consensus implementation will be discussed in the [Consensus](consensus.md) section.
