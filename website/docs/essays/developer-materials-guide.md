---
id: developer-materials-guide
title: Developer Materials Guide
---

This guide will help introduce new developers to the essential topics and tools needed to get started.

## Section 1: Introduction and Absolute Basics

These materials are for participants who are brand new, or need a refresher on the basics of what makes Nervos a unique and powerful alternative to the existing blockchain smart contract platforms.

### Recommended Materials

We recommend all new developers review these materials to get a high-level conceptual understanding of how Nervos works.

* [Nervos Docs - Basics](https://docs.nervos.org/docs/basics/introduction)
* [Nervos YouTube - Intro to Nervos CKB](https://www.youtube.com/watch?v=3Gl8hNzfigo)

### More In-Depth Materials (Optional)

These materials cover similar topics to the recommended materials, but are much more in-depth. Reading these is optional.

* [Nervos RFCs - Positioning Paper](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0001-positioning/0001-positioning.md)
* [Nervos RFCs - Crypto-Economic Paper](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)
* [Nervos RFCs - CKB Whitepaper](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md)

## Section 2: Developer Concepts

Learn the unique concepts and design patterns that developers will need to understand to create Dapps on Nervos.

### Recommended Materials

These materials are recommended for all developers who want to develop Dapps or Smart Contracts on Nervos.

* [Nervos Docs - Reference](https://docs.nervos.org/docs/reference/introduction)
* [Video Lecture: Dapps with CKB Workshop - Lecture 1: Introduction (English)](https://youtu.be/6nYyYikSZj0)
* [Video Lecture: Dapps with CKB Workshop - Lecture 1: Introduction (Chinese + English Subtitles)](https://youtu.be/iVjccs3z5q0)
* [Nervos YouTube - Programming CKB Part 1](https://www.youtube.com/watch?v=HyYXzEIdF90)
* [Nervos YouTube - Programming CKB Part 2](https://www.youtube.com/watch?v=Co-rzOhwuHs)
* [Nervos YouTube - Programming CKB Part 3](https://www.youtube.com/watch?v=13w6Wvu9ff0)

### Available When You Need Them (Optional)

These materials are much more in-depth, but only relevant for specific topics. We recommend reviewing them only as needed.

* [Nervos RFCs - VM Syscalls](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md) - Smart Contract related system calls.
* [Nervos RFCs - Data Structures](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md) - Data structures for a Cell, Script, Transaction, and Block.
* [Nervos RFCs - CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md) - How Nervos addresses are encoded.
* [Nervos RFCs - Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md) - How a transaction is structured.

## Section 3: Developer Tooling

Learn about the tools that are available for developing on Nervos.

### Recommended Tooling

These are the recommended tools for developing on Nervos CKB.

* [Capsule](https://github.com/nervosnetwork/capsule) - A framework for developing on-chain smart contracts in Rust and C.
    * [Documentation](https://github.com/nervosnetwork/capsule/wiki)
    * [CKB-STD Library Documentation](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/index.html)
    * [Tutorial: Write an SUDT in Capsule](https://docs.nervos.org/docs/labs/sudtbycapsule)
    * [Video Lecture: Dapps with CKB workshop - Lecture 2: On-chain Scripts with Capsule (English)](https://www.youtube.com/watch?v=pbnVwVOaJg4)
    * [Video Lecture: Dapps with CKB workshop - Lecture 2: On-chain Scripts with Capsule (Chinese + English Subtitles)](https://youtu.be/NcN3NiBuJbo)
    * [Video Tutorial: Understanding the Token Sale Lock Script (English)](https://youtu.be/ysUbx4FAKlE)
* [Lumos](https://github.com/nervosnetwork/lumos) - A framework for server side Dapp development.
    * [Documentation](https://github.com/nervosnetwork/lumos)
    * [Tutorial: Intro to Lumos](https://docs.nervos.org/docs/labs/lumos-nervosdao)
    * [Video Lecture: Dapps with CKB Workshop - Lecture 3: Dapps with Lumos (Chinese + English Subtitles)](https://youtu.be/TJ2bnSFUpPQ)
    * [Video Lecture: Dapps with CKB Workshop - Lecture 4: Dapp Architecture with Lumos (English)](https://youtu.be/9U23hrzCAiM)
* [PW-Core](https://github.com/lay2dev/pw-core) - A framework for client side Dapp wallet support.
    * [Documentation](https://docs.lay2.dev/)
    * [Demo Project: Simplest Dapp](https://github.com/lay2dev/simplestdapp)
    * [Video Tutorial: PW-Core Programming Walkthrough (English)](https://www.youtube.com/watch?v=E2AYuRaeP9Q)
    * [Video Tutorial: PW-Core Programming Walkthrough (Chinese)](https://www.youtube.com/watch?v=NmMRM4PoE08)

### Available When You Need Them (Optional)

* [CKB Studio](https://www.obsidians.io/) - An development IDE with a built-in dev blockchain and transaction testing tool.
    * [Tutorials](https://medium.com/nervos-ckb-israel/collection-of-ckb-studio-tutorials-9ffd573894)
    * [Video Tutorial: How to Use CKB Studio](https://www.youtube.com/watch?v=lOxXrVIfT2Y)
* [Synapse Web Wallet](https://github.com/rebase-network/synapse-extension) - A Dapp wallet with support for multiple lock types.
    * [Documentation](https://github.com/rebase-network/synapse-extension/tree/master/docs)
    * [Demo Project: Simplest Dapp + Synapse](https://github.com/rebase-network/simplestdapp)

### Testnet Funds

When building on the Aggron Testnet, free testnet CKB can be obtained from this faucet.

* [Nervos Aggron Faucet](https://faucet.nervos.org/)

## Section 4: Sample Projects

View functioning example smart contract scripts and Dapps.

### Example Scripts

These are smart contract scripts written in C and Rust. For most developers we recommend building scripts in Rust.

* [Simple UDT Type Script (Rust + Capsule)](https://github.com/jjyr/my-sudt)
    * [Tutorial: Writing an SUDT in Capsule](https://docs.nervos.org/docs/labs/sudtbycapsule)
* [Simple UDT Type Script (C)](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/simple_udt.c)
* [Token Sale Lock Script (Rust + Capsule)](https://github.com/jordanmack/token-sale)
    * [Documentation](https://github.com/jordanmack/token-sale/blob/master/README.md)
    * [Video Tutorial: Understanding the Token Sale Lock Script (English)](https://youtu.be/ysUbx4FAKlE)
* [Anyone Can Pay Lock Script (C)](https://github.com/nervosnetwork/ckb-anyone-can-pay/blob/master/c/anyone_can_pay.c)
* [Open Transaction Lock Script (C)](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/open_transaction.c)
    * [Nervos Talk - Open Transaction Four Part](https://talk.nervos.org/t/open-tx-protocol-brainstorm-1-otx-in-general/4010)[Brainstorm](https://talk.nervos.org/t/open-tx-protocol-brainstorm-1-otx-in-general/4010)
* [Multi-Token Extensible NFT Type Script (Rust + Capsule)](https://github.com/jordanmack/nervos-ckb-nft)

### Example Dapps

These are fully functioning Dapps which were built using our recommended tooling.

* [Hello Lumos Dapp Template](https://github.com/tspoff/hello-lumos)
* [Token Playground (Lumos + PW-SDK)](https://github.com/tspoff/token-playground)
* [Simplest Dapp](https://github.com/lay2dev/simplestdapp)
* [Simplest Dapp + Synapse](https://github.com/rebase-network/simplestdapp)

## Section 5: Recommended Setup

Recommendations for setting up your development environment and which technologies to build your application with.

### Recommended Development Setup

These are the minimum software recommendations for any developer building on Nervos CKB.

* OS: MacOS, Ubuntu Linux, or Windows 10 + WSL2 (Ubuntu)
* IDE: [CKB Studio](https://www.obsidians.io/) or your favorite IDE! 😁
* [CKB Development Blockchain](https://docs.nervos.org/docs/basics/guides/devchain) - For testing smart contracts and Dapps.
* [Docker](https://docs.docker.com/get-docker/) - For smart contract development using Capsule.
* [NPM](https://www.npmjs.com/get-npm) or [Yarn](https://classic.yarnpkg.com/en/docs/install/) - For Dapp development using [Lumos](https://github.com/nervosnetwork/lumos) and [PW-SDK](https://github.com/lay2dev/pw-core).
* [Neuron Wallet](https://github.com/nervosnetwork/neuron/releases) or [Portal Wallet](https://ckb.pw/) - For managing Mainnet funds.

### Recommended Development Stack

These are the recommended software stacks for any team building on Nervos CKB. These selections are based on current industry trends and the tooling available today.

* Dapp Front-end: [React.js](https://reactjs.org/) + [PW-SDK](https://github.com/lay2dev/pw-core)
* Dapp Back-end: [Express.js +](https://expressjs.com/en/starter/installing.html)[Lumos](https://github.com/nervosnetwork/lumos)
* Dapp Wallet: [PW-SDK](https://github.com/lay2dev/pw-core) + [MetaMask](https://metamask.io/)
* Smart Contract Scripts: [Capsule](https://github.com/nervosnetwork/capsule)
