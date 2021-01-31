---
id: rfcs_zh
title: 了解 RFCs 文档
---

Nervos Network 由一系列协议和创新方法组成。关键协议的设计和实现需要有明确的文档和技术规范，这一点至关重要，因此我们采用 RFC (request for comment) 流程，旨在为新协议、优化建议和最佳实践提供一个开放的、由社区驱动的渠道。

本章节会带你了解一下当前的 RFCs 文档，帮助你更好的了解 Nervos 网络。RFCs 文档会分成两类：

* 标准类（Standards Track）：这部分 RFC 是 Nervos network 中的协议、客户端和应用程序需要遵循的标准。
* 信息类（Informational）：任何和 Nervos network 相关的内容。

## 信息类（Informational）

### [Nervos Network 定位白皮书](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0001-positioning/0001-positioning.zh.md)

该 RFC 提供了对 Nervos Network 各个组成部分的详细描述，并重点介绍每个部分是如何协同工作以支持我们对整个网络的愿景。

### [Nervos CKB: 加密经济共同知识库](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0002-ckb/0002-ckb.zh.md)

这是 Nervos CKB 的白皮书，提供了 Nervos CKB 的概述，一个免准入许可的公链，也是 Nervos Network 的 layer1。 

### [CKB-VM](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0003-ckb-vm/0003-ckb-vm.zh.md)

该 RFC 专门介绍 CKB 虚拟机：CKB-VM，它是一个基于 RISC-V 指令集的虚拟机，由 Rust 语言编写，用于执行 Nervos CKB 上的智能合约。文档中有通过一个用户自定义代币(user defined token, or UDT)的发行过程来介绍 CKB 中虚拟机的执行过程的示例。

### [CKB VM 中的特权架构支持](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0005-priviledged-mode/0005-priviledged-mode.zh.md)

本 RFC 的目标是为 CKB VM 添加特权架构支持。虽然由于 CKB VM 每次只运行一个合约，特权模式在 CKB VM 本身的运行中并不需要，但特权模式对添加 MMU 的支持是很有帮助的。

### [Nervos CKB 经济模型](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.zh.md)

本 RFC 介绍了 Nervos CKB 的经济模型。Nervos CKB 是整个 Nervos 网络的基础层，一个专注于“资产存储”的区块链。在经济上，它的设计是为了提供可持续的安全性和去中心化。

### [数据结构](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0019-data-structures/0019-data-structures.zh.md)

本 RFC 解释了 CKB 中使用的所有基本数据结构，包括 Cell，脚本，交易以及区块。

### [CKB 共识协议](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.zh.md)

这是 Nervos CKB 的共识协议白皮书。CKB 的共识协议是 NC 的变体，在保留 NC 优点的同时，提升了其性能极限和抵抗自私挖矿攻击的能力。

### [CKB 交易结构](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md)

本 RFC 我们深入探究 CKB 的基本数据结构：交易。

本文将分成两个部分。第一个部分描述交易的核心特征，第二部分将介绍一些扩展内容。

## 标准类（Standards Track）

### [CKB 区块同步协议](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0004-ckb-block-sync/0004-ckb-block-sync.zh.md)

块同步**必须**分阶段进行，采用 [Bitcoin Headers First](https://bitcoin.org/en/glossary/headers-first-sync) 的方式。每一阶段获得一部分块的信息，或者基于已有的块信息进行验证，或者两者同时进行。

### [用于静态数据的默克尔树](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0006-merkle-tree/0006-merkle-tree.zh.md)

CKB 使用 ***Complete Binary Merkle Tree(CBMT)*** 来为静态数据项生成 *Merkle Root* 及 *Merkle Proof*。

### [P2P 评分系统和网络安全](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0007-scoring-system-and-network-security/0007-scoring-system-and-network-security.zh.md)

本 RFC 描述了 CKB P2P 网络层的评分系统，以及基于评分的网络安全策略。

### [序列化](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0008-serialization/0008-serialization.zh.md)

本 RFC 介绍了 CKB 主要使用的两种序列化格式： [Molecule](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0008-serialization/0008-serialization.zh.md#molecule) 和 [JSON](https://www.json.org/)。

### [VM 系统调用](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0009-vm-syscalls/0009-vm-syscalls.zh.md)

本 RFC 描述了当前 CKB 已实现的所有 RISC-V VM 系统调用。CKB VM 系统调用用于实现基于 RISC-V 的 CKB VM 与 CKB 进程之间的通讯，可以在运行在 VM 中的脚本读取当前交易信息以及通用的链上信息。

### [Eaglesong（Nervos CKB 的 PoW 函数）](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0010-eaglesong/0010-eaglesong.zh.md)

本 RFC 详细介绍了 Nervos CKB 的工作量证明哈希函数：Eaglesong。 

### [交易过滤](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0011-transaction-filter-protocol/0011-transaction-filter-protocol.zh.md)

交易过滤协议能够帮助节点减少需要发送的交易数据量，这是为了让低容量的节点也能维持对链上某些特定交易的最新状态或者验证交易的执行情况的高度安全保证。

### [节点发现](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0012-node-discovery/0012-node-discovery.zh.md)

本 RFC 介绍 CKB 的节点发现协议。主要参考了 [比特币的协议](https://en.bitcoin.it/wiki/Satoshi_Client_Node_Discovery)。主要不同点如下:
- 节点版本号包含在 `GetNodes` 消息中
- 通过 `Nodes` 消息来定时广播当前连接的所有节点
- 我们使用 `multiaddr` 作为节点地址的格式 (不允许出现 `/p2p/` 段，如果违反会被认为是*不良*行为并被打低分)

### [区块模板](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0013-get-block-template/0013-get-block-template.zh.md)

本 RFC 主要是用来描述去中心化的 CKB 挖矿协议，该协议通过使区块去中心化来提高 CKB 网络的安全性。

### [VM Cycle 限制](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.zh.md)

这个 RFC 描述了用于规范 VM 脚本的 cycle 限制。

CKB VM 是一个灵活的虚拟机，可以自由地实现许多流程控制，比如 loops 或者 branches。因此，我们需要在 CKB VM 中强制执行某些规则来防止恶意脚本，比如带有无限循环的脚本。

### [交易有效字段：since](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0017-tx-valid-since/0017-tx-valid-since.zh.md)

这个 RFC 建议通过添加一个新的共识规则，来防止在某个特定的区块时间戳或者区块号之前使用某个 Cell。

### [CKB 地址格式](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0021-ckb-address-format/0021-ckb-address-format.zh.md)

本 RFC 介绍如何实现 CKB 地址格式，这个 Cell 的锁脚本（lock script）在应用层的显示建议。lock script 主要由三个关键参数组成，包括：`code_hash`，`hash_type` 和 `args`。CKB 地址将锁脚本（lock script）封装为单行的、可验证的和人类可读的格式。

### [Nervos DAO 的存入和取出](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.zh.md)

本文描述了 Nervos DAO 中的存入和取出机制。Nervos DAO 是一个智能合约，就像 CKB 上其他的智能合约一样，用户可以与之交互。Nervos DAO 的功能之一就是为 CKByte 持币者提供一种抗稀释的功能。

注意: 这里有常见问题汇总：[Common Gotchas](https://github.com/nervosnetwork/ckb/wiki/Common-Gotchas#nervos-dao)，如果您想要清楚地了解如何使用 Nervos DAO 并且不丢失 CKB，那么请务必阅读该部分，里面包含了一些常见的且非常重要的要点

