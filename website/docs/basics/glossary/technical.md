---
id: glossary-technical
title: Technical Glossary
---

<!--
Notes:
- Synonyms, Not To Be Confused With, and See Also should be omitted when they are empty.
- Avoid links in the definition. Add them to the sections in the note above.
- Definitions should be descriptive but brief. The Glossary is not a tutorial. 
- Links should be alphabetized with local links appearing above external links.
-->

## Active Cell
A Cell in the current state of CKB. Active cells can be used as inputs to transactions.

#### Synonyms
- [Live Cell](#live-cell)

#### See Also
- [Cell](glossary-general#cell)
- [Input](#input)
- [Transaction](glossary-general#transaction)

---

## Aggron
The name of the main public testnet for Nervos CKB.

#### Synonyms
- [Testnet](#testnet)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

---

## Animagus
A framework layer that runs on top of Nervos CKB which provides an easy way to query for account balances without having to go through the Cell Collection process.

#### See Also
- [Cell Collection](#cell-collection)
- [Nervos CKB](#nervos-ckb)
- [Animagus Introduction on the Nervos Blog](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-animagus-part-1-introduction-66fa8ce27ccd-cfb361a7d883)

---

## Args
Args is short for arguments, and is data provided to a Lock Script or Type Script within a Cell. This is nearly identical to arguments provided to a normal command-line application.

Arguments are stored as part of the Cell when it is created.

#### See Also
- [Cell](glossary-general#cell)
- [Lock Script](#lock-script)
- [Type Script](#type-script)

---

## Axon
A layer 2 side-chain of the Nervos CKB developed by the Nervos Core Team. Axon provides high-performance smart contract execution while utilizing Nervos CKB as a trust layer.

#### See Also
- [Layer 2](#layer-2)
- [Nervos CKB](#nervos-ckb)
- [Axon on Nervos.org](https://www.nervos.org/network/)

---

## Blake2b
A general-purpose cryptographic hashing algorithm that can create a succinct data fingerprint for any type of data.

#### See Also
- [Blake Hash Function on Wikipedia](https://en.wikipedia.org/wiki/BLAKE_(hash_function))
- [Hash Function on Wikipedia](https://en.wikipedia.org/wiki/Hash_function)

---

## Cell Collection
The process of gathering cells that meet certain criteria.

For example: To find the balance of a particular account, all active cells for the address would need to be collected.

#### See Also
- [Cell](glossary-general#cell)

---

## Cellbase
The transaction in each block that is responsible for the minting of new CKBytes.

This is the equivalent of a coinbase transaction in Bitcoin.

#### See Also
- [CKByte](glossary-general#ckbyte)
- [Coinbase on Bitcoin.org](https://bitcoin.org/en/glossary/coinbase)

---

## Commitment Zone
Section of the block that contains transaction commitments. The commitment zone can only contain valid transactions which have appeared in the proposal zone of one of the previous 2 to 10 blocks.

#### See Also
- [Block](glossary-general#block)
- [Transaction](glossary-general#transaction)

---

## Consume
The process of using a Live Cell as an input to a transaction.

The process of consumption marks the Live Cell as a Dead Cell. This is the equivalent of marking a UTXO as spent in Bitcoin.

#### See Also
- [Cell](glossary-general#cell)
- [Cell Model](glossary-general#cell-model)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

## Crypto Primitives
Well-established, low-level cryptographic algorithm commonly used to build out a cryptographic protocol.

#### See Also
- [Cryptographic Primitive on Wikipedia](https://en.wikipedia.org/wiki/Cryptographic_primitive)

---

## Dead Cell
A cell that has been used as an input to a previous transaction. It cannot be used as an input to a new transaction, nor can it be used as a dependency.

This is the equivalent of a "spent UTXO" in Bitcoin.

#### See Also
- [Cell](glossary-general#cell)
- [Cell Model](glossary-general#cell-model)
- [Consume](#consume)
- [Transaction](glossary-general#transaction)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

## Deps
A shorthand name for dependencies.

#### Synonyms
- [Dependencies](#dependencies)

---

## Dependencies
Cells that are referenced in a transaction. Cells that are referenced as dependencies are read-only and made available to any Scripts executing within the transaction. Dependencies are not consumed.

#### Synonyms
- [Deps](#deps)

#### See Also
- [Cell](glossary-general#cell)
- [Consume](#consume)
- [Script](#script)
- [Transaction](glossary-general#transaction)

---

## Eaglesong
The proof of work function used for mining on Nervos CKB.

#### See Also
- [Eaglesong RFC on the Nervos Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)

---

## Generator
A program that is used to create transactions that can be broadcast to the Nervos CKB network.

#### See Also
- [Nervos CKB](#nervos-ckb)
- [Transaction](glossary-general#transaction)

---

## Governance Script
A Type Script which defines the monetary policy of a User Defined Token (UDT).

#### See Also
- [Governance Script Hash](#governance-script-hash)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

## Governance Script Hash
A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### Synonyms
- [Type Script Hash](#type-script-hash)

#### See Also
- [Governance Script](#governance-script)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

## Input
A Live Cell that is used in a transaction. If the transaction is accepted by the network, the Live Cell will be consumed, and marked as a Dead Cell.

#### See Also
- [Cell](glossary-general#cell)
- [Consume](#consume)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [Transaction](glossary-general#transaction)

---

## Layer 1
A proof of work blockchain known as the Common Knowledge Base (CKB) that serves as the base layer for the Nervos Network.

#### Synonyms
- [CKB](glossary-general#ckb)
- [Common Knowledge Base](glossary-general#common-knowledge-base)

#### See Also
- [Layer 2](#layer-2)

---

## Layer 2
Any framework or protocol that is built on top of and dependent on a layer 1 blockchain.

Layer 2 systems often address different concerns than layer 1, allowing for a wider range of use cases while directly inheriting many of benefits of layer 1.

#### See Also
- [Layer 1](#layer-1)

---

## Lina
The name of public Mainnet of the Nervos CKB.

#### Synonyms
- [Mainnet](#mainnet)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

#### See Also
- [Nervos CKB](#nervos-ckb)

---

## Live Cell
A Cell that has not been consumed and is available for use.

This is similar to an unspent transaction output (UTXO) in Bitcoin.

#### Synonyms
- [Active Cell](#active-cell)

#### See Also
- [Cell](glossary-general#cell)
- [Cell Model](glossary-general#cell-model)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

## Lock Script
A Script that enforces access and ownership of a Cell. This Script controls who has permission to use the Cell as an input. 

#### See Also
- [Cell](glossary-general#cell)
- [Type Script](#type-script)
- [Script](#script)

---

## Lock Script Hash
A Blake2b hash of a Lock Script which is used as an identifier for the Script when referenced by a Cell.

#### See Also
- [Cell](glossary-general#cell)
- [Lock Script](#lock-script)

---

## Mainnet
The Nervos CKB public blockchain.

The name of the Nervos CKB Mainnet is Lina.

#### Synonyms
- [CKB](glossary-general#ckb)
- [Common Knowledge Base](/glossary/glossary-general#common-knowledge-base)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

---

## Nervos CKB
The layer 1 blockchain of the Nervos Network, the Common Knowledge Base.

#### Synonyms
- [CKB](glossary-general#ckb)
- [Common Knowledge Base](glossary-general#common-knowledge-base)

#### See Also
- [Layer 1](#layer-1)

---

## Outpoint
A particular output Cell in a transaction.

#### See Also
- [Cell](glossary-general#cell)
- [Output](#output)
- [Transaction](glossary-general#transaction)

---

## Output
A Live Cell that is created in a transaction.

#### See Also
- [Cell](glossary-general#cell)
- [Live Cell](#live-cell)
- [Transaction](glossary-general#transaction)

---

## RISC-V
An open standard instruction set architecture (ISA) for general computing.

RISC-V is the instruction set used by the CKB-VM.

#### See Also
- [CKB-VM](glossary-general#risc-v)
- [RISC-V on Wikipedia](https://en.wikipedia.org/wiki/RISC-V)

---

## Script
A program that executes on the CKB-VM. A Script can be one of two types:

- Lock Script - Used to control ownership and access to a Cell.
- Type Script - Used to control how a Cell is used in a transaction.

A Script is a binary executable in the ELF format for the RISC-V architecture.

#### See Also
- [CKB-VM](glossary-general#risc-v)
- [Lock Script](#lock-script)
- [RISC-V](#risc-v)
- [Type Script](#type-script)
- [ELF on Wikipedia](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

---

## Shannon
A fractional denomination of CKBytes. One CKByte is equal to 100,000,000 Shannons.

A Shannon is the equivalent of a Bitcoin Satoshi.

#### See Also
- [CKByte](glossary-general#ckbyte)
- [Common Knowledge Byte](glossary-general#common-knowledge-byte)
- [Satoshi (denomination) on Bitcoin.org](https://bitcoin.org/en/glossary/denominations)

---

## Testnet
An alternate public blockchain used for testing purposes that is running the same or similar software as the Mainnet. All tokens and data on testnets have no value.

The name of the Nervos CKB Testnet is Aggron.

#### Synonyms
- [Aggron](#aggron)

#### Not To Be Confused With
- [Lina](#lina)
- [Mainnet](#mainnet)

---

## Type Script
A Script that enforces the rules that must be followed in a transaction for a Cell to be consumed as an input or for a Cell to be created as an output.

#### See Also
- [Cell](glossary-general#cell)
- [Lock Script](#lock-script)
- [Script](#script)
- [Type Script Hash](#type-script-hash)

---

## Type Script Hash
A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### See Also
- [Cell](glossary-general#cell)
- [Script](#script)
- [Type Script](#type-script)

---

## UDT
An abbreviation for User-Defined Token.

#### Synonyms
- [User-Defined Token](#user-defined-token)

---

## User-Defined Token
A unique non-fungible token with properties defined by the user.

A UDT is equivalent of an Ethereum ERC20 token or ER777 token.

#### See Also
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)
- [UDT Draft Spec on Nervos Talk](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)

---

## Validator
A Script that is used to ensure that a transaction created by a Generator is valid.

Validators are Scripts that run within the CKB-VM, and are either Lock Scripts or Type Scripts.

#### See Also
- [CKB-VM](glossary-general#risc-v)
- [Lock Script](#lock-script)
- [Type Script](#type-script)
- [Transaction](glossary-general#transaction)

---

## Witness
A set of cryptographic signatures that contains the data required to prove authorization to the resources used in a transaction.

#### See Also
- [Transaction](glossary-general#transaction)

---
