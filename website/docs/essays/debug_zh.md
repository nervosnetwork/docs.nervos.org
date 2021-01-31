---
id: debug_zh
title: CKB 脚本调试小提示
---

CKB 使用 RISC-V ISA 来实现 VM 层，CKB VM 不同于其他通过硬编码操作码实现功能的 VM。鉴于 CKB VM 的通用性，可以支持各种语言和工具链。每种语言和工具链都会有些不同，实现者应该为社区提供适当的文档和支持。

本章节主要介绍关于 CKB 脚本调试的一些小提示。


## 错误代码（Error codes）

CKB 节点只在交易验证失败时报告一个退出代码，区分错误的最直接方法是使用不同的退出代码（在 -128 和 127 之间）来表示错误。

我们可以看看默认的锁脚本（lock script）错误代码： [secp256k1 error codes](https://github.com/nervosnetwork/ckb-system-scripts/wiki/Error-codes)

> 一个常见的错误是把锁脚本（lock script）错误和类型脚本（type script）错误混为一谈。建议删除类型脚本（type script），然后再运行；如果错误仍然存在，可以确定错误是由锁脚本（lock script）引起的；否则，就是由类型脚本（type script） 引起的。


## 调试系统调用（Debug syscall）

当我们想从脚本中输出额外的信息时，我们可以使用[系统调用调试](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md#debug).

默认情况下，CKB 节点不会输出系统调用调试消息，但是可以配置 ckb.toml 来启用它。

```
[logger]
filter = info,ckb-script=debug
```

你也可以选择在调试环境下运行脚本，例如： [ckb-cli](https://github.com/nervosnetwork/ckb-cli)，[VM debugger](https://github.com/xxuejie/ckb-standalone-debugger)，或 [ckb-contract-tool](https://github.com/jjyr/ckb-contract-tool)。

> 对于编程语言/工具链开发者来说，如果语言支持，建议集成 [debug syscall](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md#debug) 来打印错误回溯。例如：如果你使用 Rust 与 ckb-contract-std，你可以看到程序崩溃的触发点。


## ckb-cli

[ckb-cli](https://github.com/nervosnetwork/ckb-cli) 支持调试环境下生成模拟交易和验证。


### 1. 生成 mock-tx 模板

```
ckb-cli mock-tx template --lock-arg <your lock-arg> --output-file debug-tx.json
```

### 2. 修改模板

将你的脚本 Cell 添加到 `cell_deps` ，然后修改交易结构，以使用锁脚本（lock script）或者类型脚本（type script）。


### 3. 模板完成

```
ckb-cli mock-tx complete --tx-file debug-tx.json
```


该命令是根据你的锁参数（lock arg），使用私钥对交易进行签名。


### 4. 验证交易

```
ckb-cli mock-tx verify --tx-file debug-tx.json
```

你会看到验证结果以及调试输出。

至于如何构建一笔交易，请参考 [交易RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md) 。


## 使用 VM 调试器和 GDB

### 1. 安装 ckb-standalone-debugger

```
git clone https://github.com/nervosnetwork/ckb-standalone-debugger
cd ckb-standalone-debugger/bins
cargo build --release
```

### 2. 启动 ckb-standalone-debugger

[ckb-standalone-debugger](https://github.com/xxuejie/ckb-standalone-debugger) 支持 ckb-cli 生成的模板。进行脚本调试，我们用来 `-g <script type>` 表示脚本组类型。 `-h <script hash>`  表示我们要引用来调试的脚本组。 


```
ckb-debugger -l 0.0.0.0:2000 -g type -h <type script hash> -t debug-tx.json
```

### 3. 启动 GDB

```
docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191012 bash
# start gdb
riscv64-unknown-elf-gdb <path of script binary>
# connect to debugger server
target remote <ip>:2000
```


可以参考该教程 [CKB 脚本编程入门](https://xuejie.space/2019_07_05_introduction_to_ckb_script_programming_validation_model/) 了解更多。


## 报告漏洞

当你在脚本中发现与安全相关的漏洞时，请不要以公开 issue 的方式提交。相反，请尝试私下联系维护者，他们可以在 [CKB 开发者电报群](https://t.me/nervos_ckb_dev) 上找到。负责任的披露可以帮助维护者，也可以避免用户的资金损失。

当你在 CKB 官方脚本或 CKB VM 中发现与安全相关的漏洞时，请加入漏洞赏金计划，以奖励您的宝贵贡献!

