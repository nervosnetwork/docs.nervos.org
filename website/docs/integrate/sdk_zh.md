---
id: sdk_zh
title: Nervos CKB SDK
---

CKB-SDK 是一个库集合，可以让你通过 JSON-RPC 与本地或者远程 CKB 节点交互。在使用 SDK 之前，你应该熟悉一下 [ckb 交易结构](reference/transaction_zh.md) 和 [JSON-RPC](https://github.com/nervosnetwork/ckb/tree/develop/rpc)。当前 CKB-SDK 有以下语言的实现：JavaScript/TypeScript，Ruby，Swift，Java 和 Go。

* [ckb-sdk-js](https://github.com/nervosnetwork/ckb-sdk-js)
    * ckb-sdk-js 是 JavaScript 版的 SDK，已发布在 [NPM Registry](https://www.npmjs.com/package/@nervosnetwork/ckb-sdk-core/)，为开发者提供 APIs 向 CKB 网络发送请求。Neuron 钱包使用的就是 ckb-sdk-js。
* [ckb-sdk-ruby](https://github.com/nervosnetwork/ckb-sdk-ruby)
    * ckb-sdk-ruby 是 Ruby 版的 SDK，为开发者提供 APIs 向 CKB 网络发送请求。CKB 浏览器使用的就是 ckb-sdk-ruby。
* [ckb-sdk-java](https://github.com/nervosnetwork/ckb-sdk-java)
    * ckb-sdk-java 是 Java 版的 SDK，为开发者提供 APIs 向 CKB 网络发送请求。
* [ckb-sdk-swift](https://github.com/ashchan/ckb-swift-kit)
    * ckb-sdk-swift 是 Swift 版的 SDK，为开发者提供 APIs 向 CKB 网络发送请求。测试网水龙头使用的就是 ckb-sdk-swift。
* [ckb-sdk-go](https://github.com/ququzone/ckb-sdk-go)
    * ckb-sdk-go 是 Go 版的 SDK。