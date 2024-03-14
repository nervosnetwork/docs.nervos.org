---
id: write-and-read-on-chain-message
title: Write & Read On-Chain Message
sidebar_position: 3
---

# Write & Read On-Chain Message

```md
Estimated time: 2 – 5 min

What you’ll learn?

- How to store data on cell 
- Write a text message on a cell
- Read the text message from cell
```

## How to store & retrieve data from a Cell

In this tutorial, you'll learn how to tuck a nifty message - "**Hello CKB!**" - into a [cell](https://docs.nervos.org/docs/reference/cell/) on the CKB testnet. Imagine it as sending a message in a bottle, but the ocean is digital, and the bottle is a super secure, tamper-proof CKB cell!

Once your words are encoded and inscribed into the blockchain, we'll show you how to decode them with the same cell.

## Setup the devnet & run the example project

1. To begin, you'll need to install `@offckb/cli` to establish a local dev environment and initialize the project.

```bash
npm install -g @offckb/cli
```

2. Use Offckb to select the transfer template to init the project to your local environment

```bash
offckb init <project-name>
? Select a dapp template (Use arrow keys)
❯ View and Transfer Balance
  Issue Token via XUDT scripts
a simple dapp to issue your own token via XUDT scripts
init CKB dapp project: /Users/ckb/Desktop/offckb/<project-name>
✨  Done in 2.52s.
```

3. Start devnet and run the app

- Open one terminal and start the devnet:

```bash
offckb node
```

- Open another terminal and check some pre-funded accounts, copy some private keys for later usage:

```bash
offckb accounts
```

- Install node dependencies and start the example app:

```bash
cd <project-name> && yarn && yarn start
```

Now, you can access the app via http://localhost:1234 to inscribe the message.

---

## Behind the Scene

The [program](https://github.com/cryptape/ckb-tutorial/blob/main/js/index.ts) inscribes "Hello CKB!" into a cell on the CKB testnet in [3 steps](https://github.com/cryptape/ckb-tutorial/blob/2c5e4cfae3d7301b4c1d488446cf440c0436b629/js/index.ts#L146-L154):

```javascript
file:index.ts
// Step 1: this is the message that will be written on chain
const onChainMemo: string = "Hello CKB!";

// Step 2: construct the transaction
let txSkeleton = await constructHelloWorldTx(onChainMemo);

// Step 3: sign and send the transaction
const txHash = await signAndSendTx(txSkeleton, testPrivKey);
console.log(`Transaction ${txHash} sent.\n`)

// Done, let’s see the transaction in CKB Testnet Explorer
console.log(`See ${CKB_TESTNET_EXPLORER}/transaction/${txHash}`);
```

That's it - three easy steps to making your mark on the blockchain.

---

## Bonus Round

Feeling adventurous?

You can access and edit the [code file](https://github.com/Flouse/ckb-tthw/blob/42bf1b5a3566e2d8adf6ef79aad8580de0d79281/js/index.ts#L125-L136) in your terminal using:

```bash
vi index.ts
```

Try changing the **onChainMemo** string to a different message and run it again! Go ahead, make the blockchain your own personal diary, but remember - whatever happens on the blockchain, stays on the blockchain!

---

## Want to dive deeper into the code?

Let's take a closer look at two functions that constitute the majority of [our code](https://github.com/Flouse/ckb-tthw/blob/42bf1b5a3566e2d8adf6ef79aad8580de0d79281/js/index.ts): **constructHelloWorldTx** and **signAndSendTx**.

### Function <span className="tutorial-font-green">constructHelloWorldTx</span>

Creates a new transaction that includes a cell with the specified on-chain message. Here's the sequence of actions it performs:

### Function <span className="tutorial-font-green">signAndSendTx</span>

Performs two main actions:

---

## Wrap-up

Congratulations! You've just mastered the art of inscribing messages into a cell on the CKB testnet using Lumos and how to verify your transaction on the CKB explorer. Lumos offers a suite of helper functions that simplify interactions with the CKB blockchain, making it easy to create, sign, and send transactions.

And that's a wrap! You're now officially a blockchain scribe.

#### Last modified on Jun 6, 2023

---
