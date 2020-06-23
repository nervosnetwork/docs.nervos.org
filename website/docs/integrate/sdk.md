---
id: sdk
title: Nervos CKB SDK
---

ckb-sdk is a collection of libraries which allow you to interact with a local or remote CKB node by using JSON-RPC. You should get familiar with [ckb transaction structure](reference/transaction.md) and [JSON-RPC](https://github.com/nervosnetwork/ckb/tree/develop/rpc) before using it. Now ckb-sdk is implemented by five programming languages: JavaScript、Ruby、Swift、Java and Go.

* ckb-sdk-js  [Github](https://github.com/nervosnetwork/ckb-sdk-js)
    * ckb-sdk-js is an SDK implemented in JavaScript, and published in [NPM Registry](https://www.npmjs.com/package/@nervosnetwork/ckb-sdk-core/), and provides APIs for developers to send requests to the CKB blockchain. Neuron Wallet utilizes ckb-sdk-js .
* ckb-sdk-ruby  [Github](https://github.com/nervosnetwork/ckb-sdk-ruby)
    * ckb-sdk-ruby is an SDK implemented in Ruby and provides APIs for developers to send requests to the CKB blockchain. CKB-Explorer utilizes ckb-sdk-ruby.
* ckb-sdk-java  [Github](https://github.com/nervosnetwork/ckb-sdk-java)
    * ckb-sdk-java is an SDK implemented in Java and provides APIs for developers to send requests to the CKB blockchain.
* ckb-sdk-swift  [Github](https://github.com/ashchan/ckb-swift-kit)
    * ckb-sdk-swift is an SDK implemented in Swift and provides APIs for developers to send requests to the CKB blockchain. Testnet Faucet utilizes ckb-sdk-swift .
* ckb-sdk-go [Github](https://github.com/ququzone/ckb-sdk-go)
    * ckb-sdk-go is an SDK implemented in Golang.