---
title: "Introduction to CKB Script Programming 2: Script Basics"
date: "2019-07-13"
slug: intro-to-ckb-script-programming-2
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

Last post introduced current CKB's validation model. This post will get more fun, since we will show how to deploy script codes to CKB for real. I'm hoping after this post, you should be able to explore the CKB world and work on new script codes as you wish.

This post is written based on current CKB Lina mainnet version now.

A warning here: this will be a long post, since I want to fill in enough for the more interesting topic next week. So you don't have to finish it at once if you don't have enough time. I've tried to split it into individual sections, so you can try each one at a time.

# Wording

Before we continue, let's distinguish between 2 terms: script, and script code.

In this post and hopefully the whole series, we will distinguish between script, and script code. Script code actually refers to the program you write and compile to use on CKB. Script, on the other hand, actually refers to the script data structure used in CKB, which is a little more than just the script code:

```rust
pub struct Script {
    pub code_hash: H256,
    pub hash_type: ScriptHashType,
    pub args: JsonBytes,
}
```

We can ignore `hash_type` for now, a future post will explain what it is and it's interesting usage. Later in this post, we will show that `code_hash` actually just identifies a script code, so for now we can just think of it as script code. What script also includes, is the `args` part, which distinguishes script from script code. `args` can be used here to provide additional arguments for a CKB script, for example, while people might all be using the same default lock script code, each of them might have their own pubkey hash, `args` is exact the place to hold pubkey hash. This way each user of CKB can have different lock script, while sharing the same lock script code.

Note that in most cases, script and script code can be used interchangably, but if you are confused at some places, it might be worthwhile to think of the difference between the 2.

# A Minimal CKB Script Code

As you might have already heard, CKB is based on the open source RISC-V ISA. But what does that even mean? In my words, it means we are (sort of) embedding a real mini computer in CKB, instead of a virtual machine. The benefit of a real computer, is that you can write any logic you want in any language you want. The first few examples we show here will be written in C for simplicity(well I mean simplicity in the toolchain, not the [language](http://blog.llvm.org/2011/05/what-every-c-programmer-should-know.html)), but later we will switch to JavaScript based script code, and hopefully show more languages in the series. On CKB there's endless possibilities.

As we mentioned about, CKB VM is more like a real mini computer. CKB script code also looks like a normal Unix style executable program we run on a computer:

```c
int main(int argc, char* argv[])
{
  return 0;
}
```

When compiled via a C compiler, this will become a script code that is runnable on CKB. In other words, CKB just take plain old Unix style executables(but in RISC-V architecture instead of the popular x86 architecture), and run it in a virtual machine environment. If the program returns with 0 as the return code, we consider the script succeeds, all non-zero return codes will be considered script faliures.

In the example above, we are showing a script code that always succeeds, since the return code will always be zero. Please don't use this as your lock script code, otherwise your token can be taken away by anyone.

But the example above won't be interesting, here we will start with an interesting idea: personally I dislike carrot. I do know that carrot is great from a nutritional point of view, but I still want to avoid it due to the taste. Now what if I want to set a rule, that none of my cells on CKB has data that begin with `carrot`? Let's write a script code to ensure this.

In order to ensure none of the cells can have `carrot` in cell data, we need a way to first read cell data in the script. CKB provides `syscalls` to help with this.

To ensure the security of CKB script, each script has to run in an isolated environment that is totally separated from the main computer you are running CKB. This way it won't be able to access data it doesn't need, such as your private keys or passwords. However, for a script to be useful, there must be certain data it want to access, such as the cell a script guards, or a transaction a script validates. CKB provides `syscalls` to ensure this, syscalls are defined in RISC-V standard, they provide a way to access certain resources provided by the environment. In a normal situation, the environment here means the operating system, but in the case of CKB VM, the environment refers to the actual CKB process. With syscalls, a CKB script can access the whole transaction containing itself, including inputs, outputs, witnesses, and deps.

The good news, is that we have encapsulated syscalls in an easy to use [header file](https://github.com/nervosnetwork/ckb-system-scripts/blob/a7b7c75662ed950c9bd024e15f83ce702a54996e/c/ckb_syscalls.h), you are very welcome to poke around this file to see how syscalls are implemented. The bottomline is you can just grab this header file and use the wrapped functions to make syscalls as you want.

Now with the syscalls at hand, we can start with our carrot-forbidden script:

```c
#include <memory.h>
#include "ckb_syscalls.h"

int main(int argc, char* argv[]) {
  int ret;
  size_t index = 0;
  uint64_t len = 0; /* (1) */
  unsigned char buffer[6];

  while (1) {
    len = 6;
    memset(buffer, 0, 6);
    ret = ckb_load_cell_data(buffer, &len, 0, index, CKB_SOURCE_OUTPUT); /* (2) */
    if (ret == CKB_INDEX_OUT_OF_BOUND) {               /* (3) */
      break;
    }

    if (memcmp(buffer, "carrot", 6) == 0) {
      return -1;
    }

    index++;
  }

  return 0;
}
```

Several points worth explaining here:

1. We will use `len` field both as an input and output parameter, hence it is passed as a pointer here.
2. When making a syscall, we need to provide the following: a buffer to hold the data provided by the syscall; a `len` field denoting both the buffer length, and available data length returned by the syscall; an offset into the input data buffer, and several parameters denoting the exact field we are fetching in the transaction. For more details, please refer to our [RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md).
3. For maximum flexibility, CKB uses the return value of the syscall to represent data fetching status: 0(or `CKB_SUCCESS`) means success, 1(or `CKB_INDEX_OUT_OF_BOUND`) means you have finished fetching all indices in a kind, 2(or `CKB_ITEM_MISSING`) means an entity is not present, such as fetching a type script from a cell that doesn't have one.

So to recap, this script would loop through all output cells in the transaction, load the first 6 bytes of each cell data and test if those bytes match `carrot`. If we found a match, the script would return `-1`, denoting an error status, if no match is found, the script exits with `0`, meaning execution success.

To perform the loop, the script would keep an `index` variable, in each loop iteration, it would tries to make the syscall to fetch the cell denoted by current `index` value, if the syscall returns `CKB_INDEX_OUT_OF_BOUND`, it means the script has iterated through all the cells, hence it just exits the loop, otherwise, the loop would continue, the cell data is tested, then `index` variable is incremented for the next iteration.

This concludes your first useful CKB script code! In the next section, we will see how we can deploy it to CKB and run it.

# Deploying a Script to CKB

First, we need to compile the carrot source code written above. Since GCC already has upstream RISC-V support, you can of course use the official GCC to build your script code. Or you can use the [docker image](https://hub.docker.com/r/nervos/ckb-riscv-gnu-toolchain) we have prepared to save the trouble of compiling GCC:

```bash
$ ls
carrot.c  ckb_consts.h  ckb_syscalls.h
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
root@dc2c0c209dcd:/# cd /code
root@dc2c0c209dcd:/code# riscv64-unknown-elf-gcc -Os carrot.c -o carrot
root@dc2c0c209dcd:/code# exit
exit
$ ls
carrot*  carrot.c  ckb_consts.h  ckb_syscalls.h
```

And that's it, CKB can use the compiled executable from GCC directly as scripts on chain, there's no way for further processing. We can now deploy it on chain. Note that I will use CKB's Node.js SDK [Lumos](https://github.com/ckb-js/lumos). Please refer to the official [Docs](https://lumos-website.vercel.app/) for how to set it up. Across the serial posts, there are some common codes to set up in the Repl environment with Lumos packages, we won't repeat these codes for simplicity, but you can take the following as a reference:

```js
$ node
Welcome to Node.js v20.12.0.
Type ".help" for more information.
>
> const lumos = require("@ckb-lumos/lumos");
> const indexer = new lumos.Indexer("https://testnet.ckb.dev/rpc");
> const rpc = new lumos.RPC("https://testnet.ckb.dev/rpc");
> lumos.config.initializeConfig(lumos.config.TESTNET);
> const wallet = {
  address:
    "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvwg2cen8extgq8s5puft8vf40px3f599cytcyd8",
  privkey: "0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6",
};
> const wallet2 = {
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2prryvze6fhufxkgjx35psh7w70k3hz7c3mtl4d",
  privkey: "0xace08599f3174f4376ae51fdc30950d4f2d731440382bb0aa1b6b0bd3a9728cd"
}
```

To deploy the script to CKB, we can just create a new cell, with the script code as cell data part:

```js
> const fs = require("fs");
> const data = fs.readFileSync("carrot");
> data.byteLength
7744
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = await lumos.commons.common.transfer(txSkeleton,[wallet.address], wallet2.address, "8000" + "00000000");
> txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.data = "0x" + data.toString("hex");
  return outputs;
});
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton,[wallet.address], 1000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> const signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet.privkey)).toArray();
> const signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> const carrotTxHash = await rpc.sendTransaction(signedTx)
```

Here I simply create a new cell with enough capacity by sending tokens to another wallet. Now we can create the type script containing the carrot script code:

```js
> const bytes = require("@ckb-lumos/lumos/codec").bytes;
> const carrotDataHash = lumos.utils.ckbHash(bytes.bytify("0x" + data.toString("hex")));
> const carrotTypeScript =  {
  codeHash: carrotDataHash,
  hashType: "data",
  args: "0x"
};
```

Recall the Script data structure:

```rust
pub struct Script {
    pub code_hash: H256,
    pub hash_type: ScriptHashType,
    pub args: JsonBytes,
}
```

We can see that instead of embedding the script code directly in the script data structure, we are only including the code hash, which is a Blake2b hash of the actual script binary code. Since carrot script doesn't use an argument, we can use empty bytes for `args` part.

Note I'm still ignoring `hash_type` here, we will leave to a future post to see a different way of specifying code hash. For now, let's keep it simple here.

To run the carrot script, we need to create a new transaction, and set carrot type script as the type script of one of the output cells:

```js
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = await lumos.commons.common.transfer(txSkeleton,[wallet.address], wallet2.address,"100" + "00000000");
> txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.cellOutput.type = carrotTypeScript;
  return outputs;
});
```

There's one more step needed: in order for CKB to locate the carrot script, we need to reference the cell containing carrot script in one of transaction deps:

```js
> txSkeleton = lumos.helpers.addCellDep(txSkeleton, {
  outPoint: {
    txHash: carrotTxHash,
    index: "0x0"
  },
  depType: "code"
})
```

Now we are ready to sign and send the transaction:

```js
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton,[wallet.address],1000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> const signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet.privkey)).toArray();
> const signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> const txHash = await rpc.sendTransaction(signedTx)
> txHash
0xd7b0fea7c1527cde27cc4e7a2e055e494690a384db14cc35cd2e51ec6f078163
```

Since this transaction does not have any cell containing `carrot` in the cell data, the type script validates successfully. Now let's try a different transaction that does have a cell that begins with `carrot`:

```js
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = await lumos.commons.common.transfer(txSkeleton,[wallet.address],wallet2.address,"400" + "00000000");
> txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.cellOutput.type = carrotTypeScript;
  cell.data = "0x" + Buffer.from("carrot123", "utf8").toString("hex");
  return outputs;
});
> txSkeleton = lumos.helpers.addCellDep(txSkeleton, {
  outPoint: {
    txHash: carrotTxHash,
    index: "0x0",
  },
  depType: "code",
});
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton,[wallet.address],1000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> const signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet.privkey)).toArray();
> const signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures);
> await rpc.sendTransaction(signedTx);
Uncaught:
ResponseException [Error]: {"code":-302,"message":"TransactionFailedToVerify: Verification failed Script(TransactionScriptError { source: Outputs[0].Type, cause: ValidationFailure: see error code -1 on page.."}
```

We can see our carrot script rejects a transaction that generates a cell with carrot. Now I can use this script to make sure all my cells are free from carrots!

So to recap, to deploy and run a script as type script, what we need to do is:

1. Compile the script to RISC-V executable binary
2. Deploy the binary in a cell's data part
3. Create a type script data structure with the blake2b hash of the binary as `code hash`, any required arguments of the script code in the `args` part
4. Create a new transaction with the type script set in one of the generated cells
5. Include the outpoint to the cell containing the script code as one of the transaction deps

That's really all you need! If your script has run into problems, those are the points you need to check.

Although we only talk about type scripts here, lock script works exactly the same way. The only quirk you need to keep in mind, is that when you create a cell with a specificed lock script, the lock script won't run here. It only runs when you are consuming the cell. So while type script can be used to create the logic that runs when you create the cell, lock script is used to create the logic that runs when you consume the cell. Given this consideration, please make sure your lock script is correct, otherwise you might be losing the tokens in the following scenarios:

- Your lock script has a bug that someone else can unlock your cell.
- Your lock script has a bug that no one(including you) can unlock your cell.

One tip we can provide here, is always test your script as a type script attached to an output cell in your transaction, this way when error happens, you will know immediately, your tokens can stay safe.

# Introducing Duktape

I'm sure you feel the same way as I do now: it's good we can write contracts in C, but C always feels a bit tedious and, let's face it, dangerous. Is there a better way?

Yes of course! We mentioned above CKB VM is essentially a mini computer, and there are tons of solutions we can explore. One thing we have prepared here, is that we can write CKB script codes in JavaScript. Yes you got it right, plain ES5(yes I know, but this is just one example, and you can use a transpiler) JavaScript.

How this is possible? Since we have C compiler available, all we did is just take a JavaScript implementation for the embeded system, in our case, [duktape](https://duktape.org/), compile it from C to RISC-V binary, put it on chain, then boom, we can run JavaScript in CKB! Since we are working with a real mini computer here, there's no stopping us from embeding another VM as CKB script to CKB VM, and exploring this VM on top of VM path.

And we can actually expand from this path, we can have JavaScript on CKB via duktape, we can also have Ruby on CKB via [mruby](https://github.com/mruby/mruby), we can even have Bitcoin Script or EVM on chain if we just compile their VM and put it on chain. This ensures CKB VM can both help us preserve legacy and build a diversified ecosystem. All languages should be and are treated equal on CKB, the freedom should be in the hands of blockchain contract developers.

At this stage you might want to ask: yes this is possible, but won't VM on top of VM be slow? I believe it really depends on your use case to say if this is gonna be slow. I'm a firm believer that benchmarks make no sense unless we put it in a real use case with standard hardware requirements. So wait to see if this is really gonna be an issue. In my opinion, higher languages are more likely to be used in type scripts to guard cell transformation, in this case, I doubt it's gonna be slow. Besides, we are also working on this field to optimize both CKB VM and the VMs on top of CKB VM to make it faster and faster :P

To use duktape on CKB, first you need to compile duktape itself into a RISC-V executable binary:

```bash
$ git clone https://github.com/xxuejie/ckb-duktape.git
$ cd ckb-duktape
$ git submodule init
$ git submodule update
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
root@0d31cad7a539:~# cd /code
root@0d31cad7a539:/code# make
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Ischema -Ideps/ckb-c-stdlib -Ideps/ckb-c-stdlib/molecule -Wall -Werror c/entry.c -c -o build/entry.o
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Ischema -Ideps/ckb-c-stdlib -Ideps/ckb-c-stdlib/molecule -Wall -Werror duktape/duktape.c -c -o build/duktape.o
riscv64-unknown-elf-gcc build/entry.o build/duktape.o -o build/duktape -lm -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Ischema -Ideps/ckb-c-stdlib -Ideps/ckb-c-stdlib/molecule -Wall -Werror c/repl.c -c -o build/repl.o
riscv64-unknown-elf-gcc build/repl.o build/duktape.o -o build/repl -lm -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Ischema -Ideps/ckb-c-stdlib -Ideps/ckb-c-stdlib/molecule -Wall -Werror c/dump_load.c -c -o build/dump_load.o
riscv64-unknown-elf-gcc build/dump_load.o build/duktape.o -o build/dump_load -lm -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
gcc -Wall -Werror -Iduktape -O3 c/native_dump_bytecode.c duktape/duktape.c -o build/native_dump_bytecode -lm
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Ischema -Ideps/ckb-c-stdlib -Ideps/ckb-c-stdlib/molecule -Wall -Werror c/dump_load_nocleanup.c -c -o build/dump_load_nocleanup.o
riscv64-unknown-elf-gcc build/dump_load_nocleanup.o build/duktape.o -o build/dump_load_nocleanup -lm -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
gcc -Wall -Werror -Ischema -Ideps/ckb-c-stdlib/molecule -O3 c/native_args_assembler.c -o build/native_args_assembler
root@0d31cad7a539:/code# exit
exit
$ ls build/
duktape               dump_load             dump_load_nocleanup   entry.o               native_dump_bytecode  repl.o
duktape.o             dump_load.o           dump_load_nocleanup.o native_args_assembler repl
```

Like the carrot example, the first step here is to deploy duktape script code in a CKB cell:

```js
> const data = fs.readFileSync("../ckb-duktape/build/duktape");
> data.byteLength
291440
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = await lumos.commons.common.transfer(txSkeleton,[wallet.address],wallet2.address,"292000" + "00000000");
> txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.data = "0x" + data.toString("hex");
  return outputs;
});
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton,[wallet.address],1000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> const signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet.privkey)).toArray();
> const signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> const duktapeTxHash = await rpc.sendTransaction(signedTx)
> const duktapeCodeHash = lumos.utils.ckbHash(bytes.bytify("0x" + data.toString("hex")));
```

Unlike the carrot example, duktape script code now requires one argument: the JavaScript source you want to execute and the arguments to pass to the JavaScript source code. `ckb-duktape` provides a small binary tool called `native_args_assembler` to help us provide the script args from the js file and the js arguments.

First, let's create the script args:

```bash
> docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
> cd /code
> echo "CKB.debug(\"I'm running in JS\")" > test.js
> ./build/native_args_assembler -f test.js
370000000c00000033000000000000001f000000434b422e6465627567282249276d2072756e6e696e6720696e204a5322290a04000000
```

Next, copy the script args and build the script:

```js
> const duktapeTypeScript =  {
  codeHash: duktapeCodeHash,
  hashType: "data",
  args: "0x370000000c00000033000000000000001f000000434b422e6465627567282249276d2072756e6e696e6720696e204a5322290a04000000"
};
```

Notice that with a different argument, you can create a different duktape powered type script for different use case:

```bash
> docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
> cd /code
> echo "var a = 1;var b = a + 2;" >> test.js
> ./build/native_args_assembler -f test.js
330000000c0000002f000000000000001b0000007661722061203d20313b5c6e7661722062203d2061202b20323b0a04000000
```

```js
> const duktapeTypeScript =  {
  codeHash: duktapeCodeHash,
  hashType: "data",
  args: "0x330000000c0000002f000000000000001b0000007661722061203d20313b5c6e7661722062203d2061202b20323b0a04000000"
};
```

This echos the differences mentioned above on script code vs script: here duktape serves as a script code providing a JavaScript engine, while different script leveraging duktape script code serves different functionalities on chain.

Now we can create a cell with the duktape type script attached:

```js
> const duktapeTypeScript =  {
  codeHash: duktapeCodeHash,
  hashType: "data",
  args: "0x370000000c00000033000000000000001f000000434b422e6465627567282249276d2072756e6e696e6720696e204a5322290a04000000"
};
> let txSkeleton = lumos.helpers.TransactionSkeleton({ cellProvider: indexer });
> txSkeleton = await lumos.commons.common.transfer(txSkeleton,[wallet.address],wallet2.address,"200" + "00000000");
> txSkeleton.update("outputs", (outputs) => {
  let cell = outputs.first();
  cell.cellOutput.type = duktapeTypeScript;
  return outputs;
});
> txSkeleton = lumos.helpers.addCellDep(txSkeleton, {
  outPoint: {
    txHash: duktapeTxHash,
    index: "0x0"
  },
  depType: "code"
})
> txSkeleton = await lumos.commons.common.payFeeByFeeRate(txSkeleton,[wallet.address],1000);
> txSkeleton = lumos.commons.common.prepareSigningEntries(txSkeleton);
> const signatures = txSkeleton.get("signingEntries").map((entry) => lumos.hd.key.signRecoverable(entry.message, wallet.privkey)).toArray();
> const signedTx = lumos.helpers.sealTransaction(txSkeleton, signatures)
> const txHash = await rpc.sendTransaction(signedTx)
```

We can see that the script executes successfully, and if you have `ckb-script` module's log level set to `debug` in your `ckb.toml` file, you can also notice the following log:

```bash
2019-07-15 05:59:13.551 +00:00 http.worker8 DEBUG ckb-script  script group: c35b9fed5fc0dd6eaef5a918cd7a4e4b77ea93398bece4d4572b67a474874641 DEBUG OUTPUT: I'm running in JS!
```

Now you have successfully deploy a JavaScript engine on CKB, and run JavaScript based script on CKB! Feel free to try any JavaScript code you want here.

# A Thought Exercise

Now you are familiar with CKB script basics, here's one thought exercise: in this post you've seen what an always-success script looks like, but what about an always-failure script? How small an always-faliure script(and script code) can be?

A hint: this is NOT a gcc flag-tweaking optimization contest, this is merely a thought exercise.

# Next

I know this is a long post, I hope you have tried this and successfully deployed a script to CKB. In the next post, we will introduce an important topic: how to issue your own user defined tokens(UDT) on CKB. The best part of UDTs on CKB, is that each user can store their UDTs in their own cells, which is different from ERC20 tokens on Ethereum, where everyone's token will have to live in the token issuer's single address. All of this can be achieved by using type scripts alone. If you are interested please stay tuned :)
