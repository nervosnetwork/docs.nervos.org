---
title: "Introduction to CKB Script Programming 3: UDT"
date: "2019-09-06"
slug: intro-to-ckb-script-programming-3
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

CKB's cell model and VM enables many new use cases. However that doesn't mean we need to ditch existing ones. One common use in existing blockchains, is to issue new tokens with special purpose/meaning from the token issuer. In Ethereum, we call those ERC20 tokens, let's see how we can build a similar concept in CKB. To distinguish from ERC20, we call the tokens issued in CKB `user defined token`, or UDT for short.

This post is written based on current CKB Lina mainnet version now.

# Data Model

While Ethereum has a unique storage space for each contract account, CKB spreads data among multiple cells. A cell's lock & type script then tells which account the cell belongs to, as well as how you can interact with the cell. The consequence of this, is that unlike ERC20 which stores all token users' balances in the ERC20 contract's storage space, in CKB we will need a new design to store the balances of UDT users.

We could, of course, designate a special cell to keep the balances of all UDT users. This solution would look a lot like Ethereum's ERC20 design. But several problems arise:

- The token issuer would have to provide storage space for keeping all the users' balances. As the number of user grows, the storage space would also grow, in CKB's economic model, this won't be an effective design.
- Consider that updating a cell in CKB is essentially destroying the old cell and re-create a new one, having a single cell with all balances would create a bottleneck: every action which needs to update UDT balance would have to update the one and only cell. People will compete on using the cell.

While there are solutions which can mitigate or even solve the above problems, we started to question the basic design here: does it really make sense to keep all UDTs in a single place? Once transferred, the UDTs really should belong to the receiver, why should the balance still be kept in a central place?

That leads to our proposed design here:

1. A special type script denotes that the cell stores UDTs.
2. The first 4 bytes of the cell data contains the amount of UDTs in current cell.

This design has several implications:

- The storage cost for a UDT cell is always constant, it is irrelevant to the amount of UDTs stored in the cell.
- A user can transfer either all or part of the UDTs in a cell to others
- In practice, there might be numerous cells containing the same UDTs.
- The lock script used to guard a UDT is decoupled from the UDT itself.

Each token user then keeps their UDTs in their own cells. They are responsible for providing the storage space for the UDTs, and ensure their own tokens are secure. This way UDTs can truly belong to each individual UDT user.

One question remains here: if tokens are stored in numerous cells belonging to each user instead of a single place, how can we ensure the tokens are indeed created by token issuer? What if someone forges tokens on their own? In Ethereum, this is probably a problem, but as we shall see in this post, a type script in CKB can prevent all those attacks, ensuring your token is safe.

# Writing the UDT Script

Given the above design, a minimal UDT type script should guard the following rules:

- In a UDT transfer transaction, the sum of UDTs in the output cells should equal the sum of UDTs in the input cells.
- Only the token issuer can generate new tokens in the initial token creation process.

This might sound a little ambitious, but we will see that with a type script and some CKB's unique design patterns, the eagle can be landed :P

For simplicity, we will write the UDT script here in pure JavaScript, while a C version might help in saving cycles, the functionality will be the same.

First, we will need to loop through all input cells and gather the sum of UDTs:

```
diff --git a/udt.js b/udt.js
index e69de29..4a20bd0 100644
--- a/udt.js
+++ b/udt.js
@@ -0,0 +1,17 @@
+var input_index = 0;
+var input_coins = 0;
+var buffer = new ArrayBuffer(4);
+var ret = CKB.CODE.INDEX_OUT_OF_BOUND;
+
+while (true) {
+  ret = CKB.raw_load_cell_data(buffer, 0, input_index, CKB.SOURCE.GROUP_INPUT);
+  if (ret === CKB.CODE.INDEX_OUT_OF_BOUND) {
+    break;
+  }
+  if (ret !== 4) {
+    throw "Invalid input cell!";
+  }
+  var view = new DataView(buffer);
+  input_coins += view.getUint32(0, true);
+  input_index += 1;
+}
```

As explained in the previous post, CKB requires us to use a loop to iterate through all inputs in the same `group` and fetch the data. In C we would use `ckb_load_cell_data`, which is wrapped into a JS function `CKB.raw_load_cell_data`. As indicated by the ArrayBuffer, we are only interested in the first 4 bytes of the cell data, since those 4 bytes will contain the amount of UDTs.

Note that here we perform a simple add operation on `input_coins`, this is very dangerous. We are doing it just for simplicity, in a production setting, you should check if the value will hold in a 32-bit integer value. Higher precision number types should be used if needed.

Similarly, we can fetch the sum of output coins and do the comparision:

```
diff --git a/udt.js b/udt.js
index 4a20bd0..e02b993 100644
--- a/udt.js
+++ b/udt.js
@@ -15,3 +15,23 @@ while (true) {
   input_coins += view.getUint32(0);
   input_index += 1;
 }
+
+var output_index = 0;
+var output_coins = 0;
+
+while (true) {
+  ret = CKB.raw_load_cell_data(buffer, 0, output_index, CKB.SOURCE.GROUP_OUTPUT);
+  if (ret === CKB.CODE.INDEX_OUT_OF_BOUND) {
+    break;
+  }
+  if (ret !== 4) {
+    throw "Invalid output cell!";
+  }
+  var view = new DataView(buffer);
+  output_coins += view.getUint32(0, true);
+  output_index += 1;
+}
+
+if (input_coins !== output_coins) {
+  throw "Input coins do not equal output coins!";
+}
```

This is almost all we need to validate the first rule: the sum of UDTs in the output cells should equal the sum of UDTs in the input cells. In other words, with this type script now, no one will be able to forge new tokens. Isn't that wonderful?

But there's one quirk: when we say `no one` will be able to forge new tokens, we really mean `no one`, including the token issuer! This is no good, we need to add an exception so the token issuer can create the tokens first, but no one will be able to do that after. Is there a way to do that?

Yes there is! But the answer reads like a riddle, so please read this paragraph carefully if I lost you the first time: a type script consist of 2 parts: a code hash denoting the actual code, and args used by the type script. 2 type scripts with different args will be treated 2 different type scripts. The trick here, is to allow the token issuer to create a cell with a new type script, that no one will be able to create again, so if we put something in the args part that is not be able to included again, the problem will be solved.

Now think about this problem: what cannot be included in a blockchain twice? An OutPoint in a transaction input! The first time we include an OutPoint as a transaction input, the referenced cell will be consumed, if someone later include it again, it will create a double-spending error, which is exactly what we use blockchain for.

And we have the answer now! The full validation flow of a minimal UDT type script in CKB, is as follows:

1. First gather the sum of all UDTs in the input cells and the sum of all UDTs in the output cells, if they are equaled, the type script exits with a success status.
2. Check if the first argument of the type script matches the first OutPoint in current transaction, if they match, exit with a success status.
3. Otherwise exit with a failure status

If you are still with me here, you will see that step 1 corresponds to a normal UDT transfer, while step 2 corresponds to the initial token creation process.

This is what we mean by CKB's unique design pattern: by using an input OutPoint as a script argument, we can create a unique script that cannot be forged again:

1. If an attacker tries to use the same argument, the script will validate that the first input OutPoint in the transaction does not match the argument, hence invalidates the transaction;
2. If the attacker tries to use the same argument and fill in the argument as the first input OutPoint, it will create a double-spent error, also invalidates the transaction;
3. If the attacker tries to use a different argument, CKB will recognize that the different argument leads to a different type script, hence generating a different UDT.

This simple yet powerful pattern thus ensures the UDTs stay safe while enjoying the benefits that they can be transferred freely among many different cells. To the best of our knowledge, this pattern is not possible yet in many other blockchains which claim to be `flexible` or `programmable`.

Now we can finally complete the UDT script:

```bash
diff --git a/contract.js b/contract.js
deleted file mode 100644
index e69de29..0000000
diff --git a/udt.js b/udt.js
index e02b993..cd443bf 100644
--- a/udt.js
+++ b/udt.js
@@ -1,3 +1,7 @@
+if (CKB.ARGV.length !== 1) {
+  throw "Requires only one argument!";
+}
+
 var input_index = 0;
 var input_coins = 0;
 var buffer = new ArrayBuffer(4);
@@ -33,5 +37,17 @@ while (true) {
 }

 if (input_coins !== output_coins) {
-  throw "Input coins do not equal output coins!";
+  if (!((input_index === 0) && (output_index === 1))) {
+    throw "Invalid token issuing mode!";
+  }
+  var first_input = CKB.load_input(0, 0, CKB.SOURCE.INPUT);
+  if (typeof first_input === "number") {
+    throw "Cannot fetch the first input";
+  }
+  var hex_input_outpoint = Array.prototype.map
+   .call(new Uint8Array(first_input), function (x) {
+     return ("00" + x.toString(16)).slice(-2);
+   })
+   .join("")
+   .slice(16); // remove the first 8 bytes of since
+  var outpoint_arg = new TextDecoder().decode(CKB.ARGV[0]);
+  if (outpoint_arg != hex_input_outpoint) {
+    throw "Invalid creation argument!";
+  }
 }
```

And that's it, with 53 lines of code or 1372 bytes, we've completed a minimal UDT type script in CKB. Notice I don't even use a minimizer here, with any decent JS minimizer, we should be able to get a much more compact type script. Of course this is a production ready script, but it suffices to show a simple script is enough to handle important tasks in CKB.

# Deploying to CKB

I'm not like [some other organizations](https://hacks.mozilla.org/2019/09/debugging-webassembly-outside-of-the-browser/) who prefer to only show you a video and a provocative post which hide how they did it and the accompanying problems. I believe no post is fun without actual code and steps to play with it. And here's how you can use the above UDT script on CKB:

In case you might need it, here's the full UDT script without diff format:

```bash
$ cat udt.js
if (CKB.ARGV.length !== 1) {
  throw "Requires only one argument!";
}

var input_index = 0;
var input_coins = 0;
var buffer = new ArrayBuffer(4);
var ret = CKB.CODE.INDEX_OUT_OF_BOUND;

while (true) {
  ret = CKB.raw_load_cell_data(buffer, 0, input_index, CKB.SOURCE.GROUP_INPUT);
  if (ret === CKB.CODE.INDEX_OUT_OF_BOUND) {
    break;
  }
  if (ret !== 4) {
    throw "Invalid input cell!";
  }
  var view = new DataView(buffer);
  input_coins += view.getUint32(0, true);
  input_index += 1;
}

var output_index = 0;
var output_coins = 0;

while (true) {
  ret = CKB.raw_load_cell_data(buffer, 0, output_index, CKB.SOURCE.GROUP_OUTPUT);
  if (ret === CKB.CODE.INDEX_OUT_OF_BOUND) {
    break;
  }
  if (ret !== 4) {
    throw "Invalid output cell!";
  }
  var view = new DataView(buffer);
  output_coins += view.getUint32(0, true);
  output_index += 1;
}

if (input_coins !== output_coins) {
  if (!((input_index === 0) && (output_index === 1))) {
    throw "Invalid token issuing mode!";
  }
  var first_input = CKB.load_input(0, 0, CKB.SOURCE.INPUT);
  if (typeof first_input === "number") {
    throw "Cannot fetch the first input";
  }
  var hex_input_outpoint = Array.prototype.map
    .call(new Uint8Array(first_input), function (x) {
      return ("00" + x.toString(16)).slice(-2);
    })
    .join("")
    .slice(16); // remove the first 8 bytes of since
  var outpoint_arg = new TextDecoder().decode(CKB.ARGV[0]);
  if (outpoint_arg != hex_input_outpoint) {
    throw "Invalid creation argument!";
  }
}
```

In order to run JavaScript, let's first deploy duktape on CKB:

```js
> const fs = require("fs");
> const data = fs.readFileSync("../ckb-duktape/build/duktape");
> data.byteLength
291440
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = await lumos.commons.common.transfer(txSkeleton, [wallet.address], wallet2.address, "292000" + "00000000");
> txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.data = "0x" + data.toString("hex");
  return outputs;
});
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton, [wallet.address], 1000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> const signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet.privkey)).toArray();
> const signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> const duktapeTxHash = await rpc.sendTransaction(signedTx)
> const duktapeCodeHash = lumos.utils.ckbHash(bytes.bytify("0x" + data.toString("hex")));
```

First, let's create a UDT with 1000000 tokens

```js
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = await lumos.commons.common.transfer(txSkeleton, [wallet.address], wallet2.address, "1820" + "00000000");
> const blockchain = require("@ckb-lumos/base").blockchain;
> const outPointBuf = blockchain.OutPoint.pack(txSkeleton.get("inputs").first().outPoint);
> const outPointHex = Buffer.from(outPointBuf).toString("hex");
> outPointHex
6a5f904a6f6ec270b6dde3add221aa8a82120e2e98ea6dac59160dd09359084201000000
```

`outPointHex` is part of the args in the Script, we will use a small tool to build the whole js Script args:

```bash
cd ckb-duktape
docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
root@0d31cad7a539:~# cd /code
root@0d31cad7a539:/code# ./build/native_args_assembler -f udt.js -t 6a5f904a6f6ec270b6dde3add221aa8a82120e2e98ea6dac59160dd09359084201000000
b50600000c00000061060000000000004d06000069662028434b422e415247562e6c656e67746820213d3d203129207b0a20207468726f7720225265717569726573206f6e6c79206f6e6520617267756d656e7421223b0a7d0a0a76617220696e7075745f696e646578203d20303b0a76617220696e7075745f636f696e73203d20303b0a76617220627566666572203d206e65772041727261794275666665722834293b0a76617220726574203d20434b422e434f44452e494e4445585f4f55545f4f465f424f554e443b0a0a7768696c6520287472756529207b0a2020726574203d20434b422e7261775f6c6f61645f63656c6c5f64617461286275666665722c20302c20696e7075745f696e6465782c20434b422e534f555243452e47524f55505f494e505554293b0a202069662028726574203d3d3d20434b422e434f44452e494e4445585f4f55545f4f465f424f554e4429207b0a20202020627265616b3b0a20207d0a20206966202872657420213d3d203429207b0a202020207468726f772022496e76616c696420696e7075742063656c6c21223b0a20207d0a20207661722076696577203d206e657720446174615669657728627566666572293b0a2020696e7075745f636f696e73202b3d20766965772e67657455696e74333228302c2074727565293b0a2020696e7075745f696e646578202b3d20313b0a7d0a0a766172206f75747075745f696e646578203d20303b0a766172206f75747075745f636f696e73203d20303b0a0a7768696c6520287472756529207b0a2020726574203d20434b422e7261775f6c6f61645f63656c6c5f64617461280a202020206275666665722c0a20202020302c0a202020206f75747075745f696e6465782c0a20202020434b422e534f555243452e47524f55505f4f55545055540a2020293b0a202069662028726574203d3d3d20434b422e434f44452e494e4445585f4f55545f4f465f424f554e4429207b0a20202020627265616b3b0a20207d0a20206966202872657420213d3d203429207b0a20202020434b422e646562756728726574293b0a202020207468726f772022496e76616c6964206f75747075742063656c6c21223b0a20207d0a20207661722076696577203d206e657720446174615669657728627566666572293b0a20206f75747075745f636f696e73202b3d20766965772e67657455696e74333228302c2074727565293b0a20206f75747075745f696e646578202b3d20313b0a7d0a0a69662028696e7075745f636f696e7320213d3d206f75747075745f636f696e7329207b0a2020696620282128696e7075745f696e646578203d3d3d2030202626206f75747075745f696e646578203d3d3d20312929207b0a202020207468726f772022496e76616c696420746f6b656e2069737375696e67206d6f646521223b0a20207d0a20207661722066697273745f696e707574203d20434b422e6c6f61645f696e70757428302c20302c20434b422e534f555243452e494e505554293b0a202069662028747970656f662066697273745f696e707574203d3d3d20226e756d6265722229207b0a202020207468726f77202243616e6e6f742066657463682074686520666972737420696e707574223b0a20207d0a2020766172206865785f696e7075745f6f7574706f696e74203d2041727261792e70726f746f747970652e6d61700a202020202e63616c6c286e65772055696e743841727261792866697273745f696e707574292c2066756e6374696f6e20287829207b0a20202020202072657475726e202822303022202b20782e746f537472696e6728313629292e736c696365282d32293b0a202020207d290a202020202e6a6f696e282222290a202020202e736c696365283136293b202f2f2072656d6f7665207468652066697273742038206279746573206f662073696e63650a2020766172206f7574706f696e745f617267203d206e657720546578744465636f64657228292e6465636f646528434b422e415247565b305d293b0a2020696620286f7574706f696e745f61726720213d206865785f696e7075745f6f7574706f696e7429207b0a20202020434b422e6465627567286f7574706f696e745f617267290a20202020434b422e6465627567286865785f696e7075745f6f7574706f696e74290a202020207468726f772022496e76616c6964206372656174696f6e20617267756d656e7421223b0a20207d0a7d0a540000000800000048000000366135663930346136663665633237306236646465336164643232316161386138323132306532653938656136646163353931363064643039333539303834323031303030303030
```

Copy this args to the Script args:

```js
> let duktapeUdtTypeScript = {
    codeHash: duktapeCodeHash,
    hashType: "data",
    args: "0xb50600000c00000061060000000000004d06000069662028434b422e415247562e6c656e67746820213d3d203129207b0a20207468726f7720225265717569726573206f6e6c79206f6e6520617267756d656e7421223b0a7d0a0a76617220696e7075745f696e646578203d20303b0a76617220696e7075745f636f696e73203d20303b0a76617220627566666572203d206e65772041727261794275666665722834293b0a76617220726574203d20434b422e434f44452e494e4445585f4f55545f4f465f424f554e443b0a0a7768696c6520287472756529207b0a2020726574203d20434b422e7261775f6c6f61645f63656c6c5f64617461286275666665722c20302c20696e7075745f696e6465782c20434b422e534f555243452e47524f55505f494e505554293b0a202069662028726574203d3d3d20434b422e434f44452e494e4445585f4f55545f4f465f424f554e4429207b0a20202020627265616b3b0a20207d0a20206966202872657420213d3d203429207b0a202020207468726f772022496e76616c696420696e7075742063656c6c21223b0a20207d0a20207661722076696577203d206e657720446174615669657728627566666572293b0a2020696e7075745f636f696e73202b3d20766965772e67657455696e74333228302c2074727565293b0a2020696e7075745f696e646578202b3d20313b0a7d0a0a766172206f75747075745f696e646578203d20303b0a766172206f75747075745f636f696e73203d20303b0a0a7768696c6520287472756529207b0a2020726574203d20434b422e7261775f6c6f61645f63656c6c5f64617461280a202020206275666665722c0a20202020302c0a202020206f75747075745f696e6465782c0a20202020434b422e534f555243452e47524f55505f4f55545055540a2020293b0a202069662028726574203d3d3d20434b422e434f44452e494e4445585f4f55545f4f465f424f554e4429207b0a20202020627265616b3b0a20207d0a20206966202872657420213d3d203429207b0a20202020434b422e646562756728726574293b0a202020207468726f772022496e76616c6964206f75747075742063656c6c21223b0a20207d0a20207661722076696577203d206e657720446174615669657728627566666572293b0a20206f75747075745f636f696e73202b3d20766965772e67657455696e74333228302c2074727565293b0a20206f75747075745f696e646578202b3d20313b0a7d0a0a69662028696e7075745f636f696e7320213d3d206f75747075745f636f696e7329207b0a2020696620282128696e7075745f696e646578203d3d3d2030202626206f75747075745f696e646578203d3d3d20312929207b0a202020207468726f772022496e76616c696420746f6b656e2069737375696e67206d6f646521223b0a20207d0a20207661722066697273745f696e707574203d20434b422e6c6f61645f696e70757428302c20302c20434b422e534f555243452e494e505554293b0a202069662028747970656f662066697273745f696e707574203d3d3d20226e756d6265722229207b0a202020207468726f77202243616e6e6f742066657463682074686520666972737420696e707574223b0a20207d0a2020766172206865785f696e7075745f6f7574706f696e74203d2041727261792e70726f746f747970652e6d61700a202020202e63616c6c286e65772055696e743841727261792866697273745f696e707574292c2066756e6374696f6e20287829207b0a20202020202072657475726e202822303022202b20782e746f537472696e6728313629292e736c696365282d32293b0a202020207d290a202020202e6a6f696e282222290a202020202e736c696365283136293b202f2f2072656d6f7665207468652066697273742038206279746573206f662073696e63650a2020766172206f7574706f696e745f617267203d206e657720546578744465636f64657228292e6465636f646528434b422e415247565b305d293b0a2020696620286f7574706f696e745f61726720213d206865785f696e7075745f6f7574706f696e7429207b0a20202020434b422e6465627567286f7574706f696e745f617267290a20202020434b422e6465627567286865785f696e7075745f6f7574706f696e74290a202020207468726f772022496e76616c6964206372656174696f6e20617267756d656e7421223b0a20207d0a7d0a540000000800000048000000366135663930346136663665633237306236646465336164643232316161386138323132306532653938656136646163353931363064643039333539303834323031303030303030"
  };
> const bytes = require("@ckb-lumos/lumos/codec").bytes;
> const Uint32LE = require("@ckb-lumos/codec").number.Uint32LE;
> txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.cellOutput.type = duktapeUdtTypeScript;
  cell.data = bytes.hexify(Uint32LE.pack(1000000));
  return outputs;
});
> txSkeleton = lumos.helpers.addCellDep(txSkeleton, {
  outPoint: {
    txHash: duktapeTxHash,
    index: "0x0"
  },
  depType: "code"
})
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton, [wallet.address], 3000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> const signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet.privkey)).toArray();
> const signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> const rootUdtTxHash = await rpc.sendTransaction(signedTx)
```

If we tried to submit the same transaction again, double-spent error will prevent us from forging the same token:

```js
await rpc.sendTransaction(signedTx)
CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"UnresolvableTransaction(Dead(OutPoint(0x0b607e9599f23a8140d428bd24880e5079de1f0ee931618b2f84decf2600383601000000)))"}
```

And no matter how we tried, we cannot create another cell which forges the same UDT token.

Now we can try transfering UDTs to another account. First let's try creating one which has more output UDTs than input UDTs

```js
> let inputOutpoint = {
  txHash: rootUdtTxHash,
  index: "0x0"
}
> let udtCellWithStatus = await rpc.getLiveCell(inputOutpoint, true);
> let blockHash = (await rpc.getTransaction(rootUdtTxHash)).txStatus.blockHash;
> let blockNumber = (await rpc.getHeader(blockHash)).number;
> let input = {
    outPoint: inputOutpoint,
    data: udtCellWithStatus.cell.data.content,
    cellOutput: udtCellWithStatus.cell.output,
    blockNumber
  }
> let output = {
  data: bytes.hexify(Uint32LE.pack(2000000)),
  cellOutput: udtCellWithStatus.cell.output,
}
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = txSkeleton.update("inputs", (inputs) => inputs.push(input));
> txSkeleton = txSkeleton.update("outputs", (outputs) => outputs.push(output));
> txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.push("0x55000000100000005500000055000000410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"));
> txSkeleton = lumos.helpers.addCellDep(txSkeleton, {
  outPoint: {
    txHash: duktapeTxHash,
    index: "0x0"
  },
  depType: "code"
})
> txSkeleton = lumos.helpers.addCellDep(txSkeleton, {
  outPoint: {
    txHash: lumos.config.TESTNET.SCRIPTS['SECP256K1_BLAKE160']['TX_HASH'],
    index: lumos.config.TESTNET.SCRIPTS['SECP256K1_BLAKE160']['INDEX']
  },
  depType: lumos.config.TESTNET.SCRIPTS['SECP256K1_BLAKE160']['DEP_TYPE']
})
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton, [wallet2.address], 3000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> let signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet2.privkey)).toArray();
> let signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> await rpc.sendTransaction(signedTx)
CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"InvalidTx(ScriptFailure(ValidationFailure(101)))"}
```

Here we tried to send another user 2000000 UDTs, of course this should trigger an error since we are trying to forge more tokens. But with slight modification, we can show that a UDT transferring transaction works if you respect the sum verification rule:

```js
> txSkeleton = txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.cellOutput.type = input.cellOutput.type;
  cell.data = bytes.hexify(Uint32LE.pack(1000000));
  return outputs;
});
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton, [wallet2.address], 3000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet2.privkey)).toArray();
> signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> let txHash = await rpc.sendTransaction(signedTx)
```

# Flexible Rules

The UDT script shown here serves just as an example, in reality, dapps might be more complicated and requires more functions. You are also free to include more features for your UDT scripts depending on your needs, some examples include:

- Here we strictly ensure that the sum of output UDTs equals the sum of input UDTs, but in some cases, it might be enough just to ensure the sum of output UDTs does not exceed the sum of input UDTs. In order words, when not needed, a user can choose to burn the UDTs for the capacities.
- The above UDT script doesn't allow issuing more tokens after the initial creation process, but there might be another type of UDT that allows more issurance from the token issuer. This is also possible on CKB, the actual way to solve this task, is left as an exercise here :)
- Here we limit the script to only create one cell in the initial token creation process, it's also possible to create multiple cells to spread the usage in the initial token creation process.
- While we only cover ERC20 here, ERC721 should also be totally possible.

Notice those are just some examples, the actual ways of using CKB script are limitless here. We are more than happy to see cases where CKB dapp developers amaze us with interesting usage of CKB scripts.
