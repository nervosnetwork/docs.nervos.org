---
title: "Introduction to CKB Script Programming 4: WebAssembly on CKB"
date: "2019-10-09"
slug: intro-to-ckb-script-programming-4
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

Since we made the choice to build CKB's virtual machine with RISC-V, we've been getting a question almost everyday: why don't you build your virtual machine on WebAssembly like everyone else does?

There're many reasons behind this choice, making it a perfect choice for another article or even a conference talk. But fundamentally there lies one important reason: building software is all about finding the right abstraction, and we believe RISC-V is a better abstraction than WebAssembly for public permissionless blockchain.

While WebAssembly is already a huge advancement over higher level programming langauges as well as the first generation blockchain virtual machines, RISC-V works at a much lower level than WebAssembly, making it a more suitable choice for public blockchains which are designed to run for decades to come.

But that still leaves one question unanswered: a significant portion of the blockchain industry is betting on WebAssembly, contributing an (arguably) better ecosystem building on WebAssembly powered dapps. How can CKB compete with that? As mentioned above, RISC-V is actually a lower level of abstraction than WebAssembly, we can port existing WebAssembly programs, and run them on CKB VM directly. This way, we can enjoy the flexibility and stability provided by RISC-V, while also embracing the WebAssembly ecosystem.

In this article, we will show how you can run WebAssembly programs in CKB VM, we will also show that it actually has more benefits running this way than directly using a WebAssembly VM.

Personally, while I believe WebAssembly has some interesting features enabling different use cases, I don't believe WebAssembly has a better ecosystem in the blockchain space. If you look around, there are probably just 2 mature choices for building dapps in a WebAssembly-based blockchain: Rust, and AssemblyScript. People keep bragging about WebAssembly's ability to support arbitrary languages in a single abstract VM(I personally refuse to call WebAssembly low-level VM), but it really just comes down to one of the 2 choices here to build a real dapp. I think we probably have different definitions if we can call 2 supported languages a good VM ecosystem. There are some [other languages](https://github.com/tweag/asterius) playing catching up here, but they are not yet at stable phase to count as a richful ecosystem. While some [interesting langauges](https://github.com/forest-lang/forest-compiler) have potentials in a WebAssembly based environment, no one pays attention to support them. And if you look hard enough, it also remains a question if 2 different blockchains using WebAssembly can share contracts with each other. Of course one might say: "well it's just a matter of time, given time more vibrant WebAssembly ecosystem will sprout", but the same argument could apply anywhere: why given time, an ecosystem for RISC-V won't be better?

But enough for the rant, let's just assume for now, WebAssembly does have a blockchain ecosystem, we can show that the 2 widely used choices, AssemblyScript and Rust, are all supported in a CKB VM environment.

# AssemblyScript

I believe no words speak better than a demo you can play with. So let's try the official AssemblyScript and run the compiled program on CKB. We will just use the official example in AssemblyScript's [introduction page](https://docs.assemblyscript.org/):

```
$ cat fib.ts
export function fib(n: i32): i32 {
  var a = 0, b = 1;
    for (let i = 0; i < n; i++) {
        let t = a + b; a = b; b = t;
  }
  return b;
}
```

Please refer to AssemblyScript's documentation on how to install it. For convenience, I have some steps that you can just copy-paste here.

```
$ git clone https://github.com/AssemblyScript/assemblyscript.git
$ cd assemblyscript
$ npm install
$ bin/asc ../fib.ts -b ../fib.wasm -O3
$ cd ..
```

We have a compiled WebAssembly program to use here. What we can do then, is invoke a program named [wasm2c](https://github.com/WebAssembly/wabt/tree/master/wasm2c) to compile it to C source file, then compile it via a RISC-V compiler to a RISC-V program, and run it on CKB VM.

I'm sure you would ask: but this is a hack! It sort of does a decompilation of the WASM program then make it work, you are cheating here. The answer to this question, is yes and no:

- On the one hand, yes I'm cheating here, but the question I'm gonna raise in response is: all we should care, is the end result, if the result is good enough, why should we care if this is cheating? In addition, modern compiler is already complicated enough like a total black box, how can we be sure this decompilation will achieve worse result?
- On the other hand, this is just one way of transforming WebAssembly into RISC-V. There're numerous other ways in which you can achieve the same result. We will come back to this in the Recap section later.

Let's fire up `wasm2c` and transform the WebAssembly program:

```
$ git clone --recursive https://github.com/WebAssembly/wabt
$ cd wabt
$ mkdir build
$ cd build
$ cmake ..
$ cmake --build .
$ cd ../..
$ wabt/bin/wasm2c fib.wasm -o fib.c
```

You will see a pair of `fib.c` and `fib.h` file in current directory, they contain the transformation result of the WebAssembly program, and when compiled and called correctly, they will achieve the same feature as the WebAssembly program.

We can use a small wrapper C file to invoke the WebAssembly program:

```
$ cat main.c
#include <stdio.h>
#include <stdlib.h>

#include "fib.h"

int main(int argc, char** argv) {
  if (argc < 2) return 2;

  u8 x = atoi(argv[1]);

  init();

  u8 result = Z_fibZ_ii(x);

  return result;
}
```

This just reads an integer from a CLI argument, invokes the fibonacci function in the WebAssembly program, then return the result. Let's try compile it first:

```
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
(docker) $ cd /code
(docker) $ riscv64-unknown-elf-gcc -o fib_riscv64 -O3 -g main.c fib.c /code/wabt/wasm2c/wasm-rt-impl.c -I /code/wabt/wasm2c
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccfUDYhE.o: in function `__retain':
/code/fib.c:1602: undefined reference to `Z_envZ_abortZ_viiii'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccfUDYhE.o: in function `i32_load':
/code/fib.c:42: undefined reference to `Z_envZ_abortZ_viiii'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccfUDYhE.o: in function `f17':
/code/fib.c:1564: undefined reference to `Z_envZ_abortZ_viiii'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /code/fib.c:1564: undefined reference to `Z_envZ_abortZ_viiii'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccfUDYhE.o: in function `f6':
/code/fib.c:1011: undefined reference to `Z_envZ_abortZ_viiii'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccfUDYhE.o:/code/fib.c:1012: more undefined references to `Z_envZ_abortZ_viiii' follow
collect2: error: ld returned 1 exit status
(docker) $ exit
```

As shown above, there's an error here. It tells us there's an `Z_envZ_abortZ_viiii` function not defined. Let's dive into why this happened.

First, let's transform the original WebAssembly file into a human readable form:

```
$ wabt/bin/wasm2wat fib.wasm -o fib.wast
$ cat fib.wast | grep "(import"
(import "env" "abort" (func (;0;) (type 2)))
```

So the problem is that WebAssembly can import external functions, when invoking, provides additional functionalities. In fact, the famous [WASI](https://wasi.dev/) is implemented based on the `import` feature. Later we shall see `import` can be used to implement more interesting features that are not possible in WebAssembly based blockchain virtual machines.

For now, let's provide an abort implementation to fix the error:

```
$ cat main.c
#include <stdio.h>
#include <stdlib.h>

#include "fib.h"

void (*Z_envZ_abortZ_viiii)(u32, u32, u32, u32);

void env_abort(u32 a, u32 b, u32 c, u32 d) {
  abort();
}

int main(int argc, char** argv) {
  if (argc < 2) return 2;

  u8 x = atoi(argv[1]);

  Z_envZ_abortZ_viiii = &env_abort;

  init();

  u8 result = Z_fibZ_ii(x);

  return result;
}
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
(docker) $ cd /code
(docker) $ riscv64-unknown-elf-gcc -o fib_riscv64 -O3 -g main.c fib.c /code/wabt/wasm2c/wasm-rt-impl.c -I /code/wabt/wasm2c
(docker) $ exit
```

Of course you can test the compiled `fib_riscv64` program on CKB. But as a trick, there's a simple CKB VM [binary](https://github.com/nervosnetwork/ckb-vm-test-suite/tree/master/binary/src) in the [test suite](https://github.com/nervosnetwork/ckb-vm-test-suite) we can use the run this particular program. It's worth mentioning that this CKB VM binary works slightly different from the VM in CKB. It suffices to test WebAssembly programs in current example. But for testing proper CKB script, you might want to use the newly built [standalone debugger](https://github.com/nervosnetwork/ckb-standalone-debugger), which follows all CKB semantics. Later posts will explain how the debugger works.

Let's try compile the binary in test suite and run the program:

```
$ git clone --recursive https://github.com/nervosnetwork/ckb-vm-test-suite
$ cd ckb-vm-test-suite
$ git clone https://github.com/nervosnetwork/ckb-vm
$ cd binary
$ cargo build --release
$ cd ../..
$ ckb-vm-test-suite/binary/target/release/asm64 fib_riscv64 5
Error result: Ok(8)
$ ckb-vm-test-suite/binary/target/release/asm64 fib_riscv64 10
Error result: Ok(89)
```

The error here is slightly misleading, the binary will treat any non-zero result from the program as errors. Since the program tested return the fibonacci calculation result as the return value, the binary will treat the return value(which is most likely non-zero) as error, but we can see that the actual error value contains the correct fibonacci value.

Now we proves AssemblyScript program indeed works on CKB VM! I'm sure more complicated programs might run into errors which need separate tweaking, but you already get the workflow and know where to look for when error happens :)

# Rust

We've already seen simpler examples in the AssemblyScript part. Let's try something more interesting in the Rust part: can we do a whole signature verification in Rust code?

Turns out yes we can! But this is signficantly more than what we can fit in a blog post. I've prepared a [demo project](https://github.com/nervosnetwork/wasm-secp256k1-test) showcasing this. It uses a pure Rust implemented [secp256k1 library](https://github.com/paritytech/libsecp256k1) to do signature verification. If you follow the instructions in the README, you can reproduce the exact steps of the following:

- Compile a complicated Rust program into WebAssembly
- Transform the WebAssembly program into RISC-V
- Run the resulting RISC-V program on CKB VM

# Enhancements to WebAssembly

There's one additional thing we want to mention: if you check out the `bindgen` branch of the [Rust secp256k1 demo repository](https://github.com/nervosnetwork/wasm-secp256k1-test/tree/bindgen), and try the same steps, you will run into the following errors:

```
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccYMiL3C.o: in function `core::result::unwrap_failed':
/code/secp.c:342: undefined reference to `Z___wbindgen_placeholder__Z___wbindgen_describeZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /code/secp.c:344: undefined reference to `Z___wbindgen_placeholder__Z___wbindgen_describeZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /code/secp.c:344: undefined reference to `Z___wbindgen_placeholder__Z___wbindgen_describeZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /code/secp.c:347: undefined reference to `Z___wbindgen_placeholder__Z___wbindgen_describeZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /code/secp.c:350: undefined reference to `Z___wbindgen_placeholder__Z___wbindgen_describeZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccYMiL3C.o:/code/secp.c:353: more undefined references to `Z___wbindgen_placeholder__Z___wbindgen_describeZ_vi' follow
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccYMiL3C.o: in function `i32_store':
/code/secp.c:56: undefined reference to `Z___wbindgen_anyref_xform__Z___wbindgen_anyref_table_set_nullZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccYMiL3C.o: in function `i32_load':
/code/secp.c:42: undefined reference to `Z___wbindgen_anyref_xform__Z___wbindgen_anyref_table_set_nullZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccYMiL3C.o: in function `i32_store':
/code/secp.c:56: undefined reference to `Z___wbindgen_anyref_xform__Z___wbindgen_anyref_table_set_nullZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /code/secp.c:56: undefined reference to `Z___wbindgen_anyref_xform__Z___wbindgen_anyref_table_set_nullZ_vi'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /tmp/ccYMiL3C.o: in function `i32_load':
/code/secp.c:42: undefined reference to `Z___wbindgen_anyref_xform__Z___wbindgen_anyref_table_growZ_ii'
/riscv/lib/gcc/riscv64-unknown-elf/8.3.0/../../../../riscv64-unknown-elf/bin/ld: /code/secp.c:42: undefined reference to `Z___wbindgen_anyref_xform__Z___wbindgen_anyref_table_growZ_ii'
collect2: error: ld returned 1 exit status
```

Following the same steps in the AssemblyScript examples, we can certain `imports` in the WebAssembly file:

```
$ wabt/bin/wasm2wat wasm_secp256k1_test.wasm -o secp.wat
$ cat secp.wat | grep "(import"
(import "__wbindgen_placeholder__" "__wbindgen_describe" (func $__wbindgen_describe (type 3)))
(import "__wbindgen_anyref_xform__" "__wbindgen_anyref_table_grow" (func $__wbindgen_anyref_table_grow (type 4)))
(import "__wbindgen_anyref_xform__" "__wbindgen_anyref_table_set_null" (func $__wbindgen_anyref_table_set_null (type 3)))
```

Those are actually binding environment functions needed in the Rust [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen). We will continue to work to provide the bindings compatible with CKB environment. But let's take a step back and think about this now: the environment functions needed here, are not part of WebAssembly standard. What's required in the standard, is that when an import entry cannot be found, the WebAssembly VM is expected to halt execution with an errors. To achieve different features, different WebAssembly based blockchains might inject different imports here, making it hard to write a WebAssembly program that's compatible across different blockchains.

In the CKB environment, however, we can attach any environment functions as we like, hence supporting all WebAssembly programs which are targeting different blockchains. What's more, we can use `imports` as we like to introduce new features to an existing WebAssembly programs, since the import functions are shipped together with the WebAssembly program, CKB itself doesn't have to do anything to support this, all the magic happens right within a single CKB script. For a WebAssembly powered blockchain, those environment functions are most likely to be fixed and part of the consensus rules, you cannot introduce new ones as you wish. Similarly, this tranformation based workflow on CKB will make it far easier to support new WebAssembly features, such as garbage collection, or threading, it really is just a matter of shipping the support features you need as part of your CKB script, there's no need to wait another 6 months for the next hardfork when a WebAssembly virtual machine gets updated, if it's updated.

# It's About Ease of Implementation

You might have one question: "I get it, you have WebAssembly on RISC-V, but I could also have RISC-V on WebAssembly! WebAssembly is flexible!". In a sense, this is true, once a language or a VM surpasses a certain level of flexibility, it can be used to build many (even crazy) things. The first version of [jslinux](https://bellard.org/jslinux/tech.html) which emulates full x86 was even written in pure JavaScript! But the other side of the problem, is ease of implementation. Building WebAssembly on RISC-V feels more natural, since WebAssembly abstracts at a higher level with many high level features, such as higher level contrl flows, garbage collection, etc. RISC-V, on the other hand, really emulates what a real CPU can do, it is a very thin layer on top of the actual CPU running inside of the computer. So while both directions are possible indeed, certain features are easier to implement in the WebAssembly on RISC-V direction, while roadblocks might sit in front of you in the RISC-V on WebAssembly direction.

One alternative example is EVM, EVM has been advocating turing complete for years, but the sad truth is that it's close to impossible to build arbitrary complicated algorithsm on EVM: either the coding part is too difficult or gas consumption will be unreasonable. People have to come up with all kinds of hacks so as to introduce latest algorithms on EVM, we can only have reasonable blake2b algorithms in EVM when Istanbul hardfork lands. What about many other algorithms?

All of those reflect our rationale behind the RISC-V choice: we want to find the minimal layer on top of this generation's CPU architecture, and RISC-V is the most transparent model we can expose to the blockchain world while ensuring security and performance. Any different models, such as WebAssembly, EVM, etc., should be one layer on top of the RISC-V model, and can be naturally implemented via the RISC-V model. The other direction, however, might not feel so smooth at all.

# Recap

Here we demonstrated that you can run non-trivial WebAssembly programs on CKB VM. But we do want to point out this workflow is not without its problems. One gotcha is performance, our preliminary testing shows that the WebAssembly based secp256k1 demo runs 30 times slower than a similar C based implementation compiled directly to CKB VM. After some investigation, we believe this is due to the following problems

- Due to how memory works in WebAssembly, wasm2c has to first put data segments in the code in plain C array, then when booting, allocate enough memory, then do memcpy to copy the data into the allocated memory. For the secp256k1 example, this means every boot of the program has to copy the 1MB pre-computed multiplication table. Combining with the fact that our RISC-V program now uses newlib, which contains a naive memcpy implementation optimized for code size over speed, this can significantly slow down the program.
- While wasm2c can deliver good performance for simpler programs, for a sophisticated and heavily optimized algorithm like secp256k1, the transformation layer could mean that many optimization chances are lost, hence making it slower than a direct implementation compiled directly to RISC-V

Luckily, the problems here are totally solvable. The above mentioned workflow is one way we can translate WebAssembly programs to RISC-V programs, but it's absolutely not the only way to achieve that. Like we mentioned above, the transformation layer hinders optimization opportunities, what if we bring in modern compilers to unleash all the possible optimizations here?

There is already [progress](https://github.com/wasmerio/wasmer/tree/master/lib/llvm-backend) being done which translates a WebAssembly program via LLVM into native code. The performance obtained here, is really good. Since LLVM 9 [officially supports](https://riscv.org/2019/09/llvm-9-releases-with-official-risc-v-target-support-asm-goto-clang-9-and-more-vincy-davis-packt-pub/) RISC-V now, it's perfectly possible to change the code so LLVM generates RISC-V assembly instead of x86_64 assembly. This way we can translate WebAssembly program via LLVM directly into a RISC-V program, enjoying all the advanced optimizations LLVM can performn on our code.

As a result, our current solution documented in this post shows this path is totally possible while achieving good enough performance for many existing cases(e.g., many type scripts can be written in Rust for safety, while the performance is not a big problem), this new LLVM solution can provide far better performance for the same workflow in the future. It's just a matter of time for us to find the time to work on this.
