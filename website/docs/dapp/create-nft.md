---
id: create-nft
title: Create an NFT
sidebar_position: 6
---

# Create an on-chain digital object via Spore protocol

```md
Estimated time: 2 – 5 min

What you’ll learn?

- How Spore protocol works on CKB 
- Create a on-chain digital object with a picture via Spore-sdk
- Render the picture in browser from your digital object
```

## How Spore protocol works on CKB

Spore is an on-chain digital object(DOB) protocol backed by CKB. An "on-chain" asset refers to a digital asset whose data is directly encoded onto the blockchain. A spore cell can hold any type of assets users want to store on-chain, the following data structure is used in the spore cell:

```js
data:
    content-type: Bytes # String Bytes
    content: Bytes
    # OPTIONAL
    cluster_id: Bytes
type:
    hash_type: "data1"
    code_hash: SPORE_TYPE_DATA_HASH
    args: SPORE_ID
lock:
    <user_defined>
```

Noticed that the data field of the spore cell contains `content-type` and `content`, which allow users to turn any content form into a digital object. All the fields in a Spore Cell are immutable once created.

In this tutorial, we will build a simple Dapp to turn a picture on your computer into a digital object on the blockchain using the spore SDK.

## Setup the devnet & run the example project

1. To begin, you'll need to install `@offckb/cli` to establish a local dev environment and initialize the project.

```bash
npm install -g @offckb/cli
```

2. Use Offckb to select the `write-and-read-on-chain-message` template to init the project to your local environment

```bash
offckb init <project-name>
? Select a dapp template (Use arrow keys)
  View and Transfer Balance
  Issue Token via xUDT scripts
  Write and Read On-Chain Message
❯ Create an on-chain digital object via Spore scripts
a simple dapp to create an on-chain digital object with your picture via Spore protocol
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

Now, you can access the app via http://localhost:1234 to create on-chain digital object.

---

## Breakdown

Open the `lib.ts` file in your project, it lists all the important functions that do the most of work for the project.

### Create a digital object

Check out the `createSporeNFT` function:

```ts
export async function createSporeNFT(privkey: string, content: Uint8Array): Promise<{txHash: string, outputIndex: number}>
```

It accepts two parameters, one is the private key that is used to sign and create the digital object and one is the content of your picture that is stored in the digital object. 

The content can be any type of data that is serialized into a `Uint8Array`. Here we are dealing with images, so the content is the result of `FileReader.readAsArrayBuffer`. You can check out the following code recipe in `handleFileChange` function from the react frontend `index.tsx`:

```ts
const reader = new FileReader();
reader.onload = () => {
  // Access the file content here
  const content = reader.result;
  if (content && content instanceof ArrayBuffer) {
    const uint8Array = new Uint8Array(content);
    setFileContent(uint8Array);
  }
};
// Read the file as ArrayBuffer
reader.readAsArrayBuffer(files[0]);
```

Once we have the picture content and the private key, we will build a transaction that produces a spore output cell, aka the digital object cell. We can handle all the logic with Lumos.js, but with the help of Spore-SDK, it becomes very simple to do:

```ts
export async function createSporeNFT(privkey: string, content: Uint8Array): Promise<{txHash: string, outputIndex: number}> {
  const wallet = createDefaultLockWallet(privkey);

  const { txSkeleton, outputIndex } = await createSpore({
    data: {
      contentType: "image/jpeg",
      content,
    },
    toLock: wallet.lock,
    fromInfos: [wallet.address],
    config: SPORE_CONFIG,
  });

  const txHash = await wallet.signAndSendTransaction(txSkeleton);
  console.log(`Spore created at transaction: ${txHash}`);
  console.log(
    `Spore ID: ${
      txSkeleton.get("outputs").get(outputIndex)!.cellOutput.type!.args
    }`
  );
  return { txHash, outputIndex };
}
```

Noticed that the `createDefaultLockWallet` and `const txHash = await wallet.signAndSendTransaction(txSkeleton);` are just some methods that helps us to keep the code clean, all it does is the same as the previous tutorials involving signing and sending transactions.

### Render content from the digital object

Once we created our digital object on-chain, what we love to do is to render and show this digital object. To do this, we need to first find the spore cell of our digital object and extract the data from the spore cell and decode the content from the data to render it in the browser.

Check out the `showSporeContent` function:

```ts
export async function showSporeContent(txHash: string, index = 0) {
  const indexHex = "0x" + index.toString(16);
  const { cell } = await rpc.getLiveCell({ txHash, index: indexHex }, true);
  if (cell == null) {
    return alert("cell not found, please retry later");
  }
  const data = cell.data.content;
  const msg = unpackToRawSporeData(data);
  console.log("spore data: ", msg);
  return msg;
}
```

We locate the spore cell by accepting a outpoint parameter(`txHash` and `outputIndex`), and use `rpc.getLiveCell` to get the live cell. Then we unpack the data content from this cell:

```ts
const data = cell.data.content;
const msg = unpackToRawSporeData(data);
```

To render the image from this raw data, check out the `renderSpore` function in the `index.tsx`:

```ts
const renderSpore = async () => {
  const res = await showSporeContent(txHash, outputIndex);
  if (!res) return;
  setRawSporeData(res);
  // Create Blob from binary data
  const buffer = hexStringToUint8Array(res.content.toString().slice(2));
  const blob = new Blob([buffer], { type: res.contentType });
  const url = URL.createObjectURL(blob);
  setImageURL(url);
};

...
{imageURL && <img src={imageURL} />}
```

## Congratulations!

By following this tutorial this far, you have mastered how digital-object works on CKB. Here's a quick recap:

- How Spore protocol works on CKB
- Create an on-chain digital object with a picture via Spore-sdk
- Render the picture in the browser from your digital object

## Additional resources

- Spore protocol: [docs.spore.pro](https://docs.spore.pro/)
- CKB transaction structure: [RFC-0022-transaction-structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)
- CKB data structure basics: [RFC-0019-data-structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-data-structures/0019-data-structures.md)
