---
id: glossary
title: Glossary
---

The Glossary is consisted of different sections: [General glossary](#general-glossary), [Economics glossary](#technical-glossary), and [Technical glossary](#economic-glossary). 

## General Glossary

### Address
A shorthand name for Payment Address.

#### Synonyms
- [Payment Address](#payment-address)

---

### Asset
A shorthand name for digital asset.

#### Synonyms
- [Digital Asset](#digital-asset)
- [Token](#token)

---

### Block
A record in the blockchain that contains and confirms transactions.

#### See Also
- [Blockchain](#blockchain)
- [Confirmation](#confirmation)
- [Transaction](#transaction)

---

### Block Height
The block height is the total number of blocks that have been confirmed on the blockchain.

This term can also used to refer to identify a single unique block when specifying a specific block height since there is always exactly one block at any block height.

#### Synonyms
- [Height](#height)

#### See Also
- [Block](#block)
- [Blockchain](#blockchain)
- [Confirmation](#confirmation)

---

### Block Interval
The approximate amount of time between between the creation of two blocks in a blockchain.

On Bitcoin blockchain the block interval is approximately every 10 minutes. On the Nervos blockchain the block interval is variable, but normally under 10 seconds.

#### Synonyms
- [Block Time](#block-time)

#### See Also
- [Block](#block)
- [Blockchain](#blockchain)

---

### Block Propagation
The process of synchronizing a new block to the majority of full nodes in the network.

#### See Also
- [Block](#block)
- [Broadcast](#broadcast)
- [Full Node](#full-node)

---

### Block Reward
A payment that is made in the native currency of the blockchain that is paid to to miners for providing the computational resources create a block and secure the blockchain.

#### See Also
- [Block](#block)
- [Block Subsidy](#block-subsidy)

---

### Block Time
A alternate name for Block Interval.

#### Synonyms
- [Block Interval](#block-interval)

---

### Blockchain
An immutable data structure that where each subsequent block of data is cryptographically linked to the previous blocks. This creates a chain like structure where none of the historical data can be altered without causing a validation error.

#### See Also
- [Block](#block)

---

### Broadcast
A message that is sent to all nodes in a blockchain network.

#### See Also
- [Blockchain](#blockchain)
- [Node](#node)

---

### Capacity
The maximum amount of space (in bytes) that a Cell can occupy on the Nervos blockchain.

#### Synonyms
- [CKByte](#ckbyte)

#### See Also
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Common Knowledge Byte](#common-knowledge-byte)
- [Nervos Blockchain](#nervos-blockchain)

---

### Cell
A simple structure used hold a piece of state or data on the Nervos CKB.

A Cell is similar in concept to a Bitcoin UTXO.

#### Synonyms
- [Micro-State](#micro-state)

#### See Also
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [Nervos CKB](#nervos-ckb)
- [Cell Model in Key Concepts](/key-concepts/cell-model)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Cell Model
A representation of how state is managed on Nervos CKB.

#### See Also
- [Lock Script](#lock-script)
- [Nervos CKB](#nervos-ckb)
- [Type Script](#type-script)
- [Cell Model in Key Concepts](/key-concepts/cell-model)
- [Cell Model on the Nervos Blog](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

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
The virtual machine used to execute Scripts on Nervos CKB.

The instruction set of CKB-VM is RISC-V.

#### See Also
- [Nervos CKB](#nervos-ckb)
- [RISC-V](#risc-v)
- [Script](#script)
- [Virtual Machine on Wikipedia](https://en.wikipedia.org/wiki/Virtual_machine)

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

Owning a CKByte entitles the holder to store one byte of data on the Nervos CKB.

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

---

### Consensus
Consensus is a state of agreement between the participants (nodes) of a decentralized network.

#### See Also
- [Full Node](#full-node)
- [Node](#node)

---

### Cryptocurrency
Digital currency that relies on mathematics and cryptography to secure funds and facilitate transfers from one party to another.

#### See Also
- [Digital Currency](#digital-currency)
- [Fiat Currency](#fiat-currency)

---

### Cryptographic Signature
A concise piece of proof data which is used to prove that the creator of the signature has ownership of a specific private key by "signing" a unique piece of data. This signing process proves ownership of the private keys without revealing the private keys.

#### Synonyms
- [Private Key](#private-key)
- [Signature](#signature)

---

### Cryptography
The study and practice of using mathematics to secure communications and information.

#### See Also
- [Cryptography at Wikipedia](https://en.wikipedia.org/wiki/Cryptography)

---

### Cycles
The number of RISC-V computational cycles required by a script to execute.

This is a similar concept to Ethereum's Gas.

#### See Also
- [Script](#script)
- [RISC-V](#risc-v)
- [Gas on the Ethereum Wiki](https://github.com/ethereum/wiki/wiki/Glossary)

---

### DAO
Short for Decentralized Autonomous Organization. A DAO is an organization run by the rules of a computer program. A DAO is controlled by stakeholders, and may not have a physical location, therefore reducing the influence of governments.

#### See Also
- [DAO on Wikipedia](https://en.wikipedia.org/wiki/Decentralized_autonomous_organization)

---

### Decentralization
The process of spreading the responsibility and ownership between multiple parties in order to mitigate the risks associated with a single party being in control.

#### See Also
- [Distributed](#distributed)
- [Decentralization on Wikipedia](https://en.wikipedia.org/wiki/Decentralization)

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

### Double Spend
A double spend is a fraudlent action where a cryptocurrency token is spent in two places at once, effectively allowing the attacker to spend more tokens than they actually own.

The potential for a double spend is based on network synchronization delays. These problems are automatically resolved over time, which is why most blockchains set guidelines on the minimum number of confirmations that should be accumulated before considering a transaction final.

#### See Also
- [Confirmation](#confirmation)
- [Cryptocurrency](#cryptocurrency)
- [Token](#token)
- [Transaction](#transaction)

---

### Epoch
An epoch is a period of time for a set of blocks.

In Nervos an epoch is approximately four hours.

#### See Also
- [Block](#block)

---

### First-Class Assets
A unique property of CKB wherein ownership of a Cell, and the data contained within, is not assigned by the issuer, developer, or smart contract. The user owns the cell and is responsible for costs associated with state rent.

#### See Also
- [Cell](#cell)
- [Cell Model](#cell-model)
- [State Rent](#state-rent)
- [First-Class Asset on the Nervos Network Blog](https://medium.com/nervosnetwork/first-class-asset-ff4feaf370c4)

---

### Fungible Token
Any token where every unit has identical characteristics and is interchangeable with other tokens of the same type.

Fungible tokens represent the vast majority of cryptocurrencies.

#### See Also
- [Non-Fungible Token](#non-fungible-token)
- [Token](#token)
- [User-Defined Token](#user-defined-token)

---

### Full Node
A node that contains a complete copy of the entire blockchain history.

#### Synonyms
- [Node](#node)

---

### Hardware Wallet
A cryptocurrency wallet that uses a physical hardware component to store private keys. These devices are permanently disconnected from the internet and typically interface with computers only for specific activities such as sending funds.

A hardware wallet is a form of cold wallet.

#### See Also
- [Cold Storage](#cold-storage)
- [Cold Wallet](#cold-wallet)
- [Private Key](#private-key)
- [Wallet](#wallet)

---

### Hash Rate
A measure of the speed at which a computer is able to complete cryptographic operations. These operations are known as "hashing", and are often measured in hashes per second.

#### See Also
- [Miner](#miner)
- [Network Hash Rate](#network-hash-rate)

---

### Height
A shorthand name for block height.

### Synonyms
- [Block Height](#block-height)

---

### Light Client
A type of node software with much lower resource requirements than a full node. A light client allows for the most common basic functions, but does not have advanced functionality.

Light clients do not contain a copy of the full blockchain or full state. They typically rely on full nodes in the network in order to operate.

#### See Also
- [Blockchain](#blockchain)
- [Full Node](#full-node)
- [Node](#node)

---

### Mainnet
The Nervos CKB public blockchain.

The name of the Nervos CKB Mainnet is Lina.

#### Synonyms
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

#### See Also
- [Confirmation](#confirmation)
- [Transaction](#transaction)

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
A miner is a computer that provides computing power to validate transactions and create the blocks in the blockchain.

#### See Also
- [Block](#block)
- [Blockchain](#blockchain)

---

### Miner Fee
Another term for transaction fee.

#### Synonyms
- [Transaction Fee](#transaction-fee)

---

### Mining
The practice of providing computational power to validate transactions and create blocks in the blockchain in exchange for a mining reward.

#### See Also
- [Block](#block)
- [Blockchain](#blockchain)
- [Mining Reward](#mining-reward)
- [Transaction](#transaction)

---

### Mining Reward
Native tokens that are paid to a miner in exchange for providing the computational resources required for mining.

#### See Also
- [Miner](#miner)
- [Mining](#mining)
- [Native Token](#native-token)

---

### Native Token
A token type which is used for paying fees and rewards on a public blockchain. This token is often unique as it is the only token that must exist on the blockchain in order to operate.

On Nervos the native token is the CKByte.

#### See Also
- [CKByte](#ckbyte)
- [Token](#token)

---

### NC-MAX
The consensus algorithm used on the Nervos blockchain.

#### See Also
- [Consensus](#consensus)
- [Nervos Blockchain](#nervos-blockchain)

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
A system that allows users to lock CKBytes for a period of time to earn rewards from Secondary Issuance. This process is similar to staking on other platforms.

#### See Also
- [CKByte](#ckbyte)
- [DAO](#dao)
- [Secondary Issuance](#secondary-issuance)
- [Nervos DAO Explained on the Nervos Blog](https://medium.com/nervosnetwork/nervos-dao-explained-95e33898b1c)

---

### Network Hash Rate
A measurement of the total computational processing power which is dedicated to providing security to the network.

#### See Also
- [Hash Rate](#hash-rate)
- [Miner]

---

### Node
A computer that is running the blockchain node software, which allows them to participate in the blockchain's peer to peer network.

#### Synonyms
- [Full Node](#full-node)

#### See Also
- [Pruned Node](#pruned-node)

---

### Non-Fungible Token
Any token where every unit within the same type can have different characteristics, making each token unique.

Non-fungible tokens are often used for digital representation of unique real-world items, such as real-estate.

#### See Also
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

Nervos addresses always begin with the letters "ckb" and are 46 characters in length.

A payment address is designed to be shared with others, similar to an email address.

#### Synonyms
- [Address](#address)

---

### Peer to Peer
A type of network where the nodes communicate directly with each other instead of going through an intermediary centralized server.

#### Synonyms
- [P2P](#p2p)

#### See Also
- [Node](#node)

---

### Proof of Work
A type of consensus algorithm that requires high computational resources in order to produce answers to cryptographic puzzles in return for a mining reward paid in native tokens.

These answers used to produce blocks and process transactions in a public blockchain. The computational difficulty itself is the basis for security in the public blockchain because it is extremely costly to replicate.

#### See Also
- [Block](#block)
- [Consensus](#consensus)
- [Mining Reward](#mining-reward)
- [Proof of Stake](#proof-of-stake)
- [Transaction](#transaction)

---

### Proof of Stake
A type of consensus algorithm where the participants of the network cast votes to reach agreement on the creation of blocks and processing of transactions. The strength of each vote is weighted by the amount of native token owned by the voter.

#### See Also
- [Consensus](#consensus)
- [Mining Reward](#mining-reward)
- [Proof of Work](#proof-of-work)
- [Transaction](#transaction)

---

### Private Key
A string of letters and numbers that is used to prove ownership of cryptocurrency or digital assets, allowing them to be sent to other payment addresses. A private key is normally stored in a wallet.

A private key must be kept secret at all times. A private key works similarly to a key to a safe containing your cryptocurrency. Anyone with the key has the ability to open the safe and take the contents.

#### See Also
- [Digital Asset](#digital-asset)
- [Paper Wallet](#paper-wallet)
- [Payment Address](#payment-address)
- [Wallet](#wallet)

---

### Pruned Node
A node which contains only part of the blockchain history.

#### See Also
- [Node](#node)

---

### Shannon
A fractional denomination of CKBytes. One CKByte is equal to 100,000,000 Shannons.

A Shannon is the equivalent of a Bitcoin Satoshi.

#### See Also
- [CKByte](#ckbyte)
- [Common Knowledge Byte](#common-knowledge-byte)
- [Satoshi (denomination) on Bitcoin.org](https://bitcoin.org/en/glossary/denominations)

---

### Signature
A shorthand name for cryptographic signature.

#### Synonyms
- [Cryptographic Signature](#cryptographic-signature)

---

### State
Data stored on the blockchain. In most contexts this this means current data and excludes historical data.

#### See Also
- [Blockchain](#blockchain)

---

### Testnet
An alternate public blockchain used for testing purposes that is running the same or similar software as the Mainnet. All tokens and data on testnets have no value.

The name of the Nervos Testnet is Aggron.

#### Synonyms
- [Aggron](#aggron)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

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
An entry in the blockchain that describes any change in state. 

#### See Also
- [Blockchain](#blockchain)
- [Nervos Blockchain](#nervos-blockchain)

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
A single unit of information used to facilitate a transaction on a blockchain.

#### See Also
- [Blockchain](#blockchain)
- [Digital Asset](#digital-asset)
- [Transaction](#transaction)

---

### UDT
An abbreviation for User-Defined Token.

#### Synonyms
- [User-Defined Token](#user-defined-token)

---

### User-Defined Token
A unique non-fungible token with properties defined by the user.

A UDT is equivalent of an Ethereum ERC20 token or ER777 token.

#### See Also
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)
- [UDT Draft Spec on Nervos Talk](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)

---

### Wallet
A piece of software used to manage a user's private keys and payment addresses. A wallet allows a user to send and receive cryptocurrency payments. Some wallets also incorporate functionality to manage digital assets.

#### See Also
- [Paper Wallet](#paper-wallet)
- [Private Key](#private-key)
- [Payment Address](#payment-address)
- [Digital Asset](#digital-asset)

---

## Economic Glossary

### Base Issuance
The creation of new CKBytes through temporary inflation that is paid to miners through Base Rewards.

Base Issuance is paid for by using a fixed and decreasing inflation schedule. Approximately every four years the amount is halved until eventually stopping when the cap of 33.6 billion CKBytes have been issued.

#### See Also
- [Base Reward](#base-reward)
- [CKByte](#ckbyte)
- [Secondary Issuance](#secondary-issuance)
- [Miner](#miner)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Base Reward
A subsidy paid to miners in CKBytes for providing the compute and storage requirements required for processing transactions and persisting data on Nervos.

Base Rewards are created from Base Issuance and will decrease over time until eventually ending.

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

### Fiat Currency
Fiat currency is a form of money that has no intrinsic value. The value of fiat currency is derived from the support of the governing body that maintains it, and by the agreed value by parties that transact with it.

#### See Also
- [Cryptocurrency](#cryptocurrency)
- [Digital Currency](#digital-currency)

---

### Heavy Asset Problem
A common problem found in multi-asset blockchain platforms where the value of the assets stored on the chain gains significant value but the native token of the chain does not. This raises the incentive to attack the the network, but does not increase the security because the value of the native token is what is used to secure the network.

#### See Also
- [Asset](#asset)
- [Starving Layer 1 Problem](#starving-layer-1-problem)

---

### Liquidity
The ability for an asset to be bought or sold easily without causing a significant change in the current market price.

#### See Also
- [Asset](#asset)

---

### Proposal Reward
A reward paid to miners in CKBytes for proposing an unconfirmed transaction. After the transaction has been proposed it becomes eligible to be committed.

#### See Also
- [CKByte](#ckbyte)
- [Confirmation](#confirmation)
- [Miner](#miner)
- [Transaction](#transaction)

---

### Secondary Issuance
The creation of new CKBytes through limited and decreasing inflation that is paid to miners through Secondary Rewards.

Secondary Issuance follows a fixed inflation schedule of 1.344 billion CKBytes per year. This amount does not change. Unlike Base Issuance, Secondary Issuance does not affect everyone on the network. It is a small and targeted inflation from users that occupy space on Nervos or hold their CKBytes outside of the Nervos DAO.

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

Secondary Rewards are created from Secondary Issuance, and continuously pay miners for the preservation of state data contained on the blockchain.

#### See Also
- [CKByte](#ckbyte)
- [Miner](#miner)
- [Secondary Issuance](#secondary-issuance)
- [Transaction](#transaction)

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

On Nervos, Secondary Issuance is used to facilitate the paying of State Rent by the users who occupy the space on the Nervos blockchain.

#### See Also
- [Secondary Issuance](#secondary-issuance)
- [Nervos Blockchain](#nervos-blockchain)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### Store of Assets
A platform which is designed to safely preserve multiple types of assets, each of which could be a store of value.

#### See Also
- [Store of Value](#store-of-value)

---

### Store of Value
An asset that is purchased to retain purchasing power in the long-term.

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
A situation in a system where the participants act in accordance with their own self interest and deplete or destroy a shared resource through their collective action.

#### See Also
- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)
- [Tragedy of the Storage Commons](#tragedy-of-the-storage-commons)

---

### Tragedy of the Security Commons


#### See Also
- [Tragedy of the Commons](#tragedy-of-the-commons)
- [Tragedy of the Storage Commons](#tragedy-of-the-storage-commons)

---

### Tragedy of the Storage Commons
A situation that can emerge on incentivized blockchain platforms where mining rewards are paid for inclusion of data to the blockchain, but no rewards exist for the long-term persistance of the blockchain data. As the size of the chain grows, so do the costs associated with persisting the data. If there is no direct incentive for persisting data, fewer and fewer nodes will do so. Eventually, too few nodes will be available to properly support the network.

#### See Also
- [Tragedy of the Commons](#tragedy-of-the-commons)
- [Tragedy of the Security Commons](#tragedy-of-the-security-commons)

---

## Technical Glossary

### Active Cell
A Cell in the current state of CKB. Active cells can be used as inputs to transactions.

#### Synonyms
- [Live Cell](#live-cell)

#### See Also
- [Cell](#cell)
- [Input](#input)
- [Transaction](#transaction)

---

### Aggron
The name of the main public testnet for Nervos CKB.

#### Synonyms
- [Testnet](#testnet)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

---

### Animagus
A framework layer that runs on top of Nervos CKB which provides an easy way to query for account balances without having to go through the Cell Collection process.

#### See Also
- [Cell Collection](#cell-collection)
- [Nervos CKB](#nervos-ckb)
- [Animagus Introduction on the Nervos Blog](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-animagus-part-1-introduction-66fa8ce27ccd-cfb361a7d883)

---

### Args
Args is short for arguments, and is data provided to a Lock Script or Type Script within a Cell. This is nearly identical to arguments provided to a normal command-line application.

Arguments are stored as part of the Cell when it is created.

#### See Also
- [Cell](#cell)
- [Lock Script](#lock-script)
- [Type Script](#type-script)

---

### Axon
A layer 2 side-chain of the Nervos CKB developed by the Nervos Core Team. Axon provides high-performance smart contract execution while utilizing Nervos CKB as a trust layer.

#### See Also
- [Layer 2](#layer-2)
- [Nervos CKB](#nervos-ckb)
- [Axon on Nervos.org](https://www.nervos.org/network/)

---

### Blake2b
A general-purpose cryptographic hashing algorithm that can create a succinct data fingerprint for any type of data.

#### See Also
- [Blake Hash Function on Wikipedia](https://en.wikipedia.org/wiki/BLAKE_(hash_function))
- [Hash Function on Wikipedia](https://en.wikipedia.org/wiki/Hash_function)

---

### Cell Collection
The process of gathering cells that meet certain criteria.

For example: To find the balance of a particular account, all active cells for the address would need to be collected.

#### See Also
- [Cell](#cell)

---

### Cellbase
The transaction in each block that is responsible for the minting of new CKBytes.

This is the equivalent of a coinbase transaction in Bitcoin.

#### See Also
- [CKByte](#ckbyte)
- [Coinbase on Bitcoin.org](https://bitcoin.org/en/glossary/coinbase)

---

### Commitment Zone
Section of the block that contains transaction commitments. The commitment zone can only contain valid transactions which have appeared in the proposal zone of one of the previous 2 to 10 blocks.

#### See Also
- [Block](#block)
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
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Crypto Primitives
Well-established, low-level cryptographic algorithm commonly used to build out a cryptographic protocol.

#### See Also
- [Cryptographic Primitive on Wikipedia](https://en.wikipedia.org/wiki/Cryptographic_primitive)

---

### Dead Cell
A cell that has been used as an input to a previous transaction. It cannot be used as an input to a new transaction, nor can it be used as a dependency.

This is the equivalent of a "spent UTXO" in Bitcoin.

#### See Also
- [Cell](#cell)
- [Cell Model](#cell-model)
- [Consume](#consume)
- [Transaction](#transaction)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Deps
A shorthand name for dependencies.

#### Synonyms
- [Dependencies](#dependencies)

---

### Dependencies
Cells that are referenced in a transaction. Cells that are referenced as dependencies are read-only and made available to any Scripts executing within the transaction. Dependencies are not consumed.

#### Synonyms
- [Deps](#deps)

#### See Also
- [Cell](#cell)
- [Consume](#consume)
- [Script](#script)
- [Transaction](#transaction)

---

### Eaglesong
The proof of work function used for mining on Nervos CKB.

#### See Also
- [Eaglesong RFC on the Nervos Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)

---

### Generator
A program that is used to create transactions that can be broadcast to the Nervos CKB network.

#### See Also
- [Nervos CKB](#nervos-ckb)
- [Transaction](#transaction)

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

### Input
A Live Cell that is used in a transaction. If the transaction is accepted by the network, the Live Cell will be consumed, and marked as a Dead Cell.

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

---

### Layer 1
A proof of work blockchain known as the Common Knowledge Base (CKB) that serves as the base layer for the Nervos Network.

#### Synonyms
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)

#### See Also
- [Layer 2](#layer-2)

---

### Layer 2
Any framework or protocol that is built on top of and dependent on a layer 1 blockchain.

Layer 2 systems often address different concerns than layer 1, allowing for a wider range of use cases while directly inheriting many of benefits of layer 1.

#### See Also
- [Layer 1](#layer-1)

---

### Lina
The name of public Mainnet of the Nervos CKB.

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
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Lock Script
A Script that enforces access and ownership of a Cell. This Script controls who has permission to use the Cell as an input. 

#### See Also
- [Cell](#cell)
- [Type Script](#type-script)
- [Script](#script)

---

### Lock Script Hash
A Blake2b hash of a Lock Script which is used as an identifier for the Script when referenced by a Cell.

#### See Also
- [Cell](#cell)
- [Lock Script](#lock-script)

---

### Mainnet
The Nervos CKB public blockchain.

The name of the Nervos CKB Mainnet is Lina.

#### Synonyms
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

---

### Nervos CKB
The layer 1 blockchain of the Nervos Network, the Common Knowledge Base.

#### Synonyms
- [CKB](#ckb)
- [Common Knowledge Base](#common-knowledge-base)

#### See Also
- [Layer 1](#layer-1)

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

### RISC-V
An open standard instruction set architecture (ISA) for general computing.

RISC-V is the instruction set used by the CKB-VM.

#### See Also
- [CKB-VM](#risc-v)
- [RISC-V on Wikipedia](https://en.wikipedia.org/wiki/RISC-V)

---

### Script
A program that executes on the CKB-VM. A Script can be one of two types:

- Lock Script - Used to control ownership and access to a Cell.
- Type Script - Used to control how a Cell is used in a transaction.

A Script is a binary executable in the ELF format for the RISC-V architecture.

#### See Also
- [CKB-VM](#risc-v)
- [Lock Script](#lock-script)
- [RISC-V](#risc-v)
- [Type Script](#type-script)
- [ELF on Wikipedia](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

---

### Shannon
A fractional denomination of CKBytes. One CKByte is equal to 100,000,000 Shannons.

A Shannon is the equivalent of a Bitcoin Satoshi.

#### See Also
- [CKByte](#ckbyte)
- [Common Knowledge Byte](#common-knowledge-byte)
- [Satoshi (denomination) on Bitcoin.org](https://bitcoin.org/en/glossary/denominations)

---

### Testnet
An alternate public blockchain used for testing purposes that is running the same or similar software as the Mainnet. All tokens and data on testnets have no value.

The name of the Nervos CKB Testnet is Aggron.

#### Synonyms
- [Aggron](#aggron)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

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
A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### See Also
- [Cell](#cell)
- [Script](#script)
- [Type Script](#type-script)

---

### UDT
An abbreviation for User-Defined Token.

#### Synonyms
- [User-Defined Token](#user-defined-token)

---

### User-Defined Token
A unique non-fungible token with properties defined by the user.

A UDT is equivalent of an Ethereum ERC20 token or ER777 token.

#### See Also
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)
- [UDT Draft Spec on Nervos Talk](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)

---

### Validator
A Script that is used to ensure that a transaction created by a Generator is valid.

Validators are Scripts that run within the CKB-VM, and are either Lock Scripts or Type Scripts.

#### See Also
- [CKB-VM](#risc-v)
- [Lock Script](#lock-script)
- [Type Script](#type-script)
- [Transaction](#transaction)

---

### Witness
A set of cryptographic signatures that contains the data required to prove authorization to the resources used in a transaction.

#### See Also
- [Transaction](#transaction)

---
