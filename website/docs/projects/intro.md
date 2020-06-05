---
id: introduction
title: Projects introduction
---

We aim to offer blockchain developers exciting new capabilities, now we have built three useful development projects: Lumos,Capsule and Polyjuice.If you know the generator/validator separation of CKB, you would realize that Capsule is for validator, while Lumos is for generator. When working together, we expect them to provide top-level development experience on Nervos CKB.You may refer to [Labs](labs/intro.md) for helpful tutorials, we would be very happy for you to build on Nervos CKB.

## Lumos 
[Github repo](https://github.com/nervosnetwork/lumos)

Lumos is a full featured JavaScript/TypeScript based dapp framework for Nervos CKB and target Electron and Web platforms.Now we already have a [sample project](https://github.com/xxuejie/felix) for you to check out.

## Capsule 
[Github repo](https://github.com/nervosnetwork/capsule) 

Capsule is a set of tools for Rust developers to develop scripts on CKB which covers the entire lifecycle of script development: writing,debugging,testing and deployment. We aim to improve the development experience of Rust developers.

## Polyjuice 
[Github repo](https://github.com/nervosnetwork/polyjuice)

Polyjuice is a layer 2 solution that provides a Web3 compatible interface on top of Nervos CKB. The design goal here is 95%+ compatible with existing Ethereum solution, so that your Solidity smart contracts and tools for Ethereum could work directly on top of Nervos CKB, while enjoying the following benefits:
* A state rent model that everyone needs to pay for their own storage
* An EVM that could be upgraded with new features without hardforks
* A modern blockchain that does not suffer from Ethereum's legacies.