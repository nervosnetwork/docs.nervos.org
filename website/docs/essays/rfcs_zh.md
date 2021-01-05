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

This RFC introduces the crypto-economics of Nervos CKB. Nervos CKB is the base layer of the overall Nervos Network which is a preservation focused, "Store of Assets" blockchain. Economically, it's designed to provide sustainable security and decentralization.

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



This RFC describes all the RISC-V VM syscalls implemented in CKB so far.CKB VM syscalls are used to implement communications between the RISC-V based CKB VM, and the main CKB process, allowing scripts running in the VM to read current transaction information as well as general blockchain information from CKB. 

### [Eaglesong (Proof-of-Work Function for Nervos CKB)](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)

This RFC specifies the Eaglesong hash function as it is to be used in the context of Nervos CKB proof-of-work.

### [Transaction Filter](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0011-transaction-filter-protocol/0011-transaction-filter-protocol.md)

Transaction filter protocol allows peers to reduce the amount of transaction data they send which is to allow low-capacity peers to maintain a high-security assurance about the up to date state of some particular transactions of the chain or verify the execution of transactions.

### [Node Discovery](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0012-node-discovery/0012-node-discovery.md)

This RFC introduces the CKB Node Discovery.It mainly refers to [Satoshi Client Node Discovery](https://en.bitcoin.it/wiki/Satoshi_Client_Node_Discovery). The differences between them are summarized below:
* The node version number is included in the `GetNodes` message.
* The `Nodes` message is used to periodically broadcast all nodes currently connected.
* We use `multiaddr` as the format of node addresses (It MUST NOT include `/p2p/` segment otherwise it's considered as *misbehavior* and a low score SHOULD be given.)

### [Block Template](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0013-get-block-template/0013-get-block-template.md)

This RFC describes the decentralized CKB mining protocol which is to improve the security of the CKB network by making blocks decentralized.

### [VM Cycle Limits](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.md)

This RFC describes cycle limits used to regulate VM scripts.CKB VM is a flexible VM that is free to implement many control flow constructs. We need to enforce certain rules in CKB VM to prevent malicious scripts, such as a script with infinite loops.

### [Transaction valid since](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md)

This RFC introduces a new consensus rule to prevent a cell to be spent before a certain block timestamp or a block number by adding a new `u64`  type field:  `since` in the transaction input.

### [CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md)

This RFC introduces how to implement CKB Address Format which is an application level cell lock script display recommendation.CKB address packages lock script into a single line, verifiable, and human read friendly format.

### [Deposit and Withdraw in Nervos DAO](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)

This RFC describes deposit and withdraw transaction in Nervos DAO. Nervos DAO is a smart contract and one function of Nervos DAO is to provide an dilution counter-measure for CKByte holders. Please pay attention to  [Common Gotchas](https://github.com/nervosnetwork/ckb/wiki/Common-Gotchas#nervos-dao) which including common and very important points you should be aware to use Nervos DAO well without losing CKBs.