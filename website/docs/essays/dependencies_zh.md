---
id: dependencies_zh
title: 脚本依赖
---

## 部署 VM 并在 VM 上运行代码

由于 CKB VM 就相当于一台虚拟微型计算机，所以可以将另一个 VM 嵌套作为一个脚本，运行在 CKB VM 中。本章节，我们将探索一下这种形式的 VM。

通过这种方法，我们可以通过 duktape 在 CKB 上使用 JavaScript，通过 mruby 在 CKB 上使用 Ruby。我们甚至可以使用比特币脚本甚至链上 EVM，只要我们将这些 VMs 编译打包为 CKB 上的脚本。这种兼容性保证了 CKB VM 既可以保留传统代码，又可以建立一个多元化的生态系统。

在 CKB 上所有语言都被平等对待，给区块链开发者自行选择最适合自己的语言基于 CKB 进行开发。

在 CKB 上使用 duktape，你需要先将 duktape 编译为 RISC-V 二进制文件：

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

这里我们使用 ruby SDK 与 CKB 进行交互，具体设置事宜请参考官方[README](https://github.com/nervosnetwork/ckb-sdk-ruby/blob/develop/README.md) 。然后部署 duktape 脚本代码到 cell 中：

```
pry(main)> data = File.read("../ckb-duktape/build/duktape")
pry(main)> duktape_data.bytesize
=> 269064
pry(main)> duktape_tx_hash = wallet.send_capacity(wallet.address, CKB::Utils.byte_to_shannon(280000), CKB::Utils.bin_to_hex(duktape_data))
pry(main)> duktape_data_hash = CKB::Blake2b.hexdigest(duktape_data)
pry(main)> duktape_cell_dep = CKB::Types::CellDep.new(out_point: CKB::Types::OutPoint.new(tx_hash: duktape_tx_hash, index: 0))
```

duktape 脚本代码现在需要一个参数： 你要执行的 JavaScript 源代码。

```
pry(main)> duktape_hello_type_script = CKB::Types::Script.new(code_hash: duktape_data_hash, args: CKB::Utils.bin_to_hex("CKB.debug(\"I'm running in JS!\")"))
```

注意，使用不同的参数，你可以为不同的用例创建不同的 duktape 类的锁脚本（lock script）。

```
pry(main)> duktape_hello_type_script = CKB::Types::Script.new(code_hash: duktape_data_hash, args: CKB::Utils.bin_to_hex("var a = 1;\nvar b = a + 2;"))
```

这与上面提到的关于脚本代码与脚本的区别相呼应：这里 duktape 作为脚本代码提供了一个 JavaScript 引擎，而利用 duktape 脚本代码的不同脚本在链上起到了不同的作用。

现在，我们可以创建一个带有 duktape 类型脚本（type script）的 Cell。

```
pry(main)> tx = wallet.generate_tx(wallet2.address, CKB::Utils.byte_to_shannon(200))
pry(main)> tx.cell_deps.push(duktape_out_point.dup)
pry(main)> tx.outputs.type = duktape_hello_type_script.dup
pry(main)> tx.witnesses[0] = "0x"
pry(main)> tx = tx.sign(wallet.key, api.compute_transaction_hash(tx))
pry(main)> api.send_transaction(tx)
=> "0x2e4d3aab4284bc52fc6f07df66e7c8fc0e236916b8a8b8417abb2a2c60824028"
```

我们可以看到脚本执行成功了，如果你在 ckb.toml 文件中把 ckb-script 模块的日志级别设置为 debug，你也会注意到以下日志。

```
2019-07-15 05:59:13.551 +00:00 http.worker8 DEBUG ckb-script  script group: c35b9fed5fc0dd6eaef5a918cd7a4e4b77ea93398bece4d4572b67a474874641 DEBUG OUTPUT: I'm running in JS!
```

现在你已经成功地在 CKB 上部署了一个 JavaScript 引擎，并在 CKB 上运行了基于 JavaScript 的脚本。你可以在这里自由测试任何你想要的 JavaScript 代码。


## 动态链接

 [nervosnetwork/ckb-c-stdlib](https://github.com/nervosnetwork/ckb-c-stdlib/blob/693c58163fe37d6abd326c537447260a846375f0/ckb_dlfcn.h#L94) 实现了两个动态链接函数： `ckb_dlopen()` 和 `ckb_dlsym()`。

`ckb_dlopen()` 通过数据哈希从 Cell 中加载动态库，并返回动态库的一个不透明的 “句柄”。` ckb_dlsym()` 取 `ckb_dlopen()` 返回的动态库的 "句柄 "和符号名，并返回该符号被加载到内存中的地址。

[nervosnetwork/ckb-miscellaneous-scripts](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/5b06297d4451ee1fb496fb48625481b26386de78/c/or.c#L86-L98) 有一个使用这两个函数的简单示例：

```
int ckb_dlopen(const uint8_t *dep_cell_data_hash, uint8_t *aligned_addr,
               size_t aligned_size, void **handle, size_t *consumed_size);

void *ckb_dlsym(void *handle, const char *symbol);
```

## 依赖的工作原理

在交易数据结构中，有两个不同的依赖字段： [`cell_deps`](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#code-locating) 和 [`header_deps`](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#header-deps)。

`cell_deps` 可以让交易中的脚本读取引用的可用 Cells（live cells）。 

`header_deps` 可以让交易中的脚本读取引用的过去的区块头数据。 

请参考 [CKB 交易结构 RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md) 了解更多。
