---
id: dependencies
title: Script Dependencies
---

## Deploy a VM and run code on the VM

Since we are working with a virtualized mini computer in CKB VM, there’s nothing stopping us from embedding another VM as a CKB script that runs on CKB VM and in this article we will explore this VM on top of VM path. 

Through this method, we can have JavaScript on CKB via duktape, Ruby on CKB via mruby, we can even have Bitcoin Script or EVM on chain if we just compile those VMs and store them as scripts on CKB. This compatibility ensures CKB VM can both help to preserve legacy code and build a diversified ecosystem. 

All languages should are treated equal on CKB, giving freedom to blockchain contract developers to build on top of CKB however they feel is best.

To use duktape on CKB, first you need to compile duktape itself into a RISC-V executable binary:

```
$ git clone https://github.com/xxuejie/ckb-duktape
$ cd ckb-duktape
$ git submodule init
$ git submodule update
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:xenial bash
root@0d31cad7a539:~# cd /code
root@0d31cad7a539:/code# make
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Wall -Werror c/entry.c -c -o build/entry.o
riscv64-unknown-elf-gcc -Os -DCKB_NO_MMU -D__riscv_soft_float -D__riscv_float_abi_soft -Iduktape -Ic -Wall -Werror duktape/duktape.c -c -o build/duktape.o
riscv64-unknown-elf-gcc build/entry.o build/duktape.o -o build/duktape -lm -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections -Wl,-s
root@0d31cad7a539:/code# exit
exit
$ ls build/duktape
build/duktape*
```

Here we use the ruby SDK to interact with CKB, please refer to the official [README](https://github.com/nervosnetwork/ckb-sdk-ruby/blob/develop/README.md) for how to set it up. Then deploy the duktape script code in a CKB cell:

```
pry(main)> data = File.read("../ckb-duktape/build/duktape")
pry(main)> duktape_data.bytesize
=> 269064
pry(main)> duktape_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(280000), CKB::Utils.bin_to_hex(duktape_data))
pry(main)> duktape_data_hash = CKB::Blake2b.hexdigest(duktape_data)
pry(main)> duktape_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: duktape_tx_hash, index: 0))
```

The duktape script code now requires one argument: the JavaScript source you want to execute

```
pry(main)> duktape_hello_type_script = CKB::Types::Script.new(code_hash: duktape_data_hash, args: CKB::Utils.bin_to_hex("CKB.debug(\"I'm running in JS!\")"))
```

Notice that with a different argument, you can create a different duktape powered type script for a different use case:

```
pry(main)> duktape_hello_type_script = CKB::Types::Script.new(code_hash: duktape_data_hash, args: CKB::Utils.bin_to_hex("var a = 1;\nvar b = a + 2;"))
```

This echoes the differences mentioned above on script code vs script: here duktape serves as script code providing a JavaScript engine, while a different script leveraging duktape script code serves a different function on chain.

Now we can create a cell with the duktape type script attached:

```
pry(main)> tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(200))
pry(main)> tx.cell_deps.push(duktape_out_point.dup)
pry(main)> tx.outputs.type = duktape_hello_type_script.dup
pry(main)> tx.witnesses[0] = "0x"
pry(main)> tx = tx.sign(wallet.key, api.compute_transaction_hash(tx))
pry(main)> api.send_transaction(tx)
=> "0x2e4d3aab4284bc52fc6f07df66e7c8fc0e236916b8a8b8417abb2a2c60824028"
```

We can see that the script executes successfully and if you have the ckb-script module’s log level set to debug in your ckb.toml file, you will also notice the following log:

```
2019-07-15 05:59:13.551 +00:00 http.worker8 DEBUG ckb-script  script group: c35b9fed5fc0dd6eaef5a918cd7a4e4b77ea93398bece4d4572b67a474874641 DEBUG OUTPUT: I'm running in JS!
```

Now you have successfully deployed a JavaScript engine on CKB, and have also run JavaScript-based script on CKB! Feel free to try any JavaScript code you want here.


## Dynamic linking

There are two dynamic linking functions implemented in [nervosnetwork/ckb-c-stdlib](https://github.com/nervosnetwork/ckb-c-stdlib/blob/693c58163fe37d6abd326c537447260a846375f0/ckb_dlfcn.h#L94), which are `ckb_dlopen()` and `ckb_dlsym()`. 

`ckb_dlopen()` loads the dynamic library from a cell by its data hash and returns an opaque "handle" for the dynamic library. `ckb_dlsym()` takes a "handle" of a dynamic library returned by `ckb_dlopen()` and the symbol name, and returns the address where that symbol is loaded into memory. 

[nervosnetwork/ckb-miscellaneous-scripts](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/5b06297d4451ee1fb496fb48625481b26386de78/c/or.c#L86-L98) has a simple example for using these two functions.

```
int ckb_dlopen(const uint8_t *dep_cell_data_hash, uint8_t *aligned_addr,
               size_t aligned_size, void **handle, size_t *consumed_size);

void *ckb_dlsym(void *handle, const char *symbol);
```

## How dependencies work

There are two different dependency fields in the transaction data structure: [`cell_deps`](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#code-locating) and [`header_deps`](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#header-deps).  

`cell_deps` allow scripts in the transaction to access (read-only) referenced live cells. 

`header_deps` allow scripts in the transaction to access (read-only) data of referenced past block headers of the blockchain. 

Please refer to the [CKB Transaction Structure RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md) for more details.
