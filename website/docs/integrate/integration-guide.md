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

## A Checklist for Integration
Before starting your integration, we recommend reading [CKB Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md) RFC to familiarize yourself with an essential data structure in CKB. Some common issues and corresponding example solutions (using [CKB SDK Java](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1)) are listed below.

### Generating and Parsing Address
[CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md) is an application-level recommendation for cell lock script display. The lock script consists of three key parameters, including code_hash, hash_type, and args. CKB address packages lock script into a single line, verifiable, and human read friendly format.

* Generate an Address: [JavaAddressGeneratorTest](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/ckb/src/test/java/utils/AddressGeneratorTest.java) or [JsAddressGeneratorTest](https://github.com/nervosnetwork/ckb-sdk-js/blob/v0.35.0/packages/ckb-sdk-utils/__tests__/address/index.test.js#L40).
* Parse an Address: [JavaAddressParserTest](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/ckb/src/test/java/utils/AddressParserTest.java) or [JsAddressParserTest](https://github.com/nervosnetwork/ckb-sdk-js/blob/v0.35.0/packages/ckb-sdk-utils/__tests__/address/index.test.js#L78).
* Generate Private key: We won’t generate private keys for you on SDK. You need to produce it on your own, you can try [web3j](https://github.com/web3j/web3j/blob/116539fff875a083c896b2d569d17416dfeb8a6f/crypto/src/main/java/org/web3j/crypto/Keys.java#L79). CKB default lock script code using the same secp256k1 signature verification algorithm as used in bitcoin. For more information, please see [SECP256k1Blake160](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c).


### Transferring CKB
The transmission of CKB between addresses is divided into three steps, constructing, signing, and submitting the transaction. You can use the following example to understand how to transfer CKB between addresses [SingleSigWithCkbIndexerTxExample](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/example/src/main/java/org/nervos/ckb/SingleSigWithCkbIndexerTxExample.java) and [TransferAllBalanceWithCkbIndexerExample](https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/example/src/main/java/org/nervos/ckb/TransferAllBalanceWithCkbIndexerExample.java). If you want to know the signing process, you can check [How to sign the transaction](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction). For the calculation of transaction fees, please see the [Transaction Fee](https://github.com/nervosnetwork/ckb/wiki/Transaction-%C2%BB-Transaction-Fee).

For withdrawal, need to support both transfers to [Short Payload Format Address](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md#short-payload-format) and transfers to [Full Payload Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md#full-payload-format).

### Retrieving data from node
You can make a JSON-RPC request to your CKB node with the SDK. There are some [CKB SDK Java](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1) examples: [JSON-RPC Example](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1#json-rpc). Commonly used RPC interfaces are
* [get_tip_block_number](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_tip_block_number) Returns, the number/height of blocks in the longest blockchain.
* [get_block_by_number](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_block_by_number) Get block by number/height.
* [get_transaction](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_transaction) Returns the information about a transaction requested by transaction hash.
For more information, please see the [CKB JSON-RPC protocols](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md). Other available SDK: [CKB SDK JS](https://github.com/nervosnetwork/ckb-sdk-js/tree/v0.35.0).

### How to manage cells(like UTXO set)
Cell management mainly affects cell collection and address balance display. There are many ways to manage cells; Here are two typical example solutions.

* **Recommended**: use CKB indexer to collect cells and display balance. Recommend using [built-in](#ckb-built-in-indexer) version available since v0.106.0, [standalone](https://github.com/nervosnetwork/ckb-indexer) version is also available.
  * [get_cells_capacity](https://github.com/nervosnetwork/ckb/tree/master/rpc#method-get_cells_capacity) Returns the live cells total capacity by the lock or type script. You can use this RPC to display address balance.
* Use your UTXO management framework to combine [CKB JSON-RPC protocols](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md) to scan the entire CKB blockchain.


### CKB built-in indexer

#### CKB

Since v0.106.0, CKB has integrated the functions in previous standalone ckb-indexers. Users of v0.106.0 nodes or above have no need to start ckb-indexer service separately. Ckb-indexer-related RPC is included in the current RPC as a module. Users don't have to configure the indexer port separately.

There are three ways to enable CKB built-in indexer:

- Add the parameter `--indexer` to the command line to start CKB

```
ckb run -C <path> --indexer
```

- Add Indexer module in the RPC section of CKB config file. CKB built-in indexer will be enabled along with the node.

```
[rpc]
modules = [..., "Indexer"]
```

- Add indexer_v2 section to the config file to configure the indexer. Since the indexer section was deprecated in the configuration file once before, the v2 suffix is added to avoid conflicts and to be compatible with older config files. Once the indexer section is configured, the CKB built-in indexer will be enabled along with the node.

```
[indexer_v2]
index_tx_pool = false
```


These three methods do not mutually conflict. Users can choose based on their preferences. The third method supports advanced indexer configuration.

Below listed the items to be configured:

| Items  | Description |
| ------------- | ------------- |
| store = `<PATH>`  | Indexer db directory. Configured as data/indexer/store by default.  |
| secondary_path = `<PATH>`  | Indexer directory for node data synchronization. Configured as  data/indexer/secondary_path by default.  |
| poll_interval = 2  | Indexer data synchronization interval. Measured in second, 2s by default. Mainly used for testing. We recommended not to modify. |
| index_tx_pool = bool  | Whether to create index for the unconfirmed transactions in tx_pool. |
| db_background_jobs = 6  | Number of indexer db background job. 6 by default. We recommended not to modify. |
| db_keep_log_file_num = 1  | Number of indexer db debug logs. 1 by default. |

Block_filter and cell_filter provide options to customize index rules via a simple Rhai script.
Configured as below:

```
block_filter = "block.header.number.to_uint() > "1000000".to_uint()"
cell_filter = 'let script = output.lock; script.code_hash == "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8" && script.hash_type == "type" && script.args == "0xa897829e60ee4e3fb0e4abe65549ec4a5ddafad7"'
```


Also note that the difference between the RPC of CKB built-in indexer and the RPC of the previous standalone ckb-indexer:

* get_tip RPC in ckb-indexer is renamed to get_indexer_tip to avoid ambiguity.
* get_indexer_info RPC is removed.

#### Ckb-cli

Ckb-cli requires v1.2.0 or higher to support CKB built-in indexer.

Specifying [`ckb-indexer-url`](http://ckb-indexer-url.is) is no longer necessary.

#### Ckb-sdk

**Go SDK**

Importing [Go SDK](http://github.com/nervosnetwork/ckb-sdk-go/indexer) is no longer necessary.

 All previous method calls are switched from `indexerClient` to CKB client as follows:

```
//import [github.com/nervosnetwork/ckb-sdk-go/indexer](http://github.com/nervosnetwork/ckb-sdk-go/indexer)
import github.com/nervosnetwork/ckb-sdk-go/rpc

///BEFORE
//!!NOTE: OLD ONE, this is deprated!
//indexerClient, err := indexer.Dial("http://127.0.0.1:8114")
//indexerClient.GetCells....

///AFTER
//!!NOTE: USE THIS INSTEAD
var client, _ = rpc.Dial("https://testnet.ckb.dev")
//client.GetCells(...)
```

#### Lumos

Lumos needs v0.19.0 to adapt to CKB build-in indexer.

```
import { Indexer } from '@ckb-lumos/lumos';

// before
// const indexer = new Indexer(
//   "https://testnet.ckb.dev/indexer",
//   "https://testnet.ckb.dev/rpc",
// );

// after
const indexer = new Indexer("https://testnet.ckb.dev/rpc");
```

### Confirmation count suggestion

Since Nervos CKB network is secured by [ASIC PoW miners with extreme hash rate](https://explorer.nervos.org/charts/hash-rate) now, it could achieve the same or better security threshold than Ethereum at **24 block confirmations**.

[This essay](https://docs.nervos.org/docs/essays/tx-confirmation/) demonstrates how the transaction confirmation number is calculated.

## Testing

Once you’ve fully integrated with the CKB network, please test on the testnet and mainnet.
* [Testnet Explorer](https://explorer.nervos.org/aggron/)
* [Mainnet Explorer](https://explorer.nervos.org/)

## Q&A
When you integrate CKB into your system, you may face some challenges. Here is a [Q&A](https://docs.nervos.org/docs/integrate/introduction) that may help you.
