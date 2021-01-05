---
id: introduction_zh
title: Nervos CKB 主网集成指南
---

连接 CKB 网络极其容易，只需在一台计算机上运行一个节点。连接成功后，你就可以通过 RPC 接口与节点交互。

## 关于 Nervos CKB

CKB 是 Nervos 网络的 layer1，一条真正免准入许可的公链。CKB 使用 [Proof of Work](https://en.wikipedia.org/wiki/Proof_of_work) 和 [优化的中本聪共识](https://medium.com/nervosnetwork/breaking-the-throughput-limit-of-nakamoto-consensus-ccdf65fe0832)，在不牺牲区块链的核心价值去中心化和安全性的前提下，实现平均硬件和网络连接的最优化。 

## 运行一个 CKB 节点

你需要部署一个节点连接 CKB 网络，读取区块链网络数据，向网络中广播交易。更多信息， 请查阅 [使用最新发布包运行 CKB 节点教程文档](https://docs.nervos.org/docs/basics/guides/mainnet) 或者 [使用 Docker 运行 CKB 节点教程文档](https://github.com/nervosnetwork/ckb/blob/v0.35.0/docs/run-ckb-with-docker.md)。你可能还需要一个索引器来索引 `livecells` 和交易，可以尝试使用 [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer)。如果你正在寻找包含节点和索引器的一站式解决方案，可以尝试 [Perkins' Tent](https://github.com/xxuejie/perkins-tent)。

## 服务器要求
* OS: Ubuntu 18.04 LTS x86_64 (recommended)
* Processor:  Mainstream CPU  4c
* RAM: 4G
* Storage: 100G SSD

## 编写集成
在开始集成之前，我们建议阅读 [CKB 交易结构 RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md)，熟悉 CKB 中的一个基本数据结构。下面列出了一些常见的问题和相应的解决方案示例（使用 CKB SDK Java）。

### 生成/解析地址
[CKB 地址格式](https://github.com/nervoscommunity/docs/tree/master/docs/rfcs/0021-ckb-address-format) 是一个针对 Cell `lock script`  展示方式的应用级的建议。`lock script` 包含 3 个关键参数，包括 `code_hash`, `hash_type` 以及   `args`。CKB 地址将 `lock script`  封装为单行、可验证、人类易读的格式。

* 生成一个地址：[JavaAddressGeneratorTest](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/ckb/src/test/java/utils/AddressGeneratorTest.java) 或者  [JsAddressGeneratorTest](https://github.com/nervosnetwork/ckb-sdk-js/blob/v0.35.0/packages/ckb-sdk-utils/__tests__/address/index.test.js#L40).
* 解析一个地址：[JavaAddressParserTest](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/ckb/src/test/java/utils/AddressParserTest.java) 或者 [JsAddressParserTest](https://github.com/nervosnetwork/ckb-sdk-js/blob/v0.35.0/packages/ckb-sdk-utils/__tests__/address/index.test.js#L78).
* 生成私钥：我们不会在 SDK 中为你生成私钥，你需要自己生成，可以试试  [web3j](https://github.com/web3j/web3j/blob/116539fff875a083c896b2d569d17416dfeb8a6f/crypto/src/main/java/org/web3j/crypto/Keys.java#L79)。CKB 的 `lock script` 代码默认使用跟比特币一样的 secp256k1 签名验证算法。更多信息，请查阅 [SECP256k1Blake160](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c)。


### CKB 转账
地址间的 CKB 转账分为三步：构建、签名以及提交。你可以使用如下例子帮助理解：[SingleSigWithCkbIndexerTxExample](https://github.com/nervosnetwork/ckb-sdk-java/blob/v0.35.1/example/src/main/java/org/nervos/ckb/SingleSigWithCkbIndexerTxExample.java) 和 [TransferAllBalanceWithCkbIndexerExample](https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/example/src/main/java/org/nervos/ckb/TransferAllBalanceWithCkbIndexerExample.java)。如果你想要了解签名流程，呢可以查看[如何对交易进行签名](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction)；如果想要了解交易费用的计算你，可以查看[交易费用](https://github.com/nervosnetwork/ckb/wiki/Transaction-%C2%BB-Transaction-Fee)。

对于提现，需要同时支持转账给[简短版的有效格式](<https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0021-ckb-address-format/0021-ckb-address-format.zh.md#%E7%AE%80%E7%9F%AD%E7%89%88%E7%9A%84%E6%9C%89%E6%95%88%E6%A0%BC%E5%BC%8F>)以及 [完整版的有效格式](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0021-ckb-address-format/0021-ckb-address-format.zh.md#%E5%AE%8C%E6%95%B4%E7%89%88%E7%9A%84%E6%9C%89%E6%95%88%E6%A0%BC%E5%BC%8F)。 

### 从节点检索数据

你可以使用 SDK 向你的 CKB 节点发送 JSON-RPC 请求。这里有一些 [CKB SDK Java](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1) 例子：[JSON-RPC 例子](https://github.com/nervosnetwork/ckb-sdk-java/tree/v0.35.1#json-rpc)。常用的 RPC 接口如下：

* [get_tip_block_number](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_tip_block_number) 返回最长链的当前最新区块高度。
* [get_block_by_number](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_block_by_number) 获取指定高度的区块。
* [get_transaction](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md#get_transaction) 返回指定交易哈希值的交易相关信息，更多信息，请参阅
   [CKB JSON-RPC 协议](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md)。其他有效 SDK：[CKB SDK JS](https://github.com/nervosnetwork/ckb-sdk-js/tree/v0.35.0).

### 如何管理 Cells（类似 UTXO 集合）
Cell 管理主要影响到 Cell 的收集和地址余额的展示。管理 Cells 的方式有很多，以下是两个经典方案：

* **推荐**：使用 [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer) 来收集 Cells 和管理余额。
  * [get_cells_capacity](https://github.com/nervosnetwork/ckb-indexer#get_cells_capacity) 通过 `lock script` 或者 `type script `返回当前所有 `live cells` 的总容量。你可以使用该接口展示地址余额。
* 使用 UTXO 管理框架结合 [CKB JSON-RPC 协议](https://github.com/nervosnetwork/ckb/blob/v0.35.0/rpc/README.md) 来扫描整个 CKB 区块链网络。
  * 不推荐使用 CKB 节点内部的索引器模块来收集 `live cells`，该模块已被丢弃。

### 确认次数建议

由于 Nervos CKB 网络是由 ASIC PoW 矿机以极高的哈希率来保证安全的，所以相比以太坊，同样是 24 个区块确认，CKB 网络能够实现同等甚至更高的安全性。

## 测试

一旦你完成 CKB 网络的集成后，请在测试网和主网进行测试。

* [Testnet 浏览器](https://explorer.nervos.org/aggron/)
* [Mainnet 浏览器](https://explorer.nervos.org/)

## Q&A
若在本教程中你遇到了未能解决的难题，可参考 [Q&A](https://docs.nervos.org/docs/integrate/introduction) 列表，可能会有些帮助。