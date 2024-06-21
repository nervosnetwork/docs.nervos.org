---
title: "Introduction to CKB Script Programming 8: Performant WASM"
date: "2020-03-02"
slug: intro-to-ckb-script-programming-8
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

In an [earlier post](../2019_10_09_introduction_to_ckb_script_programming_wasm_on_ckb/), I've shown you that you can have WASM programming running on CKB, with a little caveat that the WASM programs might not be so performant. I also mentioned that there is a potential solution that could solve the problem. And now it's the day! We now have a new [project](https://github.com/xxuejie/wavm-aot-generator) that could be used to generate performant WASM programs. Let's see how it works in this post.

# Background

(If you are impatient, you can skip this section and jump directly to Examples)

In the previous post, we are translating the WebAssembly programs back to C code, then compile it from C code to RISC-V again. But this has many drawbacks:

- It's not always possible to preserve all the optimizations done on the code in a C intermediate layer.
- Due to limitations in C, it is not possible to fully customize memory layout for the maximum performance.
- A C layer can be flaky at times and is not always easy to debug.

Here we are trying a different solution: [WAVM](https://github.com/WAVM/WAVM) is a high performance([benchmarks](https://00f.net/2019/10/22/updated-webassembly-benchmark/) show this is the highest performance WASM implementation so far) translation layer that compiles WASM code directly to native code via LLVM. Since LLVM 9+ has official RISC-V support, we can just retarget WAVM to RISC-V code, it will then be able to translate WASM program directly to RISC-V native code.

There's one additional problem: WAVM requires a runtime part to complement the native with surrounding environments. Currently this is included within WAVM with dependency on LLVM, which makes the binary quite huge. One day it suddenly occurs to me that all the information needed to build the runtime, is already included in the original WASM file, so we can just build a separate project, that processes the original WASM file and emits a minimal runtime part in plain C code, then we link it together with generated native code, the result will be a single RISC-V native program that is compiled from WASM code, and can run independently.

# Examples

Here we will use the exact same examples as the previous post: the fibonacci code written in AssemblyScript, and secp256k1 example in pure Rust. We will do a side-by-side comparison on the generated code size, and cycles consumed running in CKB VM. For the sake of completeness, we will also include native versions written in pure C in each example. As we will see below, even if our current WASM solution still has way to go towards the pure C version, it is already quite close and could enable many use cases.

First let's clone all the needed repos and do necessary preparations:

```
$ export TOP=$(pwd)
$ git clone https://github.com/AssemblyScript/assemblyscript.git
$ cd assemblyscript
$ git checkout b433bc425633c3df6a4a30c735c91c78526a9eb7
$ npm install

$ cd $TOP
$ git clone --recursive https://github.com/WebAssembly/wabt
$ cd wabt
$ git checkout bec78eafbc203d81b9a6d1ce81f5a80dd7bf692a
$ mkdir build
$ cd build
$ cmake ..
$ cmake --build .

$ cd $TOP
$ git clone https://github.com/xxuejie/WAVM
$ cd WAVM
$ git checkout cb35225feeb4ba1b5a9c73cbbdb07f4cace9b359
$ mkdir build
$ cd build
# Make sure you are using LLVM 9+, you might need to tweak this path depending
# on your environment
$ cmake .. -DLLVM_DIR=/usr/lib/llvm-9/lib/cmake/llvm
$ cmake --build .

$ cd $TOP
$ git clone https://github.com/xxuejie/wavm-aot-generator
$ cd wavm-aot-generator
$ git checkout 8c818747eb19494fc9c5e0289810aa7ad484a22e
$ cargo build --release

$ cd $TOP
$ git clone https://github.com/xxuejie/ckb-standalone-debugger
$ cd ckb-standalone-debugger
$ git checkout 15e8813b8cb886e95e2c81bbee9f26d47a831850
$ cd bins
$ cargo build --release

$ cd $TOP
$ git clone https://github.com/xxuejie/ckb-binary-patcher
$ cd ckb-binary-patcher
$ git checkout 930f0b468a8f426ebb759d9da735ebaa1e2f98ba
$ cd ckb-binary-patcher
$ cargo build --release

$ cd $TOP
$ git clone https://github.com/nervosnetwork/ckb-c-stdlib
$ cd ckb-c-stdlib
$ git checkout 693c58163fe37d6abd326c537447260a846375f0
```

## AssemblyScript Example

Here's our old fibonacci example in AssemblyScript, let's compile it to WebAssembly program first:

```
$ cd $TOP
$ cat << EOF > fib.ts
export function fib(n: i32): i32 {
  var a = 0, b = 1;
    for (let i = 0; i < n; i++) {
        let t = a + b; a = b; b = t;
  }
  return b;
}
EOF
$ assemblyscript/bin/asc fib.ts -b fib.wasm -O3
```

We will compile the WASM code to 2 different versions: C code, and RISC-V native code.

```
$ cd $TOP
$ wabt/build/wasm2c fib.wasm -o fib.c
$ WAVM/build/bin/wavm compile --target-triple riscv64 fib.wasm fib_precompiled.wasm
$ wavm-aot-generator/target/release/wavm-aot-generator fib_precompiled.wasm fib_precompiled
```

You might noticed that instead of generating native RISC-V code, we are using WAVM to generated a `precompiled object` formatted file. This is essentially the original WASM file with native code embedded in a custom section, this way we can feed a single file to our generator for convenience reasons.

Let's attach 2 distinct wrapper files used in 2 WASM solutions, and also provide a native implementation:

```
$ cd $TOP
$ cat << EOF > fib_wabt_main.c
#include <stdio.h>
#include <stdlib.h>
#include "ckb_syscalls.h"

#include "fib.h"

void (*Z_envZ_abortZ_viiii)(u32, u32, u32, u32);

void env_abort(u32 a, u32 b, u32 c, u32 d) {
  abort();
}

int main() {
  uint32_t value;
  uint64_t len = 4;
  int ret = ckb_load_witness((void*) &value, &len, 0, 0,
                             CKB_SOURCE_GROUP_INPUT);
  if (ret != CKB_SUCCESS) {
    return ret;
  }
  if (len < 4) {
    return -1;
  }

  init();
  u8 result = Z_fibZ_ii(value);

  return result;
}
EOF
$ cat << EOF > fib_wavm_main.c
#include "fib_precompiled_glue.h"
#include "abi/ckb_vm_wasi_abi.h"
#include "ckb_syscalls.h"

void* wavm_env_abort(void* dummy, int32_t code, int32_t a, int32_t b, int32_t c)
{
  ckb_exit(code);

  return dummy;
}

int main() {
  uint32_t value;
  uint64_t len = 4;
  int ret = ckb_load_witness((void*) &value, &len, 0, 0,
                             CKB_SOURCE_GROUP_INPUT);
  if (ret != CKB_SUCCESS) {
    return ret;
  }
  if (len < 4) {
    return -1;
  }

  wavm_ret_int32_t wavm_ret = wavm_exported_function_fib(NULL, value);
  return wavm_ret.value;
}
EOF
$ cat << EOF > fib_native_main.c
#include "ckb_syscalls.h"

int32_t fib(int32_t n) {
  int32_t a = 0;
  int32_t b = 1;

  for (int32_t i = 0; i < n; i++) {
    int32_t t = a + b;
    a = b;
    b = t;
  }

  return b;
}

int main() {
  uint32_t value;
  uint64_t len = 4;
  int ret = ckb_load_witness((void*) &value, &len, 0, 0,
                             CKB_SOURCE_GROUP_INPUT);
  if (ret != CKB_SUCCESS) {
    return ret;
  }
  if (len < 4) {
    return -1;
  }

  return fib(value);
}
EOF
```

You might noticed that we altered the wabt wrapper used in previous post, so that all 3 versions here load the input to fibonacci function from witness data, this way we can set the same standard for comparison.

Let's compile the 3 files first:

```
$ cd $TOP
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191209 bash
root@7f24745ca702:/# cd /code
root@7f24745ca702:/code# riscv64-unknown-elf-gcc -O3 -I ckb-c-stdlib -I wavm-aot-generator -I wabt/wasm2c fib_wabt_main.c fib.c wabt/wasm2c/wasm-rt-impl.c -o fib_wabt
root@7f24745ca702:/code# riscv64-unknown-elf-gcc -O3 -I ckb-c-stdlib -I wavm-aot-generator -I wabt/wasm2c fib_wavm_main.c wavm-aot-generator/abi/riscv64_runtime.S fib_precompiled.o -o fib_wavm -Wl,-T wavm-aot-generator/abi/riscv64.lds
root@7f24745ca702:/code# riscv64-unknown-elf-gcc -O3 -I ckb-c-stdlib -I wavm-aot-generator -I wabt/wasm2c fib_native_main.c -o fib_native
root@7f24745ca702:/code# exit
exit
$ ckb-binary-patcher/target/release/ckb-binary-patcher -i fib_wavm -o fib_wavm_patched
```

Due to a [VM bug](https://github.com/nervosnetwork/ckb-vm/issues/92), a [patcher](https://github.com/xxuejie/ckb-binary-patcher) utility has been provided to workaround RISC-V code that would generate the bug. Even though we only observed LLVM affected by this bug(GCC has optimizations that would generate different code), it still recommended to run the patcher against any script that you would want to run on CKB.

We also prepare a runner to run the scripts:

```
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

if ARGV.length != 2
  STDERR.puts "Usage: runner.rb <script file> <witness args>"
  exit 1
end

script_binary = File.read(ARGV[0])
script_hash = blake2b(script_binary)

tx = DATA.read.sub("@FIB_CODE", bin_to_hex(script_binary))
       .sub("@FIB_HASH", bin_to_hex(script_hash))
       .sub("@FIB_ARG", ARGV[1])

File.write("tx.json", tx)
commandline = "ckb-standalone-debugger/bins/target/release/ckb-debugger --tx-file tx.json --script-group-type type -i 0 -e input"
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
            "args": "0x",
            "code_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "hash_type": "data"
          },
          "type": {
            "args": "0x",
            "code_hash": "@FIB_HASH",
            "hash_type": "data"
          }
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
        "data": "@FIB_CODE"
      }
    ],
    "header_deps": []
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
      }
    ],
    "header_deps": [
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
      "@FIB_ARG"
    ],
    "outputs_data": [
      "0x"
    ]
  }
}
EOF
$ chmod +x runner.rb
```

Now we can take a look at the binary size of each version, and run the 3 versions of fibonacci calculation:

```
$ ls -lh fib_wabt fib_wavm_patched fib_native
-rwxr-xr-x 1 root 11K Mar  3 03:27 fib_native*
-rwxr-xr-x 1 root 53K Mar  3 03:26 fib_wabt*
-rwxr-xr-x 1 root 88K Mar  3 03:26 fib_wavm_patched*
$ ./runner.rb fib_wabt 0x10000000
Run result: Ok(61)
Total cycles consumed: 549478
Transfer cycles: 6530, running cycles: 542948
$ ./runner.rb fib_wabt 0x20000000
Run result: Ok(-30)
Total cycles consumed: 549590
Transfer cycles: 6530, running cycles: 543060
$ ./runner.rb fib_wabt 0x00010000
Run result: Ok(29)
Total cycles consumed: 551158
Transfer cycles: 6530, running cycles: 544628
$ ./runner.rb fib_wavm_patched 0x10000000
Run result: Ok(61)
Total cycles consumed: 22402
Transfer cycles: 19696, running cycles: 2706
$ ./runner.rb fib_wavm_patched 0x20000000
Run result: Ok(-30)
Total cycles consumed: 22578
Transfer cycles: 19696, running cycles: 2882
$ ./runner.rb fib_wavm_patched 0x00010000
Run result: Ok(29)
Total cycles consumed: 25042
Transfer cycles: 19696, running cycles: 5346
$ ./runner.rb fib_native 0x10000000
Run result: Ok(61)
Total cycles consumed: 3114
Transfer cycles: 1137, running cycles: 1977
$ ./runner.rb fib_native 0x20000000
Run result: Ok(-30)
Total cycles consumed: 3226
Transfer cycles: 1137, running cycles: 2089
$ ./runner.rb fib_native 0x00010000
Run result: Ok(29)
Total cycles consumed: 4794
Transfer cycles: 1137, running cycles: 3657
```

The input value is encoded in witness part as 32-bit unsigned little endian integer, meaning `0x10000000`, `0x20000000` and `0x00010000` here represent `16`, `32` and `256` respectively.

Since CKB VM emits 8-bit signed value as output, the calculated value are truncated here. But we do not care so much about the actual fibonacci number(well of course, assuming the 3 versions generate the same result), it's the cycle consumption that we care about here.

Some insights can thus be deduced from the values:

- The WAVM version generates the biggest binary size(88K), in fact it also requires loading more bytes into the VM as confirmed by `transfer cycles` of 19696(roughly speaking, 1 transfer cycle means 4 bytes loaded into the VM).
- The WABT version and native version both take about 7 cycles to calculate one round of fibonacci iteration, while the WAVM version takes about 11 cycles to calculate one round of iteration
- However, the WAVM version requires only about 2530 cycles to set up the running environment, while the WABT version takes about 542836 cycles to set up.

We can see that the WAVM version does take significant less cycles in the initial setup(this is hugely due to the custom memory layout we can leverage in WAVM version), but the WAVM version is slightly slower per fibonacci iteration. This might be due to the fact that LLVM still needs some work to catch up GCC's code generation quality for RISC-V, and it could also be that fibonacci is so simple, that GCC can perfectly pick up the calculation structure from the restored C code. For more complex examples, this might not be the case anymore.

I personally did do some investigation into the large binary size of WAVM binary, and the problem, is that all the symbols generated in WAVM, are declared public symbols. That means we cannot rely on dead code elimination(DCE) to purge those variables and functions that we are not used, hence a larger binary is generated here. If the original WASM program is generated by Rust or LLVM directly, this won't be a problem since DCE is already performed, but Assemblyscript tends to do less DCE, hence we have a larger binary. Later I might look into WAVM to see if there's a way we can tweak non-exported functions to be module local, if that can be resolved, we should be able to reduce the binary size of WAVM version to the same level like the other solutions.

# Rust Secp256k1 Example

Let's also try the more complicated Rust based secp256k1 example:

```
$ cd $TOP
$ git clone https://github.com/nervosnetwork/wasm-secp256k1-test
$ cd wasm-secp256k1-test
$ cargo build --release --target=wasm32-unknown-unknown

$ cd $TOP
$ wabt/bin/wasm2c wasm-secp256k1-test/target/wasm32-unknown-unknown/release/wasm-secp256k1-test.wasm -o secp.c
# There's a symbol confliction in the latest versioni of gcc with wabt here, this
# can serve as a temporary solutin
$ sed -i s/bcmp/bcmp1/g secp.c
$ WAVM/build/bin/wavm compile --target-triple riscv64 wasm-secp256k1-test/target/wasm32-unknown-unknown/release/wasm-secp256k1-test.wasm secp_precompiled.wasm
$ wavm-aot-generator/target/release/wavm-aot-generator secp_precompiled.wasm secp_precompiled

$ cd $TOP
$ cat << EOF > secp_wabt_main.c
#include <stdio.h>
#include <stdlib.h>
#include "ckb_syscalls.h"

#include "secp.h"

int main() {
  uint32_t value;
  uint64_t len = 4;
  int ret = ckb_load_witness((void*) &value, &len, 0, 0,
                             CKB_SOURCE_GROUP_INPUT);
  if (ret != CKB_SUCCESS) {
    return ret;
  }
  if (len < 4) {
    return -1;
  }

  init();

  uint32_t times = value >> 8;
  value = value & 0xFF;
  uint8_t result = 0;

  for (int i = 0; i < times; i++) {
    result += Z_runZ_ii(value);
  }

  return result;
}
EOF
$ cat << EOF > secp_wavm_main.c
#include "secp_precompiled_glue.h"
#include "abi/ckb_vm_wasi_abi.h"
#include "ckb_syscalls.h"

int main() {
  uint32_t value;
  uint64_t len = 4;
  int ret = ckb_load_witness((void*) &value, &len, 0, 0,
                             CKB_SOURCE_GROUP_INPUT);
  if (ret != CKB_SUCCESS) {
    return ret;
  }
  if (len < 4) {
    return -1;
  }

  uint32_t times = value >> 8;
  value = value & 0xFF;
  uint8_t result = 0;

  for (int i = 0; i < times; i++) {
    ckb_debug("One run!");
    wavm_ret_int32_t wavm_ret = wavm_exported_function_run(NULL, value);
    result += wavm_ret.value;
  }

  return result;
}
EOF
```

Now we can compile the code, then compare binary size as well as running cycles:

```
$ cd $TOP
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191209 bash
root@a237c0d00b1c:/# cd /code/
root@a237c0d00b1c:/code# riscv64-unknown-elf-gcc -O3 -I ckb-c-stdlib -I wavm-aot-generator -I wabt/wasm2c secp_wabt_main.c secp.c wabt/wasm2c/wasm-rt-impl.c -o secp_wabt
root@a237c0d00b1c:/code# riscv64-unknown-elf-gcc -O3 -I ckb-c-stdlib -I wavm-aot-generator -I wabt/wasm2c secp_wavm_main.c wavm-aot-generator/abi/riscv64_runtime.S secp_precompiled.o -o secp_wavm -Wl,-T wavm-aot-generator/abi/riscv64.lds
root@a237c0d00b1c:/code# exit
exit
$ ckb-binary-patcher/target/release/ckb-binary-patcher -i secp_wavm -o secp_wavm_patched

$ ls -l secp_wabt secp_wavm_patched
-rwxrwxr-x 1 ubuntu 1791744 Mar  3 05:27 secp_wabt*
-rw-rw-r-- 1 ubuntu 1800440 Mar  3 05:29 secp_wavm_patched
$ ./runner.rb secp_wabt 0x01010000
Run result: Ok(0)
Total cycles consumed: 35702943
Transfer cycles: 438060, running cycles: 35264883
$ ./runner.rb secp_wabt 0x01050000
Run result: Ok(0)
Total cycles consumed: 90164183
Transfer cycles: 438060, running cycles: 89726123
$ ./runner.rb secp_wavm_patched 0x01010000
Run result: Ok(0)
Total cycles consumed: 10206568
Transfer cycles: 428764, running cycles: 9777804
$ ./runner.rb secp_wavm_patched 0x01050000
Run result: Ok(0)
Total cycles consumed: 49307936
Transfer cycles: 428764, running cycles: 48879172
```

Like the previous case, we can deduce facts from the values as well:

- The binary sizes generated by the 2 version are only slightly different, WAVM has a slightly larger binary but the bytes needed to load into VM is less.
- In this case, a single secp256k1 verification step takes 9775342 in the WAVM version, while 13615310 cycles are needed in the WABT version. Here we can see doing translations in LLVM directly does provide better performance than a restored C version in WABT.
- For such a complex program, the WAVM version still only takes 2462 cycles to set up, while the WABT version would take an enourmous 21649573 cycles to set up things. Here WAVM version can provide you with big wins.

Since the current direct path from Rust to RISC-V does not allow std to be used. We cannot provide a similar native version directly. But just for the curious ones, I still provide a similar function in pure C, and we can measure the cycles taken by the C version compiled directly into RISC-V:

```
$ cd $TOP
$ git clone --recursive https://github.com/nervosnetwork/ckb-vm-bench-scripts
$ cd ckb-vm-bench-scripts
$ git checkout f7ab37c055b1a59bbc4f931c732331642c728c1d
$ cd $TOP
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191209 bash
root@ad22c452cb54:/# cd /code/ckb-vm-bench-scripts
root@ad22c452cb54:/code/ckb-vm-bench-scripts# make
(omitted ...)
root@ad22c452cb54:/code/ckb-vm-bench-scripts# exit
exit

$ ./runner.rb ckb-vm-bench-scripts/build/secp256k1_bench 0x01010000
Run result: Ok(0)
Total cycles consumed: 1621594
Transfer cycles: 272630, running cycles: 1348964

$ ./runner.rb ckb-vm-bench-scripts/build/secp256k1_bench 0x01050000
Run result: Ok(0)
Total cycles consumed: 7007598
Transfer cycles: 272630, running cycles: 6734968
```

As we can see here, the C native version takes 1346501 cycles per secp256k1 step, and 2463 cycles for initial bookkeeping work. Both the binary sizes and loaded bytes are also smaller.

I do want to mention here that we are not comparing the same code here, the C version and Rust version use different implementation, and we haven't benched the quality of the 2 implementations directly. That being said, assuming the 2 versions have similar performance, the Rust code, compiled to WASM first, then to RISC-V, is roughly 7x the performance of C code. Considering bound checking logic might also be performed by the Rust version, I would consider this is good performance for many many use cases. There're a whole lot of scripts that can work with this level of performance. What's more, you can always combine the C implemented performance oriented code and Rust implemented logic code together to enjoy the best of both works. And we haven't mentioned the best of this new route. Last but not least, all the involved projects, including Rust, LLVM, WAVM and our generator are active projects with development work going on, soon this gap might become much narrower with progresses made by all the awesome engineers.

# WASI

I kept talking about doing Rust on CKB via WASM, my colleague has [proved](https://justjjy.com/Build-CKB-contract-with-Rust-part-1) there is a path you can go directly from Rust to RISC-V, what does a WASM intermediate path help here? The problem with a native path, is that Rust's std is not supported in RISC-V port, to make matters worse, libc binding is also absent. This means you will really have to work with core Rust, a minimal and limited set of Rust. Please don't get me wrong, there's nothing bad about going with core Rust, if your use case is enough with Rust's std, you are perfectly good going that path. But I do want to provide a different path, where std is available, so most Rust libraries on crates can be used to build awesome CKB scripts. This is what the WASM path can enable us with WASI.

If you haven't heard of it, [WASI](https://wasi.dev/) is a standard way of interfacing with the running environment for a WebAssembly program. It has [been](https://github.com/alexcrichton/cc-rs/issues/447) [proved](https://github.com/alexcrichton/cc-rs/issues/446) that Rust's WASM future lies in a new `wasm32-wasi` target. By doing the WASM intermediate step, we can build WASI support right into CKB script, enjoying the future-proof `wasm32-wasi` target of Rust! In fact, WAVM already provides an [example](https://github.com/xxuejie/WAVM/blob/master/Examples/helloworld.wast) that leverages 2 of WASI's API, let's see if we can get that to work on CKB:

```
$ cd $TOP
$ WAVM/build/bin/wavm compile --target-triple riscv64 WAVM/Examples/helloworld.wast helloworld_precompiled.wasm
$ wavm-aot-generator/target/release/wavm-aot-generator helloworld_precompiled.wasm helloworld_precompiled
$ cat << EOF > helloworld_wavm_main.c
#include "helloworld_precompiled_glue.h"
#include "abi/ckb_vm_wasi_abi.h"

/* main is already generated via wavm-aot-generator */
EOF
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191209 bash
root@d28602dba318:/# cd /code
root@d28602dba318:/code# riscv64-unknown-elf-gcc -O3 -I ckb-c-stdlib -I wavm-aot-generator -I wabt/wasm2c helloworld_wavm_main.c wavm-aot-generator/abi/riscv64_runtime.S
helloworld_precompiled.o -o helloworld_wavm -Wl,-T wavm-aot-generator/abi/riscv64.lds
root@d28602dba318:/code# exit
exit
$ ckb-binary-patcher/target/release/ckb-binary-patcher -i helloworld_wavm -o helloworld_wavm_patched
$ RUST_LOG=debug ./runner.rb helloworld_wavm_patched 0x
DEBUG:<unknown>: script group: Byte32(0x86cfac3b49b8f97f913aa5a09d02ad1e5b1ab5be0be793815e9cb714ba831948) DEBUG OUTPUT: Hello World!

Run result: Ok(0)
Total cycles consumed: 20260
Transfer cycles: 17728, running cycles: 2532
```

We can see the WASI APIs work perfectly! This is because I have already provided the [implementation](https://github.com/xxuejie/wavm-aot-generator/blob/8c818747eb19494fc9c5e0289810aa7ad484a22e/abi/ckb_vm_wasi_abi.h#L51-L91) for the 2 APIs used here. While it is incomplete now, I will work to add shims for all WASI APIs. After that we can have Rust programs, with std supported, compiled to `wasm32-wasi` target's WASM code, then translated to RISC-V perfectly.

You see many different blockchains claiming they use WebAssembly everyday, but what they don't tell you, is that WebAssembly is designed to have many flavors, and they just choose to support one of them. In fact [many](https://github.com/paritytech/substrate/issues/4043) [famous](https://github.com/confio/cosmwasm/blob/master/Building.md#requirements) [blockchains](https://github.com/CasperLabs/CasperLabs/tree/dev/execution-engine/cargo-casperlabs#building-the-contract~) [only](https://github.com/EOSIO/eosio.cdt/blob/master/tools/external/wabt/src/emscripten-helpers.cc) tend to support a bare minimal WebAssembly program. While most of them let you use Rust, they only use the flaky and could-be-deprecated `wasm32-unknown-unknown` target. As a result, they either just disable Rust std directly, claiming you don't need it, or has flaky support that might break going into the future, or they cannot afford to change the code for compatibility reasons. On the other hand, you can enjoy WASI and full feature Rust in CKB. Many ask us why we don't use WebAssembly directly, I would say that we are the first one, or at least among the first ones to get WebAssembly right on blockchains.

# "Vice Verca" doesn't always work well

One recurring topic we heard, is that if you can translate WASM to RISC-V, you can also translate RISC-V to WASM! In a sense that is true, but there's a difference betweeen one thing that works, and one thing that works well.

RISC-V, due to its design, is a very simple specification that maps extremely well to modern day CPUs. If you check our VM implementation, you might notice that most RISC-V instructions map directly onto a dozen x86-64 CPU instructions. We are just building a minimal secure layer that works on top of the CPUs in your machines. WASM, on the other hand, is a [beast](https://webassembly.org/docs/future-features/) much like JVM, there are tons of features in the spec already, there are also tons of features being added to the spec everyday. Many of the new features don't have direct mappings on CPUs, ranging from lower level instructions such as `memory.grow` or `callIndirect`, to higher level features such as garbage collections, or threading. When you pick WebAssembly as your blockchain's engine, you will have to pick a set of features, and decide how/if you want to migrate when new features keep coming out. To complicate this matter, you cannot just change the implementation of some features in your current WebAssembly engine, cuz that might bring incompatible changes.

When you pick RISC-V as the underlying engine, you don't have such concerns. RISC-V is designed for hardware that never changes. When the spec is fixed, it will be fixed forever, and all compilers have to respect bugs in the spec. And when you are implementing WebAssembly programs on top of RISC-V, you are free to change the implementations of higher constructs in WebAssembly anyway you want. For example, you might discover a new garbage collection algorithm that will help your smart contracts, you can deploy the algorithm by upgrading the a different smart contract, no forks are needed to support this. All of these are extremely hard to being even impossible if you tackle the problem starting from a WebAssembly engine. That is where I believe the true beauty of CKB's unique design lies.

# Recap

Here's one suggestion: if someone tells you his/her blockchain uses WebAssembly, do yourself a favor, and ask what specific spec his/her WebAssembly engine uses, and how he/she plan to tackle the problem when more features are added to the WebAssembly specification. WebAssembly is an evergrowing specification due to its Web roots, picking one specification and freeze there is never a good strategy for employing WebAssembly in a stack. There's nothing wrong relying on WebAssembly in the blockchain world, but it matters if WebAssembly is used in the correct way. To me, CKB is one example that WebAssembly is used in the correct way with future issues considered. I do believe you will thank yourself years later, if you take the extra effort ensuring your choice of blockchain deploys WebAssembly the correct way.
