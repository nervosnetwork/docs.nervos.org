---
id: glossary
title: Glossary
---

## 术语小节

- [通用类术语](#通用类术语)
- [经济类术语](#经济类术语)
- [技术类术语](#技术类术语)

---

## 通用类术语

### 地址
支付地址的简称。

#### 同义词
- [支付地址](#支付地址)

---

### 资产
数字资产的简称。

#### 同义词
- [数字资产](#数字资产)
- [代币](#代币)

---

### 区块
区块链中用于包含并且确认交易的记录。

#### 参考
- [区块链](#区块链)
- [确认](#确认)
- [交易](#交易)

---

### 区块高度
区块高度是指区块链上已确认的区块总数。

具体制定某个区块高度时通常指的是特定的某个区块，因为通常在同个高度只有一个区块。

#### 同义词
- [高度](#高度)

#### 参考
- [区块](#区块)
- [区块链](#区块链)
- [确认](#确认)

---

### 区块间隔时间
区块链上创建两个区块中间间隔的大致时间。

比特币的区块间隔时间大约是 10 分钟，Nervos CKB 上的区块间隔时间是变化的，不过通过在 10 秒以下。

#### 同义词
- [区块时间](#区块时间)

#### 参考
- [区块](#区块)
- [区块链](#区块链)

---

### 区块广播
在链上向大多数全节点同步一个新区块的过程。

#### 同义词
- [广播](#广播)

#### 参考
- [区块](#block)
- [广播](#广播)
- [全节点](#全节点)

---

### 区块奖励
以原生代币支付给矿工的款项，奖励矿工新建区块以及保证网络安全所提供的算力资源。

#### 参考
- [区块](#区块)
- [区块补贴](#区块补贴)

---

### 出块时间
区块间隔时间的别称。

#### 同义词
- [区块间隔时间](#区块间隔时间)

---

### 区块链
一种不可篡改的数据结构，其中每个后续数据块都与之前的数据块进行加密链接。这就创造了一个类似于链式的结构，在这个结构中，所有的历史数据都不能被篡改，而不会导致验证错误。

#### 参考
- [区块](#区块)

---

### 广播
发送给区块链网络中所有节点的消息。

#### 参考
- [区块链](#区块链)
- [节点](#节点)

---

### 容量
一个 Cell 在 Nervos CKB 上可以占用的最大空间（单位：字节）。

#### 同义词
- [CKByte](#ckbyte)

#### 参考
- [CKB](#ckb)
- [共同知识库](#共同知识库)
- [共同知识字节](#共同知识字节)
- [Nervos 区块链](#Nervos 区块链)

---

### Cell
一个简单的结构，用于保存 Nervos CKB 上的一段状态或数据。

Cell 类似于比特币的 UTXO 概念。

#### 同义词
- [微状态](#微状态)

#### 参考
- [已销毁 Cell](#已销毁-Cell)
- [可用 Cell](#可用-Cell)
- [Nervos CKB](#nervos-ckb)
- [关键概念中的 Cell 模型定义](/key-concepts/cell-model)
- [UTXO](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Cell 模型
Nervos CKB 上状态管理方式的表示。

#### 参考
- [锁脚本](#锁脚本)
- [Nervos CKB](#nervos-ckb)
- [类型脚本](#类型脚本)
- [关键概念中的 Cell 模型定义](/key-concepts/cell-model)
- [Nervos 博客中的 Cell 模型定义](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571)
- [UTXO](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### 链
区块链的简称。.

#### 同义词
- [区块链](#区块链)

---

### CKB
英文缩写，具体含义取决于具体的语境：

- 共同知识库（Common Knowledge Base）：Nervos 网络的 layer1，也称为 Nervos CKB。
- 共同知识字节（Common Knowledge Byte）：Nervos 网络的原生代币。

#### 同义词
- [共同知识库](#共同知识库)
- [共同知识字节](#共同知识字节)

---

### CKByte
共同知识字节（Common Knowledge Byte）的简称。

CKByte 有时候也直接简写为 CKB。交易所通常使用 CKB 作为代币符号。

#### 同义词
- [CKB](#ckb)
- [共同知识字节](#共同知识字节)

#### 易混淆：
- [共同知识库](#共同知识库)

---

### CKB-VM
在 Nervos CKB 用于执行脚本的虚拟机。

CKB-VM 的指令集为 RISC-V。

#### 参考
- [Nervos CKB](#nervos-ckb)
- [RISC-V](#risc-v)
- [脚本](#脚本)
- [百度百科的虚拟机定义](https://baike.baidu.com/item/%E8%99%9A%E6%8B%9F%E6%9C%BA)

---

### 冷存储
将资金存放在冷钱包的一种保障资金安全的方式。这类型的钱包不触网。

#### 参考
- [冷钱包](#冷钱包)
- [硬件钱包](#硬件钱包)
- [钱包](#钱包)

---

### 冷钱包
用于离线保障资产安全的钱包，这类钱包永不触网，不容易受到依赖在线网络连接的攻击。

#### 参考
- [冷存储](#冷存储)
- [钱包](#钱包)

---

### 共同知识库
共同知识库（Common Knowledge Base），一条为 Nervos 网络提供去中心化信任基础的 layer1 的 PoW 链。

#### 同义词
- [CKB](#ckb)
- [Nervos CKB](#nervos-ckb)

#### 易混淆
- [共同知识字节](#共同知识字节)

#### 参考
- [Nervos CKB](https://www.nervos.org/ckb/)

---

### 共同知识字节
共同知识字节（Common Knowledge Byte）是 Nervos layer1 网络的原生代币，通常简写为 CKByte 或者 CKB，拥有 1 CKByte 意味着持有者能够在 Nervos CKB 网络上存储 1 字节的数据。

#### 同义词
- [CKB](#ckb)
- [CKByte](#ckbyte)

#### 易混淆
- [共同知识库](#共同知识库)

#### 参考
- [Capacity](#capacity)
- [Nervos CKB](#nervos-ckb)
- [Shannon](#shannon)

---
### 确认
交易已被网络接受和验证并包含在一个区块中的过程。

#### 参考
- [区块](#区块)
- [交易](#交易)
- [未确认](#未确认)

---

### 共识
共识是某一状态在去中心化网络中的参与者（节点）之间达成一致。

#### 参考
- [全节点](#全节点)
- [节点](#节点)

---

### 加密货币
依靠数学和密码学来保障资金安全、实现点对点转账的数字货币。

#### 参考
- [数字货币](#数字货币)
- [法定货币](#法定货币)

---

### 加密签名
一条简明的证明数据，用于通过“签署”一条独特的数据来证明签名的创建者对某一特定私钥的所有权。这一签字过程证明了对私钥的所有权，但不透露私钥。

#### 同义词
- [私钥](#私钥)
- [签名](#签名)

---

### 密码学
研究和实践如何使用数学来确保通信和信息的安全。

#### 参考
- [维基百科密码学定义](https://zh.wikipedia.org/zh/%E5%AF%86%E7%A0%81%E5%AD%A6)

---

### Cycles
脚本执行所需要执行的 RISC-V 计算循环次数。

类似于以太坊的 Gas 概念。

#### 参考
- [脚本](#脚本)
- [RISC-V](#risc-v)
- [以太坊 Wiki 上的 Gas 定义](https://github.com/ethereum/wiki/wiki/%5BSimplified-Chinese%5D-Ethereum-TOC)

---

### DAO
去中心化自治组织（Decentralized Autonomous Organization）的简称。DAO 是一个按照计算机程序规则运行的组织。有质押参与者控制，可能没有实际的办公地点，因此减少了政府的影响。

#### 参考
- [百度百科上 DAO 的定义](https://bkso.baidu.com/item/%E5%8E%BB%E4%B8%AD%E5%BF%83%E5%8C%96%E8%87%AA%E6%B2%BB%E7%BB%84%E7%BB%87)

---

### 去中心化
在多方之间分散责任和所有权的过程，以减轻与单方控制有关的风险。

#### 参考
- [分布式](#分布式)
- [维基百科上去中心化的定义](https://zh.wikipedia.org/zh-hans/%E5%8E%BB%E4%B8%AD%E5%BF%83%E5%8C%96)

---

### 数字资产
数字资产是指具有价值的单个数据，或代表另一个具有价值的实体。

数字资产最常见的表现形式是代币，它可以作为数字货币使用，也可以代表不动产等实物。

#### 同义词
- [资产](#资产)
- [代币](#代币)

---

### 数字货币
一种主要通过互联网以数字形式存在的货币。货币的实物表现形式，如卡片、钞票或硬币，可能存在，但只是次要媒介。

#### 参考
- [加密货币](#加密货币)

---

### 分布式
一个系统，其中组件分布在多个节点上，以并行处理工作负载，增加冗余，或消除单点故障。

#### 参考
- [去中心化](#去中心化)

---

### 双花
双花是一种欺诈行为，即一个加密货币代币同时在两个地方花费，能够攻击者花费比他们实际拥有的更多的代币。

造成双花的原因主要是由于网络同步延迟。这些问题会随着时间的推移而自动解决，这就是为什么大多数区块链在考虑交易最终确定之前，对应该积累的最低确认数量设定了建议数值。

#### 参考
- [确认](#确认)
- [加密货币](#加密货币)
- [代币](#代币)
- [交易](#交易)

---

### Epoch
一个 epoch 其实是指一定区块范围内的时间段。

在 Nervos 上，一个 epoch 大约是 4 个小时。

#### 参考
- [区块](#区块)

---

### 一等资产
A unique property of CKB wherein ownership of a Cell, and the data contained within, is not assigned by the issuer, developer, or smart contract. The user owns the cell and is responsible for costs associated with state rent.

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)
- [State Rent](#state-rent)
- [First-Class Asset on the Nervos Network Blog](https://medium.com/nervosnetwork/first-class-asset-ff4feaf370c4)

---

### Fungible Token
Any token where every unit has identical characteristics and is interchangeable with other tokens of the same type.

Fungible tokens represent the vast majority of cryptocurrencies.

#### 参考
- [Non-Fungible Token](#non-fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)

---

### Full Node
A node that contains a complete copy of the entire blockchain history.

#### 同义词
- [Node](#node)

---

### Hardware Wallet
A cryptocurrency wallet that uses a physical hardware component to store private keys. These devices are permanently disconnected from the internet and typically interface with computers only for specific activities such as sending funds.

A hardware wallet is a form of cold wallet.

#### 参考
- [Cold Storage](#cold-storage)
- [Cold Wallet](#cold-wallet)
- [Private Key](#private-key)
- [Wallet](#wallet)

---

### Hash Rate
A measure of the speed at which a computer is able to complete cryptographic operations. These operations are known as "hashing", and are often measured in hashes per second.

#### 参考
- [Miner](#miner)
- [Network Hash Rate](#network-hash-rate)

---

### Height
A shorthand name for block height.

### 同义词
- [Block Height](#block-height)

---

### Light Client
A type of node software with much lower resource requirements than a full node. A light client allows for the most common basic functions, but does not have advanced functionality.

Light clients do not contain a copy of the full blockchain or full state. They typically rely on full nodes in the network in order to operate.

#### 参考
- [Blockchain](#blockchain)
- [Full Node](#full-node)
- [Node](#node)

---

### Mainnet
The Nervos CKB public blockchain.

The name of the Nervos CKB Mainnet is Lina.

#### 同义词
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

---

### Mempool
A shorthand name for memory pool. A "waiting area" on full nodes for transactions that have been broadcasted to the network but have not yet been confirmed on the blockchain.

#### 参考
- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### Micro-State
A small piece of state that is isolated and often able to be acted upon independently without knowing the total state of the network.

On Nervos, micro-state is represented by a Cell.

#### 同义词
- [Cell](#cell)

#### 参考
- [State](#state)

---

### Miner
A miner is a computer that provides computing power to validate transactions and create the blocks in the blockchain.

#### 参考
- [Block](#block)
- [Blockchain](#blockchain)

---

### Miner Fee
Another term for transaction fee.

#### 同义词
- [Transaction Fee](#transaction-fee)

---

### Mining
The practice of providing computational power to validate transactions and create blocks in the blockchain in exchange for a mining reward.

#### 参考
- [Block](#block)
- [Blockchain](#blockchain)
- [Mining Reward](#mining-reward)
- [Transaction](#transaction)

---

### Mining Reward
Native tokens that are paid to a miner in exchange for providing the computational resources required for mining.

#### 参考
- [Miner](#miner)
- [Mining](#mining)
- [Native Token](#native-token)

---

### Native Token
A token type which is used for paying fees and rewards on a public blockchain. This token is often unique as it is the only token that must exist on the blockchain in order to operate.

On Nervos the native token is the CKByte.

#### 参考
- [CKByte](#ckbyte)
- [Token](#token)

---

### NC-MAX
The consensus algorithm used on the Nervos blockchain.

#### 参考
- [Consensus](#consensus)
- [Nervos Blockchain](#nervos-blockchain)

---

### Neighbor
A node that is directly connected to another node in the blockchain peer to peer network.

#### 参考
- [Node](#node)
- [Peer to Peer](#peer-to-peer)

---

### Nervos Blockchain
The layer 1 blockchain of the Nervos Network known as the Common Knowledge Base.

#### 同义词
- [Common Knowledge Base](#common-knowledge-base)
- [Layer 1](#layer-1)
- [Nervos CKB](#nervos-ckb)

---

### Nervos DAO
A system that allows users to lock CKBytes for a period of time to earn rewards from Secondary Issuance. This process is similar to staking on other platforms.

#### 参考
- [CKByte](#ckbyte)
- [DAO](#dao)
- [Secondary Issuance](#secondary-issuance)
- [Nervos DAO Explained on the Nervos Blog](https://medium.com/nervosnetwork/nervos-dao-explained-95e33898b1c)

---

### Network Hash Rate
A measurement of the total computational processing power which is dedicated to providing security to the network.

#### 参考
- [Hash Rate](#hash-rate)
- [Miner]

---

### Node
A computer that is running the blockchain node software, which allows them to participate in the blockchain's peer to peer network.

#### 同义词
- [Full Node](#full-node)

#### 参考
- [Pruned Node](#pruned-node)

---

### Non-Fungible Token
Any token where every unit within the same type can have different characteristics, making each token unique.

Non-fungible tokens are often used for digital representation of unique real-world items, such as real-estate.

#### 参考
- [Fungible Token](#fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)

---

### Open Source
A piece of software where source code is freely available for examination or alteration by any third-party.

#### 参考
- [What is Open Source at OpenSource.com](https://opensource.com/resources/what-open-source)

---

### P2P
A shortname name for peer to peer.

#### 同义词
- [Peer to Peer](#peer-to-peer)

---

### Paper Wallet
A form of storing a recovery phrase or private keys offline by printing them on a piece of paper. This document would then be stored by traditional means in a secured location of the user's choosing, such as a safe.

#### 参考
- [Private Key](#private-key)
- [Wallet](#wallet)

---

### 支付地址
A string of letters and numbers that cryptocurrency and assets can be sent to and from.

Nervos addresses always begin with the letters "ckb" and are 46 characters in length.

A payment address is designed to be shared with others, similar to an email address.

#### 同义词
- [Address](#address)

---

### Peer to Peer
A type of network where the nodes communicate directly with each other instead of going through an intermediary centralized server.

#### 同义词
- [P2P](#p2p)

#### 参考
- [Node](#node)

---

### Proof of Work
A type of consensus algorithm that requires high computational resources in order to produce answers to cryptographic puzzles in return for a mining reward paid in native tokens.

These answers used to produce blocks and process transactions in a public blockchain. The computational difficulty itself is the basis for security in the public blockchain because it is extremely costly to replicate.

#### 参考
- [Block](#block)
- [Consensus](#consensus)
- [Mining Reward](#mining-reward)
- [Proof of Stake](#proof-of-stake)
- [Transaction](#transaction)

---

### Proof of Stake
A type of consensus algorithm where the participants of the network cast votes to reach agreement on the creation of blocks and processing of transactions. The strength of each vote is weighted by the amount of native token owned by the voter.

#### 参考
- [Consensus](#consensus)
- [Mining Reward](#mining-reward)
- [Proof of Work](#proof-of-work)
- [Transaction](#transaction)

---

### Propagation
A shorthand name for Block Propagation.

#### 同义词
- [Block Propagation](#block-propagation)

---

### Private Key
A string of letters and numbers that is used to prove ownership of cryptocurrency or digital assets, allowing them to be sent to other payment addresses. A private key is normally stored in a wallet.

A private key must be kept secret at all times. A private key works similarly to a key to a safe containing your cryptocurrency. Anyone with the key has the ability to open the safe and take the contents.

#### 参考
- [Digital Asset](#digital-asset)
- [Paper Wallet](#paper-wallet)
- [Payment Address](#payment-address)
- [Wallet](#wallet)

---

### Pruned Node
A node which contains only part of the blockchain history.

#### 参考
- [Node](#node)

---

### Shannon
A fractional denomination of CKBytes. One CKByte is equal to 100,000,000 Shannons.

A Shannon is the equivalent of a Bitcoin Satoshi.

#### 参考
- [CKByte](#ckbyte)
- [Common Knowledge Byte](#common-knowledge-byte)
- [Satoshi (denomination) on Bitcoin.org](https://bitcoin.org/en/glossary/denominations)

---

### Signature
A shorthand name for cryptographic signature.

#### 同义词
- [Cryptographic Signature](#cryptographic-signature)

---

### State
Data stored on the blockchain. In most contexts this this means current data and excludes historical data.

#### 参考
- [Blockchain](#blockchain)

---

### Testnet
An alternate public blockchain used for testing purposes that is running the same or similar software as the Mainnet. All tokens and data on testnets have no value.

The name of the Nervos Testnet is Aggron.

#### 同义词
- [Aggron](#aggron)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

---

### Tip
A shorthand name for tip block.

#### 同义词
- [Tip Block](#tip-block)

---

### Tip Block
The most recent block to be confirmed in a blockchain. The tip block has the highest block height in the blockchain.

#### 同义词
- [Tip](#tip)

#### 参考
- [Block](#block)
- [Block Height](#block-height)
- [Blockchain](#blockchain)

---

### Transaction
An entry in the blockchain that describes any change in state. 

#### 参考
- [Blockchain](#blockchain)
- [Nervos Blockchain](#nervos-blockchain)

---

### Transaction Fee
A fee which is paid in the native token to miners in exchange for processing a transaction.

#### 同义词
- [Miner Fee](#miner-fee)

#### 参考
- [Miner](#miner)
- [Native Token](#native-token)
- [Transaction](#transaction)

---

### Token
A single unit of information used to facilitate a transaction on a blockchain.

#### 参考
- [Blockchain](#blockchain)
- [Digital Asset](#digital-asset)
- [Transaction](#transaction)

---

### UDT
An abbreviation for User-Defined Token.

#### 同义词
- [User-Defined Token](#user-defined-token)

---

### Unconfirmed
The state of a transaction that has not yet been confirmed. An unconfirmed transaction is not finalized and cannot be guaranteed.

#### 同义词
- [Unconfirmed Transaction](#unconfirmed-transaction)

#### 参考
- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### Unconfirmed Transaction
A transaction that has not yet been confirmed. An unconfirmed transaction is not finalized and cannot be guaranteed.

#### 同义词
- [Unconfirmed](#unconfirmed)

#### 参考
- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### User-Defined Token
A custom token created with properties defined by the user. In normal usage, this most commonly refers to fungible tokens.

A User-Defined Token is usually referred to by its abbreviation, UDT.

#### 同义词
- [Fungible Token](#fungible-token)
- [UDT](#udt)

#### 参考
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)
- [Simple UDT Draft Spec on Nervos Talk](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)

---

### Wallet
A piece of software used to manage a user's private keys and payment addresses. A wallet allows a user to send and receive cryptocurrency payments. Some wallets also incorporate functionality to manage digital assets.

#### 参考
- [Paper Wallet](#paper-wallet)
- [Private Key](#private-key)
- [Payment Address](#payment-address)
- [Digital Asset](#digital-asset)

---

## Economics Glossary

### Base Issuance
The creation of new CKBytes through temporary inflation that is paid to miners through Base Rewards.

Base Issuance is paid for by using a fixed and decreasing inflation schedule. Approximately every four years the amount is halved until eventually stopping when the cap of 33.6 billion CKBytes have been issued.

#### 参考
- [Base Reward](#base-reward)
- [CKByte](#ckbyte)
- [Secondary Issuance](#secondary-issuance)
- [Miner](#miner)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Base Reward
A subsidy paid to miners in CKBytes for providing the compute and storage requirements required for processing transactions and persisting data on Nervos.

Base Rewards are created from Base Issuance and will decrease over time until eventually ending.

#### 参考
- [Base Issuance](#base-issuance)
- [CKByte](#ckbyte)
- [Miner](#miner)
- [Transaction](#transaction)

---

### Commit Reward
A reward paid to miners in CKBytes for committing a previously proposed transaction. After the transaction has been committed it is confirmed.

#### 参考
- [CKByte](#ckbyte)
- [Confirmation](#confirmation)
- [Miner](#miner)
- [Transaction](#transaction)

---

### Fiat Currency
Fiat currency is a form of money that has no intrinsic value. The value of fiat currency is derived from the support of the governing body that maintains it, and by the agreed value by parties that transact with it.

#### 参考
- [Cryptocurrency](#cryptocurrency)
- [Digital Currency](#digital-currency)

---

### Heavy Asset Problem
A common problem found in multi-asset blockchain platforms where the value of the assets stored on the chain gains significant value but the native token of the chain does not. This raises the incentive to attack the the network, but does not increase the security because the value of the native token is what is used to secure the network.

#### 参考
- [Asset](#asset)
- [Starving Layer 1 Problem](#starving-layer-1-problem)
- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)

---

### Liquidity
The ability for an asset to be bought or sold easily without causing a significant change in the current market price.

#### 参考
- [Asset](#asset)

---

### Proposal Reward
A reward paid to miners in CKBytes for proposing an unconfirmed transaction. After the transaction has been proposed it becomes eligible to be committed.

#### 参考
- [CKByte](#ckbyte)
- [Confirmation](#confirmation)
- [Miner](#miner)
- [Transaction](#transaction)

---

### Secondary Issuance
The creation of new CKBytes through limited and decreasing inflation that is paid to miners through Secondary Rewards.

Secondary Issuance follows a fixed inflation schedule of 1.344 billion CKBytes per year. This amount does not change. Unlike Base Issuance, Secondary Issuance does not affect everyone on the network. It is a small and targeted inflation from users that occupy space on Nervos or hold their CKBytes outside of the Nervos DAO.

#### 参考
- [Base Issuance](#base-issuance)
- [CKByte](#ckbyte)
- [Nervos DAO](#nervos-dao)
- [Secondary Reward](#secondary-reward)
- [State](#state)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Secondary Reward
A subsidy paid to miners in CKBytes for providing the compute and storage requirements required for processing transactions and persisting data on Nervos.

Secondary Rewards are created from Secondary Issuance, and continuously pay miners for the preservation of state data contained on the blockchain.

#### 参考
- [CKByte](#ckbyte)
- [Miner](#miner)
- [Secondary Issuance](#secondary-issuance)
- [Transaction](#transaction)

---

### Starving Layer 1 Problem
A scenario that can arise in multi-layer blockchain platforms where the vast majority of the transaction traffic moves from layer 1 to layer 2, taking the vast majority of transaction fees with it. If layer 1 relies exclusively on transaction fees to support the security of the platform, it may end up not having enough incentives available to properly secure it.

#### 参考
- [Heavy Asset Problem](#heavy-asset-problem)
- [Layer 1](#layer-1)
- [Layer 2](#layer-2)
- [Transaction](#transaction)
- [Transaction Fee](#transaction-fee)

---

### State Rent
A recurring fee that is paid to persist and secure state data.

On Nervos, Secondary Issuance is used to facilitate the paying of State Rent by the users who occupy the space on the Nervos blockchain.

#### 参考
- [Secondary Issuance](#secondary-issuance)
- [Nervos Blockchain](#nervos-blockchain)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Store of Assets
A platform which is designed to safely preserve multiple types of assets, each of which could be a store of value.

#### 参考
- [Store of Value](#store-of-value)

---

### Store of Value
An asset that is purchased to retain purchasing power in the long-term.

A good store of value either match or outpace the inflation rate of fiat currency, and has a reasonable amount of liquidity, allowing the asset to be easily sold.

#### 参考
- [Store of Assets](#store-of-assets)
- [Liquidity](#liquidity)

---

### Tail Emission
A type of reward that is paid to miners through a fixed amount of inflation.

#### 参考
- [Secondary Reward](#secondary-reward)

---

### Targeted Inflation
A form of inflation that only affects a specific subset of users.

Nervos uses Secondary Issuance to create targeted inflation on users who occupy space on the Nervos blockchain to pay State Rent. Long-term holders of CKBytes have the option of locking them in the Nervos DAO, which acts and an inflation shelter.

#### 参考
- [CKByte](#ckbyte)
- [Secondary Issuance](#secondary-issuance)
- [Nervos Blockchain](#nervos-blockchain)
- [Nervos DAO](#nervos-dao)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Tragedy of the Commons
A situation in a system where the participants act in accordance with their own self interest and deplete or destroy a shared resource through their collective action.

#### 参考
- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)
- [Tragedy of the Storage Commons](#tragedy-of-the-storage-commons)

---

### Tragedy of the Security Commons
A situation that can emerge on multi-asset blockchain platforms where asset tokens rely on the storage and security of the blockchain platform, but do not contribute back to the platform. As the number of assets that "ride for free" increases, so does the burden placed on the underlying blockchain platform. If the assets do not contribute to the underlying platform, the available security may not properly support the network.

#### 参考
- [Heavy Asset Problem](#heavy-asset-problem)
- [Tragedy of the Commons](#tragedy-of-the-commons)
- [Tragedy of the Storage Commons](#tragedy-of-the-storage-commons)

---

### Tragedy of the Storage Commons
A situation that can emerge on incentivized blockchain platforms where mining rewards are paid for inclusion of data to the blockchain, but no rewards exist for the long-term persistance of the blockchain data. As the size of the chain grows, so do the costs associated with persisting the data. If there is no direct incentive for persisting data, fewer and fewer nodes will do so. Eventually, too few nodes will be available to properly support the network.

#### 参考
- [Tragedy of the Commons](#tragedy-of-the-commons)
- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)

---

## Technical Glossary

### Active Cell
A Cell in the current state of CKB. Active cells can be used as inputs to transactions.

#### 同义词
- [Live Cell](#live-cell)

#### 参考
- [Cell](#cell)
- [Input](#input)
- [Transaction](#transaction)

---

### Aggron
The name of the main public testnet for Nervos CKB.

- **ckb version**: >= v0.32.0 (latest stable is recommended)
- **genesis hash**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **launched at**: 2020-05-22 04:00:00 UTC

#### 同义词
- [Testnet](#testnet)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

---

### Animagus
A framework layer that runs on top of Nervos CKB which provides an easy way to query for account balances without having to go through the Cell Collection process.

#### 参考
- [Cell Collection](#cell-collection)
- [Nervos CKB](#nervos-ckb)
- [Animagus Introduction on the Nervos Blog](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-animagus-part-1-introduction-66fa8ce27ccd-cfb361a7d883)

---

### Args
Args is short for arguments, and is data provided to a Lock Script or Type Script within a Cell. This is nearly identical to arguments provided to a normal command-line application.

Arguments are stored as part of the Cell when it is created.

#### 参考
- [Cell](#cell)
- [Lock Script](#lock-script)
- [Type Script](#type-script)

---

### Axon
A layer 2 side-chain of the Nervos CKB developed by the Nervos Core Team. Axon provides high-performance smart contract execution while utilizing Nervos CKB as a trust layer.

#### 参考
- [Layer 2](#layer-2)
- [Nervos CKB](#nervos-ckb)
- [Axon on Nervos.org](https://www.nervos.org/network/)

---

### Blake2b
A general-purpose cryptographic hashing algorithm that can create a succinct data fingerprint for any type of data.CKB uses blake2b as the default hash algorithm. 

#### 参考
- [Blake2b paper](https://blake2.net/blake2.pdf)
- [Ckbhash](#ckbhash)
- [Blake Hash Function on Wikipedia](https://en.wikipedia.org/wiki/BLAKE_(hash_function))
- [Hash Function on Wikipedia](https://en.wikipedia.org/wiki/Hash_function)

---

### Block Subsidy
A payment that is made in the native currency of the blockchain that is paid to to miners for providing the computational resources create a block and secure the blockchain.

The subsidy consists is the portion of the total block reward that is issued out of inflation for creating the block, but does not include any additional transaction fees that may be paid on top.

#### 同义词
- [Block Reward](#block-reward)
- [Transaction Fee](#transaction-fee)

---

### BLS
A cryptographic signature scheme for signing and verification.

BLS is short for Boneh–Lynn–Shacham.

#### 参考
- [Boneh–Lynn–Shacham on Wikipedia](https://en.wikipedia.org/wiki/Boneh%E2%80%93Lynn%E2%80%93Shacham)

---

### Boxer
A lightweight Rust library for verifying the Nervos layer 1 blockchain, the Common Knowledge Base.

#### 参考
- [Common Knowledge Base](#common-knowledge-base)
- [Boxer on GitHub](https://github.com/xxuejie/ckb-boxer)

---

### Cell Collection
The process of gathering cells that meet certain criteria.

For example: To find the balance of a particular account, all active cells for the address would need to be collected.

#### 参考
- [Cell](#cell)

---

### Cellbase
The transaction in each block that is responsible for the minting of new CKBytes.

This is the equivalent of a coinbase transaction in Bitcoin.

#### 参考
- [CKByte](#ckbyte)
- [Coinbase on Bitcoin.org](https://bitcoin.org/en/glossary/coinbase)

---

### Ckbhash
CKB uses blake2b as the default hash algorithm with following configurations:

- output digest size: `32`
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
#### 参考
- [Blake2b](#blake2b)

---

### CKB Merkle Tree

CKB Merkle Tree is a CBMT( [Complete Binary Merkle Tree](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md#complete-binary-merkle-tree) ) using following merge function:

```
ckbhash(left || right)
```

> [ckbhash](#ckbhash) is the hash function, `||` denotes binary concatenation.

#### 参考
- [Merkle Tree for Static Data](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md)
- [Ckbhash](#ckbhash)
- [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)

---

### Code Hash
A field in a Cell that contains a hash value which could refer to a specific piece of data, or a specific cell referenced by Type ID.

#### 参考
- [Cell](#cell)
- [Data](#data)
- [Type ID](#type-id)

---

### Commit
The process of taking a proposed transaction and adding it to the blockchain. After the transaction has been committed it is confirmed.

Miners are incentivized to commit transactions by being paid a commit reward.

#### 参考
- [Commit Reward](#commit-reward)
- [Confirmation](#confirmation)
- [Propose](#propose)
- [Transaction](#transaction)

---

### Commitment Zone
Section of the block that contains transaction commitments. The commitment zone can only contain valid transactions which have appeared in the proposal zone of one of the previous 2 to 10 blocks.

#### 参考
- [Block](#block)
- [Proposal Zone](#proposal-zone)
- [Transaction](#transaction)

---

### Consume
The process of using a Live Cell as an input to a transaction.

The process of consumption marks the Live Cell as a Dead Cell. This is the equivalent of marking a UTXO as spent in Bitcoin.

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Crypto Primitives
Well-established, low-level cryptographic algorithm commonly used to build out a cryptographic protocol.

#### 参考
- [Cryptographic Primitive on Wikipedia](https://en.wikipedia.org/wiki/Cryptographic_primitive)

---

### Data
In Nervos specific contexts, data may refer to the data structure within a Cell. This structure is used to hold any form of information that needs to be stored on the Nervos blockchain.

In more general contexts, data may refer to any form of information.

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)

---

### Dead Cell
A cell that has been used as an input to a previous transaction and is consumed.

A dead cell cannot be used as an input to a new transaction, nor can it be used as a dependency. It is effectively destroyed and removed from the active state of the network.

A dead cell is the equivalent of a "spent UTXO" in Bitcoin.

#### 同义词
- [Historical Cell](#historical-cell)

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)
- [Consume](#consume)
- [Transaction](#transaction)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Dep Group
A method for referencing multiple dependencies which are commonly used together using a single dependency field.

#### 参考
- [Dep Type](#dep-type)
- [Dependencies](#dependencies)
- [CKB Transaction Structure on GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

---

### Dep Type
A field that specifies the type of the dependency.

#### 参考
- [Dep Group](#dep-group)
- [Dependencies](#dependencies)
- [CKB Transaction Structure on GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

---

### Deps
A shorthand name for dependencies.

#### 同义词
- [Dependencies](#dependencies)

---

### Dependencies
Cells that are referenced in a transaction. Cells that are referenced as dependencies are read-only and made available to any Scripts executing within the transaction. Dependencies are not consumed.

Dependencies are commonly referred to as deps.

#### 同义词
- [Deps](#deps)

#### 参考
- [Cell](#cell)
- [Consume](#consume)
- [Script](#script)
- [Transaction](#transaction)

---

### Duktape
Duktape is an embeddable Javascript engine, with a focus on portability and compact footprint.

Duktape is used to run Javascript based smart contracts on Nervos.

#### 参考
- [Duktape Official Website](https://duktape.org/)

---

### Difficulty
A measurement of how difficult it is to solve the Proof of Work cryptographic puzzle required to create a block.

Networks automatically adjust the difficulty to control the speed at which blocks are generated as mining participants enter and exit the network.

#### 参考
- [Proof of Work](#proof-of-work)

---

### Diviner
A deterministic testing framework for Rust.

#### 参考
- [Diviner on GitHub](https://github.com/xxuejie/diviner)

---

### Eaglesong
The proof of work function used for mining on Nervos CKB.

#### 参考
- [Eaglesong RFC on the Nervos Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)

---

### ERC20
An Ethereum token standard for basic fungible tokens.

An SUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 or ERC777.

#### 参考
- [ERC777](#erc777)
- [Fungible Token](#fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)

---

### ERC721
An Ethereum token standard for non-fungible tokens.

#### 参考
- [Non-Fungible Token](#non-fungible-token)
- [Token](#token)
- [ERC721 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-721)

---

### ERC777
An updated Ethereum token standard for basic fungible tokens that is backwards compatible with ERC20.

An SUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 or ERC777.

#### 参考
- [ERC20](#erc20)
- [Fungible Token](#fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)

---

### ERC1155
An Ethereum token standard that supports the creation any number of fungible or non-fungible tokens on a single contract.

#### 参考
- [Fungible Token](#fungible-token)
- [Non-Fungible Token](#non-fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)
- [ERC1155 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-1155)

---

### Generator
A program that is used to create transactions that can be broadcast to the Nervos CKB network.

#### 参考
- [Nervos CKB](#nervos-ckb)
- [Transaction](#transaction)

---

### Genesis Block
The first block on a blockchain. The genesis block is unique because it does not contain a reference to the previous block because it is the first.

#### 参考
- [Block](#block)
- [Blockchain](#blockchain)

---

### Godwoken
A tool that provides a programmable layer on Nervos CKB that emulates the account model used by other cryptocurrencies like Ethereum.

#### 参考
- [Godwoken on GitHub](https://github.com/jjyr/godwoken)

---

### Governance Script
A Type Script which defines the monetary policy of a User Defined Token (UDT).

#### 参考
- [Governance Script Hash](#governance-script-hash)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

### Governance Script Hash
A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### 同义词
- [Type Script Hash](#type-script-hash)

#### 参考
- [Governance Script](#governance-script)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

### Historical Cell
An alternative term for Dead Cell.

#### 同义词
- [Dead Cell](#dead-cell)

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)

---

### Indexer
An application or library that keeps track of live Cells that match criteria specified by the developer or user.

#### 参考
- [Cells](#cells)
- [Live Cell](#live-cell)

---

### Input
A Live Cell that is used in a transaction. If the transaction is accepted by the network, the Live Cell will be consumed, and marked as a Dead Cell.

#### 参考
- [Cell](#cell)
- [Consume](#consume)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [Transaction](#transaction)

---

### Keyper
A specification of how to manage wallet Lock Scripts which apply to a specific user.

#### 参考
- [Lock Script](#lock-script)
- [Keyper on GitHub](https://github.com/ququzone/keyper)

---

### Late Spawning
When a node joins a blockchain network for the first time after the network has already been in operation for a period of time.

A network is said to support late spawning if that participant can download and verify the entire blockchain without having to trust any of the participants in the network to feed them unaltered data.

#### 参考
- [Genesis Block](#genesis-block)

---

### Layer 1
A proof of work blockchain known as the Common Knowledge Base (CKB) that serves as the base layer for the Nervos Network.

#### 同义词
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)

#### 参考
- [Layer 2](#layer-2)

---

### Layer 2
Any framework or protocol that is built on top of and dependent on a layer 1 blockchain.

Layer 2 systems often address different concerns than layer 1, allowing for a wider range of use cases while directly inheriting many of benefits of layer 1.

#### 参考
- [Layer 1](#layer-1)

---

### Lina
The name of public Mainnet of the Nervos CKB.

#### 同义词
- [Mainnet](#mainnet)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

#### 参考
- [Nervos CKB](#nervos-ckb)

---

### Live Cell
A Cell that has not been consumed and is available for use.

This is similar to an unspent transaction output (UTXO) in Bitcoin.

#### 同义词
- [Active Cell](#active-cell)

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Lock Script
A Script that enforces access and ownership of a Cell. This Script controls who has permission to use the Cell as an input. 

#### 参考
- [Cell](#cell)
- [Type Script](#type-script)
- [Script](#script)

---

### Lock Script Hash
A Blake2b hash of a Lock Script which is used as an identifier for the Script when referenced by a Cell.

#### 参考
- [Cell](#cell)
- [Lock Script](#lock-script)

---

### Long Address
An address format used on Nervos that includes the full code hash of the lock script which is associated with it.

#### 参考
- [Address](#address)
- [Code Hash](#code-hash)
- [Lock Script](#lock-script)
- [Short Address](#short-address)

---

### Mainnet
The Nervos CKB public blockchain.The name of the Nervos CKB Mainnet is Lina.

- **ckb version**: >= v0.25.2 (latest stable is recommended)
- **genesis hash**: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
- **launched at**: 2019-11-15 21:11:00 UTC

#### 同义词
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

---

### Minting
The process of creating of new tokens.

#### 参考
- [Token](#token)

---

### Molecule
A serialization framework for encoding data which is used extensively on the Nervos blockchain.

#### 参考
- [Molecule Specification](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0008-serialization/0008-serialization.md)
- [Molecule on Github](https://github.com/nervosnetwork/molecule)
- [Molecule Schema used in CKB](https://github.com/nervosnetwork/ckb/tree/develop/util/types/schemas)

---

### Muta
A framework used to create highly customizable layer 2 blockchain implementations on Nervos.

#### 参考
- [Muta on GitHub](https://github.com/nervosnetwork/muta)

---

### Nervos CKB
The layer 1 blockchain of the Nervos Network, the Common Knowledge Base.

Nervos CKB is often referred to as the Nervos Blockchain.

#### 同义词
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Nervos Blockchain](#nervos-blockchain)

#### 参考
- [Layer 1](#layer-1)

---

### Off-Chain Computation
A programming model where all computation is done off-chain to reduce the burden on the nodes in the network and provide higher levels of scalability.

Nervos uses off-chain computation and on-chain verification.

#### 参考
- [On-Chain Computation](#on-chain-computation)
- [On-Chain Verification](#on-chain-verification)

---

### Off-Chain State
A programming model where the data that represents the state of an application is not stored on the blockchain, or is not accessible by on-chain smart contracts.

#### 参考
- [On-Chain State](#on-chain-state)

---

### On-Chain Computation
A programming model where all computation by smart contracts is done on-chain every node on the network simultaneously.

Ethereum uses on-chain computation.

#### 参考
- [Off-Chain Computation](#off-chain-computation)

---

### On-Chain State
A programming model where the data that represents the state of an application is stored on the blockchain and is accessible by on-chain smart contracts.

Nervos provides on-chain state for all smart contracts.

#### 参考
- [Off-Chain State](#off-chain-state)

---

### On-Chain Verification
A programming model where all computation is done off-chain to reduce the burden on the nodes in the network, but verification of the resulting data is done on-chain to enforce the smart contract rules created by the developer.

Nervos uses off-chain computation and on-chain verification.

#### 参考
- [On-Chain Computation](#on-chain-computation)

---

### Open Transaction
A signed piece of a transaction that is incomplete and invalid on its own. When combined with other signed transaction pieces can form a complete transaction which can be processed.

One use of open transactions is to create the functionality required for a trustless decentalized exchange.

#### 参考
- [Cryptographic Signature](#cryptographic-signature)
- [Transaction](#transaction)

---

### Orphan
A shorthand name for Orphan Block.

#### 同义词
- [Orphan Block](#orphan-block)
- [Uncle](#uncle)

---

### Orphan Block
A valid block that was found simultaneously with another valid block by another miner, but was not selected by network because it arrived after the other block.

Orphan blocks are expected to occur under normal operation and do not become a problem unless they occur too frequently.

On Nervos, orphan blocks are better described as Uncles.

#### 同义词
- [Orphan](#orphan)
- [Uncle](#uncle)

#### 参考
- [Block](#block)
- [Orphan Rate](#orphan-rate)

---

### Orphan Rate
A measure of the speed at which Orphan blocks occur within the blockchain network.

#### 参考
- [Orphan Block](#orphan-block)

---

### Outpoint
A particular output Cell in a transaction.

#### 参考
- [Cell](#cell)
- [Output](#output)
- [Transaction](#transaction)

---

### Output
A Live Cell that is created in a transaction.

#### 参考
- [Cell](#cell)
- [Live Cell](#live-cell)
- [Transaction](#transaction)

---

### Overlord
A byzantine fault tollerant consensus algorithm designed by Nervos for Huobi which can support thousands of transactions per second.

#### 参考
- [Overlord on Medium](https://medium.com/nervosnetwork/overlord-a-new-consensus-algorithm-3cc51690d269)

---

### Polyjuice
An Ethereum compatible layer that provides account model functionality on top of Nervos' Cell Model.

#### 参考
- [Cell Model](#cell-model)
- [Polyjuice on GitHub](https://github.com/nervosnetwork/polyjuice)

---

### Proposal Zone
Section of the block that contains transaction proposals.

#### 参考
- [Commitment Zone](#commitment-zone)
- [Propose](#propose)

---

### Propose
The process of taking an unconfirmed transaction out of the mempool and proposing it for commitment. A transaction is not confirmed until after it has been committed.

Miners are incentivized to propose transactions by being paid a proposal reward.

#### 参考
- [Commit](#commit)
- [Confirmation](#confirmation)
- [Mempool](#mempool)
- [Proposal Reward](#proposal-reward)
- [Proposal Zone](#proposal-zone)
- [Transaction](#transaction)

---

### RISC-V
An open standard instruction set architecture (ISA) for general computing.

RISC-V is the instruction set used by the CKB-VM.

#### 参考
- [CKB-VM](#risc-v)
- [RISC-V on Wikipedia](https://en.wikipedia.org/wiki/RISC-V)

---

### Schnorr Signature
A cryptographic signature scheme for signing and verification.

#### 参考
- [Schnorr Signature on Wikipedia](https://en.wikipedia.org/wiki/Schnorr_signature)

---

### Script
A program that executes on the CKB-VM. A Script can be one of two types:

- Lock Script - Used to control ownership and access to a Cell.
- Type Script - Used to control how a Cell is used in a transaction.

A Script is a binary executable in the ELF format for the RISC-V architecture.

#### 参考
- [CKB-VM](#risc-v)
- [Lock Script](#lock-script)
- [RISC-V](#risc-v)
- [Type Script](#type-script)
- [ELF on Wikipedia](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

---

### Seed Cell
A design pattern on Nervos from creating unique identifiers used to create unforgeable assets.

#### 参考
- [Cell](#cell)

---

### Shannon
A fractional denomination of CKBytes. One CKByte is equal to 100,000,000 Shannons.

A Shannon is the equivalent of a Bitcoin Satoshi.

#### 参考
- [CKByte](#ckbyte)
- [Common Knowledge Byte](#common-knowledge-byte)
- [Satoshi (denomination) on Bitcoin.org](https://bitcoin.org/en/glossary/denominations)

---

### Short Address
An address format on Nervos that does not include the code hash of the associated lock script, and instead uses one of many commonly used lock scripts.

The short address format is the most common address format used, and is often referred to as simply "address".

#### 同义词
- [Address](#address)

#### 参考
- [Code Hash](#code-hash)
- [Lock Script](#lock-script)
- [Long Address](#long-address)

---

### Simple UDT
A standard that defines a the most basic implementation of a UDT fungible token on Nervos.

A Simple UDT is often referred to by its abbreviation, SUDT.

An SUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 and ERC777.

#### 同义词
- [SUDT](#sudt)

#### 参考
- [Token](#token)
- [UDT](#udt)
- [User-Defined Token](#user-defined-token)
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [Simple UDT RFC Draft Spec on Nervos Talk](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333/1)

---

### Since
A field on a Cell which can contain an optional value that prevents consumption before a certain block timestamp or a block number.

#### 参考
- [Cell](#cell)

---

### SPV
An abbreviation for Simplified Payment Verification. A protocol for using a blockchain cryptocurrency without having to operate a full node.

SPV clients require far less data to be stored, but also must requires the trust of the network clients it is connected to directly.

#### 参考
- [SPV Wallet](#spv-wallet)
- [Simplified Payment Verification on BitcoinWiki](https://en.bitcoinwiki.org/wiki/Simplified_Payment_Verification)

---

### SPV Wallet
A light-weight cryptocurrency wallet that uses the SPV protocol.

#### 参考
- [SPV](#spv)

---

### SUDT
An abbreviation for Simple UDT.

#### 同义词
- [Simple UDT](#simple-udt)

---

### Testnet
An alternate public blockchain used for testing purposes that is running the same or similar software as the Mainnet. All tokens and data on testnets have no value.The name of the Nervos CKB Testnet is Aggron.

- **ckb version**: >= v0.32.0 (latest stable is recommended)
- **genesis hash**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **launched at**: 2020-05-22 04:00:00 UTC

#### 同义词
- [Aggron](#aggron)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

---

### Transaction Hash

Transaction is serialized via [molecule](#molecule) in CKB. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

Transaction hash is generated by the serialized `raw` structure through [ckbhash](#ckbhash).

#### 参考
- [Transaction Witness Hash](#transaction-witness-hash)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)

---

### Transaction Witness Hash

Transaction is serialized via [molecule](#molecule) in CKB. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

Transaction witness hash is generated by the serialized transaction through [ckbhash](#ckbhash).

#### 参考
- [Transaction Hash](#transaction-hash)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)

---

### Transaction Root

The field `transactions_root` in header is

```
ckbhash(T || W)
```

> [ckbhash](#ckbhash) is the hash function, `||` denotes binary concatenation.

T is the root of a [CKB Merkle Tree](#ckb-merkle-tree), which items are the [transaction hashes](#transaction-hash)  of all the transactions in the block.

W is also the root of a [CKB Merkle Tree](#ckb-merkle-tree), but the items are the [Transaction Witness Hash](#transaction-witness-hash) of all the transactions in the block.

#### 参考
- [Ckbhash](#ckbhash)
- [CKB Merkle Tree](#ckb-merkle-tree)
- [Transaction Witness Hash](#transaction-witness-hash)

---


### Type Script
A Script that enforces the rules that must be followed in a transaction for a Cell to be consumed as an input or for a Cell to be created as an output.

#### 参考
- [Cell](#cell)
- [Lock Script](#lock-script)
- [Script](#script)
- [Type Script Hash](#type-script-hash)

---

### Type Script Hash
A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### 参考
- [Cell](#cell)
- [Script](#script)
- [Type Script](#type-script)

---

### Type ID
A unique identifier for asset types on Nervos. This idenfier is based on the Type Script and Arguments of a Cell.

#### 参考
- [Args](#args)
- [Cell](#cell)
- [Type Script](#type-script)

---

### Uncle
A valid block that was found simultaneously with another valid block by another miner, but was not selected by network because it arrived after the other block.

Uncles are paid a reduced block reward when they are found and reported.

On Nervos, Uncles are tracked by consensus to adjust the block interval of the network.

#### 同义词
- [Orphan Block](#orphan-block)

#### 参考
- [Block Interval](#block-interval)
- [Orphan Rate](#orphan-rate)
- [Uncle](#uncle)

---

### Uncle Rate

#### 参考
- [Orphan Rate](#orphan-rate)
- [Uncle](#uncle)

---

### Validator
A Script that is used to ensure that a transaction created by a Generator is valid.

Validators are Scripts that run within the CKB-VM, and are either Lock Scripts or Type Scripts.

#### 参考
- [CKB-VM](#risc-v)
- [Lock Script](#lock-script)
- [Type Script](#type-script)
- [Transaction](#transaction)

---

### Witness
A set of cryptographic signatures that contains the data required to prove authorization to the resources used in a transaction.

#### 参考
- [Transaction](#transaction)

---

### Zk-SNARK
A form of cryptographic proof, that when used in cryptocurrencies, allows for privacy features which do not reveal the amounts or participants in transactions.

Zk-SNARKs require a trusted setup, but are otherwise trustless.

#### 参考
- [Transaction](#transaction)
- [Zk-STARK](#zk-stark)
- [Non-interactive zero-knowledge proofs on Wikipedia](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---

### Zk-STARK
A form of cryptographic proof, that when used in cryptocurrencies, allows for privacy features which do not reveal the amounts or participants in transactions.

Unlike Zk-SNARKs, Zk-STARKs do not require a trusted setup.

#### 参考
- [Transaction](#transaction)
- [Zk-SNARK](#zk-snark)
- [Non-interactive zero-knowledge proofs on Wikipedia](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---
