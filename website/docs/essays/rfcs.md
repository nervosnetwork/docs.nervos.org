---
id: rfcs
title: A Tour of RFCs
---

The Nervos Network is made up of a number of protocols and innovations. It's important to have clear documentation and technical specifications on key protocol design and implementations - for which we utilize an [RFC](https://github.com/nervosnetwork/rfcs) (request for comment) process which is intended to provide an open and community driven path for new protocols, improvements and best practices.

This tour provides  short introduction on our RFCs and links, hope it will be helpful for you to round out your journey to Nervos Network. There are two categories of RFCs：

* Informational - Anything related to Nervos network.

* Standards Track - RFC that is intended to be standard followed by protocols, clients and applications in Nervos Network.

## Informational

### [The Nervos Network Positioning Paper](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0001-positioning/0001-positioning.md)

This document provides a high-level walkthrough of all parts of the Nervos Network, with a focus on how they work together to support the overall vision of the network. 

### [Nervos CKB: A Common Knowledge Base for Crypto-Economy](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md)

This is Nervos CKB whitepaper, provides an overview of the Nervos Common Knowledge Base (CKB), a public permissionless blockchain and layer 1 of Nervos. 

### [CKB-VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md)

This RFC introduces CKB-VM (CKB-Virtual Machine)  which is a RISC-V instruction set based VM for executing smart contracts on Nervos CKB, written in Rust. There is a user defined token(UDT) issuing process used as an example to demenstrate the implementation of CKB-VM.

### [Privileged architecture support for CKB VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0005-priviledged-mode/0005-priviledged-mode.md)

This RFC  introduces privileged architecture support for CKB VM. While CKB VM doesn't require a privileged model since it only runs one contract at a time, privileged model can help bring MMU support.

### [Crypto-Economics of the Nervos Common Knowledge Base](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

This RFC introduces the crypto-economics of Nervos CKB. Nervos CKB is the base layer of the overall Nervos Network which is a preservation focused, "Store of Assets" blockchain. Economically, it's designed to provide sustainable security and decentralization.

### [Data Structures](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md)

This RFC explains all the basic data structures used in CKB, includes [Cell](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md#Cell), [Script](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md#Script), [Transaction](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md#Transaction) and [Block](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md#Block).

### [CKB Consensus Protocol](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md)

This is Nervos CKB consensue paper. The CKB consensus protocol is a variant of NC that raises its performance limit and selfish mining resistance while keeping its merits. 

### [CKB Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

This RFC is about an essential data structure in CKB, the transaction, contains two parts, the first one covers the core transaction features and the second one introduces some extensions.

## Standards Track

### [CKB Block Synchronization Protocol](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0004-ckb-block-sync/0004-ckb-block-sync.md)

Block synchronization must be performed in stages with [Bitcoin Headers First](https://bitcoin.org/en/glossary/headers-first-sync) style. Block is downloaded in parts in each stage and is validated using the obtained parts.

### [Merkle Tree for Static Data](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md)

CKB uses Complete Binary Merkle Tree(CBMT) to generate *Merkle Root* and *Merkle Proof* for a static list of items. 

### [P2P Scoring System And Network Security](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0007-scoring-system-and-network-security/0007-scoring-system-and-network-security.md)

This RFC describes the scoring system of CKB P2P Networking layer and several networking security strategies based on it.

### [Serialization](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0008-serialization/0008-serialization.md)

This RFC introduces two major serialization formats, [Molecule](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0008-serialization/0008-serialization.md#molecule) and [JSON](https://www.json.org/), used in CKB.

### [VM Syscalls](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md)

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