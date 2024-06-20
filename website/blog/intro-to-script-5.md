---
title: "Introduction to CKB Script Programming 5: Debugging"
date: "2019-10-18"
slug: intro-to-ckb-script-programming-5
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

Due to the fact that CKB script works at a much lower level than other smart contracts, the debugging story for CKB, has been quite a mysterious one. In this post, we will show how one can debug CKB scripts. As you will find out, debugging a CKB script is not so different from debugging your everyday program.

This post is written based on current CKB Lina mainnet version now.

# Debugging C programs with GDB

The first solution to CKB script debugging, works with compiled languages such as C, Rust, etc. Perhaps you are used to writing C programs, and GDB is your best friend. You are wondering if debugging C programs with GDB is possible, and the answer, of course, is: yes, you can definitely debug your CKB script written in C via GDB! Let me show you how.

First we have the same carrot example from my old posts:

```c
#include <memory.h>
#include "ckb_syscalls.h"

int main(int argc, char* argv[]) {
  int ret;
  size_t index = 0;
  uint64_t len = 0;
  unsigned char buffer[6];

  while (1) {
    len = 6;
    memset(buffer, 0, 6);
    ret = ckb_load_cell_data(buffer, &len, 0, index, CKB_SOURCE_OUTPUT);
    if (ret == CKB_INDEX_OUT_OF_BOUND) {
      break;
    }

    int cmp = memcmp(buffer, "carrot", 6);
    if (cmp) {
      return -1;
    }

    index++;
  }

  return 0;
}
```

I've made 2 changes to it:

- I've updated the script to make it compatible with CKB v0.23.0. In this version, we should be using `ckb_load_cell_data` to fetch cell data.
- I've also introduced a slight bug to the code, so we can later try the debugging workflow. You might noticed it if you are familiar with C, but no need to worry if you missed it, I will explain it later.

As usual, let's use our official toolchain to compile it to RISC-V code:

```bash
$ ls
carrot.c
$ git clone https://github.com/nervosnetwork/ckb-system-scripts
$ cp ckb-system-scripts/c/ckb_*.h ./
$ ls
carrot.c  ckb_consts.h  ckb_syscalls.h  ckb-system-scripts/
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191012 bash
root@3efa454be9af:/# cd /code
root@3efa454be9af:/code# riscv64-unknown-elf-gcc carrot.c -g -o carrot
root@3efa454be9af:/code# exit
```

Notice when I compile the script, I added `-g` so as to generate debugging information which is quite useful in GDB. For a production script, you would almost always want to strip them out to save previous on-chain space.

Now let's deploy the script to CKB. Have your CKB node running, and fire up to Ruby SDK:

```ruby
pry(main)> api = CKB::API.new
pry(main)> wallet = CKB::Wallet.from_hex(api, "<your private key>")
pry(main)> wallet2 = CKB::Wallet.from_hex(api, CKB::Key.random_private_key)
pry(main)> carrot_data = File.read("carrot")
pry(main)> carrot_data.bytesize
=> 19296
pry(main)> carrot_tx_hash = wallet.send_capacity(wallet2.address, CKB::Utils.byte_to_shannon(20000), CKB::Utils.bin_to_hex(carrot_data), fee: 21000)
pry(main)> carrot_data_hash = CKB::Blake2b.hexdigest(carrot_data)
pry(main)> carrot_type_script = CKB::Types::Script.new(code_hash: carrot_data_hash, args: "0x")
pry(main)> carrot_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: carrot_tx_hash, index: 0))
```

With carrot script on blockchain, we can create a transaction to test the carrot script:

```ruby
pry(main)> tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(100), use_dep_group: false, fee: 5000)
pry(main)> tx.outputs[0].type = carrot_type_script
pry(main)> tx.cell_deps << carrot_cell_dep
pry(main)> tx.witnesses[0] = "0x"
pry(main)> tx = tx.sign(wallet.key, api.compute_transaction_hash(tx))
pry(main)> api.send_transaction(tx)
CKB::RPCError: jsonrpc error: {:code=>-3, :message=>"Script(ValidationFailure(-1))"}
```

If you checked the transaction carefully, you will noticed that none of the output cells has data starting with `carrot`. However we still run into validation failure, it means our script must have a bug. Previously, you would run out of options here, you might go back to check the code, hoping you can see where it goes wrong. But that is not necessary now, you can just dump the transaction here, and feed it into a standalone CKB debugger to debug it!

First, let's dump the transaction together with its surrounding environment, into a local file:

```ruby
pry(main)> CKB::MockTransactionDumper.new(api, tx).write("carrot.json")
```

What you also need here, is to keep track of the carrot type script hash:

```ruby
pry(main)> carrot_type_script.compute_hash
=> "0x039c2fba64f389575cdecff8173882b97be5f8d3bdb2bb0770d8a7e265b91933"
```

Notice depending on your environment you might get a different hash from what I have here.

Now let's try [ckb-standalone-debugger](https://github.com/nervosnetwork/ckb-standalone-debugger):

```bash
$ git clone https://github.com/nervosnetwork/ckb-standalone-debugger
$ cd ckb-standalone-debugger/bins
$ cargo build --release
$ ./target/release/ckb-debugger -l 0.0.0.0:2000 -g type -h 0x039c2fba64f389575cdecff8173882b97be5f8d3bdb2bb0770d8a7e265b91933 -t carrot.json
```

Keep in mind you might need to tweak the carrot type script hash, or the path to `carrot.json` depending on your environment. Now we can try connecting to the debugger via GDB in a differnet terminal:

```
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191012 bash
root@66e3b39e0dfd:/# cd /code
root@66e3b39e0dfd:/code# riscv64-unknown-elf-gdb carrot
GNU gdb (GDB) 8.3.0.20190516-git
Copyright (C) 2019 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "--host=x86_64-pc-linux-gnu --target=riscv64-unknown-elf".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from carrot...
(gdb) target remote 192.168.1.230:2000
Remote debugging using 192.168.1.230:2000
0x00000000000100c6 in _start ()
(gdb)
```

Notice `192.168.1.230`, is the IP address of my workstation in my local network. It's very likely you need to adjust that, since your computer might have a different IP address. Now we can try a normal GDB debugging session:

```
(gdb) b main
Breakpoint 1 at 0x106b0: file carrot.c, line 6.
(gdb) c
Continuing.

Breakpoint 1, main (argc=0, argv=0x400000) at carrot.c:6
6         size_t index = 0;
(gdb) n
7         uint64_t len = 0;
(gdb) n
11          len = 6;
(gdb) n
12          memset(buffer, 0, 6);
(gdb) n
13          ret = ckb_load_cell_data(buffer, &len, 0, index, CKB_SOURCE_OUTPUT);
(gdb) n
14          if (ret == CKB_INDEX_OUT_OF_BOUND) {
(gdb) n
18          int cmp = memcmp(buffer, "carrot", 6);
(gdb) n
19          if (cmp) {
(gdb) p cmp
$1 = -99
(gdb) p buffer[0]
$2 = 0 '\000'
(gdb) n
20            return -1;
```

Here we can see where it goes wrong: the first byte in `buffer` has value `0`, which is different from `c`, hence our buffer is different from `carrot`. But instead of jumping to next iteration, the condition `if (cmp) {` jumps to the true case, where `-1` is returned, indicating a match to `carrot`! And the reason to this, is that `memcmp` would return `0` when the 2 buffers are equal, and non-zero value when they are not. But instead of testing the return value of `memcmp` is 0, we directly use it in the `if` condition, since C would treat any non-zero value as true, `-99` in this case would be treated as true. This is a typical C mistake for beginners, I hope you will never run into it :)

Now we know the reason, it will be a trivial task to fix the bug in the carrot script, but what you just see here, is that we manage to dump the runtime state of an errored transaction from CKB, then debug it via GDB, which is a common tool in the industry! And your existing workflows and tools on top of GDB can also work here, isn't that beautiful?

# REPL based Development/Debugging

However, GDB is only one part of the story in modern software development. Dynamic languages have largely taken the landscape, and many programmers are used to REPL baesd development/debugging workflow. This is totally different from GDB in a compiled languages, basically what you get is a running environment, and you can type in any code you want to interact with the environment, getting different results. As we will show here, CKB also has support for this type of development/debugging workflow :P

Here we will use the [ckb-duktape](https://github.com/nervosnetwork/ckb-duktape) showcasing a REPL in JavaScript. But keep in mind this is merely a demo showing the workflow, there's nothing preventing you from porting your favorite dynamic languages(whether it's Ruby, Python, Lisp, etc.) to CKB, and start a REPL for that language.

First let's try compiling duktape:

```bash
$ git clone https://github.com/nervosnetwork/ckb-duktape
$ cd ckb-duktape
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191012 bash
root@982d1e906b76:/# cd /code
root@982d1e906b76:/code# make
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Wall -Werror c/entry.c -c -o build/entry.o
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Wall -Werror duktape/duktape.c -c -o build/duktape.o
riscv64-unknown-elf-gcc build/entry.o build/duktape.o -o build/duktape -lm -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Wall -Werror c/repl.c -c -o build/repl.o
riscv64-unknown-elf-gcc build/repl.o build/duktape.o -o build/repl -lm -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
root@982d1e906b76:/code# exit
```

You will need the `build/repl` binary generated here. Similar to the carrot example, let's first deploy duktape REPL binary on CKB:

```ruby
pry(main)> api = CKB::API.new
pry(main)> wallet = CKB::Wallet.from_hex(api, "<your private key>")
pry(main)> wallet2 = CKB::Wallet.from_hex(api, CKB::Key.random_private_key)
pry(main)> duktape_repl_data = File.read("build/repl")
pry(main)> duktape_repl_data.bytesize
=> 283048
pry(main)> duktape_repl_tx_hash = wallet.send_capacity(wallet2.address, CKB::Utils.byte_to_shannon(300000), CKB::Utils.bin_to_hex(duktape_repl_data), fee: 310000)
pry(main)> duktape_repl_data_hash = CKB::Blake2b.hexdigest(duktape_repl_data)
pry(main)> duktape_repl_type_script = CKB::Types::Script.new(code_hash: duktape_repl_data_hash, args: "0x")
pry(main)> duktape_repl_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: duktape_repl_tx_hash, index: 0))
```

We will also need to create a transaction containing the duktape script, I'm building a simpler one, but you are free to include more data so you can play with CKB:

```ruby
pry(main)> tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(100), use_dep_group: false, fee: 5000)
pry(main)> tx.outputs[0].type = duktape_repl_type_script
pry(main)> tx.cell_deps << duktape_repl_cell_dep
pry(main)> tx.witnesses[0] = "0x"
```

Let's also dump it to file, and check out duktape type script hash:

```ruby
pry(main)> CKB::MockTransactionDumper.new(api, tx).write("duktape.json")
=> 2765824
pry(main)> duktape_repl_type_script.compute_hash
=> "0xa8b79392c857e29cb283e452f2cd48a8e06c51af64be175e0fe0e2902c482837"
```

Different from last time, we don't need to start GDB, we can start the program directly:

```bash
$ ./target/release/ckb-debugger -g type -h 0xa8b79392c857e29cb283e452f2cd48a8e06c51af64be175e0fe0e2902c482837 -t duktape.json
duk>
```

You will see a `duk>` prompt for you to enter JS code! Again if you run into errors, check if you need to change to a different type script hash, or use the correct path to `duktape.json`. We can see normal JS code works here:

```bash
duk> print(1 + 2)
3
= undefined
duk> function foo(a) { return a + 1; }
= undefined
duk> foo(123)
= 124
```

There're also CKB related functions you can use:

```bash
duk> var hash = CKB.load_script_hash()
= undefined
duk> function buf2hex(buffer) { return Array.prototype.map.call(new Uint8Array(buffer), function(x) { return ('00' + x.toString(16)).slice(-2); }).join(''); }
= undefined
duk> buf2hex(hash)
= a8b79392c857e29cb283e452f2cd48a8e06c51af64be175e0fe0e2902c482837
```

Notice the script hash we get here is exactly the current executing type script hash! This verifies CKB syscalls do work here, we can also try more interesting stuff

```bash
duk> print(CKB.SOURCE.OUTPUT)
2
= undefined
duk> print(CKB.CELL.CAPACITY)
0
= undefined
duk> capacity_field = CKB.load_cell_by_field(0, 0, CKB.SOURCE.OUTPUT, CKB.CELL.CAPACITY)
= [object ArrayBuffer]
duk> buf2hex(capacity_field)
= 00e40b5402000000
```

This `00e40b5402000000` might looks slightly mysterious to you at first, but notice that RISC-V uses little endian, so if we reverse the byte order here, we would get `00000002540be400`, which is exactly `10000000000` in decimal. Also keep in mind that in CKB capacity is stored in shannons, so `10000000000` is exactly `100` bytes, which is the same amount of coins we want to transfer when we generate the transaction above! Now you can see how you can play with CKB in this duktape environment :)

# Conclusion

Now we've introduced 2 types of debugging experience in CKB, feel free to play with either one you like(or actually both of them). I can't wait to see all the amazing applications you can build with CKB :)
