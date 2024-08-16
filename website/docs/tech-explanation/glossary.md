---
id: glossary
title: Glossary
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## Glossary Sections

- [General Glossary](#general-glossary)
- [Economics Glossary](#economics-glossary)
- [Technical Glossary](#technical-glossary)

---

## General Glossary

### Account

A kind of basic object in distributed ledger used to keep the balance and other information of users.

---

### Address

A label consists of string of letters and numbers that anonymously represents user's identity on chain. Crypto assets can be sent to and/or from addresses.
CKB address packages [Lock Script](#lock-script) into a single line, verifiable, and human read friendly format. A single public-private key pair can generate multiple Lock Scripts, consequently multiple addresses.

#### Synonyms

- [Payment Address](#payment-address)

#### See Also

- [Lock Script](#lock-script)
- [Private Key](#private-key)
- [Public Key](#public-key)

---

### Asset

A piece of data that has value or that represents an entity having value.

#### Synonyms

- [Digital Asset](#digital-asset)
- [Token](#token)

---

### Block

A grouping of transactions, marked with a timestamp, and a fingerprint of the previous block. The block header is hashed to produce a proof of work, thereby validating the transactions. Valid blocks are added to the main blockchain by network consensus.

#### See Also

- [Blockchain](#blockchain)
- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### Block Height

Block height is the total number of blocks that have been confirmed on the blockchain, also used to identify a unique block when specifying a particular block height, as there is always an exact block at any block height.

#### Synonyms

- [Height](#height)

#### See Also

- [Block](#block)
- [Blockchain](#blockchain)
- [Confirmation](#confirmation)

---

### Block Interval

Also known as [Block Time](#block-time). Block interval is the length of time it takes to create a new block in a cryptocurrency blockchain. Block interval is the measure of the time it takes the miners or validators within a network to verify transactions within one block and produce a new block in that blockchain. The block interval is variable on Nervos blockchain.

The block interval on the Bitcoin blockchain is approximately every 10 minutes. The block interval on Nervos is variable, but is usually under 10 seconds.

#### Synonyms

- [Block Time](#block-time)

#### See Also

- [Block](#block)
- [Blockchain](#blockchain)

---

### Block Propagation

The process of synchronizing a new block to the majority of full nodes in the network. Block propagation is a well-known bottleneck that prevents Bitcoin from scaling.

Block propagation time is an average time that is needed for the new block to reach the majority of nodes in the network. Long block propagation delay reduces the node's resistance against 51% attacks.

#### Synonyms

- [Propagation](#propagation)

#### See Also

- [Block](#block)
- [Broadcast](#broadcast)
- [Full Node](#full-node)

---

### Block Reward

The amount of cryptocurrency credited to a miner's account after the miner successfully adds a block of transactions to the blockchain.

In Nervos CKB, block rewards are the CKBytes credited to a miner's account after a block is successfully added to CKB by the miner.

#### See Also

- [Block](#block)
- [Block Subsidy](#block-subsidy)

---

### Block Time

Alternatively referred to as [Block Interval](#block-interval).

#### Synonyms

- [Block Interval](#block-interval)

---

### Blockchain

A data structure maintaining a growing list of records, organized as a chain of blocks. Each block, apart from the first one, is cryptographically linked to the previous block, thus creating a chain-like structure.

The cryptographic link ensures any party with the last block can verify that none of the historical data is modified after the creation of this block.

#### See Also

- [Block](#block)

---

### BLS Signature

A cryptographic signature scheme for signing and verification. BLS is short for Boneh–Lynn–Shacham.

#### See Also

- [Boneh–Lynn–Shacham on Wikipedia](https://en.wikipedia.org/wiki/Boneh%E2%80%93Lynn%E2%80%93Shacham)

---

### Broadcast

Blocks are sent to all nodes in a blockchain network.

#### See Also

- [Blockchain](#blockchain)
- [Node](#node)

---

### Capacity

The maximum space (in bytes) that a Cell can occupy on the Nervos CKB.

#### Synonyms

- [CKByte](#ckbyte)

#### See Also

- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Common Knowledge Byte](#common-knowledge-byte)
- [Nervos Blockchain](#nervos-blockchain)

---

### Cell

Cells are the primary state units in CKB, within them users can include arbitrary states. All data on Nervos CKB is stored in Cells.

A Cell has 4 fields: `capacity`, `data`, `type` and `lock`.

#### Synonyms

- [Micro-State](#micro-state)

#### See Also

- [Data](#data)
- [Lock](#lock)
- [Lock Script](#lock-script)
- [Type Script](#type-script)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [Cell Model](/docs/tech-explanation/cell-model)
- [UTXO on Bitcoin.org](https://developer.bitcoin.org/glossary.html)

---

### Cell Model

A representation of how state is managed on Nervos CKB. The Cell Model is a more generic state model than either Bitcoin's UTXO or Ethereum's account model.

The Cell Model is a new construction that combines many of the advantages of Ethereum's account model with the asset ownership and proof-based verification properties of Bitcoin's UTXO model.

#### See Also

- [Lock Script](#lock-script)
- [Type Script](#type-script)
- [Cell Model](/docs/tech-explanation/cell-model)
- [Cell Model on the Nervos Blog](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571)
- [UTXO on Bitcoin.org](https://developer.bitcoin.org/glossary.html)

---

### Censorship Resistance

Censorship resistance in blockchain generally means that it is difficult for a malicious party to prevent the blockchain from confirming a set of transactions generated by honest users.

---

### Chain

A shorthand name for blockchain.

#### Synonyms

- [Blockchain](#blockchain)

---

### CKB

An abbreviation which can have different meanings depending on the context:

- Common Knowledge Base - The layer 1 blockchain of the Nervos Network.
- Common Knowledge Byte - The native token of the Nervos Common Knowledge Base.

#### Synonyms

- [Common Knowledge Base](#common-knowledge-base)
- [Common Knowledge Byte](#common-knowledge-byte)

---

### CKByte

A shorthand name for Common Knowledge Byte.

CKByte is also sometimes shortened to CKB. Exchanges often use CKB as the ticker symbol.

#### Synonyms

- [CKB](#ckb)
- [Common Knowledge Byte](#common-knowledge-byte)

#### Not To Be Confused With

- [Common Knowledge Base](#common-knowledge-base)

---

### CKB-VM

CKB-VM is a crypto-agnostic virtual machine, a RISC-V instruction set based VM for executing both on-chain and off-chain code.

#### See Also

- [RISC-V](#risc-v)
- [Script](#script)
- [Virtual Machine on Wikipedia](https://en.wikipedia.org/wiki/Virtual_machine)

---

### Code Hash

A field in a Cell which contains a hash value that can refer to a specific piece of data, or a specific Cell referenced by Type ID.

#### See Also

- [Cell](#cell)
- [Type ID](#type_id)

---

### Cold Storage

A method of securing funds by placing them in a cold wallet; a type of wallet that is never connected to the internet.

#### See Also

- [Cold Wallet](#cold-wallet)
- [Hardware Wallet](#hardware-wallet)
- [Wallet](#wallet)

---

### Cold Wallet

A wallet that is used to secure assets offline. This wallet is permanently disconnected from the internet, and not vulnerable to attacks which rely on an active internet connection.

#### See Also

- [Cold Storage](#cold-storage)
- [Wallet](#wallet)

---

### Commit

Nervos CKB's consensus algorithm, [NC-Max](#nc-max) consensus, has two phases: **propose** and **commit**. Commit is the process of including a valid proposed transaction into a new block.

---

### Commit-Chain

A scheme that enables the off-chain processing of transactions by one or more operators with on-chain state update commitments that do not contain per-transaction data.

---

### Commit Reward

A reward paid to miners in CKBytes on inclusion of previously proposed transactions.

---

### Common Knowledge Base

A layer 1 proof of work blockchain that provides a foundation of decentralized trust for the Nervos Network.

#### Synonyms

- [CKB](#ckb)
- [Nervos CKB](#nervos-ckb)

#### Not To Be Confused With

- [Common Knowledge Byte](#common-knowledge-byte)

#### See Also

- [Nervos CKB on Nervos.org](https://www.nervos.org/ckb/)

---

### Common Knowledge Byte

The native token of the Nervos layer 1 blockchain, the Common Knowledge Base.

Common Knowledge Byte is often abbreviated as CKByte or CKB.

Owning a CKByte entitles the holder to store one byte of data on the Nervos CKB blockchain.

#### Synonyms

- [CKB](#ckb)
- [CKByte](#ckbyte)

#### Not To Be Confused With

- [Common Knowledge Base](#common-knowledge-base)

#### See Also

- [Capacity](#capacity)
- [Nervos CKB](#nervos-ckb)
- [Shannon](#shannon)

---

### Confirmation

A process where a transaction has been accepted and verified by the network and included in a block.

#### See Also

- [Block](#block)
- [Transaction](#transaction)
- [Unconfirmed](#unconfirmed)

---

### Consensus

An algorithm executed among a number of distributed participants, ensuring that all participants faithfully executing this algorithm can reach agreement on some data value even if the other participants are faulty or malicious.

#### See Also

- [NC-MAX](#nc-max)

---

### Consume

The process of using a Live Cell as an input to a transaction. The consumption processes indicate that Live Cell turns into a Dead Cell.

---

### Contract Account

An account containing code that executes automatically whenever it receives an event from another account.

#### See Also

- [Account](#account)

---

### Cryptocurrency

A cryptocurrency is a digital or virtual currency that is secured by blockchain and cryptography, which makes it nearly impossible to counterfeit or double-spend.

#### See Also

- [Digital Currency](#digital-currency)
- [Fiat Currency](#fiat-currency)

---

### Cryptographic Signature

A concise piece of proof data. Cryptographic signature schemes are a fundamental component of cryptocurrency networks that verify the integrity and non-repudiation of transaction messages across the network.

#### Synonyms

- [Private Key](#private-key)
- [Signature](#signature)

---

### Cryptography

Cryptography is the practice and study of techniques for secure communication in the presence of adversarial behavior.

#### See Also

- [Cryptography at Wikipedia](https://en.wikipedia.org/wiki/Cryptography)

---

### Cycles

The number of RISC-V computational cycles required by a Script to execute. It's a metric used to prevent malicious behavior such as infinite loops, that's why it is called cycles.

This is a similar concept to Ethereum's Gas, we set cycles to ensure optimal performance and security. Scripts must stay within cycle limits, otherwise the block will be rejected by CKB nodes.

#### See Also

- [Estimate cycles](https://nervos-ckb-docs-git-v1-cryptape.vercel.app/docs/essays/faq/#estimate-cycles)
- [Max_block_cycles](#max_block_cycles)
- [Rules for calculating cycles in RFC on Nervos Network Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.md)
- [Script](#script)
- [RISC-V](#risc-v)
- [Ethereum's Gas](https://ethereum.org/en/glossary/#gas)

---

### DAO

A decentralized autonomous organization (DAO) is an organization represented by rules encoded as a computer program that is transparent, controlled by the organization members and not influenced by a centralized entity, in other words they are member-owned communities without centralized leadership. A DAO's financial transaction record and program rules are maintained on a blockchain.

#### See Also

- [DAO on Wikipedia](https://en.wikipedia.org/wiki/Decentralized_autonomous_organization)

---

### DApp

Decentralized application. At a minimum, it is a smart contract and a web user interface. In a broader sense, dApps are web applications that are built on top of open, decentralized, peer-to-peer infrastructure services. Additionally, many dApps include decentralized storage and/or a message protocol and platform.

---

### Data

In Cell Model, `data` is a field in a Cell which can store arbitrary bytes.

#### See Also

- [Cell](#cell)
- [Cell Model](#cell-model)

---

### Decentralization

In blockchain, decentralization refers to the transfer of control and decision-making from a centralized entity (individual, organization, or group thereof) to a distributed network.

#### See Also

- [Distributed](#distributed)
- [Decentralization on Wikipedia](https://en.wikipedia.org/wiki/Decentralization)

---

### DeFi

Short for "decentralized finance", a broad category of dApps aiming to provide financial services backed by the blockchain, without any intermediaries, so anyone with an internet connection can participate.

---

### Digital Asset

A digital asset is an individual piece of data that has value, or represents another entity that has value.

Digital assets are most commonly represented as tokens, which may be used as digital currency or represent physical items such as real estate.

#### Synonyms

- [Asset](#asset)
- [Token](#token)

---

### Digital Currency

A type of currency that primarily exists digitally over the internet. Physical representations of the currency, in the form of cards, bills, or coins, may exist, but are secondary mediums.

#### See Also

- [Cryptocurrency](#cryptocurrency)

---

### Distributed

A system where components are spread across multiple nodes to parallelize workloads, add redundancy, or eliminate single points of failure.

#### See Also

- [Decentralization](#decentralization)

---

### Digital Object (DOB)

A non-fungible encrypted asset with its content fully stored on-chain, establishing an intrinsic link between content and value.

#### See Also

- [Non-Fungible-Token](#non-fungible-token)

---

### Double-Spending

Double-spending is the risk that a digital token is spent twice or more. In the context of blockchain, it happens when the transaction spending a digital token is cancelled after confirmation, and the same token is spent in another transaction.

#### See Also

- [Confirmation](#confirmation)
- [Cryptocurrency](#cryptocurrency)
- [Token](#token)
- [Transaction](#transaction)

---

### Epoch

An epoch is a period of time for a set of blocks.

In Nervos, the PoW difficulty changes on a new epoch. All the blocks in the same epoch share the same difficulty target. The difficulty adjustment algorithm aims to stabilize the orphan block rate at 2.5% and the epoch duration at 4 hours.

#### See Also

- [Block](#block)

---

### Fee

The sender of a transaction often includes a fee to the network for processing the requested transaction. There's no minimum fee rate set in consensus, but there's a minimum fee rate 1,000 Shannons/KB in CKB's [P2P](#p2p) network. (1 Shannon = 10<sup>-8</sup> CKB)

#### See Also

- [Shannon](#shannon)
- [Fee rate](#fee-rate)
- [Fee rate in RFC on Nervos Network Github](https://github.com/nervosnetwork/ckb/tree/develop/rpc#error-poolrejectedtransactionbyminfeerate)

---

### Fee Rate

A tip per byte that a user offers to the miners for including his transaction in a block on the blockchain.

This is a same concept to Bitcoin's [Fee Rate(often spelled feerate)](https://en.bitcoin.it/wiki/Miner_fees#Feerates).

#### See Also

- [Fee](#fee)

### First-Class Assets

Assets that 1. the asset itself (rather than a reference to the asset) can be passed directly in smart contract interactions, and 2. directly controlled by owners without any intermediaries.

#### See Also

- [First-Class Asset](https://medium.com/nervosnetwork/first-class-asset-ff4feaf370c4)
- [Introduction to First-Class Asset](https://talk.nervos.org/t/first-class-asset/1293)

---

### Fork

A change in protocol causing the creation of an alternative chain, or a temporal divergence in two potential block paths during mining.

---

### Full Node

A full node is an essential component of the CKB network. It stores and syncs the entire blockchain, verifies the validity of blocks and transactions, and enforces the network's consensus rules.

```
ckb init --chain Mainnet && ckb run
```

#### See Also

- [Node](#node)
- [Light Node](#light-node)
- [Mining Node](#mining-node)

---

### Full Payload Format

The deprecated full payload format directly encodes all data field of Lock Script. The encode rule of deprecated full payload format is [Bech32](https://en.bitcoin.it/wiki/Bech32).

#### See Also

- [Lock Script](#lock-script)

---

### Fungible Token

A fungible token can be fiat currencies like the dollar or a cryptocurrency like Bitcoin.

Fungible tokens or assets are divisible and non-unique.

#### See Also

- [Non-Fungible Token](#non-fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)

---

### Gas Limit

The maximum amount of gas a transaction or block may consume.

#### See Also

- [Ethereum's Gas](https://ethereum.org/en/glossary/#gas)

---

### Hard-Fork

A permanent divergence in the blockchain; also known as a hard-forking change. One commonly occurs when nonupgraded nodes can’t validate blocks created by upgraded nodes that follow newer consensus rules. Not to be confused with a fork, soft fork, software fork, or Git fork.

---

### Hardware Wallet

A hardware wallet is a form of cold wallet. A hardware wallet is a cryptocurrency wallet that stores the user's private keys (a critical piece of information used to authorize outgoing transactions on the blockchain network) in a secure hardware device.

#### See Also

- [Cold Storage](#cold-storage)
- [Cold Wallet](#cold-wallet)
- [Private Key](#private-key)
- [Wallet](#wallet)

---

### Hash

A fixed-length fingerprint of variable-size input, produced by a hash function.

---

### Hash Rate

Hash rate is a measure of the computational power per second used when mining. These operations are known as "hashing".

#### See Also

- [Miner](#miner)
- [Network Hash Rate](#network-hash-rate)

---

### Height

A shorthand name for block height.

#### Synonyms

- [Block Height](#block-height)

---

### Light Client

As a low-resource node, a light client allows users to sync with a blockchain in a cryptographically secure manner without having to store the whole blockchain.

---

### Light Node

A light node downloads only the headers of the blockchain, conserving resources. It relies on other nodes for full transaction data and is a lightweight option for network participation.

```
ckb-light-client run --config-file ./testnet.toml
```

#### See Also

- [Node](#node)
- [Full Node](#full-node)
- [Mining Node](#mining-node)

---

### Mempool

Short for "memory pool". A waiting area on full nodes for transactions that have been broadcasted to the network but have not yet been confirmed on the blockchain.

#### See Also

- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### Metadata

Metadata is data that provides information about other data. `capacity`, `type` and `lock` in Cells are metadata, they occupy Cell capacity and incur a state cost as well.

#### See Also

- [Capacity](#capacity)
- [Cell](#cell)
- [Lock](#lock)
- [Type Script](#type-script)

---

### Micro-State

A small piece of state that is isolated and often able to be acted upon independently without knowing the total state of the network.

On Nervos, micro-state is represented by a Cell.

#### Synonyms

- [Cell](#cell)

#### See Also

- [State](#state)

---

### Miner

A network node that finds valid proof of work for new blocks, by repeated hashing.

#### See Also

- [Proof of Work](#proof-of-work)

---

### Miner Fee

Another term for transaction fee.

#### Synonyms

- [Transaction Fee](#transaction-fee)

---

### Mining

Mining is the process by which a blockchain node get new token reward by verifying new transactions, finding valid proof of work and creating new blocks.

#### See Also

- [Block](#block)
- [Blockchain](#blockchain)
- [Mining Reward](#mining-reward)
- [Proof of Work](#proof-of-work)

---

### Mining Node

Mining nodes create new blocks by solving computational puzzles. They contribute to the network's security and consensus by actively validating and adding blocks to the blockchain.

```
ckb init --chain Mainnet && ckb miner
```

#### See Also

- [Block](#block)
- [Consensus](#consensus)
- [Miner](#miner)
- [Mining](#mining)
- [Proof of Work](#proof-of-work)
- [Full Node](#full-node)
- [Light Node](#light-node)

---

### Mining Reward

Native tokens paid to miners as a reward for providing the necessary computing resources for mining.

#### See Also

- [Miner](#miner)
- [Mining](#mining)
- [Native Token](#native-token)

---

### Multisig

The term multisig stands for multi-signature, which is a specific type of digital signatures that can be created through the combination of multiple unique signatures.

---

### Native Token

The token issued as reward to a blockchain's consensus nodes. Nervos CKB's native token is CKByte.

#### See Also

- [CKByte](#ckbyte)
- [Token](#token)

---

### NC-MAX

Nervos CKB's consensus algorithm, which follows NC's backbone protocol. The main innovation here is a two-step transaction confirmation mechanism

#### See Also

- [Consensus](#consensus)
- [Nervos Blockchain](#nervos-blockchain)
- [NC-MAC](https://eprint.iacr.org/2020/1101)

---

### Neighbor

A node that is directly connected to another node in the blockchain peer to peer network.

#### See Also

- [Node](#node)
- [Peer to Peer](#peer-to-peer)

---

### Nervos Blockchain

The layer 1 blockchain of the Nervos Network known as the Common Knowledge Base.

#### Synonyms

- [Common Knowledge Base](#common-knowledge-base)
- [Layer 1](#layer-1)
- [Nervos CKB](#nervos-ckb)

---

### Nervos DAO

Nervos DAO enable users to lock CKBytes to get compensation from Nervos CKB secondary issuance. This process is similar to staking on other platforms. Nervos DAO provides a "virtual hardcap" for CKByte holders to insulate them from inflation.

#### See Also

- [CKByte](#ckbyte)
- [DAO](#dao)
- [Secondary Issuance](#secondary-issuance)
- [Nervos DAO Explained on the Nervos Blog](https://medium.com/nervosnetwork/nervos-dao-explained-95e33898b1c)
- [Nervos DAO in RFC on Nervos Network Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)
- [Inflation Rate Chart](https://explorer.nervos.org/charts/inflation-rate)

---

### Network Hash Rate

A measurement of the total computational processing power which is dedicated to providing security to the network.

#### See Also

- [Hash Rate](#hash-rate)
- [Miner](#miner)

---

### Node

A software client that participates in the network.

#### See Also

- [Full Node](#full-node)
- [Light Node](#light-node)
- [Mining Node](#mining-node)

---

### Nonce

In cryptography, a value that can only be used once. Nonce can refer to two things in blockchain context: 1. a proof-of-work nonce is the random value in a block satisfying the proof of work requirement; 2. an account nonce is a transaction counter in each account, which is used to prevent replay attacks.

#### See Also

- [Block](#block)
- [Proof of Work](#proof-of-work)

---

### Non-Fungible Token

Non-fungible tokens or NFTs are cryptographic assets on a blockchain with unique identification codes and metadata that distinguish them from each other.

#### See Also

- [DOB](#digital-object-dob)
- [Fungible Token](#fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)

---

### Open Source

A piece of software where source code is freely available for examination or alteration by any third-party.

#### See Also

- [What is Open Source at OpenSource.com](https://opensource.com/resources/what-open-source)

---

### P2P

A shortname name for peer to peer.

#### Synonyms

- [Peer to Peer](#peer-to-peer)

---

### Paper Wallet

A form of storing a recovery phrase or private keys offline by printing them on a piece of paper. This document would then be stored by traditional means in a secured location of the user's choosing, such as a safe.

#### See Also

- [Private Key](#private-key)
- [Wallet](#wallet)

---

### Payment Address

A string of letters and numbers that cryptocurrency and assets can be sent to and from.

Nervos CKB Mainnet addresses always begin with the prefix "ckb".

#### Synonyms

- [Address](#address)

---

### Payment Channel

A micropayment channel or payment channel is class of techniques designed to allow users to make multiple payment transactions without committing all of the transactions to the layer 1 blockchain. In a typical payment channel, only two transactions are added to the block chain but an unlimited or nearly unlimited number of payments can be made between the participants.

#### See Also

- [Layer 1](#layer-1)

---

### Peer to Peer

A peer-to-peer (P2P) service is a decentralized platform whereby two individuals interact directly with each other, without intermediation by a third party.

#### Synonyms

- [P2P](#p2p)

#### See Also

- [Node](#node)

---

### Private Key

A private key, also known as a secret key, is a variable in cryptography, known only to the owner(s) of the key, that is used with an algorithm to encrypt and decrypt data.

#### See Also

- [Digital Asset](#digital-asset)
- [Paper Wallet](#paper-wallet)
- [Payment Address](#payment-address)
- [Wallet](#wallet)

---

### Proof of Work

PoW asks users to solve a cryptographic puzzle to prove ownershipo of a certain amount of computational resource to participate in the consensus. In general PoW is a more permissionless consensus mechanism than PoS.

In contrast to wildly spread misconception, PoW is not a "waste" of energy and does not induce more carbon emission. PoW is used in the Nervos layer 1 blockchain CKB.

#### See Also

- [Block](#block)
- [Consensus](#consensus)
- [Mining Reward](#mining-reward)
- [Proof of Stake](#proof-of-stake)
- [Transaction](#transaction)

---

### Proof of Stake

PoS asks users to prove ownership of a certain amount of cryptocurrency (their “stake” in the network) in order to be able to participate in the consensus. PoS relies on weak-subjectivity due to unsolvable issues like long-range attack. In PoS system the future consensus quorum is decided by existing participants completely. PoS is used in layer 2 protocols on Nervos Network.

#### See Also

- [Consensus](#consensus)
- [Mining Reward](#mining-reward)
- [Proof of Work](#proof-of-work)
- [Transaction](#transaction)

---

### Propagation

A shorthand name for Block Propagation.

#### Synonyms

- [Block Propagation](#block-propagation)

---

### Public Key

A notion used only in public-key cryptography, a.k.a. asymmetric cryptography. A public key is a piece of information that can be known to others without compromising security. Unique for each user, a public key is associated with a private key known only to the user. The public key can be used to encrypt a message so that it can only be decrypted with the corresponding private key, or to verify that a message is authorized by the user with the corresponding private key.

#### See Also

- [Private Key](#private-key)

---

### Reward

An amount of CKBytes included in each new block as a reward by the network to the miner who found the proof-of-work solution.

#### See Also

- [CKByte](#ckbyte)
- [Base Reward](#base-reward)
- [Block Reward](#block-reward)
- [Commit Reward](#commit-reward)
- [Mining Reward](#mining-reward)
- [Proposal Reward](#proposal-reward)
- [Secondary Reward](#secondary-reward)

---

### Signature

A shorthand name for cryptographic signature.

#### Synonyms

- [Cryptographic Signature](#cryptographic-signature)

---

### Smart Contract

A smart contract is a self-executing contract with the terms of the agreement between contract creators and contract users being directly written into lines of code. The code and the agreements contained therein exist across a distributed, decentralized blockchain network. Also known as Script on Nervos CKB.

---

### State

Data stored on the blockchain. In most contexts this this means current data and excludes historical data.

#### See Also

- [Blockchain](#blockchain)

---

### State Bloat

The unlimited increase of state data in Ethereum. State bloat slows down node synchronization, raises the barrier of full node, thus hurts network decentralization.

---

### State Channel

A layer 2 solution where a channel is set up between participants, where they can transact freely and cheaply. Only a transaction to set up the channel and close the channel is sent to Mainnet. This allows for very high transaction throughput, but does rely on knowing number of participants up front and locking up of funds.

---

### Tip

A shorthand name for tip block.

#### Synonyms

- [Tip Block](#tip-block)

---

### Tip Block

The most recent block to be confirmed in a blockchain. The tip block has the highest block height in the blockchain.

#### Synonyms

- [Tip](#tip)

#### See Also

- [Block](#block)
- [Block Height](#block-height)
- [Blockchain](#blockchain)

---

### Transaction

Transaction is the basic object created and signed by users to interact with distributed ledger. Transactions update ledger state at users requests. A CKB transaction destroys some outputs created in previous transactions and creates some new outputs. We call the transaction output a Cell in CKB.

#### See Also

- [Blockchain](#blockchain)
- [Nervos Blockchain](#nervos-blockchain)
- [UTXO](#utxo)

---

### Transaction Fee

A fee which is paid in the native token to miners in exchange for processing a transaction.

#### Synonyms

- [Miner Fee](#miner-fee)

#### See Also

- [Miner](#miner)
- [Native Token](#native-token)
- [Transaction](#transaction)

---

### Token

A “token” often refers to non-native token on smart contract platform, such as UDT on Nervos Network or ERC20 on Ethereum.

#### See Also

- [Blockchain](#blockchain)
- [Digital Asset](#digital-asset)
- [Transaction](#transaction)

---

### Turing Complete

Turing Complete refers to a machine that, given enough time and memory along with the necessary instructions, can solve any computational problem, no matter how complex. The term is normally used to describe modern programming languages as most of them are Turing Complete (C++, Python, JavaScript, etc.).

---

### UDT

Short for User-Defined Token, a customised token created with properties defined by the user. In normal usage, this most commonly refers to fungible tokens.

#### Synonyms

- [User-Defined Token](#user-defined-token)

---

### Unconfirmed

The state of a transaction that has not yet been confirmed. An unconfirmed transaction is not finalized and cannot be guaranteed.

#### Synonyms

- [Unconfirmed Transaction](#unconfirmed-transaction)

#### See Also

- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### Unconfirmed Transaction

A transaction that has not yet been confirmed. An unconfirmed transaction is not finalized and cannot be guaranteed.

#### Synonyms

- [Unconfirmed](#unconfirmed)

#### See Also

- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### User-Defined Token

A custom token created with properties defined by the user. In normal usage, this most commonly refers to fungible tokens.

A User-Defined Token is usually referred to by its abbreviation, UDT.

#### Synonyms

- [Fungible Token](#fungible-token)
- [UDT](#udt)

#### See Also

- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)
- [Simple UDT Draft Spec on Nervos Talk](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)

---

### UTXO

Abbreviated from Unspent Transaction Output, UTXO denotes the remaining amount of tokens after a transaction, available for future use. Transactions consume existing UTXOs as inputs and generate new ones as outputs, where each UTXO is spent only once.

#### See Also

- [Transaction](#transaction)
- [The UTXO Model Explained](https://www.nervos.org/knowledge-base/utxo_model_explained)

---

### Wallet

User-facing software used to interact with on-chain entities such as assets, smart contracts and dApps. A wallet can include key management itself or delegate key management to external hardware for improved security.

#### See Also

- [Paper Wallet](#paper-wallet)
- [Private Key](#private-key)
- [Payment Address](#payment-address)
- [Digital Asset](#digital-asset)

---

## Economics Glossary

### Base Issuance

Base issuance is the basic CKByte issuance with a fixed and decreasing schedule. Base issuance is awarded to miners as incentives to protect the network and also as an indirect token distribution method.

Base issuance is limited to a finite total supply 33.6G (33.6 billion) CKBytes.

#### See Also

- [Base Reward](#base-reward)
- [CKByte](#ckbyte)
- [Secondary Issuance](#secondary-issuance)
- [Miner](#miner)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Base Reward

Base reward is the block reward (in CKBytes) to miners generated from the base issuance. Base reward halves approximately every 4 years until eventually reaching 0, like Bitcoin.

#### See Also

- [Base Issuance](#base-issuance)
- [CKByte](#ckbyte)
- [Miner](#miner)
- [Transaction](#transaction)

---

### Commit Reward

A reward paid to miners in CKBytes for committing a previously proposed transaction. After the transaction has been committed it is confirmed.

#### See Also

- [CKByte](#ckbyte)
- [Confirmation](#confirmation)
- [Miner](#miner)
- [Transaction](#transaction)

---

### Economic Abstraction

With proper tool support, users can use tokens other than CKByte (for example, stable coins) to pay transactions fees, a concept known as "Economic Abstraction".

---

### Fiat Currency

Fiat currencies are a medium of exchange established as money, often by government regulation. Fiat money does not have intrinsic value and does not have use value. It has value only because a government maintains its value, or because parties engaging in exchange agree on its value.

#### See Also

- [Cryptocurrency](#cryptocurrency)
- [Digital Currency](#digital-currency)

---

### Heavy Asset Problem

A common problem found in multi-asset blockchain platforms where the value of the assets stored on the chain gains significant value but the native token of the chain does not. This raises the incentive to attack the network, but does not increase the security because the value of the native token is what is used to secure the network.

#### See Also

- [Asset](#asset)
- [Starving Layer 1 Problem](#starving-layer-1-problem)
- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)

---

### Liquidity

The ability for an asset to be bought or sold easily without causing a significant change in the current market price.

#### See Also

- [Asset](#asset)

---

### Proposal Reward

A reward paid to miners in CKBytes for proposing an unconfirmed transaction.

#### See Also

- [CKByte](#ckbyte)
- [Confirmation](#confirmation)
- [Miner](#miner)
- [Transaction](#transaction)

---

### Secondary Issuance

The creation of new CKBytes that is paid to miners through secondary rewards. Secondary issuance follows a fixed inflation schedule of 1.344 billion CKBytes per year. Nervos DAO stakers are not affected by secondary issuance.

#### See Also

- [Base Issuance](#base-issuance)
- [CKByte](#ckbyte)
- [Nervos DAO](#nervos-dao)
- [Secondary Reward](#secondary-reward)
- [State](#state)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Secondary Reward

A subsidy paid to miners in CKBytes for providing the compute and storage requirements required for processing transactions and persisting data on Nervos.

Secondary rewards are created from secondary issuance, and continuously pay miners for the verification of transactions and preservation of blockchain state.

#### See Also

- [CKByte](#ckbyte)
- [Miner](#miner)
- [Secondary Issuance](#secondary-issuance)
- [Transaction](#transaction)

---

### Selfish Mining Attack

Selfish mining is a concept that was addressed by Cornell University researchers in detail in a 2013 report. In this attack, malicious miners gain unfair block rewards by deliberately orphaning blocks mined by others.

#### See Also

- [Selfish Mining Related Paper](https://www.cs.cornell.edu/~ie53/publications/btcProcFC.pdf)

---

### Starving Layer 1 Problem

A scenario that can arise in multi-layer blockchain platforms where the vast majority of the transaction traffic moves from layer 1 to layer 2, taking the vast majority of transaction fees with it. If layer 1 relies exclusively on transaction fees to support the security of the platform, it may end up not having enough incentives available to properly secure it.

#### See Also

- [Heavy Asset Problem](#heavy-asset-problem)
- [Layer 1](#layer-1)
- [Layer 2](#layer-2)
- [Transaction](#transaction)
- [Transaction Fee](#transaction-fee)

---

### State Rent

A recurring fee that is paid to persist and secure state data.

On Nervos, secondary issuance is used to boost the payment of state rent by users who occupy space on the Nervos blockchain.

#### See Also

- [Secondary Issuance](#secondary-issuance)
- [Nervos Blockchain](#nervos-blockchain)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Store of Assets

Similar to the concept of "Store of Value" in the context of Bitcoin, we call the utility "Store of Assets" when a blockchain keeps any crypto-assets securely and censorship-resistantly. Nervos CKB is such a Store of Assets or SoA.

#### See Also

- [Store of Value](#store-of-value)

---

### Store of Value

Assets which can maintain their worth over time without depreciating

A good store of value either match or outpace the inflation rate of fiat currency, and has a reasonable amount of liquidity, allowing the asset to be easily sold.

#### See Also

- [Store of Assets](#store-of-assets)
- [Liquidity](#liquidity)

---

### Tail Emission

A type of reward that is paid to miners through a fixed amount of inflation.

#### See Also

- [Secondary Reward](#secondary-reward)

---

### Targeted Inflation

A form of inflation that only affects a specific subset of users.

Nervos uses Secondary Issuance to create targeted inflation on users who occupy space on the Nervos blockchain to pay State Rent. Long-term holders of CKBytes have the option of locking them in the Nervos DAO, which acts and an inflation shelter.

#### See Also

- [CKByte](#ckbyte)
- [Secondary Issuance](#secondary-issuance)
- [Nervos Blockchain](#nervos-blockchain)
- [Nervos DAO](#nervos-dao)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Tragedy of the Commons

A situation in a system where the participants act in accordance with their self-interest and deplete or destroy a shared resource through their collective action.

#### See Also

- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)
- [Tragedy of the Storage Commons](#tragedy-of-the-storage-commons)

---

### Tragedy of the Security Commons

A situation that can emerge on multi-asset blockchain platforms where asset tokens rely on the storage and security of the blockchain platform, but do not contribute back to the platform. As the number of assets that "ride for free" increases, so does the burden placed on the underlying blockchain platform. If the assets do not contribute to the underlying platform, the available security may not properly support the network.

#### See Also

- [Heavy Asset Problem](#heavy-asset-problem)
- [Tragedy of the Commons](#tragedy-of-the-commons)
- [Tragedy of the Storage Commons](#tragedy-of-the-storage-commons)

---

### Tragedy of the Storage Commons

A situation that can emerge on incentivized blockchain platforms where mining rewards are paid for inclusion of data to the blockchain, but no rewards exist for the long-term persistence of the blockchain data. As the size of the chain grows, so do the costs associated with persisting the data. If there is no direct incentive for persisting data, fewer and fewer nodes will do so. Eventually, too few nodes will be available to properly support the network.

#### See Also

- [Tragedy of the Commons](#tragedy-of-the-commons)
- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)

---

## Technical Glossary

### Active Cell

Or Live Cell, a Cell exists in the current CKB state. Only active Cells can be used as inputs to new transactions.

#### Synonyms

- [Live Cell](#live-cell)

#### See Also

- [Cell](#cell)
- [Input](#input)
- [Transaction](#transaction)

---

### Aggron

The first Nervos CKB Testnet corresponding to Mainnet Lina.

- **CKB version**: >= v0.101.0 (latest stable is recommended)
- **Genesis hash**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **Init command**: `ckb init --chain testnet`
- **Launched at**: 2020-05-22 04:00:00 UTC
- **ckb2021 activated at**: 2021-10-24 03:00:00 UTC

#### Synonyms

- [Testnet](#testnet)

#### Not To Be Confused With

- [Lina](#lina)
- [Mainnet](#mainnet)

---

### Animagus

A framework layer that runs on top of Nervos CKB which provides an easy way to query for account balances without having to go through the Cell collection process.

#### See Also

- [Cell Collection](#cell-collection)
- [Nervos CKB](#nervos-ckb)
- [Animagus Introduction on the Nervos Blog](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-animagus-part-1-introduction-66fa8ce27ccd-cfb361a7d883)

---

### Args

Args is short for arguments. Arguments are data provided to the Lock Script or Type Script of a Cell, similar to args provided to a function or method call.

Arguments are stored as part of the Cell when it is created.

#### See Also

- [Cell](#cell)
- [Lock Script](#lock-script)
- [Type Script](#type-script)

---

### Axon

Axon is a chain-based layer 2 protocol and framework with a practical security and economic model. Axon chains allow anyone to stake tokens on CKB to become a validator and participate in consensus.

#### See Also

- [Layer 2](#layer-2)
- [Nervos CKB](#nervos-ckb)

---

### Blake2b

A cryptographic hash function. BLAKE2b (or BLAKE2) is optimized for 64-bit platforms including NEON-enabled ARMs and produces digests of any size between 1 and 64 bytes. BLAKE2b is optimized for 8- to 32-bit platforms, and produces digests of any size between 1 and 32 bytes. CKB uses BLAKE2b as the default hash algorithm.

#### See Also

- [Blake2b paper](https://blake2.net/blake2.pdf)
- [Ckbhash](#ckbhash)
- [Blake Hash Function on Wikipedia](<https://en.wikipedia.org/wiki/BLAKE_(hash_function)>)
- [Hash Function on Wikipedia](https://en.wikipedia.org/wiki/Hash_function)

---

### Block Subsidy

A payment that is made in the native currency of the blockchain that is paid to miners for providing the computational resources create a block and secure the blockchain.

The subsidy consists is the portion of the total block reward that is issued out of inflation for creating the block, but does not include any additional transaction fees that may be paid on top.

#### Synonyms

- [Block Reward](#block-reward)
- [Transaction Fee](#transaction-fee)

---

### Boxer

A lightweight Rust library for verifying the Nervos layer 1 blockchain, the Common Knowledge Base.

#### See Also

- [Common Knowledge Base](#common-knowledge-base)
- [Boxer on GitHub](https://github.com/xxuejie/ckb-boxer)

---

### `block_version`

Version of a block. This field is reserved for the system, set to 0 by default.

```
pub const BLOCK_VERSION: Version = 0;
```

#### See Also

- [Block](#block)

---

### Cell Collection

The process of gathering Cells that meet certain criteria.

For example: To find the balance of a particular account, all active Cells for the address would need to be collected.

#### See Also

- [Cell](#cell)

---

### Cellbase

The transaction in each block that is responsible for the minting of new CKBytes.

This is the equivalent of a coinbase transaction in Bitcoin.

#### See Also

- [CKByte](#ckbyte)
- [Coinbase on Bitcoin.org](https://developer.bitcoin.org/glossary.html)

---

### `cellbase_maturity`

Any referenced cellbase output must meet this requirement in a transaction; otherwise, the transaction is rejected. Cellbase outputs are "locked" and have to wait for 4 epochs (approximately 16 hours) to be confirmed before they become ready to be spent. This restriction is to avoid the risk of later transactions with cellbase root being rollbacked when a soft fork occurs.

```
pub(crate) const CELLBASE_MATURITY: EpochNumberWithFraction =
EpochNumberWithFraction::new_unchecked(4, 0, 1);
```

#### See Also

- [Cellbase](#cellbase)

---

### `cell_deps`

Pointers to Live Cells on the chain that allow Scripts in the transaction to access (read-only) referenced Live Cells.

Find more in the essay [Script dependencies](https://nervos-ckb-docs-git-v1-cryptape.vercel.app/docs/essays/dependencies/#how-dependencies-work).

#### See Also

- [Dependencies](#dependencies)

---

### Ckbhash

CKB uses blake2b as the default hash algorithm with the following configurations:

- output digest size in bytes: `32`
- personalization: `ckb-default-hash`

`ckbhash` is used to denote the blake2b hash with the configurations above, there are example and test vectors in python 3:

```python
import hashlib
import unittest

def ckbhash():
    return hashlib.blake2b(digest_size=32, person=b'ckb-default-hash')

class TestCKBBlake2b(unittest.TestCase):

    def test_empty_message(self):
        hasher = ckbhash()
        hasher.update(b'')
        self.assertEqual('44f4c69744d5f8c55d642062949dcae49bc4e7ef43d388c5a12f42b5633d163e', hasher.hexdigest())

if __name__ == '__main__':
    unittest.main()
```

#### See Also

- [Blake2b](#blake2b)

---

### CKB Merkle Tree

CKB Merkle Tree is a CBMT( [Complete Binary Merkle Tree](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md#complete-binary-merkle-tree) ) using following merge function:

```
ckbhash(left || right)
```

> `ckbhash` is the hash function, `||` denotes binary concatenation.

#### See Also

- [Merkle Tree for Static Data](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md)
- [Ckbhash](#ckbhash)
- [Merkle Tree on Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree)

---

### Code Hash

A field in a Cell that contains a hash value which could refer to a specific piece of data, or a specific Cell referenced by Type ID.

#### See Also

- [Cell](#cell)
- [Data](#data)
- [Type ID](#type_id)

---

### Commit

The process of taking a proposed transaction and adding it to the blockchain. After the transaction has been committed it is confirmed.

Miners are incentivized to commit transactions by being paid a commit reward.

#### See Also

- [Commit Reward](#commit-reward)
- [Confirmation](#confirmation)
- [Propose](#propose)
- [Transaction](#transaction)

---

### Commitment Zone

Section of the block that contains transaction commitments. The commitment zone can only contain valid transactions which have appeared in the proposal zone of one of the previous 2 to 10 blocks.

#### See Also

- [Block](#block)
- [Proposal Zone](#proposal-zone)
- [Transaction](#transaction)

---

### Consume

The process of using a Live Cell as an input to a transaction.

The process of consumption marks the Live Cell as a Dead Cell. This is the equivalent of marking a UTXO as spent in Bitcoin.

#### See Also

- [Cell](#cell)
- [Cell Model](#cell-model)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [UTXO on Bitcoin.org](https://developer.bitcoin.org/glossary.html)

---

### CPFP

Abbreviation of Child Pays For Parent. A transaction replacement method where a child transaction, a transaction spending the output of the stuck one, using a higher fee to encourage miners to process it along its parent, aiding timely processing during congestion.

<img
alt="Child Pays for Parent"
src={useBaseUrl("img/tech_explanation/CPFP.png")}
width="688"
/>

#### See Also

- [Fee Bumping](#fee-bumping)
- [RBF](#rbf)

---

### Crypto Primitives

Well-established, low-level cryptographic algorithm commonly used to build out a cryptographic protocol.

#### See Also

- [Cryptographic Primitive on Wikipedia](https://en.wikipedia.org/wiki/Cryptographic_primitive)

---

### `dao_type_hash`

NervosDAO’s `type_hash`.

Find more in [CKB Genesis Script List](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#ckb-genesis-script-list).

#### See Also

- [Type Script Hash](#type-script-hash)

---

### Data

In Nervos specific contexts, data may refer to the data structure within a Cell. This structure is used to hold any form of information that needs to be stored on the Nervos blockchain.

In more general contexts, data may refer to any form of information.

#### See Also

- [Cell](#cell)
- [Cell Model](#cell-model)

---

### Dead Cell

A Cell that has been used as an input to a previous transaction and is consumed.

A Dead Cell cannot be used as an input to a new transaction, nor can it be used as a dependency. It is effectively destroyed and removed from the active state of the network.

A Dead Cell is the equivalent of a "spent UTXO" in Bitcoin.

#### Synonyms

- [Historical Cell](#historical-cell)

#### See Also

- [Cell](#cell)
- [Cell Model](#cell-model)
- [Consume](#consume)
- [Transaction](#transaction)
- [UTXO on Bitcoin.org](https://developer.bitcoin.org/glossary.html)

---

### Dep Group

A method for referencing multiple dependencies which are commonly used together using a single dependency field.

#### See Also

- [Dep Type](#dep-type)
- [Dependencies](#dependencies)
- [CKB Transaction Structure on GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

---

### Dep Type

A field that specifies the type of the dependency.

#### See Also

- [Dep Group](#dep-group)
- [Dependencies](#dependencies)
- [CKB Transaction Structure on GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

---

### Deps

A shorthand name for dependencies.

#### Synonyms

- [Dependencies](#dependencies)

---

### Dependencies

Dependencies are commonly referred to as deps. Dependencies are Cells that are referenced in a transaction. Cells that are referenced as dependencies are read-only and made available to any Scripts executing within the transaction. Dependencies, or deps, are not consumed.

#### Synonyms

- [Deps](#deps)

#### See Also

- [Cell](#cell)
- [Consume](#consume)
- [Script](#script)
- [Transaction](#transaction)

---

### Duktape

Duktape is an embeddable JavaScript engine, with a focus on portability and compact footprint.

Duktape is used to run JavaScript based smart contracts on Nervos.

#### See Also

- [Duktape Official Website](https://duktape.org/)

---

### Difficulty

A measurement of how difficult it is to solve the [Proof of Work](#proof-of-work) cryptographic puzzle required to create a block.

Networks automatically adjust the difficulty to control the speed at which blocks are generated as mining participants enter and exit the network.

#### See Also

- [Proof of Work](#proof-of-work)

---

### Diviner

A deterministic testing framework for Rust.

#### See Also

- [Diviner on GitHub](https://github.com/xxuejie/diviner)

---

### Eaglesong

Eaglesong is a new hash function developed specifically for Nervos CKB proof-of-work, which is also suitable in other use cases in which a secure hash function is needed.

#### See Also

- [Eaglesong RFC on the Nervos Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)
- [Introducing Eaglesong, Nervos’s New Hash Function for CKB Proof-of-Work](https://medium.com/nervosnetwork/the-proof-of-work-function-of-nervos-ckb-3cc8364464d9)

---

### `epoch_duration_target`

The estimated epoch duration specified by NC-Max. Set as 4 hours in CKB.

```
pub(crate) const DEFAULT_EPOCH_DURATION_TARGET: u64 = 4 * 60 * 60; // 4 hours, unit: second
```

#### See Also

- [Epoch](#epoch)
- [NC-Max](#nc-max)

---

### ERC20

An Ethereum token standard for basic fungible tokens.

An sUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 or ERC777.

#### See Also

- [ERC777](#erc777)
- [Fungible Token](#fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)

---

### ERC721

An Ethereum token standard for non-fungible tokens.

#### See Also

- [Non-Fungible Token](#non-fungible-token)
- [Token](#token)
- [ERC721 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-721)

---

### ERC777

An updated Ethereum token standard for basic fungible tokens that is backwards compatible with ERC20.

An sUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 or ERC777.

#### See Also

- [ERC20](#erc20)
- [Fungible Token](#fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)

---

### ERC1155

An Ethereum token standard that supports the creation any number of fungible or non-fungible tokens on a single contract.

#### See Also

- [Fungible Token](#fungible-token)
- [Non-Fungible Token](#non-fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)
- [ERC1155 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-1155)

---

### Fee Bumping

A mechanism for users to increase the fee of a broadcasted transaction to accelerate confirmation, particularly useful during network congestion, or when the initial fee is too low. Typical fee bumping methods are: CPFP (Child Pays For Parent) and RBF (Replace-By-Fee).

#### See Also

- [CPFP](#cpfp)
- [RBF](#rbf)

---

### Full Address

An address format used on Nervos that includes the full code hash of the Lock Script associated.

#### See Also

- [Address](#address)
- [Short Address](#short-address)

---

### Generator

A program used to create transactions that can be broadcast to the Nervos CKB network.

Generators run locally on the client side (off-chain). They utilize user input and existing Cells as program inputs, to create new Cells with new states as output.

---

### Genesis Block

The first block in the blockchain, used to initialize the global state. The genesis block is unique because it does not contain a reference to the previous block because it is the first.

#### See Also

- [Block](#block)
- [Blockchain](#blockchain)

---

### `genesis_hash`

Hash of CKB genesis block. CKB Genesis Block was created in a decentralized manner that encourages everyone to generate a unique genesis block verifiably through the [Genesis Block Generator](https://github.com/nervosnetwork/genesis-block-generator/blob/master/spec.md). Nodes thus created and activated can be connected to any other node across the network to form a decentralized Common Knowledge Base.

The genesis block contains two main components:

- [System script](https://github.com/nervosnetwork/ckb-system-scripts/blob/v0.5.4/c/dao.c)
- Token pre-allocation based on the Nervos Foundation‘s [announcement](https://medium.com/nervosnetwork/nervos-ckb-official-public-sale-announcement-431438f4cc39#:~:text=Key%20details%20of%20the%20Nervos%20Public%20Sale&text=The%20initial%20total%20supply%20of,be%201%20CKB%20%3D%200.01%20USD.).

#### See Also

- [Genesis block](#genesis-block)

---

### Godwoken

Godwoken is a layer 2 rollup framework for Nervos CKB. It provides scaling capability, as well as an abstract account model to CKB.

#### See Also

- [Godwoken on GitHub](https://github.com/nervosnetwork/godwoken)
- [Godwoken Documentation Site](https://docs.godwoken.io/)

---

### Governance Script

A Type Script which defines the monetary policy of a User Defined Token (UDT).

#### See Also

- [Governance Script Hash](#governance-script-hash)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

### Governance Script Hash

A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### Synonyms

- [Type Script Hash](#type-script-hash)

#### See Also

- [Governance Script](#governance-script)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

### Historical Cell

An alternative term for [Dead Cell](#dead-cell).

#### Synonyms

- [Dead Cell](#dead-cell)

#### See Also

- [Cell](#cell)
- [Cell Model](#cell-model)

---

### Inbound Connection

Inbound connection means it is initiated by the remote peer; and the connection itself is outgoing connection when we switch the subject to the remote peer.

#### See Also

- [Outbound Connection](#outbound-connection)

---

### Indexer

An application or library to trace Live Cells that comply with criteria specified by the developer or user.

#### See Also

- [Cell](#cell)
- [Live Cell](#live-cell)

---

### `initial_primary_epoch_reward`

Incentives paid to miners in CKBytes by epoch in CKB base issuance. Under CKB's consensus, block interval is uncertain, while epoch can be fixed at approximately 4 hours, so reward issuance is determined by epoch. Each epoch issues 1_917_808_21917808 Shannons of CKBytes, whose total amount is fixed but halves every 4 years.

The initial base issuance is 4.2 billion CKBytes per year. Similar to Bitcoin, the base issuance halves approximately every 4 years until it stops.

To calculate, [block reward](/docs/tech-explanation/glossary#block-reward) = `initial_primary_epoch_reward` / epoch_length (the number of blocks in the epoch).

```
pub(crate) const INITIAL_PRIMARY_EPOCH_REWARD: Capacity = Capacity::shannons(1_917_808_21917808);
```

#### See Also

- [Block Reward](#block-reward)
- [Epoch](#epoch)
- [`secondary_epoch_reward`](#secondary_epoch_reward)

---

### Input

A Live Cell that is used in a transaction. If the transaction is accepted by the network, the Live Cell gets consumed as input and labeled as a Dead Cell.

#### See Also

- [Cell](#cell)
- [Consume](#consume)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [Transaction](#transaction)

---

### Keyper

A specification of how to manage wallet Lock Scripts which apply to a specific user.

#### See Also

- [Lock Script](#lock-script)
- [Keyper on GitHub](https://github.com/ququzone/keyper)

---

### Late Spawning

When a node joins a blockchain network for the first time after the network has already been in operation for a period of time.

A network is said to support late spawning if that participant can download and verify the entire blockchain without having to trust any of the participants in the network to feed them unaltered data.

#### See Also

- [Genesis Block](#genesis-block)

---

### Layer 1

Layer 1 of a decentralized ecosystem is the underlying blockchain architecture.

A proof of work blockchain known as the Common Knowledge Base (CKB) that serves as the base layer for the Nervos Network.

#### See Also

- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Layer 2](#layer-2)

---

### Layer 2

Layer 2 refers to a secondary framework or protocol that is built on top of an existing blockchain system.

The main goal of these protocols is to solve the transaction speed and scaling difficulties that are being faced by the major cryptocurrency networks.

#### See Also

- [Layer 1](#layer-1)

---

### Lina

The name of public Mainnet of the Nervos CKB.

- **CKB version**: >= v0.25.2 (latest stable is recommended)
- **Genesis hash**: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
- **Init command**: `ckb init --chain mainnet`
- **Launched at**: 2019-11-15 21:11:00 UTC

#### Synonyms

- [Mainnet](#mainnet)

#### Not To Be Confused With

- [Aggron](#aggron)
- [Testnet](#testnet)

#### See Also

- [Nervos CKB](#nervos-ckb)

---

### Live Cell

A Cell that has not been consumed and is available for use.

This is similar to an unspent transaction output (UTXO) in Bitcoin.

#### Synonyms

- [Active Cell](#active-cell)

#### See Also

- [Cell](#cell)
- [Cell Model](#cell-model)
- [UTXO on Bitcoin.org](https://developer.bitcoin.org/glossary.html)

---

### Lock

A Script that represents the ownership of a Cell. A user successfully unlocks a Cell and is able to consume it if the Cell's Lock Script exits normally.

#### See Also

- [Lock Script](#lock-script)

### Lock Script

A Script that enforces access and ownership of a Cell. This Script controls who has permission to use the Cell as an input. Lock Scripts accept user generated proofs or witnesses and including transaction as inputs.
In Nervos CKB, a Lock Script is encoded into a bytes array (payload) and wrapped into the final address format, creating a one-to-one correspondence between Lock Scripts and addresses.

#### See Also

- [Address](#address)
- [Cell](#cell)
- [Type Script](#type-script)
- [Script](#script)

---

### Lock Script Hash

A [Blake2b](#blake2b) hash of a Lock Script which is used as an identifier for the Script when referenced by a Cell.

#### See Also

- [Cell](#cell)
- [Lock Script](#lock-script)

---

### Mainnet

Short for "main network", the running Nervos CKB public blockchain. The name of the Nervos CKB Mainnet is [Lina](#lina).

#### Synonyms

- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### Not To Be Confused With

- [Aggron](#aggron)
- [Testnet](#testnet)

---

### `max_block_bytes`

The maximum transaction size limit allowed in a block in bytes. Estimated based on the size consumed by 1000 2-in-2-out secp256k1 transactions.

```
pub const MAX_BLOCK_BYTES: u64 = TWO_IN_TWO_OUT_BYTES * TWO_IN_TWO_OUT_COUNT;
```

---

### `max_block_cycles`

The maximum transaction cycle limit allowed in a block. Estimated based on the cycles consumed by 1000 2-in-2-out secp256k1 transactions.

```
/// cycles of a typical two-in-two-out tx.
pub const TWO_IN_TWO_OUT_CYCLES: Cycle = 3_500_000;

/// count of two-in-two-out txs a block should capable to package.
const TWO_IN_TWO_OUT_COUNT: u64 = 1_000;
pub(crate) const MAX_BLOCK_CYCLES: u64 = TWO_IN_TWO_OUT_CYCLES * TWO_IN_TWO_OUT_COUNT;
```

#### See Also

- [Cycles](#cycles)

---

### `max_block_proposals_limit`

The maximum amount of proposals contained in one block. The default value starts from 1.5.

```
TWO_IN_TWO_OUT_COUNT
pub const MAX_BLOCK_PROPOSALS_LIMIT: u64 = 1_500;
```

#### See Also

- [Proposal Zone](#proposal-zone)

---

### `max_uncles_num`

The maximum number (Uint64) of uncle blocks allowed for one block. Set as 2 by default.

```
const MAX_UNCLE_NUM: usize = 2;
```

#### See Also

- [Uncle](#uncle)

---

### `median_time_block_count`

A timestamp is valid only when it is greater than the median timestamp of the previous 37 blocks.

```
const MEDIAN_TIME_BLOCK_COUNT: usize = 37;
```

---

### Minting

The process of creating of new tokens.

#### See Also

- [Token](#token)

---

### Molecule

A serialization framework for encoding data widely used on the Nervos Network.

#### See Also

- [Molecule Specification](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0008-serialization/0008-serialization.md)
- [Molecule on Github](https://github.com/nervosnetwork/molecule)

---

### Muta

A highly customizable, high-performance blockchain framework designed to support proof of stake, BFT consensus and smart contracts.

#### See Also

- [Muta on GitHub](https://github.com/nervosnetwork/muta)
- [Proof of Stake](#proof-of-stake)

---

### Nervos CKB

The layer 1 blockchain of the Nervos Network, the Common Knowledge Base.

Nervos CKB is often referred to as the Nervos Blockchain.

#### Synonyms

- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Nervos Blockchain](#nervos-blockchain)

#### See Also

- [Layer 1](#layer-1)

---

### Off-Chain Computation

A programming model where all computation is done off-chain to reduce the burden on the nodes in the network and provide higher levels of scalability. Nervos uses off-chain computation and on-chain verification.

#### See Also

- [On-Chain Computation](#on-chain-computation)
- [On-Chain Verification](#on-chain-verification)

---

### Off-Chain Scaling

Off-chain scaling is the approach that only using the blockchain as a secure asset and settlement platform in conjunction with transferring almost all transactions off the blockchain.

#### See Also

- [On-Chain Scaling](#on-chain-scaling)

---

### Off-Chain State

The data of an application that is not stored on the blockchain, or is not accessible by on-chain smart contracts.

#### See Also

- [On-Chain State](#on-chain-state)

---

### On-Chain Computation

A programming model where all computation by smart contracts is done on-chain by every node on the network simultaneously.

Ethereum uses on-chain computation.

#### See Also

- [Off-Chain Computation](#off-chain-computation)

---

### On-Chain Scaling

On-chain scaling solution refer to extending the throughput of the consensus process, or increasing network throughput as node number increases.

#### See Also

- [Off-chain Scaling](#off-chain-scaling)

---

### On-Chain State

The data of an application that is stored on the blockchain and is accessible by on-chain smart contracts.

Nervos provides on-chain state for all smart contracts.

#### See Also

- [Off-Chain State](#off-chain-state)

---

### On-Chain Verification

A programming model where all computation is done off-chain to reduce the burden on the nodes in the network, but verification of the resulting data is done on-chain to enforce the smart contract rules created by the developer.

Nervos uses off-chain computation and on-chain verification.

#### See Also

- [On-Chain Computation](#on-chain-computation)

---

### Open Transaction

A signed piece of a transaction that is incomplete and invalid on its own. When combined with other signed transaction pieces can form a complete transaction which can be processed.

One use of open transactions is to create the functionality required for a trustless decentalized exchange.

#### See Also

- [Cryptographic Signature](#cryptographic-signature)
- [Transaction](#transaction)

---

### Optimistic Rollup

A rollup of transactions that use fraud proofs to offer increased layer 2 transaction throughput while using the security and data availability provided by layer 1.

#### See Also

- [Layer 1](#layer-1)
- [Layer 2](#layer-2)

---

### Orphan

A shorthand name for Orphan Block.

#### Synonyms

- [Orphan Block](#orphan-block)
- [Uncle](#uncle)

---

### Orphan Block

An orphan block is a valid block that is not included in the main fork due to, for example, a lag within the network itself. There can be two miners who solve a block simultaneously in NC-Max. They are non-main-chain blocks, also known as stale blocks.

In Nervos, orphan blocks are better described as Uncles.

#### Synonyms

- [Orphan](#orphan)
- [Uncle](#uncle)

#### See Also

- [Block](#block)
- [NC-Max](#nc-max)
- [Orphan Rate](#orphan-rate)

---

### Orphan Rate

A measure of the speed at which Orphan blocks occur within the blockchain network.

#### See Also

- [Orphan Block](#orphan-block)
- [`orphan_rate_target`](#orphan_rate_target)

---

### `orphan_rate_target`

The estimated orphan block rate specified in NC-max. Set as 2.5% in CKB.

```
// o_ideal = 1/40 = 2.5%
pub(crate) const DEFAULT_ORPHAN_RATE_TARGET: (u32, u32) = (1, 40);
```

#### See Also

- [Orphan Rate](#orphan-rate)
- [Orphan Block](#orphan-block)

---

### Orphan Transaction

An orphan transaction is one for which the parent transaction is absent at the time of its processing. It remains unpropagated to other nodes, lingering in a local buffer until it is either evicted or its parent transactions are found.

#### See Also

- [Orphan Block](#orphan-block)

---

### Outbound Connection

Also knowns as "outgoing connection".

A TCP connection is outgoing for the node if it was initiated (sent the TCP SYN packet) by the node in the context.

#### See Also

- [Inbound Connection](#inbound-connection)

---

### Outpoint

A particular output Cell in a transaction.

#### See Also

- [Cell](#cell)
- [Output](#output)
- [Transaction](#transaction)

---

### Output

A Live Cell that is created in a transaction.

#### See Also

- [Cell](#cell)
- [Live Cell](#live-cell)
- [Transaction](#transaction)

---

### Overlord

A byzantine fault tolerant consensus algorithm designed by Nervos for Huobi which can support thousands of transactions per second.

#### See Also

- [Overlord on Medium](https://medium.com/nervosnetwork/overlord-a-new-consensus-algorithm-3cc51690d269)

---

### P2WSH

A Pay-to-Witness-Script-Hash (P2WSH) is a type of Bitcoin transaction similar to a [P2SH](https://en.bitcoin.it/wiki/Pay_to_script_hash) transaction in most ways, except that it uses [SegWit](https://en.wikipedia.org/wiki/SegWit).

---

### `permanent_difficulty_in_dummy`

Keeps the difficulty permanent if PoW is dummy when dev-chain disables NC-MAX difficulty adjustment. As `boolean`, it can be enabled through configuration.

#### See Also

- [Difficulty](#difficulty)

---

### Polyjuice

Polyjuice provides an Ethereum compatible runtime on Godwoken.

#### See Also

- [Godwoken](#godwoken)
- [Polyjuice on GitHub](https://github.com/nervosnetwork/polyjuice)

---

### `primary_epoch_reward_halving_interval`

The halving cycle of epoch reward in CKB base issuance, typically every four years. The mining reward halves when the halving interval occurs.

```
pub(crate) const DEFAULT_PRIMARY_EPOCH_REWARD_HALVING_INTERVAL: EpochNumber =
4 * 365 * 24 * 60 * 60 / DEFAULT_EPOCH_DURATION_TARGET; // every 4 years
```

#### See Also

- [`initial_primary_epoch_reward`](#initial_primary_epoch_reward)

---

### Proposal Zone

Section of the block that contains transaction proposals.

#### See Also

- [Commitment Zone](#commitment-zone)
- [Propose](#propose)

---

### Propose

The process of taking an unconfirmed transaction out of the mempool and proposing it for commitment. A transaction is not confirmed until after it has been committed.

Miners are incentivized to propose transactions by being paid a proposal reward.

#### See Also

- [Commit](#commit)
- [Confirmation](#confirmation)
- [Mempool](#mempool)
- [Proposal Reward](#proposal-reward)
- [Proposal Zone](#proposal-zone)
- [Transaction](#transaction)

---

### `proposer_reward_ratio`

The reward ratio from transaction fees for miners who submit proposals specified by NC-Max. It is set as 40% in CKB, meaning the miner who first submits the transaction proposal will be rewarded with 40% of the transaction fee.

```
const PROPOSER_REWARD_RATIO: Ratio = Ratio::new(4, 10);
```

#### See Also

- [Proposal Reward](#proposal-reward)
- [NC-Max](#nc-max)

---

### RBF

Abbreviation of Replace-by-Fee. A transaction replacement strategy allowing a transaction in the mempool to be replaced with a new transaction having the same input but a higher fee. The fee must be enough to cover itself and all its replaced transactions. RBF was first introduced in [BIP 125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki).

<img
alt="Replace by Fee"
src={useBaseUrl("img/tech_explanation/RBF.png")}
width="688"
/>

#### See Also

- [CPFP](#cpfp)
- [Fee Bumping](#fee-bumping)

### RISC-V

An open standard instruction set architecture (ISA) for general computing.

RISC-V is the instruction set used by the CKB-VM.

#### See Also

- [CKB-VM](#ckb-vm)
- [RISC-V on Wikipedia](https://en.wikipedia.org/wiki/RISC-V)

---

### Schnorr Signature

A cryptographic signature scheme for signing and verification.

#### See Also

- [Schnorr Signature on Wikipedia](https://en.wikipedia.org/wiki/Schnorr_signature)

---

### Script

A Script in Nervos CKB is a binary executable on the CKB-VM. Compared to Bitcoin script, CKB Script is Turing-complete, equivalent to smart contract. A Script can be one of two types:

- Lock Script - Used to control ownership and access to a Cell.
- Type Script - Used to control how a Cell is used in a transaction.

#### See Also

- [CKB-VM](#risc-v)
- [Lock Script](#lock-script)
- [RISC-V](#risc-v)
- [Type Script](#type-script)
- [ELF on Wikipedia](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

---

### `script_args`

`script_args` refers to the arguments imported into the CKB-VM instance as input for the Scripts. In CKB, public key information is conventionally stored in `script_args`, while signature information is in `witnesses`, though it's not mandatory.

When a Script is validated, CKB runs it in a RISC-V VM, and `script_args` must be loaded via special CKB syscalls. The UNIX standard `argc`/`argv` convention is NOT used in CKB. For more information on CKB-VM, please refer to [RFC003: CKB-VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md).

#### See Also

- [CKB-VM](#risc-v)
- [Witness](#witness)

---

### `secondary_epoch_reward`

The secondary reward per epoch. Issued according to CKB’s tokenomics detailed in [RFC0015](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md).

Secondary issuance is designed to collect state rent, and has an issuance amount that is constant over time. After base issuance stops, there will only be secondary issuance.

Secondary issuance has two parts. One is a fixed amount of base incentive (approximately 134.4 million CKBytes per year), while the other varies according to the number of CKBytes currently occupied.

```
pub(crate) const DEFAULT_SECONDARY_EPOCH_REWARD: Capacity = Capacity::shannons(613_698_63013698);
```

#### See also

- [`initial_primary_epoch_reward`](#initial_primary_epoch_reward)
- [Secondary Reward](#secondary-reward)
- [Secondary Issuance](#secondary-issuance)

---

### `secp256k1_blake160_sighash_all_type_hash`

Type hash of `secp256k1_blake160_sighash_all` in [CKB genesis scripts](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#ckb-genesis-script-list).

Find more details [here](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#secp256k1blake160).

---

### `secp256k1_blake160_multisig_all_type_hash`

Type hash of `secp256k1_blake160_multisig_all` in [CKB genesis scripts](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#ckb-genesis-script-list).

Find more details [here](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#secp256k1multisig).

---

### Seed Cell

A design pattern on Nervos from creating unique identifiers used to create unforgeable assets.

#### See Also

- [Cell](#cell)

---

### Shannon

A fractional denomination of CKBytes. 1 CKByte is equal to 100,000,000 Shannons.

A Shannon is the equivalent of a Bitcoin Satoshi.

#### See Also

- [CKByte](#ckbyte)
- [Common Knowledge Byte](#common-knowledge-byte)
- [Satoshi (denomination) on Bitcoin.org](https://developer.bitcoin.org/glossary.html)

---

### Short Address

An address format on Nervos that does not include a code hash of the associated Lock Script, instead using one of the many common Lock Scripts.

The short address format is the most common address format used, and is often referred to as simply "address".

#### Synonyms

- [Address](#address)

#### See Also

- [Code Hash](#code-hash)
- [Lock Script](#lock-script)
- [Full Address](#full-address)

---

### Simple UDT

A standard that defines the most basic implementation of a UDT fungible token on Nervos.

An sUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 or ERC777.

#### Synonyms

- [SUDT](#sudt)

#### See Also

- [Token](#token)
- [UDT](#udt)
- [User-Defined Token](#user-defined-token)
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [Simple UDT RFC on Nervos Nerwork Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md)

---

### Since

`since` is the u64 (unsigned 64-bit integer) field in transaction input for preventing inclusion before a certain block timestamp or a block number.

#### See Also

- [Cell](#cell)

---

### SPV

An abbreviation for Simplified Payment Verification. A protocol for using a blockchain cryptocurrency without having to operate a full node.

SPV clients require far less data to be stored, but also must requires the trust of the network clients it is connected to directly.

#### See Also

- [SPV Wallet](#spv-wallet)
- [Simplified Payment Verification on BitcoinWiki](https://en.bitcoinwiki.org/wiki/Simplified_Payment_Verification)

---

### SPV Wallet

A light-weight cryptocurrency wallet that uses the SPV protocol.

#### See Also

- [SPV](#spv)

---

### SUDT

An abbreviation for Simple UDT.

#### Synonyms

- [Simple UDT](#simple-udt)

---

### Testnet

Short for “test network,” a network used to simulate the behavior of the [Mainnet](#mainnet). The name of the Nervos CKB Testnet is [Aggron](#aggron).

#### Synonyms

- [Aggron](#aggron)

#### Not To Be Confused With

- [Lina](#lina)
- [Mainnet](#mainnet)

---

### Transaction Confirmation Number

The number of confirmations required for a transaction to be added to a block.

As permissionless blockchain designs offer only probabilistic finality, a transaction can never be fully confirmed, facing an adversary with infinite computational power. Therefore, users and apps can choose a number they deem secure. We briefly discuss one factor here that influences the level of security: the recent orphan rate. It takes 6 confirmations to fully settle a transaction when the orphan rate is 0, and 24 confirmations when the rate reaches 2.5% to achieve the same level of security (See the rationale and calculation [here](https://nervos-ckb-docs-git-v1-cryptape.vercel.app/docs/essays/tx-confirmation/)).

In blockchain settlement assurance, transaction confirmation is one of the variables that cannot be easily quantified (See Nic Carter’s [article](https://medium.com/@nic__carter/its-the-settlement-assurances-stupid-5dcd1c3f4e41)). The exact number is open to adjustment depending on the security level that users desire. Nervos CKB sets a minimum of 15 confirmations, which should be considered conservative.

#### See Also

- [Confirmation](#confirmation)
- [NC-Max](#nc-max)
- [Orphan Block](#orphan-block)
- [Orphan Rate](#orphan-rate)

---

### Transaction Hash

Transaction hash, or Txhash, is the unique identifier of a transaction in a blockchain that acts as a record or proof that the transaction has taken place. To get a transaction hash in CKB, the transaction is serialized via Molecule, then the serialized raw is feed to ckbhash function. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

Transaction hash is generated by the serialized `raw` structure through [ckbhash](#ckbhash).

#### See Also

- [Transaction Witness Hash](#transaction-witness-hash)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)
- [Transaction Hash in RFC on Nervos Network Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0027-block-structure/0027-block-structure.md#transaction-hash)

---

### Transaction Witness Hash

Transaction witness hash is generated by the serialized transaction through ckbhash. Transaction is serialized via [molecule](#molecule) in CKB. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

#### See Also

- [Transaction Hash](#transaction-hash)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)

---

### Transaction Root

The field `transactions_root` in header is

```
ckbhash(T || W)
```

> `ckbhash` is the hash function, `||` denotes binary concatenation.

T is the root of a [CKB Merkle Tree](#ckb-merkle-tree), which items are the [transaction hashes](#transaction-hash) of all the transactions in the block.

W is also the root of a [CKB Merkle Tree](#ckb-merkle-tree), but the items are the [Transaction Witness Hash](#transaction-witness-hash) of all the transactions in the block.

#### See Also

- [Ckbhash](#ckbhash)
- [CKB Merkle Tree](#ckb-merkle-tree)
- [Transaction Witness Hash](#transaction-witness-hash)

---

### `tx_proposal_window`

Interval for submitting proposals in the second stage specified by NC-Max. Set between 2 and 10 blocks in CKB.

<img src={useBaseUrl("img/tx-proposal-window.png")}/>

As shown above, when a transaction is first proposed in Block 13, it can be committed in the window between Block 15 and Block 23.

```
pub(crate) const TX_PROPOSAL_WINDOW: ProposalWindow = ProposalWindow(2, 10);
```

---

### `tx_version`

The version of a transaction. This field is set to 0 and is reserved for the system.

```
pub const TX_VERSION: Version = 0;
```

---

### `type_id`

One of the CKB `system_scripts`. A unique feature of Type ID is that it‘s a CKB built-in Script directly implemented in Rust. It doesn't run in CKB-VM but can be used in the same way as other [CKB genesis scripts](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#type-id).

For a deeper understanding of Type ID, check out this blog post: [Introduction to CKB Script Programming 6: Type ID](https://xuejie.space/2020_02_03_introduction_to_ckb_script_programming_type_id/) (also translated into [Chinese](https://talk.nervos.org/t/ckb-type-id/4258)).

#### See Also

- [Script](#script)
- [Type Script](#type-script)

---

### `type_id_code_hash`

The `code_hash` of `type_id`. In view of the specificity of `type_id`, `type_id_code_hash` is hard-coded, not the hash of the actual code.

#### See Also

- [`type_id`](#type_id)

---

### Type Script

A Script that enforces the rules that must be followed in a transaction for a Cell to be consumed as an input or for a Cell to be created as an output.

#### See Also

- [Cell](#cell)
- [Lock Script](#lock-script)
- [Script](#script)
- [Type Script Hash](#type-script-hash)

---

### Type Script Hash

Or `type_hash`, a Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

The two entities in the data structure of CKB’s Cell are `lock` and `type`. Type Scripts can capture any validation logic needed in the Offtransformation.

Type Scripts can implement economic constructs as well. NervosDAO is completely implemented as a Type Script with minimal support from the consensus layer.

#### See Also

- [Cell](#cell)
- [Script](#script)
- [Type Script](#type-script)
- [Lock Script](#lock-script)
- [NervosDAO](https://github.com/nervosnetwork/ckb-system-scripts/blob/66d7da8ec72dffaa7e9c55904833951eca2422a9/c/dao.c)

---

### Uncle

Or Uncle Block. Uncle blocks are created when two blocks are mined and submitted to the ledger at roughly the same time. Only one can enter the ledger as an included block, and the other does not.

Uncles are paid a reduced block reward when they are found and reported.

On Nervos, Uncles are tracked by consensus to adjust the block interval of the network.

An uncle block has to meet the following conditions:

- An uncle should not be on the main chain; in other words, it should not be an uncle if it includes any block from the main chain.
- Uncle’s block number must be smaller than the block‘s number that later includes it.
- Uncle‘s parent must be on the main chain, or uncle’s parent must also be an uncle. In other words, uncle must be linkable to the main chain in any way. It can never be a random block that is not on the main chain.

```
- if !snapshot.is_main_chain(&uncle.hash()) // It should not be on the main chain.
- && !snapshot.is_uncle(&uncle.hash()) // It should not be an uncle twice.
- && uncle.number() < candidate_number // The block number of the uncle should be smaller than that of any block on the main chain.
- && (uncles.iter().any(|u| u.hash() == parent_hash)
|| snapshot.is_main_chain(&parent_hash) // Uncle block should not be parentless. The parent of un uncle must be a block on the main chain or another uncle.
|| snapshot.is_uncle(&parent_hash))
```

<img src={useBaseUrl("img/uncle_rule.png")}/>

As illustrated above, A is the main chain. B3 can be the uncle of A4 (to be included in A4), since B3 is linked to A2. However, B4 cannot be included in A4, since the uncle’s block number must be smaller than A4, the current block on the main chain.

Similarly, B4 can be the uncle of A5 (be included by A5). Although B4‘s parent, B3, is not on the main chain, B3 is the uncle of A4. For this reason, B4 is a legal uncle, and B3 cannot be included by A5.

C2 and C3 cannot be linked to the main chain as their parent is unknown, therefore, they cannot be uncles.

#### See Also

- [`max_uncles_num`](#max_uncles_num)

#### Synonyms

- [Orphan Block](#orphan-block)

#### See Also

- [Block Interval](#block-interval)
- [Orphan Rate](#orphan-rate)
- [Uncle](#uncle)

---

### Uncle Rate

#### See Also

- [Orphan Rate](#orphan-rate)
- [Uncle](#uncle)

---

### Validator

A Script that is used to ensure that the transactions created by the generators are valid. Validators are Scripts that run in CKB-VM as either Lock Scripts or Type Scripts.

#### See Also

- [CKB-VM](#ckb-vm)
- [Lock Script](#lock-script)
- [Type Script](#type-script)
- [Transaction](#transaction)

---

### Witness

A set of cryptographic proof containing the data required to prove authorization of the resources used in the transaction.

#### See Also

- [Transaction](#transaction)

---

### XUDT

An extended UDT standard upon sUDT (Simple UDT) to accommodate additional functionalities, including regulatory compliance. Also written as Extensible UDT.

#### See Also

- [User-Defined Token](#user-defined-token)
- [Simple UDT](#simple-udt)
- [UDT](#udt)

---

### Zk-SNARK

A form of cryptographic proof, that when used in cryptocurrencies, allows for privacy features which do not reveal the amounts or participants in transactions.

Zk-SNARKs require a trusted setup, but are otherwise trustless.

#### See Also

- [Transaction](#transaction)
- [Zk-STARK](#zk-stark)
- [Non-interactive zero-knowledge proofs on Wikipedia](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---

### Zk-STARK

A form of cryptographic proof, that when used in cryptocurrencies, allows for privacy features which do not reveal the amounts or participants in transactions.

Unlike Zk-SNARKs, Zk-STARKs do not require a trusted setup.

#### See Also

- [Transaction](#transaction)
- [Zk-SNARK](#zk-snark)
- [Non-interactive zero-knowledge proofs on Wikipedia](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---
