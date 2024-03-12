---
id: view-and-transfer-balance
title: View & Transfer Balance
sidebar_position: 2
---

# View And Transfer Balance

```md
Estimated time: 2 – 5 min

What you’ll learn?

- How to transfer CKB from one account to another
- Basic transaction structure
- How to sign a transaction
```

## How to transfer CKB from one account to another

If you're already familiar with CKB, you'll know that a transaction includes the inputs of your transaction, the outputs, and the Witness. The inputs contain the account's balance, outputs contain the balance transferred and the change, and the witness is a data structure that stores the transaction proof.

Assuming we have Alice's private key, we need to generate the account's public key and address. Here, we need to use the `BLAKE160` hashing algorithm to convert a hash value. Next, we need to construct a lock script. Here, we use the standard lock script template combining the SECP256K1 signing algorithm with the BLAKE160 hashing algorithm. Different templates will yield different addresses when encoding the address, corresponding to different assets.

```ts
const pubKey = hd.key.privateToPublic(privateKey);
const args = hd.key.publicKeyToBlake160(pubKey);
const template = CONFIG.SCRIPTS["SECP256K1_BLAKE160"]!;
const lockScript: Script = {
    codeHash: template.CODE_HASH,
    hashType: template.HASH_TYPE,
    args: args,
};
const address = helpers.encodeToAddress(lockScript, { config: CONFIG });
```

We need to get the identity information `Lock Script` of the transferring and receiving accounts. The config mentioned later is the template used to obtain the `Lock Script`.

```ts
const fromScript = helpers.parseAddress(fromAddress, { config: AGGRON4 });
const toScript = helpers.parseAddress(toAddress, { config: AGGRON4 });
```

Next, we need to handle the unit of CKB. In Nervos CKB, Shannon is the smallest currency unit, with 1 CKB equaling 10^8 Shannon. This unit system is similar to Bitcoin's Satoshis, where 1 Bitcoin = 10^8 Satoshis. When you need to convert between CKB and Shannon, you're dealing with a multiplication or division problem of 10^8.

```ts
//CKB To Shannon
function ckbToShannon(ckbAmount) {
  return ckbAmount * 1e8;
}

//Shannon to CKB
function shannonToCkb(shannonAmount) {
  return shannonAmount / 1e8;
}
```

Next, we need to build the transaction. The first step is to create an empty `txSkeleton`
```ts
let txSkeleton = helpers.TransactionSkeleton({});
```

Determine the total fees required for our transaction (Transaction Amount + Transaction Fee)

```ts
const neededCapacity = BI.from(options.amount).add(100000);
```

Retrieve the account's assets from RPC and create the transaction's Inputs

```ts
let collectedSum = BI.from(0);
const collected: Cell[] = [];
const collector = indexer.collector({ lock: fromScript, type: "empty" });
for await (const cell of collector.collect()) {
    collectedSum = collectedSum.add(cell.cellOutput.capacity);
    collected.push(cell);
    if (collectedSum >= neededCapacity) break;
}
```

Create the transaction's outputs. `transferOutpu`t is generated based on the amount the user wishes to transfer, and `changeOutput` is the change after the transaction.

```ts
const transferOutput: Cell = {
    cellOutput: {
        capacity: BI.from(options.amount).toHexString(),
        lock: toScript,
    },
    data: "0x",
};

const changeOutput: Cell = {
    cellOutput: {
        capacity: collectedSum.sub(neededCapacity).toHexString(),
        lock: fromScript,
    },
    data: "0x",
};
```

Then, we need to add Inputs and Outputs to the created `txSkeleton`. Also added are `Cell Deps`, which contain an output point pointing to cells of a cell outpoint, used like deps. Dep cells are related to the transfer and can be used to place code that will be loaded into the CKB VM or to place data that can be used for script execution. [Detailed explanation](https://something)

```ts
txSkeleton = txSkeleton.update("inputs", (inputs) => inputs.push(...collected));
txSkeleton = txSkeleton.update("outputs", (outputs) => outputs.push(transferOutput, changeOutput));
txSkeleton = txSkeleton.update("cellDeps", (cellDeps) =>
cellDeps.push({
        outPoint: {
            txHash: AGGRON4.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
            index: AGGRON4.SCRIPTS.SECP256K1_BLAKE160.INDEX,
        },
        depType: AGGRON4.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
    })
);
```

Next, update specific witness data in the transaction. It first finds the index of the first input (input) that matches the fromScript lock script. If a matching input is found, the code ensures the corresponding witness list is long enough, expanding the list with empty strings ("0x") if necessary. Then, it constructs a new witness parameter object (newWitnessArgs), mainly setting a 65-byte all-zero lock field for signing.

```ts
const firstIndex = txSkeleton
.get("inputs")
.findIndex((input) =>
    bytes.equal(blockchain.Script.pack(input.cellOutput.lock), blockchain.Script.pack(fromScript))
);
if (firstIndex !== -1) {
    while (firstIndex >= txSkeleton.get("witnesses").size) {
        txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.push("0x"));
    }
    let witness: string = txSkeleton.get("witnesses").get(firstIndex)!;
    const newWitnessArgs: WitnessArgs = {
        /* 65-byte zeros in hex */
        lock: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    };
    if (witness !== "0x") {
        const witnessArgs = blockchain.WitnessArgs.unpack(bytes.bytify(witness));
        const lock = witnessArgs.lock;
        if (!!lock && !!newWitnessArgs.lock && !bytes.equal(lock, newWitnessArgs.lock)) {
        throw new Error("Lock field in first witness is set aside for signature!");
        }
        const inputType = witnessArgs.inputType;
        if (!!inputType) {
        newWitnessArgs.inputType = inputType;
        }
        const outputType = witnessArgs.outputType;
        if (!!outputType) {
        newWitnessArgs.outputType = outputType;
        }
    }
    witness = bytes.hexify(blockchain.WitnessArgs.pack(newWitnessArgs));
    txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.set(firstIndex, witness));
}
```

Next, we create a Sign Message

- Generate signingEntries based on the transaction's Inputs and Outputs
- Retrieve the signature message
- Use the private key to sign the message recoverably, including the signature information and necessary metadata for subsequent signature verification processes

```ts
txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
const message = txSkeleton.get("signingEntries").get(0)?.message;
const Sig = hd.key.signRecoverable(message!, options.privKey);

```

Combine `txSkeleton` and the just-generated Sign Message into a transaction that can be broadcast on Nervos CKB

```ts
const tx = helpers.sealTransaction(txSkeleton, [Sig]);
```

Send the transaction

```ts
const hash = await rpc.sendTransaction(tx, "passthrough");
```

You can go to the `complete transaction` to confirm the process.[Full Transaction](https://explorer.nervos.org/transaction/0xada1ae693138bec933a17d249e9fa605f6fe5cdf8ae1f4126171f4eeed960c4a)
