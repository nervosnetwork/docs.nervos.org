# Mission: Inscribing "Hello Common Knowledge Base!" on CKB

Welcome, brave coder! Your mission, should you choose to accept it, involves inscribing the message `"Hello Common Knowledge Base!"` into a [cell](https://docs.nervos.org/docs/reference/cell/) on the CKB testnet using the mighty [Lumos](https://github.com/ckb-js/lumos), a powerful JavaScript/TypeScript library crafted specifically for Nervos CKB. Once you've accomplished your mission, you'll uncover and verify the message on the [CKB explorer](https://explorer.nervos.org/).

## Pre-mission Training

Before embarking on your mission, it's beneficial to familiarize yourself with:

- [Nervos CKB](https://ckbacademy.vercel.app/courses/basic-theory)
- [TypeScript](https://www.typescriptlang.org/)

However, if you're a rookie, fear not! This mission is designed to equip you with the necessary skills, step by step.

## Only 3 Steps

Although some of the complexity is wrapped up, intuitively writing "Hello Common Knowledge Base!" into a cell on CKB testnet is really just `three steps`:

https://github.com/Flouse/ckb-tthw/blob/42bf1b5a3566e2d8adf6ef79aad8580de0d79281/js/index.ts#L125-L136

### Talk is cheap. Run the code.

```bash
git clone https://github.com/Flouse/ckb-tthw.git
cd ckb-tthw/js

# Install dependences such as @ckb-lumos, etc.
npm install

# Let's run it.
npm run start
# Result
# Transaction 0x39d6d7b6129b7e418c9ea6a353a5d85eb69f9ee5b4c7c43223fe0fad2b0e6200 sent.
# See https://pudge.explorer.nervos.org/transaction/0x39d6d7b6129b7e418c9ea6a353a5d85eb69f9ee5b4c7c43223fe0fad2b0e6200
```
<!-- TODO: add result image -->
Would you like to change `onChainMemo` string and re-run it again?

## Show me the code
Let's dive into two functions that take up most of the code space. The [code and comments](./index.ts) are quite self-explained.

### Function `constructHelloWorldTx`
This function creates a new transaction that adds a cell with the proposed on-chain message.

1. Create a transaction skeleton that serves as a blueprint for the final transaction.
2. Define the output cell, which includes the capacity and lock script, and add it to the transaction skeleton, which is a mutable data structure used to construct a CKB transaction incrementally.
3. Modify the transaction skeleton to include the necessary capacity to cover the output cell by injecting enough input cells.
4. Pay the transaction fee by `payFeeByFeeRate` function, again, provided by Lumos.

### Function `signAndSendTx`
This function is self-explanatory:
1. Sign the transaction skeleton using a test private key.
2. Send the signed transaction to CKB testnet.

## Check the message on CKB explorer
![Check the message on CKB explorer](https://user-images.githubusercontent.com/1297478/236855817-af2158b4-22f9-4321-b9c6-7b00b474bda9.png)
The cell data is the hexadecimal format of "Hello Common Knowledge Base!".

You might want to uncover your message on CKB Explorer by
1. Go to your output [URL](https://pudge.explorer.nervos.org/transaction/0x39d6d7b6129b7e418c9ea6a353a5d85eb69f9ee5b4c7c43223fe0fad2b0e6200)
2. Click on Cell Info of Output#0, then go to the `Data tab`
3. Copy the number string after `0x`
4. Paste it into [CypherChef's magic tool](https://gchq.github.io/CyberChef/#recipe=From_Hex('None')&input=NDg2NTZjNmM2ZjIwNDM2ZjZkNmQ2ZjZlMjA0YjZlNmY3NzZjNjU2NDY3NjUyMDQyNjE3MzY1MjE) to decode.


## Conclusion
In this tutorial, you learned how to write a message into a cell on CKB testnet using Lumos. You also learned how to check the transaction on CKB explorer. Lumos provides a set of helper functions that make it easy to interact with the CKB blockchain. With Lumos, you can easily create, sign, and send transactions to the CKB blockchain.

## References
- [CKB basic theoretical knowledge](https://ckbacademy.vercel.app/courses/basic-theory)
- [CKB basic practical operation](https://ckbacademy.vercel.app/courses/basic-operation)
- [Lumos Examples](https://github.com/ckb-js/lumos/blob/develop/examples)
  - Preview and interact with `simple transfer` code online through [codesandbox](https://codesandbox.io).
    https://codesandbox.io/s/github/ckb-js/lumos/tree/develop/examples/secp256k1-transfer?file=/lib.ts
  - etc.
