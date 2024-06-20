---
title: "Introduction to CKB Script Programming 10: Language Choices"
date: "2020-04-09"
slug: intro-to-ckb-script-programming-10
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

When crafting CKB, we made the choice to use a generic VM, so it is not bound to any particular programming language. This model certainly has its pros, but it also comes with problems. A question we frequently receive is: what language should I use to program on Nervos CKB? Let's try to answer this question here.

First of all, I have had the belief that each dapp developer should have the freedom to pick their own choice of languages. No blockchain creators know the nuts and bolts better than the dapp developer themselves. No single programming language provides solutions for all kinds of dapps that might sprout. We offer different programming language choices, you can pick based on your needs.

But at the same time, this is also an irresponsible answer! Telling a newcomer that you have many choices to choose from, is like telling them nothing. They will just be overwhelmed by the numerous choices. After all, all they want to do, is pick a language and start experimenting/building. This means while we do offer choices, we will also need to provide recommendations: what will we pick, if we just get started on building a new dapp on CKB?

To make a recommendation, we will first need answers to 2 simple questions:

1. What is your purpose here? Are you just experimenting things on CKB, or are you already tasked to build a production grade dapp?
2. What do you plan to build? Are you building a normal dapp, or are you creating a new crypto primitives on CKB?

The answers to the questions, will affect the choices we suggest here.

**NOTE**: the recommendation made here, are only relavant when I write this post(Apr 9, 2020), we are building working on this field, and things might change. I will try to make sure this post is updated, but it is always better to check with us first to see our latest recommendation is, either on [Discord](https://discord.gg/AqGTUE9), or [Nervos Talk](https://talk.nervos.org/).

# Production Level Languages

For people tasked building a production grade dapp, a warning shall be provided above all: no matter what language you pick to build the smart contract part of your dapp, you should do security audit on your smart contracts. Vulnerabilities can only be eliminated via due diligence, no programming languages can help you on this part. With that said, we can now jump to the recommendation part.

Unfortunately, all production level smart contracts on CKB now, are written in pure C. The reason for this, is not C is that suitable language for writing smart contract, but really that when we started out to build CKB, only C provides good enough quality for building the contracts we need. We don't recommend using C to build any smart contract when you have a better choice, but we do admit sometimes C has to be the last resort.

In the meantime, we are busy working on Rust support to prepare Rust for this list. While things are still a little rough today, Rust might be a decent choice for building production level smart contracts on CKB soon. And you can bet on that we will continue to maintain and support building Rust smart contracts on CKB. While personally, I know CKB VM can be leveraged in ways that Rust is having a hard time to keep up, the reality is Rust is a very popular and (in many cases) good enough choice for the blockchain world. We are hoping in the not-so-distant future, maybe in a few months, we can sincerely recommend using Rust to build production level smart contracts on CKB.

While it certainly would not suit all cases, many people might be building smart contracts that:

- Needs rapid changes or dynamic behaviors;
- Are built by not so low-level focused engineers;
- Might not be so easily affected by cycle consumptions;

For this group of people, JavaScript might also be a decent smart contract choice. We are now evaluating the possibilities if we can perform a round of security audit on duktape, or some other JavaScript engine that is suitable on CKB. While you still need to audit the JavaScript source written by yourself, we can help you ensure that the underlying JavaScript engine you use, will perform in a correct and secure behavior.

# Experimental Languages

When it comes to experimenting on CKB, you have more freedom to use different other languages. I will divide my recommendation here based on the second question above: the stuff you want to build on CKB.

## Cryptographic Primitive Explorer

One unique aspect of CKB, is that it helps flourish cryptographic innovations. It's now different from the old days, when you have to wait for a hardfork so someone can include your brand new cryptographic algorithms in a blockchain. With CKB, you can build any cryptographic algorithm, and ship it on chain immediately. You might say: well this is great, but what programming language shall we use here?

If you have checked out [our code](https://github.com/nervosnetwork/ckb-system-scripts), you will noticed that we've taken the [secp256k1 C library](https://github.com/bitcoin-core/secp256k1) from the Bitcoin team(huge thanks guys!). So obvious, C is a choice here. But C is hardly the only choice: as mentioned above, we are busy working pushing the frontier here, and we are hoping soon Rust can provide a second choice here. There are already many cryptographic libraries built in Rust, we do want to embrace the whole blockchain community, rather than distancing from it. But there is actually more interesting story here besides C or Rust:

If you dig [deep](https://github.com/bitcoin-core/secp256k1/blob/4f27e344c69c33b4f3f448baa0196b9892287081/src/asm/field_10x26_arm.s) [enough](https://github.com/briansmith/ring/blob/00c21e253ba9cd3b66ab41155414b0d0e91b6c95/crypto/poly1305/asm/poly1305-x86_64.pl), most highly used cryptographic libraries uses hand-written assembly to further speed up the code. There is actually [good reason](https://cr.yp.to/qhasm/20050129-portable.txt) behind it. Since CKB builds on a real instruction set used by CPU, there's actually no stopping from us to use hand-written RISC-V assembly to further speed up the crypto algorithms. To make it even more existing, we've been paying close attentions to 2 new RISC-V instruction set extension:

- [V: Vector Extension](https://www.youtube.com/watch?v=GzZ-8bHsD5s)
- [B: Bit Manipulation Extension](https://github.com/riscv/riscv-bitmanip)

We believe those 2 extensions can bring up even closer to the full potential of modern days' CPU architecture. Once they are introduced to CKB, hand-written, assembly based crypto algorithms leveraging them can enjoy an even greater speedups, which is very hard to match via a language such as C or Rust.

## Regular Dapp Builder

For experimenting regular dapp logic, you will have a much greater number of choices here: we mentioned JavaScript above, we also have [Ruby](https://github.com/nervosnetwork/ckb-mruby) support. Rust will also soon be a viable choice. There is one more language that I particularly want to mention: for some weird unknown reason, [AssemblyScript](https://assemblyscript.org/) gets widely used in the blockchain industry. Since we do have WASM integration support now, you can also use AssemblyScript to build smart contracts on CKB. We do want to ensure that your existing knowledge in building smart contracts on other blockchains won't go in vain. Innovation is critical of course, but so is preserving histories.

# Beyond The Horizon

The advantage on CKB doesn't just stop here. It gets more exciting than this:

1. There are tons of languages that have a pure C VM based implementation, such as Lua, MicroPython;
2. There are also many languages that can be compiled down to C, we will show a real example later;
3. LLVM now officially has RISC-V support, there are many languages that target LLVM, such as zig;
4. We now do have WASM support, there are also languages that target WebAssembly, such as AssemblyScript;

So if you are the pioneer kind, you are very welcome to port new languages and make them work on CKB. And they don't have stop as experimental languages. Once they become more mature with people using it, there is nothing stopping us from treating them as production ready languages on CKB. Fundamentally, it all depends on if we know enough about the language to know where we can expect quirks. We are experimenting with new languages all day, and here I can show you my latest attempt:

# ZetZ

I've been very fascinated by [ZetZ](https://github.com/zetzit/zz) these days. It presents a unique feature set that suits CKB VM perfectly:

- Compiled to C, so we can then use GCC to compile it to RISC-V binaries
- Encourages stack usage without dynamic memory allocation
- Leverages an [SMT solver](https://github.com/Z3Prover/z3) to verify code execution

This basically provides an immediate to use language that suits blockchain smart contract extremely well: on the lower level, a C compiler helps you generate code that is both small and efficient; on the higher level, a theorem prover helps you check code logic to make sure they make sense. In addition, this is not some sort of pure hobby project, it is developed together with a real [usage](https://github.com/devguardio/carrier) in an IoT system with a lot of cryptographic code involved, much like how we would use it in blockchains.

Here our old carrot example in ZetZ:

```
using <ckb_syscalls.h> as ckb
using <string.h>::{memcmp};

fn load_data(u64 index, u8 mut * buffer) -> int
   where len(buffer) >= 6 {
  u64 mut l = 6;
  int ret = as<int>ckb::ckb_load_cell_data(buffer, &l, 0, index, 2);
  return ret;
}

export fn main () -> int {
  u64 index = 0;
  while true {
    u8 buffer[6];
    int ret = load_data(index, buffer);
    if ret == 1 {
      break;
    }
    if memcmp(buffer, "carrot", 6) == 0 {
      return -1;
    }
    index++;
  }
  return 0;
}
```

You don't have to be able to understand anything here. However, if you have a little experience with C, that `where len(buffer) >= 6` will immediately catch your attention: ZetZ uses theorem prover to ensure all calling to the `load_data` function shall provide a buffer that is at least 6 bytes long. If we change the buffer size in the main function to something less than 6, an error will immediately be generated when we build the source code:

```
$ zz build
 [ERROR] unproven callsite assert for infix expression
  --> /home/ubuntu/code/ckb-zz-demo/src/main.zz:15:25
   |
15 |     int ret = load_data(index, buffer);␊
   |                         ^------------^
   |
   = in this callsite

 --> /home/ubuntu/code/ckb-zz-demo/src/main.zz:5:22
  |
5 |    where len(buffer) >= 6 {␊
  |                      ^^
  |
  = function call requires these conditions

 --> /home/ubuntu/code/ckb-zz-demo/src/main.zz:4:1
  |
4 | fn load_data(u64 index, u8 mut * buffer) -> int␊
  | ...
9 | }␊
  | ^
  |
  = for this function

 --> /home/ubuntu/code/ckb-zz-demo/src/main.zz:5:22
  |
5 |    where len(buffer) >= 6 {␊
  |                      ^^
  |
  = for infix expression |0| = false

 --> /home/ubuntu/code/ckb-zz-demo/src/main.zz:5:14
  |
5 |    where len(buffer) >= 6 {␊
  |              ^-----^
  |
  = for literal 3 |0| = 0x3

 --> /home/ubuntu/code/ckb-zz-demo/src/main.zz:5:25
  |
5 |    where len(buffer) >= 6 {␊
  |                         ^
  |
  = for literal 6 |0| = 0x6

  --> /home/ubuntu/code/ckb-zz-demo/src/main.zz:15:25
   |
15 |     int ret = load_data(index, buffer);␊
   |                         ^------------^
   |
   = last callsite
```

You can see here that ZetZ knows that we are passing a buffer of 3 bytes to a function which requires a buffer of at least 6 bytes. The build phase results in an error.

On the other hand, the final generated code, when cleaned a bit, looks exactly like how we would write this by hand in C:

```
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

static int ckb_zz_demo_main_load_data(uint64_t const index,
                                      uint8_t* const buffer);

#include <string.h>

int __attribute__((visibility("default"))) ckb_zz_demo_main_main();

#include <ckb_syscalls.h>

static int ckb_zz_demo_main_load_data(uint64_t const index,
                                      uint8_t* const buffer);

int main() {
  uint64_t const index = 0;
  while (true) {
    uint8_t const buffer[6];
    int const ret = ckb_zz_demo_main_load_data(index, buffer);
    if ((ret == 1)) {
      break;
    }
    if ((memcmp(buffer, "carrot", 6) == 0)) {
      return -1;
    }
    (index++);
  }
  return 0;
}

static int ckb_zz_demo_main_load_data(uint64_t const index,
                                      uint8_t* const buffer) {
  uint64_t l = 6;
  int const ret = (int)(ckb_load_cell_data(buffer, (&l), 0, index, 2));
  return ret;
}

```

No prover checking code is included in the final C code here, it is just how a plain C implementation would look like. We are not paying any runtime cost here.

This example here only demostrates a small benefit of ZetZ, while the theorem prover in ZetZ can definitely do more sophisticated checking. The language is still in its infancy phase, I don't know how the future would look like, but this is definitely something I'd like to keep an eye on.

# Recap

I hope you won't treat me as a ZetZ zealot now. It really is just one example I'm playing with now. What I'm trying to say here, is that if you have any particular language you love, or discover anything that might be useful for your dapp. There really is nothing that prevents you from porting that to CKB. We really want to put the freedom, back to all the awesome developers out there. And if you have built something that proves to be useful, our [grant](https://www.nervos.org/grants/) program is awaiting for your submission.
