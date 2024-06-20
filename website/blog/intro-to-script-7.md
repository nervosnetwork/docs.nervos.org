---
title: "Introduction to CKB Script Programming 7: Advanced Duktape Examples"
date: "2020-02-21"
slug: intro-to-ckb-script-programming-7
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

I've introduced duktape before, shown how you can run JavaScript code on Nervos CKB. But up to this point, the code I've shown is all single piece of code with very simple logic. What if we need to parse CKB data structures? What if I need external libraries in my script? In this post we will create a duktape-powered CKB script with the following requirements:

- External library dependency
- Serialization/Deserialization of CKB data structures
- Hashing

Before continuing on this post, I want to mention that the major work used in this post, is not written by me. The credit really goes to [one](https://github.com/Keith-CY) of my colleagues, who spent the effort putting together a very nice [template](https://github.com/xxuejie/ckb-duktape-template) we can use here, so we can have a streamlined CKB script development experience via JavaScript & duktape.

This post is written based on current CKB Lina mainnet version now.

# Scope

In this post, we will write a simple [HTLC](https://en.bitcoin.it/wiki/Hash_Time_Locked_Contracts) script in JavaScript. Let me admit that I'm not the world's best teacher, there're many, many people who are better than me in [explaining HTLC](https://liquality.io/blog/hash-time-locked-contracts-htlcs-explained/~). So if you want to know what HTLC is, feel free to check other places first and come back here later.

Now I will assume you know what HTLC is :P The HTLC script we create here, will be unlocked if either one of the following conditions is met:

- A correct secret string, and a valid signature for public key A are provided;
- Certain amount of time is passed, and a valid signature for public key B is provided

And there are also several points made in the design of our HTLC script:

1. For simplicity, we will use a trick to do signature verification here: instead of doing signature verification directly in JavaScript, we will rely on a separate cell to provide that a signature of the correct public key is provided. Later in this post we will explain the consequence and consideration regarding signature verifi2ation in JavaScript;
2. A hash of the correct secret string will be included in `args` part of the CKB HTLC script structure, so when the script runs, it can run a hashing function on the provided secret string, testing if it is correct;
3. The amount of time is always set as 100 blocks. To verify 100 blocks has passed, the unlock transaction should include a block header which at least 100 blocks after the cell to unlock is committed on chain.

With the design set in stone, let's jump to the implementation now.

# Getting Our Hands Dirty

While you are certainly welcome to craft the skeleton on your own, a decent [template](https://github.com/xxuejie/ckb-duktape-template) has already been prepared by one of my colleagues to save us the time. In this post, we will start from the already built template here:

```
$ export TOP=$(pwd)
$ git clone https://github.com/xxuejie/ckb-duktape-template htlc-template
$ cd htlc-template
$ npm install
# now you can try building the script first to ensure everything works
$ npm run build
```

Now you can use your favorite editor to open `src/index.js` file in `htlc-template` repo, the current content of the file looks like this:

```
$ cd $TOP/htlc-template
$ cat src/index.js
const { Molecule } = require('molecule-javascript')
const schema = require('../schema/blockchain-combined.json')

const names = schema.declarations.map(declaration => declaration.name)
const scriptTypeIndex = names.indexOf('Script')
const scriptType = schema.declarations[scriptTypeIndex]

// Write your script logic here.
CKB.debug(scriptType)
```

We will modify this file to add the logic we need.

## Script Debugger Preparation

To aid script programming, let's put together a debugging environment. The debugging environment will serve 2 purposes:

- Prepare a complete transaction that can be loaded to CKB debugger;
- Create transactions and relay them to CKB

Let's first create the environment skeleton:

```
$ cd $TOP
$ mkdir htlc-runner
$ cd htlc-runner
$ npm init
$ npm install --save @nervosnetwork/ckb-sdk-core
$ npm install --save @nervosnetwork/ckb-sdk-utils
$ npm install --save molecule-javascript
$ npm install --save crc32
```

Now let's create a transaction skeleton for debugger usage:

```
$ cd $TOP/htlc-runner
$ cat skeleton.json
{
  "mock_info": {
    "inputs": [
      {
        "input": {
          "previous_output": {
            "tx_hash": "0xa98c57135830e1b91345948df6c4b8870828199a786b26f09f7dec4bc27a73da",
            "index": "0x0"
          },
          "since": "0x0"
        },
        "output": {
          "capacity": "0x4b9f96b00",
          "lock": {
            "args": "0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8",
            "code_hash": "@DUKTAPE_HASH",
            "hash_type": "data"
          },
          "type": null
        },
        "data": "0x"
      }
    ],
    "cell_deps": [
      {
        "cell_dep": {
          "out_point": {
            "tx_hash": "0xfcd1b3ddcca92b1e49783769e9bf606112b3f8cf36b96cac05bf44edcf5377e6",
            "index": "0x0"
          },
          "dep_type": "code"
        },
        "output": {
          "capacity": "0x702198d000",
          "lock": {
            "args": "0x",
            "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "hash_type": "data"
          },
          "type": null
        },
        "data": "@SCRIPT_CODE"
      },
      {
        "cell_dep": {
          "out_point": {
            "tx_hash": "0xfcd1b3ddcca92b1e49783769e9bf606112b3f8cf36b96cac05bf44edcf5377e6",
            "index": "0x1"
          },
          "dep_type": "code"
        },
        "output": {
          "capacity": "0x702198d000",
          "lock": {
            "args": "0x",
            "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "hash_type": "data"
          },
          "type": null
        },
        "data": "@DUKTAPE_CODE"
      }
    ],
    "header_deps": [
      {
        "compact_target": "0x1a1e4c2f",
        "hash": "0x51d199c4060f703344eab3c9b8794e6c60195ae9093986c35dba7c3486224409",
        "number": "0xd8fc4",
        "parent_hash": "0xc02e01eb57b205c6618c9870667ed90e13adb7e9a7ae00e7a780067a6bfa6a7b",
        "nonce": "0xca8c7caa8100003400231b4f9d6e0300",
        "timestamp": "0x17061eab69e",
        "transactions_root": "0xffb0863f4ae1f3026ba99b2458de2fa69881f7508599e2ff1ee51a54c88b5f88",
        "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "version": "0x0",
        "epoch": "0x53f00fa000232",
        "dao": "0x4bfe53a5a9bb9a30c88898b9dfe22300a58f2bafed47680000d3b9f5b6630107"
      }
    ]
  },
  "tx": {
    "version": "0x0",
    "cell_deps": [
      {
        "out_point": {
          "tx_hash": "0xfcd1b3ddcca92b1e49783769e9bf606112b3f8cf36b96cac05bf44edcf5377e6",
          "index": "0x0"
        },
        "dep_type": "code"
      },
      {
        "out_point": {
          "tx_hash": "0xfcd1b3ddcca92b1e49783769e9bf606112b3f8cf36b96cac05bf44edcf5377e6",
          "index": "0x1"
        },
        "dep_type": "code"
      }
    ],
    "header_deps": [
      "0x51d199c4060f703344eab3c9b8794e6c60195ae9093986c35dba7c3486224409"
    ],
    "inputs": [
      {
        "previous_output": {
          "tx_hash": "0xa98c57135830e1b91345948df6c4b8870828199a786b26f09f7dec4bc27a73da",
          "index": "0x0"
        },
        "since": "0x0"
      }
    ],
    "outputs": [
      {
        "capacity": "0x0",
        "lock": {
          "args": "0x",
          "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
          "hash_type": "data"
        },
        "type": null
      }
    ],
    "witnesses": [
      "0x210000000c0000001d0000000d0000006920616d20612073656372657400000000"
    ],
    "outputs_data": [
      "0x"
    ]
  }
}
```

You might notice that the skeleton skips dep cell data part, this is because as we develop the HTLC script, we might need to insert different contents in the skeleton. Hence a runner here is needed to prepare the skeleton to a full transaction, then run it via CKB debugger:

```
$ cd $TOP/htlc-runner
$ cat runner.js
#!/usr/bin/env node

const { Molecule } = require('molecule-javascript')
const schema = require('../htlc-template/schema/blockchain-combined.json')
const utils = require("@nervosnetwork/ckb-sdk-utils")
const process = require('process')
const fs = require('fs')

function blake2b(buffer) {
  return utils.blake2b(32, null, null, utils.PERSONAL).update(buffer).digest('binary')
}

if (process.argv.length !== 4) {
  console.log(`Usage: ${process.argv[1]} <duktape load0 binary> <js script>`)
  process.exit(1)
}

const duktape_binary = fs.readFileSync(process.argv[2])
const duktape_hash = blake2b(duktape_binary)
const js_script = fs.readFileSync(process.argv[3])

const data = fs.readFileSync('skeleton.json', 'utf8').
      replace("@DUKTAPE_HASH", utils.bytesToHex(duktape_hash)).
      replace("@SCRIPT_CODE", utils.bytesToHex(js_script)).
      replace("@DUKTAPE_CODE", utils.bytesToHex(duktape_binary))

fs.writeFileSync('tx.json', data)

const resolved_tx = JSON.parse(data)
const json_lock_script = resolved_tx.mock_info.inputs[0].output.lock
const lock_script = {
  codeHash: json_lock_script.code_hash,
  hashType: json_lock_script.hash_type,
  args: json_lock_script.args
}
const lock_script_hash = blake2b(utils.hexToBytes(utils.serializeScript(lock_script)))

console.log(`../ckb-standalone-debugger/bins/target/release/ckb-debugger -g lock -h ${utils.bytesToHex(lock_script_hash)} -t tx.json`)
```

We need to compile duktape here:

```
$ cd $TOP
$ git clone --recursive https://github.com/xxuejie/ckb-duktape
$ cd ckb-duktape
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191209 bash
root@18d4b1952624:/# cd /code
root@18d4b1952624:/code# make
root@18d4b1952624:/code# exit
```

And also CKB debugger:

```
$ cd $TOP
$ git clone --recursive https://github.com/xxuejie/ckb-standalone-debugger
$ cd ckb-standalone-debugger/bins
$ cargo build --release
```

Now you can try running generated script:

```
$ cd $TOP/htlc-runner
$ chmod +x runner.js
$ RUST_LOG=debug `./runner.js ../ckb-duktape/build/load0 ../htlc-template/build/duktape.js`
DEBUG:<unknown>: script group: Byte32(0x8209891745eb858abd6f5e53c99b4f101bca221bd150a2ece58a389b7b4f8fa7) DEBUG OUTPUT: [object Object]
Run result: Ok(0)
```

This will prepare the transaction to run from duktape binary and JS script, then run it via CKB debugger, debug outputs and final results will be printed to stdout.

Or if you find a REPL more helpful, you can use the following line to execute the script and then start a REPL:

```
$ cd $TOP/htlc-runner
$ RUST_LOG=debug `./runner.js ../ckb-duktape/build/repl0 ../htlc-template/build/duktape.js`
duk>
```

With the debugger ready, let's now start to implement the HTLC script.

## Custom Arguments

CKB provides 2 places that we can use to hold arguments to scripts running on CKB:

- `args` field in `Script` structure
- `witnesses` field in `Transaction` structure

The difference between them, is that `args` field is used to hold arguments that remains the same for all usage of the same script, while `witnesses` field is used for temporary arguments that are used in one-time transaction validation. One example here is: for a script that does signature verification, `args` field is typically used to store public key hash, while `witnesses` field is used to hold valid signature.

For maximum flexibility, both `args` field and each item in the `witnesses` array field are just plain raw bytes. It's up to dapp developers to design the actual format of data they want to hold. In our HTLC script, we will use [molecule](https://github.com/nervosnetwork/molecule) serialization format. Molecule is widely used in CKB. If you want to interact with CKB, such as reading certain cell/script used in the current transaction, you will need to deal with molecule format. Now this is a perfect opportunity to explain how one can interact with CKB via molecule in great details, hence we will implement the custom structure used by `args` and `witness` in molecule format. Though you are free to use any serialization format in your own scripts.

Let's first create a file with the 2 needed data structure:

```
$ cd $TOP/htlc-template
$ cat htlc.mol
array Uint32 [byte; 4];
array Byte32 [byte; 32];
vector Bytes <byte>;

struct HtlcArgs {
  a: Byte32,
  b: Byte32,
  hash: Uint32,
}

table HtlcWitness {
  s: Bytes,
  i: Uint32,
}
```

For more information on molecule, please refer to the [RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0008-serialization/0008-serialization.md). Here we are defining 2 structures with following requirements:

- `HtlcArgs` requires 2 32-byte long raw bytes for storing both public keys(later we shall the HTLC script here actually generalizes a bit from this design), and a single 32-bit integer value for storing hash. For simplicity, our HTLC will use CRC32 as the hash function, but in a production setting, this is far from a secure solution, and you should definitely use a proper secure hash function for this;
- `HtlcWitness` has 2 optional(denoted by the `table` construct) arguments: it contains either a variable length string containing the secret string for HTLC, or a 32-bit integer value denoting the header to check for 100 block rule.

## Deserializing in Molecule

With the molecule definition in place for the custom data structure, we need to first convert them into a format that can be consumed by the JavaScript implementation of molecule:

```
$ cd $TOP/htlc-template
$ cargo install moleculec
$ moleculec --language - --format json --schema-file htlc.mol > src/htlc.json
$ npx moleculec-js -ns src/htlc.json > src/htlc-combined.json
```

Now we can fill in the code that loads current Script, and parses the serialized args into a valid structure:

```
$ cd $TOP/htlc-template
$ cat src/index.js
const { Molecule } = require('molecule-javascript')
const schema = require('../schema/blockchain-combined.json')

const names = schema.declarations.map(declaration => declaration.name)
const scriptTypeIndex = names.indexOf('Script')
const scriptType = new Molecule(schema.declarations[scriptTypeIndex])

// Write your script logic here.
const customSchema = require('./htlc-combined.json')
const customNames = customSchema.declarations.map(d => d.name)

const htlcArgsIndex = customNames.indexOf('HtlcArgs')
const htlcArgsType = new Molecule(customSchema.declarations[htlcArgsIndex])

function bytesToHex(b) {
  return "0x" + Array.prototype.map.call(
    new Uint8Array(b),
    function(x) {
      return ('00' + x.toString(16)).slice(-2)
    }
  ).join('')
}

function hexStringArrayToHexString(a) {
  let s = "0x";
  for (let i = 0; i < a.length; i++) {
    s = s + a[i].substr(2)
  }
  return s
}

const current_script = scriptType.deserialize(bytesToHex(CKB.load_script(0)))
const args = hexStringArrayToHexString(current_script[2][1])
const htlcArgs = htlcArgsType.deserialize(args)

CKB.debug(`a: ${hexStringArrayToHexString(htlcArgs[0][1])}`)
CKB.debug(`b: ${hexStringArrayToHexString(htlcArgs[1][1])}`)
CKB.debug(`c: ${hexStringArrayToHexString(htlcArgs[2][1])}`)
```

If we ignore the bookkeeping code for a sec, what matters here, is that we first use CKB syscall to load script, parse script structure, then get args:

```
const current_script = scriptType.deserialize(bytesToHex(CKB.load_script(0)))
const args = hexStringArrayToHexString(current_script[2][1])
const htlcArgs = htlcArgsType.deserialize(args)
```

We assume script args contain serialized HtlcArgs structure defined above, then we apply similar method to exact them:

```
const htlcArgs = htlcArgsType.deserialize(args)
```

I have already provided some meaningful data in the skeleton, so if we try to execute the script:

```
$ cd $TOP/htlc-template
$ npm run build
$ cd $TOP/htlc-runner
$ RUST_LOG=debug `./runner.js ../ckb-duktape/build/load0 ../htlc-template/build/duktape.js`
DEBUG:<unknown>: script group: Byte32(0x35ab3d033e66c426573ed4b7ce816e248cb042d908fd8cfe7bba27acb37fb108) DEBUG OUTPUT: a: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947
DEBUG:<unknown>: script group: Byte32(0x35ab3d033e66c426573ed4b7ce816e248cb042d908fd8cfe7bba27acb37fb108) DEBUG OUTPUT: b: 0xc219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd
DEBUG:<unknown>: script group: Byte32(0x35ab3d033e66c426573ed4b7ce816e248cb042d908fd8cfe7bba27acb37fb108) DEBUG OUTPUT: c: 0x970dd9a8
Run result: Ok(0)
```

We can find parsed results from debug logs.

## Adding new library

Another thing I want to show here, is that you can include many libraries out there already on npm, assuming:

- There's a ES5 version(or you can actually adjust the webpack pipeline yourself to add polyfills) of the library;
- It is implemented purely in JavaScript without native code

In the HTLC script, I'm gonna add [crc32](https://github.com/beatgammit/crc32), and use crc32 to calculate secret string hash. I want to mention again here that CRC32 is never a secure hash function. We pick it out of simplicity, not security. In a production setting, you should really use a real secure hash function probably implemented natively rather than using JavaScript. But for now, crc32 is quite perfect for our tutorial :P

Let's include crc32 in our template, and write some debugging code to test it:

```
$ cd $TOP/htlc-template
$ npm install --save crc32
$ cat src/index.js
const { Molecule } = require('molecule-javascript')
const schema = require('../schema/blockchain-combined.json')

const names = schema.declarations.map(declaration => declaration.name)
const scriptTypeIndex = names.indexOf('Script')
const scriptType = new Molecule(schema.declarations[scriptTypeIndex])

// Write your script logic here.
const customSchema = require('./htlc-combined.json')
const customNames = customSchema.declarations.map(d => d.name)

const htlcArgsIndex = customNames.indexOf('HtlcArgs')
const htlcArgsType = new Molecule(customSchema.declarations[htlcArgsIndex])

function bytesToHex(b) {
  return "0x" + Array.prototype.map.call(
    new Uint8Array(b),
    function(x) {
      return ('00' + x.toString(16)).slice(-2)
    }
  ).join('')
}

function hexStringArrayToHexString(a) {
  let s = "0x";
  for (let i = 0; i < a.length; i++) {
    s = s + a[i].substr(2)
  }
  return s
}

const current_script = scriptType.deserialize(bytesToHex(CKB.load_script(0)))
const args = hexStringArrayToHexString(current_script[2][1])
const htlcArgs = htlcArgsType.deserialize(args)

CKB.debug(`c: ${hexStringArrayToHexString(htlcArgs[2][1])}`)

const crc32 = require('crc32')
CKB.debug(crc32('i am a secret'))
$ npm run build
$ cd $TOP/htlc-runner
$ RUST_LOG=debug `./runner.js ../ckb-duktape/build/load0 ../htlc-template/build/duktape.js`
DEBUG:<unknown>: script group: Byte32(0x35ab3d033e66c426573ed4b7ce816e248cb042d908fd8cfe7bba27acb37fb108) DEBUG OUTPUT: c: 0x970dd9a8
DEBUG:<unknown>: script group: Byte32(0x35ab3d033e66c426573ed4b7ce816e248cb042d908fd8cfe7bba27acb37fb108) DEBUG OUTPUT: 970dd9a8
Run result: Ok(0)
```

You might noticed that the 2 values we printed here are exactly the same! That's because `i am a secret` is exactly the secret string I'm picking when preparing the skeleton.

## Piecing the Contract Together

With all the libraries and required knowledge in place, we can now finish implementing the script:

```
$ cd $TOP/htlc-template
$ cat src/index.js
const { Molecule } = require('molecule-javascript')
const schema = require('../schema/blockchain-combined.json')

const names = schema.declarations.map(declaration => declaration.name)
const scriptTypeIndex = names.indexOf('Script')
const scriptType = new Molecule(schema.declarations[scriptTypeIndex])

// Write your script logic here.
const customSchema = require('./htlc-combined.json')
const customNames = customSchema.declarations.map(d => d.name)

const htlcArgsIndex = customNames.indexOf('HtlcArgs')
const htlcArgsType = new Molecule(customSchema.declarations[htlcArgsIndex])

function bytesToHex(b) {
  return "0x" + Array.prototype.map.call(
    new Uint8Array(b),
    function(x) {
      return ('00' + x.toString(16)).slice(-2)
    }
  ).join('')
}

function hexStringArrayToString(a) {
  let s = "";
  for (let i = 0; i < a.length; i++) {
    s = s + String.fromCharCode(parseInt(a[i]))
  }
  return s
}

function hexStringArrayToHexString(a) {
  let s = "0x";
  for (let i = 0; i < a.length; i++) {
    s = s + a[i].substr(2)
  }
  return s
}

function parseLittleEndianHexStringArray(a) {
  let v = 0
  const l = a.length
  for (let i = 0; i < l; i++) {
    v = (v << 8) | parseInt(a[l - i - 1])
  }
  return v
}

const current_script = scriptType.deserialize(bytesToHex(CKB.load_script(0)))
const args = hexStringArrayToHexString(current_script[2][1])
const htlcArgs = htlcArgsType.deserialize(args)

// Load and parse witness data using the same method as above
const htlcWitnessIndex = customNames.indexOf('HtlcWitness')
const htlcWitnessType = new Molecule(customSchema.declarations[htlcWitnessIndex])

const rawWitness = CKB.load_witness(0, 0, CKB.SOURCE.GROUP_INPUT)
if (typeof rawWitness === 'number') {
  throw new Error(`Invalid response when loading witness: ${rawWitness}`)
}
const htlcWitness = htlcWitnessType.deserialize(bytesToHex(rawWitness))

let lockHashToMatch;
if (htlcWitness[0][1].length > 0) {
  // Test secret string hash
  const crc32 = require('crc32')
  const hash = '0x' + crc32(hexStringArrayToString(htlcWitness[0][1]))
  if (hash !== hexStringArrayToHexString(htlcArgs[2][1])) {
    throw new Error(`Invalid secret string!`)
  }
  lockHashToMatch = hexStringArrayToHexString(htlcArgs[0][1])
} else {
  // Test header block
  const headerTypeIndex = names.indexOf('Header')
  const headerType = new Molecule(schema.declarations[headerTypeIndex])

  // Load header for current input first
  const rawInputHeader = CKB.load_header(0, 0, CKB.SOURCE.GROUP_INPUT)
  if (typeof rawWitness === 'number') {
    throw new Error(`Invalid response when loading input header: ${rawInputHeader}`)
  }
  const inputHeader = headerType.deserialize(bytesToHex(rawInputHeader))
  const inputHeaderNumber = parseLittleEndianHexStringArray(inputHeader[0][1][3][1])

  const targetHeaderIndex = parseLittleEndianHexStringArray(htlcWitness[1][1])
  const rawTargetHeader = CKB.load_header(0, targetHeaderIndex,
                                          CKB.SOURCE.HEADER_DEP)
  if (typeof rawTargetHeader === 'number') {
    throw new Error(`Invalid response when loading target header: ${rawTargetHeader}`)
  }
  const targetHeader = headerType.deserialize(bytesToHex(rawTargetHeader))
  const targetHeaderNumber = parseLittleEndianHexStringArray(targetHeader[0][1][3][1])

  if (targetHeaderNumber < inputHeaderNumber + 100) {
    throw new Error(`Timeout period has not reached!`)
  }
  lockHashToMatch = hexStringArrayToHexString(htlcArgs[1][1])
}

// Now we know which lock hash to test against, we look for an input cell
// with the specified lock hash
let i = 0
while (true) {
  const rawHash = CKB.load_cell_by_field(0, i, CKB.SOURCE.INPUT, CKB.CELL.LOCK_HASH)
  if (rawHash == CKB.CODE.INDEX_OUT_OF_BOUND) {
    throw new Error(`Cannot find input cell using lock hash ${lockHashToMatch}`)
  }
  if (typeof rawHash === 'number') {
    throw new Error(`Invalid response when loading input cell: ${rawHash}`)
  }
  if (bytesToHex(rawHash) == lockHashToMatch) {
    break
  }
  i += 1
}
```

It uses similar techniques as shown above to parse witness and block headers, which are also in molecule format.

There's one trick worth mentioning: in the design of HTLC script, I mentioned that the script needs to do signature verification for a given public key. The actual implemention we have here, generalizes slightly from this design:

1. Instead of test a given public key, we are testing for the whole lock script hash. While this certainly satisfies our requirement, it provides more possibilities: if everyone is using the default secp256k1 lock script, different public keys will be reflected in script args part, resulting in differnet lock scripts. So testing lock scripts can certainly ensure different public keys are using. On the other hand, not everyone might be using the default secp256k1 lock script, so testing lock script hash directly, can enable more flexibilities in the HTLC script usage.
2. While one can certainly embeds the signature verification logic within the HTLC script, we opt for a different and simpler solution here: we just test that one of the input cell has the specified lock script. Per CKB's validation rules, if the transaction is accepted by the blockchain, each input cells' lock script must pass validation, which means the lock script specified in the HTLC script will also pass validation, satisfying the validation rules of HTLC script.

To summarize a bit, we are actually showing 2 patterns that can be handy when desining dapps on CKB:

1. Instead of testing signature verification for a public key, one can test for the validation of a lock script to enable flexibilities.
2. Instead of duplicating a different lock script, one can check for the existence of an input cell using the same lock, and delegate the validation work to the input cell's lock script.

Fundamentally, it depends on your use case to see if those patterns can apply. Later we might also build real composable scripts via dynamic linking to supplyment pattern 2. But having those in your armory might turn out to be useful when your design can be simply by them.

## Always Audit Your Script

One final note here, is that you should always remember to audit the script before deploying it and putting real tokens in it. The above HTLC script is primarily for introductory purposes. I can easily recognize a few vulnerabilities in them. You should never use it directly on CKB mainnet. However, it does provide a quite interesting exercise, so if you are interested, feel free to read the script and see if you can spot the vulnerabilities yourself :P

# Running HTLC Script on Chain

There're 2 parts in testing a CKB script: previously, we were using a off-chain debugger environment to test the script for faster iteration. Now that we have a complete HTLC script, we should also deploy it on a dev chain and test the whole workflow. After all any blockchain smart contracts cannot live alone, they have to have a surrounding environments that help prepare the transaction and invoke them on chain. This is more the case for CKB, since CKB uses a separated validator-generator model.

To test our HTLC script on chain, we are gonna reuse our `htlc-runner` environment here, and write a few more node executables that can deploy and test the HTLC script on chain. The first executable we will write, is an executable to deploy duktape binary as well as our HTLC script on chain:

```
$ cd $TOP/htlc-runner
$ cat deploy_scripts.js
#!/usr/bin/env node

const CKB = require("@nervosnetwork/ckb-sdk-core").default
const utils = require("@nervosnetwork/ckb-sdk-utils")
const process = require('process')
const fs = require('fs')

if (process.argv.length !== 6) {
  console.log(`Usage: ${process.argv[1]} <duktape load0 binary> <js script> <private key> <node URL>`)
  process.exit(1)
}

const duktapeBinary = fs.readFileSync(process.argv[2])
const jsScript = fs.readFileSync(process.argv[3])

const privateKey = process.argv[4]
const nodeUrl = process.argv[5]

const run = async () => {
  const ckb = new CKB(nodeUrl)
  const secp256k1Dep = await ckb.loadSecp256k1Dep()

  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey)
  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

  const lockScript = {
    hashType: secp256k1Dep.hashType,
    codeHash: secp256k1Dep.codeHash,
    args: publicKeyHash
  }
  const lockHash = ckb.utils.scriptToHash(lockScript)

  const unspentCells = await ckb.loadCells({
    lockHash
  })
  const totalCapacity = unspentCells.reduce((sum, cell) => sum + BigInt(cell.capacity), 0n)

  // For simplicity, we will just use 1 CKB as fee. On a real setup you
  // might not want to do this.
  const fee = 100000000n
  const duktapeBinaryCapacity = BigInt(duktapeBinary.length) * 100000000n + 4100000000n
  const jsScriptCapacity = BigInt(jsScript.length) * 100000000n + 4100000000n

  const outputs = [
    {
      lock: {
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        hashType: 'data',
        args: '0x'
      },
      type: null,
      capacity: '0x' + duktapeBinaryCapacity.toString(16)
    },
    {
      lock: {
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        hashType: 'data',
        args: '0x'
      },
      type: null,
      capacity: '0x' + jsScriptCapacity.toString(16)
    },
    {
      lock: lockScript,
      type: null,
      capacity: '0x' + (totalCapacity - jsScriptCapacity - duktapeBinaryCapacity - fee).toString(16)
    }
  ]
  const outputsData = [
    utils.bytesToHex(duktapeBinary),
    utils.bytesToHex(jsScript),
    '0x'
  ]

  const transaction = {
    version: '0x0',
    cellDeps: [
      {
        outPoint: secp256k1Dep.outPoint,
        depType: 'depGroup'
      }
    ],
    headerDeps: [],
    inputs: unspentCells.map(cell => ({
      previousOutput: cell.outPoint,
      since: '0x0'
    })),
    outputs,
    witnesses: [
      {
        lock: '',
        inputType: '',
        outputType: ''
      }
    ],
    outputsData
  }
  const signedTransaction = ckb.signTransaction(privateKey)(transaction)

  const txHash = await ckb.rpc.sendTransaction(signedTransaction, 'passthrough')

  console.log(`Transaction hash: ${txHash}`)
  fs.writeFileSync('deploy_scripts_result.txt', txHash)
}

run()
```

The second executable creates a cell using HTLC script as lock:

```
$ cd $TOP/htlc-runner
$ cat create_htlc_cell.js
#!/usr/bin/env node

const { Molecule } = require('molecule-javascript')
const crc32 = require('crc32')
const CKB = require("@nervosnetwork/ckb-sdk-core").default
const utils = require("@nervosnetwork/ckb-sdk-utils")
const process = require('process')
const fs = require('fs')

function blake2b(buffer) {
  return utils.blake2b(32, null, null, utils.PERSONAL).update(buffer).digest('binary')
}

if (process.argv.length !== 8) {
  console.log(`Usage: ${process.argv[1]} <duktape load0 binary> <deployed tx hash> <private key> <node URL> <lock hash A> <lock hash B>`)
  process.exit(1)
}

const duktapeBinary = fs.readFileSync(process.argv[2])
const duktapeHash = blake2b(duktapeBinary)

const deployedTxHash = process.argv[3]
const privateKey = process.argv[4]
const nodeUrl = process.argv[5]
const lockHashA = process.argv[6]
const lockHashB = process.argv[7]

function hexStringToHexStringArray(s) {
  let arr = []
  for (let i = 2; i < s.length; i += 2) {
    arr.push('0x' + s.substr(i, 2))
  }
  return arr
}

const run = async () => {
  const ckb = new CKB(nodeUrl)
  const secp256k1Dep = await ckb.loadSecp256k1Dep()

  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey)
  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

  const lockScript = {
    hashType: secp256k1Dep.hashType,
    codeHash: secp256k1Dep.codeHash,
    args: publicKeyHash
  }
  const lockHash = ckb.utils.scriptToHash(lockScript)

  const unspentCells = await ckb.loadCells({
    lockHash
  })
  const totalCapacity = unspentCells.reduce((sum, cell) => sum + BigInt(cell.capacity), 0n)

  // For simplicity, we will just use 1 CKB as fee. On a real setup you
  // might not want to do this.
  const fee = 100000000n
  const htlcCellCapacity = 200000000000n

  const customSchema = JSON.parse(fs.readFileSync('../htlc-template/src/htlc-combined.json'))
  const htlcArgsType = new Molecule(
    customSchema.declarations.find(d => d.name == "HtlcArgs"))
  const htlcScriptArgs = htlcArgsType.serialize([
    ['a', hexStringToHexStringArray(lockHashA)],
    ['b', hexStringToHexStringArray(lockHashB)],
    ['hash', hexStringToHexStringArray('0x' + crc32('i am a secret'))]
  ])

  const transaction = {
    version: '0x0',
    cellDeps: [
      {
        outPoint: secp256k1Dep.outPoint,
        depType: 'depGroup'
      }
    ],
    headerDeps: [],
    inputs: unspentCells.map(cell => ({
      previousOutput: cell.outPoint,
      since: '0x0'
    })),
    outputs: [
      {
        lock: {
          codeHash: utils.bytesToHex(duktapeHash),
          hashType: 'data',
          args: htlcScriptArgs
        },
        type: null,
        capacity: '0x' + htlcCellCapacity.toString(16)
      },
      {
        lock: lockScript,
        type: null,
        capacity: '0x' + (totalCapacity - fee - htlcCellCapacity).toString(16)
      }
    ],
    witnesses: [
      {
        lock: '',
        inputType: '',
        outputType: ''
      }
    ],
    outputsData: [
      '0x',
      '0x'
    ]
  }
  const signedTransaction = ckb.signTransaction(privateKey)(transaction)

  const txHash = await ckb.rpc.sendTransaction(signedTransaction, 'passthrough')

  console.log(`Transaction hash: ${txHash}`)
  fs.writeFileSync('create_htlc_cell_result.txt', txHash)
}

run()
```

One thing worth mentioning, is that this executable shows how we can serialize a molecule formatted data structure:

```
// ...

function hexStringToHexStringArray(s) {
  let arr = []
  for (let i = 2; i < s.length; i += 2) {
    arr.push('0x' + s.substr(i, 2))
  }
  return arr
}

// ...

const customSchema = JSON.parse(fs.readFileSync('../htlc-template/src/htlc-combined.json'))
const htlcArgsType = new Molecule(
  customSchema.declarations.find(d => d.name == "HtlcArgs"))
const htlcScriptArgs = htlcArgsType.serialize([
  ['a', hexStringToHexStringArray(lockHashA)],
  ['b', hexStringToHexStringArray(lockHashB)],
  ['hash', hexStringToHexStringArray('0x' + crc32('i am a secret'))]
])

// ...
```

And now a executable that tries to unlock HTLC guarded cell by providing secret string:

```
$ cd $TOP/htlc-runner
$ cat unlock_via_secret_string.js
#!/usr/bin/env node

const { Molecule } = require('molecule-javascript')
const crc32 = require('crc32')
const CKB = require("@nervosnetwork/ckb-sdk-core").default
const utils = require("@nervosnetwork/ckb-sdk-utils")
const process = require('process')
const fs = require('fs')

function blake2b(buffer) {
  return utils.blake2b(32, null, null, utils.PERSONAL).update(buffer).digest('binary')
}

if (process.argv.length !== 8) {
  console.log(`Usage: ${process.argv[1]} <deployed tx hash> <htlc cell tx hash> <private key> <node URL> <secret string> <dry run>`)
  process.exit(1)
}

const deployedTxHash = process.argv[2]
const htlcCellTxHash = process.argv[3]
const privateKey = process.argv[4]
const nodeUrl = process.argv[5]
const secretString = process.argv[6]
const dryrun = process.argv[7] === 'true'

function stringToHexStringArray(s) {
  let a = []
  for (let i = 0; i < s.length; i++) {
    a.push('0x' + ('00' + s.charCodeAt(i).toString(16)).slice(-2))
  }
  return a
}

const run = async () => {
  const ckb = new CKB(nodeUrl)
  const secp256k1Dep = await ckb.loadSecp256k1Dep()

  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey)
  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

  const lockScript = {
    hashType: secp256k1Dep.hashType,
    codeHash: secp256k1Dep.codeHash,
    args: publicKeyHash
  }
  const lockHash = ckb.utils.scriptToHash(lockScript)

  const unspentCells = await ckb.loadCells({
    lockHash
  })
  const totalCapacity = unspentCells.reduce((sum, cell) => sum + BigInt(cell.capacity), 0n)

  // For simplicity, we will just use 1 CKB as fee. On a real setup you
  // might not want to do this.
  const fee = 100000000n
  const htlcCellCapacity = 200000000000n

  const customSchema = JSON.parse(fs.readFileSync('../htlc-template/src/htlc-combined.json'))
  const htlcWitnessType = new Molecule(
    customSchema.declarations.find(d => d.name == "HtlcWitness"))
  const htlcWitness = htlcWitnessType.serialize([
    ['s', stringToHexStringArray(secretString)],
    ['i', ['0x0', '0x0', '0x0', '0x0']]
  ])

  const transaction = {
    version: '0x0',
    cellDeps: [
      // Due to the requirement of load0 duktape binary, JavaScript source cell
      // should be the first one in cell deps
      {
        outPoint: {
          txHash: deployedTxHash,
          index: "0x1"
        },
        depType: 'code'
      },
      {
        outPoint: {
          txHash: deployedTxHash,
          index: "0x0"
        },
        depType: 'code'
      },
      {
        outPoint: secp256k1Dep.outPoint,
        depType: 'depGroup'
      }
    ],
    headerDeps: [],
    inputs: unspentCells.map(cell => ({
      previousOutput: cell.outPoint,
      since: '0x0'
    })),
    outputs: [
      {
        lock: lockScript,
        type: null,
        capacity: '0x' + (totalCapacity + htlcCellCapacity - fee).toString(16)
      }
    ],
    witnesses: unspentCells.map(_cell => '0x'),
    outputsData: [
      '0x',
      '0x'
    ]
  }
  transaction.inputs.push({
    previousOutput: {
      txHash: htlcCellTxHash,
      index: "0x0"
    },
    since: '0x0'
  })
  transaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: ''
  }
  const signedTransaction = ckb.signTransaction(privateKey)(transaction)
  signedTransaction.witnesses.push(htlcWitness)

  if (dryrun) {
    try {
      const result = await ckb.rpc.dryRunTransaction(signedTransaction)
      console.log(`Dry run success result: ${JSON.stringify(result, null, 2)}`)
    } catch (e) {
      console.log(`Dry run failure result: ${JSON.stringify(JSON.parse(e.message), null, 2)}`)
    }
  } else {
    const txHash = await ckb.rpc.sendTransaction(signedTransaction, 'passthrough')

    console.log(`Transaction hash: ${txHash}`)
    fs.writeFileSync('unlock_via_secret_string_result.txt', txHash)
  }
}

run()
```

Finally a executable that tries to unlock HTLC guarded cell assuming the waiting period has passed:

```
$ cd $TOP/htlc-runner
$ cat unlock_via_timeout.js
#!/usr/bin/env node

const { Molecule } = require('molecule-javascript')
const crc32 = require('crc32')
const CKB = require("@nervosnetwork/ckb-sdk-core").default
const utils = require("@nervosnetwork/ckb-sdk-utils")
const process = require('process')
const fs = require('fs')

function blake2b(buffer) {
  return utils.blake2b(32, null, null, utils.PERSONAL).update(buffer).digest('binary')
}

if (process.argv.length !== 8) {
  console.log(`Usage: ${process.argv[1]} <deployed tx hash> <htlc cell tx hash> <private key> <node URL> <header hash> <dry run>`)
  process.exit(1)
}

const deployedTxHash = process.argv[2]
const htlcCellTxHash = process.argv[3]
const privateKey = process.argv[4]
const nodeUrl = process.argv[5]
const headerHash = process.argv[6]
const dryrun = process.argv[7] === 'true'

const run = async () => {
  const ckb = new CKB(nodeUrl)
  const secp256k1Dep = await ckb.loadSecp256k1Dep()

  const htlcCellTx = await ckb.rpc.getTransaction(htlcCellTxHash)
  const htlcCellHeaderHash = htlcCellTx.txStatus.blockHash

  const publicKey = ckb.utils.privateKeyToPublicKey(privateKey)
  const publicKeyHash = `0x${ckb.utils.blake160(publicKey, 'hex')}`

  const lockScript = {
    hashType: secp256k1Dep.hashType,
    codeHash: secp256k1Dep.codeHash,
    args: publicKeyHash
  }
  const lockHash = ckb.utils.scriptToHash(lockScript)

  const unspentCells = await ckb.loadCells({
    lockHash
  })
  const totalCapacity = unspentCells.reduce((sum, cell) => sum + BigInt(cell.capacity), 0n)

  // For simplicity, we will just use 1 CKB as fee. On a real setup you
  // might not want to do this.
  const fee = 100000000n
  const htlcCellCapacity = 200000000000n

  const customSchema = JSON.parse(fs.readFileSync('../htlc-template/src/htlc-combined.json'))
  const htlcWitnessType = new Molecule(
    customSchema.declarations.find(d => d.name == "HtlcWitness"))
  const htlcWitness = htlcWitnessType.serialize([
    ['s', []],
    ['i', ['0x1', '0x0', '0x0', '0x0']]
  ])

  const transaction = {
    version: '0x0',
    cellDeps: [
      // Due to the requirement of load0 duktape binary, JavaScript source cell
      // should be the first one in cell deps
      {
        outPoint: {
          txHash: deployedTxHash,
          index: "0x1"
        },
        depType: 'code'
      },
      {
        outPoint: {
          txHash: deployedTxHash,
          index: "0x0"
        },
        depType: 'code'
      },
      {
        outPoint: secp256k1Dep.outPoint,
        depType: 'depGroup'
      }
    ],
    headerDeps: [
      htlcCellHeaderHash,
      headerHash,
    ],
    inputs: unspentCells.map(cell => ({
      previousOutput: cell.outPoint,
      since: '0x0'
    })),
    outputs: [
      {
        lock: lockScript,
        type: null,
        capacity: '0x' + (totalCapacity + htlcCellCapacity - fee).toString(16)
      }
    ],
    witnesses: unspentCells.map(_cell => '0x'),
    outputsData: [
      '0x',
      '0x'
    ]
  }
  transaction.inputs.push({
    previousOutput: {
      txHash: htlcCellTxHash,
      index: "0x0"
    },
    since: '0x0'
  })
  transaction.witnesses[0] = {
    lock: '',
    inputType: '',
    outputType: ''
  }
  const signedTransaction = ckb.signTransaction(privateKey)(transaction)
  signedTransaction.witnesses.push(htlcWitness)

  if (dryrun) {
    try {
      const result = await ckb.rpc.dryRunTransaction(signedTransaction)
      console.log(`Dry run success result: ${JSON.stringify(result, null, 2)}`)
    } catch (e) {
      console.log(`Dry run failure result: ${JSON.stringify(JSON.parse(e.message), null, 2)}`)
    }
  } else {
    const txHash = await ckb.rpc.sendTransaction(signedTransaction, 'passthrough')

    console.log(`Transaction hash: ${txHash}`)
    fs.writeFileSync('unlock_via_timeout_result.txt', txHash)
  }
}

run()
```

We are putting the header dep for HTLC input cell at index 0, the header to test for current timestamp at index 1, hence when we are preparing witness data, we use 0x01000000 for i, which is the little endian representation for 1.

This also provides a different inspiration. To prove certain time has past in CKB, you can use `since` field as shown in Nervos DAO validator script, you can also include a header on chain, and rely on the header's block number or timestamp to prove that certain time has already been reached. It really depends on your use case to tell which one is the better choice here.

With all 4 executables ready here, we are ready to play with our HTLC script a bit. But first, let's start a new CKB dev chain.

```
$ cd $TOP
$ export CKB="<path to your ckb binary>"
$ $CKB --version
ckb 0.28.0 (728eff2 2020-02-04)
# Block assembler args configured here correspond to the following private key:
# 0x0a14c6fd7af6a3f13c9e2aacad80d78968de5d068a342828080650084bf20104
$ $CKB init -c dev -C ckb-data --ba-arg 0x5a7487f529b8b8fd4d4a57c12dc0c70f7958a196
$ $CKB run -C ckb-data
```

On a different terminal, let's start a miner instance:

```
$ cd $TOP
$ $CKB miner -C ckb-data
```

We are using CKB's dev chain, since there are already 2 handy [addresses](https://github.com/nervosnetwork/ckb/blob/dad394ea3f50f518a40e5a8a457dfb6811ba245a/resource/specs/dev.toml#L70-L82) with issued balance, so we don't have to mine the CKB before testing. In addition, with a dev chain you can customize block issuing speed. However if you like you can also use the testnet, just remember never to use mainnet for testing here.

With the CKB instance running, HTLC script can be deployed and tested for real on chain.

```
# Make sure the HTLC script is successfully built first
$ cd $TOP/htlc-template
$ npm run build
# Ensure all scripts are runnable
$ cd $TOP/htlc-runner
$ chmod +x deploy_scripts.js
$ chmod +x create_htlc_cell.js
$ chmod +x unlock_via_secret_string.js
$ chmod +x unlock_via_timeout.js

# Let's first deploy duktape binary and JS scripts
$ ./deploy_scripts.js \
    ../ckb-duktape/build/load0 \
    ../htlc-template/build/duktape.js \
    0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc \
    "http://127.0.0.1:8114/"
This method is only for demo, don't use it in production
Transaction hash: 0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4

# Let's create a HTLC cell
$ ./create_htlc_cell.js \
    ../ckb-duktape/build/load0 \
    0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4 \
    0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc \
    "http://127.0.0.1:8114/" \
    0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947 \
    0xc219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd
This method is only for demo, don't use it in production
Transaction hash: 0x7de8ea6b0d6cb9941e76976d1d55edf844c4fa81485e00fb8eba2d161b5830cd

# To save us the hassle of recreating cells, both unlock executables support
# a dry run mode, where we only does full transaction verification, but do not
# commit the success ones on chain.
# First let's show that we can unlock a HTLC cell given the right secret string
# and lock script
$ ./unlock_via_secret_string.js \
    0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4 \
    0x7de8ea6b0d6cb9941e76976d1d55edf844c4fa81485e00fb8eba2d161b5830cd \
    0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc \
    "http://127.0.0.1:8114/" \
    "i am a secret" \
    true
This method is only for demo, don't use it in production
Dry run success result: {
  "cycles": "0xb1acc38"
}

# Given an invalid secret string, the transaction would fail the validation.
# If you have enabled debug output in CKB's configuration like mentioned here:
# https://docs.nervos.org/dev-guide/debugging-ckb-script.html#debug-syscall
# you can notice the failure lines in CKB's debug logs.
$ ./unlock_via_secret_string.js \
    0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4 \
    0x7de8ea6b0d6cb9941e76976d1d55edf844c4fa81485e00fb8eba2d161b5830cd \
    0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc \
    "http://127.0.0.1:8114/" \
    "invalid secret" \
    true
Dry run failure result: {
  "code": -3,
  "message": "Error { kind: ValidationFailure(-2) ...}"
}

# Given the correct secret string but an invalid public key, this would still
# fail the validation:
$ ./unlock_via_secret_string.js \
    0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4 \
    0x7de8ea6b0d6cb9941e76976d1d55edf844c4fa81485e00fb8eba2d161b5830cd \
    0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d \
    "http://127.0.0.1:8114/" \
    "i am a secret" \
    true
Dry run failure result: {
  "code": -3,
  "message": "Error { kind: ValidationFailure(-2) ...}"
}

# Now we've tested unlocking by providing secret string, let's try unlocking
# via waiting enough time. In my setup, I have the following values:
# HTLC cell is packed in transaction:
# 0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4
# which is commited in block:
# 0x04539cff3e1a106773bc1ec35804340c0981804093ce8d7a17e9ebc37a3268ff
# whose block number is 399.
#
# I'm gonna test it with block:
# 0xe93ebb311d156847fbcdc159d1fa3c38f12613121e51582272d909379c4d1a60
# whose block number is 409, and block:
# 0x665ccfab2d854afa035f4697a2301f2bad9d4aa86506090b104f8ed18772ca01
# whose block number is 510.
# Let's first try block 510 to verify that we can unlock the HTLC cell this way:
$ ./unlock_via_timeout.js \
    0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4 \
    0x7de8ea6b0d6cb9941e76976d1d55edf844c4fa81485e00fb8eba2d161b5830cd \
    0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d \
    "http://127.0.0.1:8114/" \
    0x665ccfab2d854afa035f4697a2301f2bad9d4aa86506090b104f8ed18772ca01 \
    true
This method is only for demo, don't use it in production
Dry run success result: {
  "cycles": "0x16c500ba"
  }
# Notice here we are unlocking using lock script hash:
# 0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d
# which is different from unlocking by providing secret string.

# Now let's try block 409 here:
$ ./unlock_via_timeout.js \
    0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4 \
    0x7de8ea6b0d6cb9941e76976d1d55edf844c4fa81485e00fb8eba2d161b5830cd \
    0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d \
    "http://127.0.0.1:8114/" \
    0xe93ebb311d156847fbcdc159d1fa3c38f12613121e51582272d909379c4d1a60 \
    true
Dry run failure result: {
  "code": -3,
  "message": "Error { kind: ValidationFailure(-2) ...}"
}
# As expected, this fails validatin, and if we check CKB's debug log(if you
# have enabled it), we can find log lines containing "Timeout period has not
# reached!", proving our script works as expected.

# One final step would checking unlocking with enough waiting, but using the
# wrong public key.
$ ./unlock_via_timeout.js \
    0xf30e1e8989fc3a4cb1e52dacc85090f8ff74b05e008d636b8c9154f5c296e1f4 \
    0x7de8ea6b0d6cb9941e76976d1d55edf844c4fa81485e00fb8eba2d161b5830cd \
    0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc \
    "http://127.0.0.1:8114/" \
    0x665ccfab2d854afa035f4697a2301f2bad9d4aa86506090b104f8ed18772ca01 \
    true
Dry run failure result: {
  "code": -3,
  "message": "Error { kind: ValidationFailure(-2) ...}"
}
# As expected, this also fails validation.
```

Notice the generated transaction hashes might different in each different run. So make sure to adjust parameters to the cells as needed.

This concludes our HTLC script runs as expected(well, excluding those vulnarable situations), hooray!

# Compute Intensive Code in JavaScript

Let's jump back for a second. I've been avoiding doing signatue verification code in our HTLC script written in JavaScript here. You might notice we also use a very simple CRC32 hashing algorithm, instead of the more secure hashing algorithms such as blake2b. While one major reason I did, is for the simplicity of this post(if you read till this point you will notice this post is already insanely long!), it is still not recommended to do those operations in JavaScript since:

- A crypto algorithm requires precise implementation, while I'm not saying you cannot do that, it certainly requires more care to build crypto algorithms in a higher-level language like JavaScript. It's much better to leverage existing battle-tested libraries written in C or Rust.
- Crypto algorithms are typical compute intensive code, since we are running JavaScript code in duktape, it can easily slow your code by 10x or even 100x. A native implementation can be much faster and saves significant cycles on CKB.

Right now the [duktape](https://github.com/xxuejie/ckb-duktape) distribution used here only contains duktape with no external libraries. In the future I might add other distributions with certain crypto algorithms shipped together, such as secp256k1 and blake2b. This way you will be able to invoke fast and secure crypto algorithms well within JavaScript. But please also remember sometimes, the delegate patterns mentioned above might suit your use case better.

# Recap

I sincerely hope you have read till this far, instead of skipping it. This is a ridiculously long post, but it contains a lot of useful information when building scripts on CKB:

- How to prepare a debugging environment that aids writting the script
- How to build custom data structure in molecule format
- How to serialize/deserialize molecule data structures
- How to include external libraries on npm and pack a single JavaScript for CKB use

While I might still add more posts to this series if I noticed interesting stuff to write, I'm sure the existing 7 posts in this series, together with [many](https://justjjy.com/Build-CKB-contract-with-Rust-part-1) [other](https://justjjy.com/CKB-contract-in-Rust-part-2-Rewrite-contract-with-ckb) [awesome](https://docs.nervos.org/dev-guide/debugging-ckb-script.html) [posts](https://mp.weixin.qq.com/s/9cP_Qik-AsdpiqL-q0ac4w) by my colleagues, have well prepared you to build awesome things on CKB. We are all prepared to amazed by the beautiful things you build on CKB :)
