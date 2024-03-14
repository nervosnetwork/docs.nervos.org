---
id: create-custom-token
title: Create Custom Token
sidebar_position: 4
---

# Create Custom Token

```md
Estimated time: 2 – 5 min

What you’ll learn?

- How Custom Token Works On CKB
- Issuing Your Own Token
- View And Check Your Token Info & holders
```

## How Custom Token Works On CKB

Different from ERC20(Ethereum) and BRC20(Bitcoin), CKB uses a unique way to build custom tokens based on the UTXO-like Cell model.

In CKB, custom tokens are called User-Defined-Token, aka UDT. The core team of CKB has proposed a minimal standard for UDT called xUDT(extensible UDT). In this tutorial, we will use the pre-deployed smart contracts `xUDT script` to issue custom tokens.

The high-level workflow to issue a custom token with xUDT goes like this: when you issue a token, you just create a special cell that presents some balance of your token, like one piece of printed cash to the dollars.

For this special cell, its data field contains the amount number of the token and its type script is xUDT script where the args of that script will be the issuer's lock script hash.

This issuer's lock script hash works like the unique ID for the custom token. Different lock script hash means a different kind of token. it is also used as a checkpoint to tell that a transaction is triggered by the token issuer or a regular token holder to apply different security validation.

In reality, xUDT is more complicated and powerful with many features but the idea is the same, you can check the [full specs here](https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0052-extensible-udt/0052-extensible-udt.md).

## How To Issue Token

### Setup the devnet & run the example project

1. To begin, you'll need to install `@offckb/cli` to establish a local dev environment and initialize the project.

```sh
npm install -g @offckb/cli
```

2. Use Offckb to select the xUDT template to init the project to your local environment

```sh
offckb init <project-name>
? Select a dapp template (Use arrow keys)
  View and Transfer Balance
❯ Issue Token via XUDT scripts
a simple dapp to issue your own token via XUDT scripts
init CKB dapp project: /Users/ckb/Desktop/offckb/<project-name>
✨  Done in 2.52s.
```

3. Start devnet and run the app

- Open one terminal and start the devnet:

```sh
offckb node
```

- Open another terminal and check some pre-funded accounts, copy some private keys for later usage:

```sh
offckb accounts
```

- Install node dependencies and start the example app:

```sh
cd <project-name> && yarn && yarn start
```

Now, you can access the app via http://localhost:1234 to issue custom tokens.

### Breakdown: Issuing Custom Token

Open the `lib.ts` file in your project and check out the `IssueToken` function:

```ts
export async function issueToken(privKey: string, amount: string) {
  const xudtDeps = lumosConfig.SCRIPTS.XUDT;

  const { lockScript } = generateAccountFromPrivateKey(privKey);
  const xudtArgs = utils.computeScriptHash(lockScript) + '00000000';

  const typeScript = {
    codeHash: xudtDeps.CODE_HASH,
    hashType: xudtDeps.HASH_TYPE,
    args: xudtArgs,
  };
  ...
}
```

This function accepts two parameters one is a private key of the issuer and one is the amount of token. Noticed that we are trying to create an output cell whose type script is an xUDT script, and the args of this xUDT script is the issuer's lock script hash, that's why we have the following lines of code:

```ts
const { lockScript } = generateAccountFromPrivateKey(privKey);
const xudtArgs = utils.computeScriptHash(lockScript) + "00000000";
```

Also noticed the `00000000` here is just a placeholder, to unleash more power of the xUDT script, this placeholder can contain some specific data, but now we don't need to worry about this part.

Further down the function, you can see that the full target output cell of our custom token looks like this:

```ts
const targetOutput: Cell = {
  cellOutput: {
    capacity: "0x0",
    lock: lockScript,
    type: typeScript,
  },
  data: bytes.hexify(number.Uint128LE.pack(amount)),
};
```

noticed that the `data` field is the amount of the custom token.

Next, to complete our `issueToken` function, we just use the `helpers.TransactionSkeleton` to build the transaction with our desired output cells.

```ts
let txSkeleton = helpers.TransactionSkeleton();
txSkeleton = addCellDep(txSkeleton, {
  outPoint: {
    txHash: lockDeps.TX_HASH,
    index: lockDeps.INDEX,
  },
  depType: lockDeps.DEP_TYPE,
});
...
txSkeleton = txSkeleton.update('inputs', (inputs) => inputs.push(...collected));
  txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(targetOutput, changeOutput));

...
```

Lastly, we do the signing and witness data part, just like what we mentioned in the previous tutorial in the `transfer-balance` example:

```ts
// prepare witness data
/* 65-byte zeros in hex */
  const lockWitness =
    '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
  const outputTypeWitness = xudtWitnessType.pack({ extension_data: [] });
  const witnessArgs = blockchain.WitnessArgs.pack({ lock: lockWitness, outputType: outputTypeWitness });
  const witness = bytes.hexify(witnessArgs);
  txSkeleton = txSkeleton.update('witnesses', (witnesses) => witnesses.set(0, witness));

// signing
txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
const message = txSkeleton.get('signingEntries').get(0)?.message;
const Sig = hd.key.signRecoverable(message!, privKey);
const tx = helpers.sealTransaction(txSkeleton, [Sig]);

// submit transaction
const hash = await rpc.sendTransaction(tx, 'passthrough');
console.log('The transaction hash is', hash);
```

### View And Check Token Info & holders

Since we have issued a custom token, the next step will be checking out this token and viewing its holders. To do that, we write a `queryIssuedTokenCells` in the `lib.ts` file:

```ts
export async function queryIssuedTokenCells(xudtArgs: HexString) {
  const xudtDeps = lumosConfig.SCRIPTS.XUDT;
  const typeScript = {
    codeHash: xudtDeps.CODE_HASH,
    hashType: xudtDeps.HASH_TYPE,
    args: xudtArgs,
  };

  const collected: Cell[] = [];
  const collector = indexer.collector({ type: typeScript });
  for await (const cell of collector.collect()) {
    collected.push(cell);
  }
  return collected;
}
```

Noticed that to query a custom token cell, we have to know its xUDTArgs, as we explained in the high-level ideas for xUDT scripts, this xUDTArgs works like the unique ID for the token you issued.

So the `queryIssuedTokenCells` will accept only one parameter which is the xudtArgs. We then build a type script with this xudtArgs and use `indexer.collector({ type: typeScript });` to query the live cells that have such type script.

By finding out the lock scripts of these live cells, we can tell that those custom tokens now belong to the one who can unlock this lock script, therefore we know who are the token holders.

## Congratulations!

By following this tutorial this far, you have mastered how custom tokens work on CKB. Here's a quick recap:

- Create a CKB transaction containing a xUDT Cell in the outputs
- The data of the xUDT cell contains the amount number of the token
- Query the custom token cell by passing the lock script hash of the token issuer

## Additional resources

- xUDT specs: [RFC-0052-extensible-udt](https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0052-extensible-udt/0052-extensible-udt.md)
- sUDT specs: [RFC-0025-simple-udt](https://github.com/nervosnetwork/rfcs/blob/xudt/rfcs/0025-simple-udt/0025-simple-udt.md)
- CKB transaction structure: [RFC-0022-transaction-structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)
- CKB data structure basics: [RFC-0019-data-structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md)
