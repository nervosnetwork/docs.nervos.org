---
id: introduction
title: Nervos CKB Mainnet - Integration Guide
---

Connecting to the CKB network is extremely easy and only requires running one node on a machine. Once you've connected to the CKB network, you can use the RPC interface to interacting with the node.

## About Nervos CKB

CKB is the layer 1 of Nervos Network, a public/permissionless blockchain. CKB uses [Proof of Work](https://en.wikipedia.org/wiki/Proof_of_work) and [improved Nakamoto consensus](https://medium.com/nervosnetwork/breaking-the-throughput-limit-of-nakamoto-consensus-ccdf65fe0832) to achieve maximized performance on average hardware and internet conditions without sacrificing decentralization and security, which are the core values of blockchain.

## Run A CKB Node

You’ll need to deploy nodes to connect with the CKB network, read data from the blockchain, and broadcast transactions onto the CKB network. For more information, please see [Run CKB With The Latest Release](https://docs.nervos.org/docs/basics/guides/mainnet) or [Run CKB With Docker](https://github.com/nervosnetwork/ckb/blob/v0.35.0/docs/run-ckb-with-docker.md). You may also need an indexer to index live cells and transactions, and then you can try [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer). If you are looking for a one-stop solution that includes both node and indexer, you can try [Perkins' Tent](https://github.com/xxuejie/perkins-tent).

## Server Requirements
* OS: Ubuntu 18.04 LTS x86_64 (recommended)
* Processor:  Mainstream CPU  4c
* RAM: 4G
* Storage: 100G SSD

## Writing an integration
Before starting your integration, we recommend reading [CKB Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md) RFC to familiarize yourself with an essential data structure in CKB. Some common issues and corresponding example solutions (using [CKB SDK Java](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1)) are listed below.

### Generating and Parsing Address
[CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md) is an application-level recommendation for cell lock script display. The lock script consists of three key parameters, including code_hash, hash_type, and args. CKB address packages lock script into a single line, verifiable, and human read friendly format.

* Generate an Address: [JavaAddressGeneratorTest](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/ckb/src/test/java/utils/AddressGeneratorTest.java) or [JsAddressGeneratorTest](https://github.com/nervosnetwork/ckb-sdk-js/blob/v0.35.0/packages/ckb-sdk-utils/__tests__/address/index.test.js#L40).
* Parse an Address: [JavaAddressParserTest](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/ckb/src/test/java/utils/AddressParserTest.java) or [JsAddressParserTest](https://github.com/nervosnetwork/ckb-sdk-js/blob/v0.35.0/packages/ckb-sdk-utils/__tests__/address/index.test.js#L78).
* Generate Private key: We won’t generate private keys for you on SDK. You need to produce it on your own, you can try [web3j](https://github.com/web3j/web3j/blob/116539fff875a083c896b2d569d17416dfeb8a6f/crypto/src/main/java/org/web3j/crypto/Keys.java#L79). CKB default lock script code using the same secp256k1 signature verification algorithm as used in bitcoin. For more information, please see [SECP256k1Blake160](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c).


### Transferring CKB
The transmission of CKB between addresses is divided into three steps, constructing, signing, and submitting the transaction. You can use the following example to understand how to transfer CKB between addresses [SingleSigWithCkbIndexerTxExample](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/example/src/main/java/org/nervos/ckb/SingleSigWithCkbIndexerTxExample.java) and [TransferAllBalanceWithCkbIndexerExample](https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/example/src/main/java/org/nervos/ckb/TransferAllBalanceWithCkbIndexerExample.java). If you want to know the signing process, you can check [How to sign the transaction](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction). For the calculation of transaction fees, please see the [Transaction Fee](https://github.com/nervosnetwork/ckb/wiki/Transaction-%C2%BB-Transaction-Fee).

For withdrawal, need to support both transfers to [Short Payload Format SECP256K1 + blake160 Address](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md#short-payload-format) and transfers to [Full Payload Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md#full-payload-format).

### Retrieving data from node
You can make a JSON-RPC request to your CKB node with the SDK. There are some [CKB SDK Java](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1) examples: [JSON-RPC Example](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1#json-rpc). Commonly used RPC interfaces are
* [get_tip_block_number](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_tip_block_number) Returns, the number/height of blocks in the longest blockchain.
* [get_block_by_number](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_block_by_number) Get block by number/height.
* [get_transaction](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_transaction) Returns the information about a transaction requested by transaction hash.
For more information, please see the [CKB JSON-RPC protocols](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md). Other available SDK: [CKB SDK JS](https://github.com/nervosnetwork/ckb-sdk-js/tree/v0.35.0).

### How to manage cells(like UTXO set)
Cell management mainly affects cell collection and address balance display. There are many ways to manage cells; here are two typical example solutions.
* Use your UTXO management framework to combine [CKB JSON-RPC protocols](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md) to scan the entire CKB blockchain.
* Use [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer) to collect cells and display balance.
  * [get_cells_capacity](https://github.com/nervosnetwork/ckb-indexer#get_cells_capacity) Returns the live cells total capacity by the lock or type script. You can use this RPC to display address balance.

## Testing

Once you’ve fully integrated with the CKB network, please test on the testnet and mainnet.
* [Testnet Explorer](https://explorer.nervos.org/aggron/)
* [Mainnet Explorer](https://explorer.nervos.org/)

## Q&A
When you integrate CKB into your system, you may face some challenges. Here is a [Q&A](https://docs.nervos.org/docs/integrate/introduction) that may help you.
