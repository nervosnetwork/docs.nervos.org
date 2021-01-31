---
id: developer-materials-guide_zh
title: 开发者资料指南
---

本章节主要帮助开发者了解 CKB 入门开发的必备资料和工具。

## 第一节：介绍与基础入门

这些资料适用于新手，也可用于温习巩固为什么 Nervos 能够作为一个独特强大的平台，与现有公链竞争的基础知识。

### 推荐资料

我们推荐所有刚接触 Nervos 的开发者阅读这些材料，以便对 Nervos 的工作原理有一个高层次的概念性了解。

* [Nervos 文档 - 基础](https://docs.nervos.org/docs/basics/introduction)
* [Nervos YouTube 视频 - Nervos CKB 介绍](https://www.youtube.com/watch?v=3Gl8hNzfigo)

### 更多深度资料（可选）

这些资料涵盖的主题与推荐资料类似，但更深入。开发者可自行选择是否深入了解。

* [Nervos RFCs - 定位白皮书](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0001-positioning/0001-positioning.zh.md)
* [Nervos RFCs - 经济模型](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.zh.md)
* [Nervos RFCs - CKB 白皮书](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0002-ckb/0002-ckb.zh.md)

## 第二节：概念

本小节主要帮助开发者学习了解在 Nervos 上开发 dApps 所需要掌握的独特概念和设计模式。 

### 推荐资料

这些资料适用于所有想在 Nervos 上开发 dApps 或智能合约的开发者。

* [Nervos Docs - 参考资料](https://docs.nervos.org/docs/reference/introduction)
* [视频课程：CKB Dapps 开发 - 课程 1：介绍（英文）](https://youtu.be/6nYyYikSZj0)
* [视频课程：CKB Dapps 开发 - 课程 1：介绍（中英字幕）](https://youtu.be/iVjccs3z5q0)
* [Nervos YouTube - CKB 编程第一部分](https://www.youtube.com/watch?v=HyYXzEIdF90)

### 需要用到时翻阅（可选）

这些资料高度深入，而且是针对特定主题的。我们建议开发者在需要的时候前往翻阅了解即可。

* [Nervos RFCs - VM 系统调用](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0009-vm-syscalls/0009-vm-syscalls.zh.md) - 智能合约相关的系统调用。
* [Nervos RFCs - 数据结构](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0019-data-structures/0019-data-structures.zh.md) - Cell，脚本，交易以及区块的数据结构。
* [Nervos RFCs - CKB 地址格式](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0021-ckb-address-format/0021-ckb-address-format.zh.md) - Nervos 地址的编码方式。
* [Nervos RFCs - 交易结构](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md) - 交易的构建方式。

## 第三节：开发者工具

本小节主要介绍 Nervos 上的开发工具。

### 推荐工具

以下为在 Nervos CKB 上进行开发的推荐工具： 

* [Capsule](https://github.com/nervosnetwork/capsule) - 用 Rust 和 C 语言开发链上智能合约的框架。
    * [文档](https://github.com/nervosnetwork/capsule/wiki)
    * [CKB-STD 文档](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/index.html)
    * [教程：使用 Capsule 编写 SUDT](https://docs.nervos.org/docs/labs/sudtbycapsule)
    * [视频课程：CKB Dapps 开发 - 课程 2：使用 Capsule 构建链上脚本（英文）](https://www.youtube.com/watch?v=pbnVwVOaJg4)
    * [视频课程：CKB Dapps 开发 - 课程 2：使用 Capsule 构建链上脚本（中英字幕）](https://youtu.be/NcN3NiBuJbo)
    * [视频教程：了解代币销售 Lock Script（英文）](https://youtu.be/ysUbx4FAKlE)
* [Lumos](https://github.com/nervosnetwork/lumos) -  服务器端 Dapp 开发框架。
    * [文档](https://github.com/nervosnetwork/lumos)
    * [教程：Lumos 介绍](https://docs.nervos.org/docs/labs/lumos-nervosdao)
    * [视频课程：CKB Dapps 开发 - 课程 3：Lumos Dapp 开发（中英字幕）](https://youtu.be/TJ2bnSFUpPQ)
    * [视频课程：CKB Dapps 开发 - 课程 4：Lumos Dapp 架构（英文）](https://youtu.be/9U23hrzCAiM)
* [PW-Core](https://github.com/lay2dev/pw-core) - 支持客户端 Dapp 钱包的框架。
    * [文档](https://docs.lay2.dev/)
    * [Demo 项目： 极简 Dapp](https://github.com/lay2dev/simplestdapp)
    * [视频教程：PW-Core 编程演练（英文）](https://www.youtube.com/watch?v=E2AYuRaeP9Q)
    * [视频教程：PW-Core 编程演练（中文）](https://www.youtube.com/watch?v=NmMRM4PoE08)

### 需要用到时翻阅（可选）

* [CKB Studio](https://www.obsidians.io/) - 一个内置区块链开发和交易测试工具的开发 IDE。
    * [教程](https://medium.com/nervos-ckb-israel/collection-of-ckb-studio-tutorials-9ffd573894)
    * [视频教程：如何使用 CKB Studio](https://www.youtube.com/watch?v=lOxXrVIfT2Y)
* [Synapse Web Wallet](https://github.com/rebase-network/synapse-extension) - 支持多个锁脚本（lock scripts）的 Dapp 钱包。
    * [文档](https://github.com/rebase-network/synapse-extension/tree/master/docs)
    * [Demo 项目： 极简 Dapp + Synapse](https://github.com/rebase-network/simplestdapp)

### 测试网水龙头

在 Aggron 测试网上开发测试时，可以从这个龙头上获得免费的测试网 CKB。

* [Nervos Aggron 水龙头](https://faucet.nervos.org/)

## 第四节：示例项目

查看智能合约脚本和 Dapps 的功能示例。

### 示例脚本

这些是用 C 和 Rust 编写的智能合约脚本。对于大多数开发者来说，我们建议用 Rust 构建脚本。

* [Simple UDT Type Script （Rust + Capsule）](https://github.com/jjyr/my-sudt)
    * [教程：用 Capsule 编写 SUDT](https://docs.nervos.org/docs/labs/sudtbycapsule)
* [Simple UDT Type Script (C)](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/simple_udt.c)
* [代币销售 Lock Script （Rust + Capsule）](https://github.com/jordanmack/token-sale)
    * [文档](https://github.com/jordanmack/token-sale/blob/master/README.md)
    * [视频教程：了解代币销售 Lock Script （英文）](https://youtu.be/ysUbx4FAKlE) 
* [Anyone Can Pay Lock Script (C)](https://github.com/nervosnetwork/ckb-anyone-can-pay/blob/master/c/anyone_can_pay.c)
* [Open Transaction Lock Script (C)](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/open_transaction.c)
    * [Nervos Talk - Open Transaction Four Part](https://talk.nervos.org/t/open-tx-protocol-brainstorm-1-otx-in-general/4010)[Brainstorm](https://talk.nervos.org/t/open-tx-protocol-brainstorm-1-otx-in-general/4010)
* [Multi-Token Extensible NFT Type Script (Rust + Capsule)](https://github.com/jordanmack/nervos-ckb-nft)

### 示例 Dapps

这些都是使用我们推荐的工具构建的功能完善的 Dapps。

* [Hello Lumos Dapp 模板](https://github.com/tspoff/hello-lumos)
* [Token Playground (Lumos + PW-SDK)](https://github.com/tspoff/token-playground)
* [极简 Dapp](https://github.com/lay2dev/simplestdapp)
* [极简 Dapp + Synapse](https://github.com/rebase-network/simplestdapp)

## 第五节：推荐开发环境搭建

本小节主要是搭建开发环境以及使用哪些技术来构建你的应用程序的建议。

### 开发环境推荐

这些是对任何基于 Nervos CKB 构建的开发者最低要求的软件推荐。

* OS: MacOS, Ubuntu Linux, or Windows 10 + WSL2 (Ubuntu)
* IDE: [CKB Studio](https://www.obsidians.io/) 或者你自己喜欢的 IDE! 😁
* [CKB 开发链](https://docs.nervos.org/docs/basics/guides/devchain) - 用于 dApp 和智能合约测试。
* [Docker](https://docs.docker.com/get-docker/) - 用于使用 Capsule 进行智能合约开发。
* [NPM](https://www.npmjs.com/get-npm) 或 [Yarn](https://classic.yarnpkg.com/en/docs/install/) - 用于使用 [Lumos](https://github.com/nervosnetwork/lumos) 和 [PW-SDK](https://github.com/lay2dev/pw-core) 的 Dapp 开发。
* [Neuron Wallet](https://github.com/nervosnetwork/neuron/releases) 或 [Portal Wallet](https://ckb.pw/) - 用于管理主网资金。

### 开发堆栈推荐

以下是进行 Nervos CKB 开发推荐使用的软件堆栈，堆栈的选择是基于当前行业趋势以及当前可用的工具的考量。

* Dapp 前端： [React.js](https://reactjs.org/) + [PW-SDK](https://github.com/lay2dev/pw-core)
* Dapp 后端： [Express.js +](https://expressjs.com/en/starter/installing.html)[Lumos](https://github.com/nervosnetwork/lumos)
* Dapp 钱包： [PW-SDK](https://github.com/lay2dev/pw-core) + [MetaMask](https://metamask.io/)
* 智能合约脚本： [Capsule](https://github.com/nervosnetwork/capsule)
