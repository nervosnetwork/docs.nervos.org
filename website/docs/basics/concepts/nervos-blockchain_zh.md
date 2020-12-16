# Nervos Blockchain Nervos 区块链

## What is the Nervos Blockchain? 什么是 Nervos 区块链

The Nervos blockchain, also known as the Common Knowledge Base, is the bottom-most layer in the Nervos ecosystem. It serves as a foundation to build on and provides trust to all layers built on top. It is designed to maximize decentralization while remaining minimal, flexible, and secure. Its main purpose is the reliable preservation of any data and assets stored within it.

Nervos 区块链，也称共同知识库（Common Knowledge Base，以下简称 CKB），是 Nervos 生态的最底层。它作为 Nervos 网络的底层基础，为所有上层网络提供信任基础，上层网络基于其上进行开发构建。Nervos 区块链的架构在保持状态数据最小化、灵活性以及安全性的同时最大程度地保持去中心化，实现安全可靠地保存存储在区块链中的所有数据和资产。

## Multi-Layer Architecture 多层架构

Trade-offs must be made when designing any decentralized system. An example of a common trade-off is between scalability, security, and decentralization. Achieving high levels of all three on a single layer is difficult to impossible, but different layers can each address different concerns.

设计任何去中心化系统时都必须涉及权衡取舍。一个常见的例子是 “可扩展性 & 安全性 & 去中心化” 之间的权衡取舍。在单层网络中充分实现这三种性能几乎是不可能的，而通过多层网络分层去各自实现对应的性能，则更具可行性。

An example of how layering helps improve this:

* Layer 1 focuses on security and decentralization, providing trust to higher layers.
* Layer 2 focuses on scalability, providing nearly instantaneous transactions for millions of users.

分层如何改善这一权衡取舍困境的示例：

* Layer 1 专注于安全性与去中心化，为高层网络提供信任。
* Layer 2 专注于可扩展性，为数百万个用户提供近乎即时的交易体验。

The two layers function together to achieve higher levels of decentralization, security, and scalability.

这两层网络功能互补，便实现了高水平的去中心化程度、安全性以及可扩展性。

The Nervos blockchain represents layer 1 of the multi-layer architecture, and its core design principles prioritize security and decentralization.

Nervos 区块链代表着多层架构中的 Layer 1，其核心设计原则优先考虑安全性和去中心化。

## What is a CKByte? 什么是 CKByte ?

The native token of Nervos is known as the CKByte, or CKB for short. One CKByte token entitles the holder to one byte of data storage on Nervos. The CKByte is also used to pay any fees associated with transactions and computation.

Nervos 的原生代币为 CKByte，缩写为 CKB。持有 1 个 CKB 代币便可以在 Nervos 区块链中存储 1 字节数据。CKB 还可用于支付与交易和计算相关的任何费用。

If you need to store 100 bytes of data in Nervos, you must own 100 CKBytes. While your data is occupying space on Nervos, your CKBytes will remain locked. If your data is no longer needed and you remove it from Nervos, then the 100 CKBytes can be used for other purposes.

如果你需要在 Nervos 中存储 100 字节数据，你就必须持有 100 CKB。当你的数据占用这 Nervos 上的空间时，你对应等额的代币也会被锁定。如果你不再需要那些数据并从 Nervos 中删除了它们，100 CKB 便会恢复可用状态。

CKBytes can also be deposited in the Nervos DAO where they gain interest in a process similar to staking.

CKB 也可以类似于质押，存放到 Nervos DAO 中获取利息。

We will cover more about the CKByte in the[Cell Model](https://docs.nervos.org/docs/basics/concepts/cell-model)and[Economics](https://docs.nervos.org/docs/basics/concepts/economics)sections.

在[Cell 模型]()和[经济模型]()章节，我们将详细介绍 CKByte。

## Programming on Nervos 基于 Nervos 编程

Nervos offers smart contract programmability using a growing number of well-known general-purpose programming languages, such as Javascript, Rust, and C.

Nervos 可以使用  Javascript、Rust 以及 C 进行智能合约开发，未来会支持更多的常见通用编程语言。

All programs on Nervos can store data and state on-chain. This makes the creation of complex applications and customized tokens a simple and straightforward process.

Nervos 上的所有程序都可以在链上存储数据和状态，极大程度简化了创建复杂应用和自定义代币的流程。

All code is executed in CKB-VM, a high-performance RISC-V virtual machine that provides a safe, consistent, and flexible environment for developers to utilize. Multiple instances of CKB-VM can execute different smart contracts at the same time, enabling substantial scaling improvements through massive parallelization.

所有代码都在 CKB-VM 中执行，CKB-VM 是一个高性能的 RISC-V 虚拟机，可以为开发者提供一个安全、一致且灵活的开发环境。多个 CKB-VM 实例可以同时执行不同的智能合约，通过这种大规模并行实现扩展性的显著优化。

We will cover more about programming on Nervos in the[Cell Model](https://docs.nervos.org/docs/basics/concepts/cell-model)and[CKB-VM](https://docs.nervos.org/docs/basics/concepts/ckb-vm)sections.

在[Cell 模型]()和[ CKB-VM]()章节，我们将详细介绍 Nervos 编程。

## Consensus 共识

Nervos uses a Proof of Work (PoW) based consensus algorithm known as NC-MAX. PoW has repeatedly been proven to be the best in class solution for incentivized security.

Nervos 使用基于工作量证明（PoW）的共识算法 NC-MAX。PoW 已被反复证明是用于安全性激励的最佳解决方案。

Building on Bitcoin’s Nakamoto Consensus, NC-MAX dramatically increases transactions per second and decreases confirmation time without compromising on security or decentralization.

在比特币的中本聪共识的基础上，NC-MAX 极大地提高了每秒交易量，并减少了确认时间，而不会影响安全性或去中心。

Nervos currently provides a 10x throughput increase compared to Ethereum and is expected to grow exponentially as layer 2 solutions are developed.

与以太坊相比，Nervos 当前的吞吐量实现了 10 倍增长，并且随着 Layer 2 解决方案的开发，吞吐量预计将实现指数增长。

We will cover more about the design of Nervos’ consensus implementation in the[Consensus](https://docs.nervos.org/docs/basics/concepts/consensus)section.

我们将在[共识](https://docs.nervos.org/docs/basics/concepts/consensus)部分中介绍有关 Nervos 共识实现的设计的更多信息。


