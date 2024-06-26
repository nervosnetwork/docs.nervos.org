---
title: "Introduction to CKB Script Programming 9: Cycle Reductions in Duktape Script"
date: "2020-03-19"
slug: intro-to-ckb-script-programming-9
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

As shown earlier, plain JavaScript can be used to build CKB scripts. But if you have tried this route before, one problem you would notice, is that JavaScript based scripts tend to consume much more cycles than a native version. While this is less of an issue in experimenting, it is very real in production environment: more cycles can naturally be reflected in more transaction fees. It's obvious that the following solutions can be used to tackle this problem:

1. Rewrite a JavaScript in a native compiled language, such as C or Rust;
2. Use better algorithms that require less cycles;

In this post, we would take a different path, and take a look at JavaScript scripts alone. Even though JavaScript can consume more cycles, it still allows fast iteraction, which might be critical in certain use cases. So the question I want to ask here is: if we decide to use JavaScript to build our CKB scripts, and we have already improved the algorithms and implementations to an optimal state, are there any other steps we can take to further optimize cycle reductions? Here we shall see some attempts at the problem.

# Script To Use

We will build a simple script here that reads and prints current script args. To build the JavaScript script, we will first need the [duktape template](https://github.com/xxuejie/ckb-duktape-template):

```
$ export TOP=$(pwd)
$ git clone https://github.com/xxuejie/ckb-duktape-template
$ cd ckb-duktape-template
$ git checkout 1a3536ae1dc14abe1e91461ab356e8967cde8d7b
$ npm i
$ cat << EOF > src/index.js
import { Script } from "../schema/blockchain.js"

function bytesToHex(b) {
  return "0x" + Array.prototype.map.call(
    new Uint8Array(b),
    function(x) {
      return ('00' + x.toString(16)).slice(-2)
    }
  ).join('')
}

const script = new Script(CKB.load_script(0))
const args = script.getArgs().raw()
CKB.debug(bytesToHex(args))
EOF
$ npm run build
```

Note this example also levearges the rebuilt [Molecule JavaScript plugin](https://github.com/xxuejie/moleculec-es). Compared to the previous one, it provides a better API, while at the same time saving huge code size and runtime cycles.

Let's get a baseline number first:

```
$ cd $TOP
$ git clone --recursive https://github.com/xxuejie/ckb-duktape
$ cd ckb-duktape
$ git checkout d6241938247b402ec56c7af218acfc9049ac753d
$ docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191209 bash
root@0d31cad7a539:~# cd /code
root@0d31cad7a539:/code# make
root@0d31cad7a539:/code# exit
exit
$ cd $TOP
$ git clone https://github.com/xxuejie/ckb-standalone-debugger
$ cd ckb-standalone-debugger/bins
$ git checkout 3c503b95962e29057b248aeed4f639180c132fff
$ cargo build --release
$ cd $TOP
$ cat << EOF > runner.rb
#!/usr/bin/env ruby

require "rbnacl"

def bin_to_hex(bin)
  "0x#{bin.unpack1('H*')}"
end

def blake2b(data)
  RbNaCl::Hash::Blake2b.digest(data,
                               personal: "ckb-default-hash",
                               digest_size: 32)
end

if ARGV.length != 2 && ARGV.length != 3
  STDERR.puts "Usage: runner.rb <duktape file> <script file> <optional dump file>"
  exit 1
end

duktape_binary = File.read(ARGV[0])
duktape_hash = blake2b(duktape_binary)
script_binary = File.read(ARGV[1])

tx = DATA.read.sub("@DUKTAPE_CODE", bin_to_hex(duktape_binary))
       .sub("@DUKTAPE_HASH", bin_to_hex(duktape_hash))
       .sub("@SCRIPT_CODE", bin_to_hex(script_binary))

File.write("tx.json", tx)
commandline = "ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input"
if ARGV.length == 3
  commandline += " -d #{ARGV[2]}"
end
STDERR.puts "Executing: #{commandline}"
exec(commandline)

__END__
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
EOF
$ chmod +x runner.rb
$ RUST_LOG=debug ./runner.rb ckb-duktape/build/load0 ckb-duktape-template/build/duktape.js
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input
DEBUG:<unknown>: script group: Byte32(0xcf13fa84ff3a615dd496e9ad8647af01078b11ba1c2757889f0a95e2520fdeb9) DEBUG OUTPUT: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 20198757
Transfer cycles: 67328, running cycles: 20131429
```

About 20 million cycles are needed for this simple script. As a comparison, we can also implement similar function in pure C:

```
$ cd $TOP
$ cat << EOF > c.c
#include "blockchain.h"
#include "ckb_syscalls.h"

#define MAXIMUM_ARG_SIZE 4096
#define SCRIPT_SIZE 32768

#define ERROR_ARGUMENTS_LEN -1
#define ERROR_ENCODING -2
#define ERROR_SYSCALL -3
#define ERROR_SCRIPT_TOO_LONG -21
#define ERROR_OVERFLOWING -51
#define ERROR_AMOUNT -52

int main() {
  unsigned char script[SCRIPT_SIZE];
  uint64_t len = SCRIPT_SIZE;
  int ret = ckb_load_script(script, &len, 0);
  if (ret != CKB_SUCCESS) {
    return ERROR_SYSCALL;
  }
  if (len > SCRIPT_SIZE) {
    return ERROR_SCRIPT_TOO_LONG;
  }
  mol_seg_t script_seg;
  script_seg.ptr = (uint8_t *)script;
  script_seg.size = len;

  if (MolReader_Script_verify(&script_seg, false) != MOL_OK) {
    return ERROR_ENCODING;
  }

  mol_seg_t args_seg = MolReader_Script_get_args(&script_seg);
  mol_seg_t args_bytes_seg = MolReader_Bytes_raw_bytes(&args_seg);
  if (args_bytes_seg.size > MAXIMUM_ARG_SIZE) {
    return ERROR_ARGUMENTS_LEN;
  }

  static const char HEXCHARS[] = "0123456789abcdef";
  char hex[MAXIMUM_ARG_SIZE * 2 + 1];
  for (size_t i = 0; i < args_bytes_seg.size; i++) {
    hex[i * 2] = HEXCHARS[args_bytes_seg.ptr[i] >> 4];
    hex[i * 2 + 1] = HEXCHARS[args_bytes_seg.ptr[i] & 0xF];
  }
  hex[args_bytes_seg.size * 2] = '\0';
  ckb_debug(hex);

  return CKB_SUCCESS;
}
EOF
$ docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191209 bash
root@57b79063c965:/# cd /code
root@57b79063c965:/code# riscv64-unknown-elf-gcc -O3 -I ckb-duktape/deps/ckb-c-stdlib -I ckb-duktape/deps/molecule c.c -o c -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
root@57b79063c965:/code# exit
exit
$ RUST_LOG=debug ./runner.rb c ckb-duktape-template/build/duktape.js
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input
DEBUG:<unknown>: script group: Byte32(0x9f637b251b36de8e6c8b48a1db2f2dcbb0e7b667de1d3ec02c589a7b680842e1) DEBUG OUTPUT: 32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 5456
Transfer cycles: 878, running cycles: 4578
```

As we shall see here, a similar C script takes only 4578 cycles, which is much less than the JavaScript scripts. Even though our JavaScript script might need consume so less cycles, we can still significantly reduce the cycle consumptions.

# Step 1: Skip Initialization

Those who are familiar with dynamic languages, would realize that all dynamic language implementations will need an initialization phase to create and properly setup the VM, this could take significant work, costing a lot of cycles. Our first idea comes from this: what if we can save the already initialized state, and reuse that state in later VM executions? The whole state of a CKB VM instance, is 33 registers(32 general purpose registers + PC register) and the memory states. If we can dump those into a separate binary, and recreate the same VM state later, we won't need to do the whole initialization step again and again.

ckb-standalone-debugger actually provides such a dump feature. It adds a new syscall to the VM instance created by the debugger(notice this syscall is useless in production, and will probably never make it into production). When the syscall gets executed, the debugger instance would serialize all VM states, including all registers and memories into a custom-built executable. Later if we instantiate a new VM instance with this generated executable, it will restore all VM states, and the VM will continue to run as if it just returns from the syscall. This way we can do the necessary initialization steps offline via the debugger, then only deploy the generated executable to CKB, all later executions on the executable, can skip the costly initialization part, hence saving a huge amount of cycles.

I have already prepared a duktape [instance](https://github.com/xxuejie/ckb-duktape/blob/d6241938247b402ec56c7af218acfc9049ac753d/c/dump_load0.c) which performs the setup, then execute the dump syscall, we can now give this a test:

```
$ cd $TOP
$ RUST_LOG=debug ./runner.rb ckb-duktape/build/dump_load0 ckb-duktape-template/build/duktape.js dump0.bin
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input -d dump0.bin
DEBUG:<unknown>: script group: Byte32(0xb5656359cbcd52cfa68e163cdd217657f0cfc533c909d13a1fdd8032f6b4f1f0) DEBUG OUTPUT: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 20199104
Transfer cycles: 67352, running cycles: 20131752

$ RUST_LOG=debug ./runner.rb dump0.bin ckb-duktape-template/build/duktape.js
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input
DEBUG:<unknown>: script group: Byte32(0x51959c6288a1cfba0d7f7dc8c5a90cf9a84bf5b58f1d5ed3b355497d119fba16) DEBUG OUTPUT: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 16249542
Transfer cycles: 96998, running cycles: 16152544
```

The first command here executes the script as normals, but internally it [calls](https://github.com/xxuejie/ckb-duktape/blob/d6241938247b402ec56c7af218acfc9049ac753d/c/dump_load0.c#L14) the dump syscall, resultling in a dumping of the VM state then into `dump0.bin` executable file. Later when we run CKB VM on `dump0.bin` directly, we can notice it performs the same action as the above duktape binary, but saves us close to 4 million cycles.

# Step 2: Bytecode Over Source

Previously, we've been running duktape on CKB VM directly against JavaScript source, this means at runtime, duktape would first need to parse the JavaScript source code, then execute it. The parsing time exists in every single invocation of the same JavaScript file, which could also be a huge waste of cycles. Luckily, duktape provides a [bytecode](https://github.com/svaarala/duktape/blob/master/doc/bytecode.rst) format: we can parse the JavaScript source to duktape bytecode format, and only loads and runs the bytecode at runtime. Let's try this now:

```
$ cd $TOP
$ ckb-duktape/build/dump_bytecode ckb-duktape-template/build/duktape.js script.bin
$ RUST_LOG=debug ./runner.rb ckb-duktape/build/dump_load0 script.bin dump0.bin
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input -d dump0.bin
DEBUG:<unknown>: script group: Byte32(0xb5656359cbcd52cfa68e163cdd217657f0cfc533c909d13a1fdd8032f6b4f1f0) DEBUG OUTPUT: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 9239414
Transfer cycles: 67352, running cycles: 9172062

$ RUST_LOG=debug ./runner.rb dump0.bin script.bin
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input
DEBUG:<unknown>: script group: Byte32(0x51959c6288a1cfba0d7f7dc8c5a90cf9a84bf5b58f1d5ed3b355497d119fba16) DEBUG OUTPUT: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 5289852
Transfer cycles: 96998, running cycles: 5192854
```

The [dump_load0](https://github.com/xxuejie/ckb-duktape/blob/d6241938247b402ec56c7af218acfc9049ac753d/c/dump_load0.c#L26-L37) binary actually supports both duktape bytecode and JavaScript source. It does a runtime check to see if the loaded data here is duktape bytecode or JavaScript source. Here we can see that by combining the previous 2 solutions, we can already shrink the cycle consumption from ~ 20 million to ~ 5 million.

Note that duktape bytecode does come with tradeoffs. It never ensures version compatibility, so different versions of duktape, or even different builds of the same duktape version could use different bytecode format. In a normal environment, this could be a problem, but since here we also ship duktape binary as a smart contract, we can lock the version of duktape binary we are using, ensuring the bytecode always works. Another drawback, and a big surprise to many, is that the bytecode file is in fact usually larger than the original JavaScript source file:

```
$ cd $TOP
$ ls -l script.bin
-rw-rw-r-- 1 ubuntu 7810 Mar 19 05:28 script.bin
$ ls -l ckb-duktape-template/build/duktape.js
-rw-rw-r-- 1 ubuntu 3551 Mar 19 04:46 ckb-duktape-template/build/duktape.js
```

In our example, while the original minimize JavaScript file is about 3.5K, the generated bytecode file is closed to 8K. This brings a tradeoff depending on your use case: do you want smaller file, or less cycle consumption?

# Step 3: Skip Cleanup Work

CKB VM works slightly different from other environment: it provides you with a fixed 4MB memory segment, and the whole segment will just be thrown away once the code finishes execution. This brings an interesting insight: in a normal environment, you definitely want to cleanup the resource you use before exiting, but in CKB VM environment, this is not necessary, since the whole memory segment will be destroyed all together. As long as you signal the correct response, cleanup steps are actually just a waste of cycles in CKB VM. Given this consideration, I've provided [dump_load0_nocleanup](https://github.com/xxuejie/ckb-duktape/blob/d6241938247b402ec56c7af218acfc9049ac753d/c/dump_load0_nocleanup.c) variation, which [does not perform](https://github.com/xxuejie/ckb-duktape/blob/d6241938247b402ec56c7af218acfc9049ac753d/c/dump_load0_nocleanup.c#L48-L49) any cleanup work after running the script. Now it is the time to try this final version:

```
$ cd $TOP
$ RUST_LOG=debug ./runner.rb ckb-duktape/build/dump_load0_nocleanup script.bin dump0.bin
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input -d dump0.bin
DEBUG:<unknown>: script group: Byte32(0x06034ffb00fec553882c6a9c7614333a728828772d3c236a7f8fa6af60669538) DEBUG OUTPUT: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 7856033
Transfer cycles: 67348, running cycles: 7788685

$ RUST_LOG=debug ./runner.rb dump0.bin script.bin
Executing: ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type lock -i 0 -e input
DEBUG:<unknown>: script group: Byte32(0x0e948e69dd75f2d6676048569073afe4ec2b284144bbe33a6216b13171606d18) DEBUG OUTPUT: 0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947c219351b150b900e50a7039f1e448b844110927e5fd9bd30425806cb8ddff1fd970dd9a8
Run result: Ok(0)
Total cycles consumed: 3903352
Transfer cycles: 96994, running cycles: 3806358
```

With all the solutions combined, we managed to reduce the cycle consumption of a JavaScript based CKB smart contract from 20 million to less than 4 million. This is still far from the C version, which takes less than 5000 cycles. But in many cases, a higher level language like JavaScript will provide superiority over plain old C, and the cycle consumption here might already be good enough.

# Future

The above are just 3 simple solutions you can levarage, there are very likely to be more way you can use to reduce cycles. One thing to remember, is that you don't have to cater for rules established in an everyday running program. As long as the script satisfies the verification needs on chain, you can employ any techniques to reduce the cycle consumption.
