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

```
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
+  var hex_input = Array.prototype.map.call(
+    new Uint8Array(first_input),
+    function(x) { return ('00' + x.toString(16)).slice(-2); }).join('');
+  if (CKB.ARGV[0] != hex_input) {
+    throw "Invalid creation argument!";
+  }
 }
```

And that's it, with 53 lines of code or 1372 bytes, we've completed a minimal UDT type script in CKB. Notice I don't even use a minimizer here, with any decent JS minimizer, we should be able to get a much more compact type script. Of course this is a production ready script, but it suffices to show a simple script is enough to handle important tasks in CKB.

# Deploying to CKB

I'm not like [some other organizations](https://hacks.mozilla.org/2019/09/debugging-webassembly-outside-of-the-browser/) who prefer to only show you a video and a provocative post which hide how they did it and the accompanying problems. I believe no post is fun without actual code and steps to play with it. And here's how you can use the above UDT script on CKB:

In case you might need it, here's the full UDT script without diff format:

```
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
  var hex_input = Array.prototype.map.call(
    new Uint8Array(first_input),
    function(x) { return ('00' + x.toString(16)).slice(-2); }).join('');
  if (CKB.ARGV[0] != hex_input) {
    throw "Invalid creation argument!";
  }
}
```

In order to run JavaScript, let's first deploy duktape on CKB:

```
pry(main)> data = File.read("../ckb-duktape/build/duktape")
pry(main)> duktape_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(300000), CKB::Utils.bin_to_hex(duktape_data))
pry(main)> duktape_data_hash = CKB::Blake2b.hexdigest(duktape_data)
pry(main)> duktape_out_point = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: duktape_tx_hash, index: 0))
```

First, let's create a UDT with 1000000 tokens

```
pry(main)> tx = wallet.generate_tx(wallet.address, CKB::Utils.byte_to_shannon(20000))
pry(main)> tx.cell_deps.push(duktape_out_point.dup)
pry(main)> arg = CKB::Utils.bin_to_hex(CKB::Serializers::InputSerializer.new(tx.inputs[0]).serialize)
pry(main)> duktape_udt_script = CKB::Types::Script.new(code_hash: duktape_data_hash, args: [CKB::Utils.bin_to_hex(File.read("udt.js")), arg])
pry(main)> tx.outputs[0].type = duktape_udt_script
pry(main)> tx.outputs_data[0] = CKB::Utils.bin_to_hex([1000000].pack("L<"))
pry(main)> tx.witnesses[0] = "0x"
pry(main)> signed_tx = tx.sign(wallet.key, api.compute_transaction_hash(tx))
pry(main)> root_udt_tx_hash = api.send_transaction(signed_tx)
```

If we tried to submit the same transaction again, double-spent error will prevent us from forging the same token:

```
pry(main)> api.send_transaction(signed_tx)
CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"UnresolvableTransaction(Dead(OutPoint(0x0b607e9599f23a8140d428bd24880e5079de1f0ee931618b2f84decf2600383601000000)))"}
```

And no matter how we tried, we cannot create another cell which forges the same UDT token.

Now we can try transfering UDTs to another account. First let's try creating one with has more output UDTs than input UDTs

```
pry(main)> udt_out_point = CKB::Types::OutPoint.new(tx_hash: root_udt_tx_hash, index: 0)
pry(main)> tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(20000))
pry(main)> tx.cell_deps.push(duktape_out_point.dup)
pry(main)> tx.witnesses[0] = "0x"
pry(main)> tx.witnesses.push(CKB::Types::Witness.new(data: []))
pry(main)> tx.outputs[0].type = duktape_udt_script
pry(main)> tx.outputs_data[0] = CKB::Utils.bin_to_hex([1000000].pack("L<"))
pry(main)> tx.inputs.push(CKB::Types::Input.new(previous_output: udt_out_point, since: "0"))
pry(main)> tx.outputs.push(tx.outputs[1].dup)
pry(main)> tx.outputs[2].capacity = CKB::Utils::byte_to_shannon(20000)
pry(main)> tx.outputs[2].type = duktape_udt_script
pry(main)> tx.outputs_data.push(CKB::Utils.bin_to_hex([1000000].pack("L<")))
pry(main)> signed_tx = tx.sign(wallet.key, api.compute_transaction_hash(tx))
pry(main)> api.send_transaction(signed_tx)
CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"InvalidTx(ScriptFailure(ValidationFailure(-2)))"}
```

Here we tried to send another user 1000000 UDTs while also keeping 1000000 UDTs for the sender itself, of course this should trigger an error since we are trying to forge more tokens. But with slight modification, we can show that a UDT transferring transaction works if you respect the sum verification rule:

```
pry(main)> tx.outputs_data[0] = CKB::Utils.bin_to_hex([900000].pack("L<"))
pry(main)> tx.outputs_data[2] = CKB::Utils.bin_to_hex([100000].pack("L<"))
pry(main)> signed_tx = tx.sign(wallet.key, api.compute_transaction_hash(tx))
pry(main)> api.send_transaction(signed_tx)
```

# Flexible Rules

The UDT script shown here serves just as an example, in reality, dapps might be more complicated and requires more functions. You are also free to include more features for your UDT scripts depending on your needs, some examples include:

- Here we strictly ensure that the sum of output UDTs equals the sum of input UDTs, but in some cases, it might be enough just to ensure the sum of output UDTs does not exceed the sum of input UDTs. In order words, when not needed, a user can choose to burn the UDTs for the capacities.
- The above UDT script doesn't allow issuing more tokens after the initial creation process, but there might be another type of UDT that allows more issurance from the token issuer. This is also possible on CKB, the actual way to solve this task, is left as an exercise here :)
- Here we limit the script to only create one cell in the initial token creation process, it's also possible to create multiple cells to spread the usage in the initial token creation process.
- While we only cover ERC20 here, ERC721 should also be totally possible.

Notice those are just some examples, the actual ways of using CKB script are limitless here. We are more than happy to see cases where CKB dapp developers amaze us with interesting usage of CKB scripts.
