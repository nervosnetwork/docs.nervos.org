---
id: debug
title: Tips for debugging CKB script
---

CKB VM simulates the RISC-V instruction set, which is very different from other VMs that hard-code functionality through opcodes. Given the generalized nature of CKB VM, various languages and toolchains can be supported- every language and toolchain will be a bit different and implementers should provide appropriate documentation and support for the community.

This document introduces several tips about debugging CKB scripts.


## Error codes

The CKB node only reports an exit code on transaction verification failure; the most straightforward way to distinguish errors is to use a different exit code (between -128 and 127) to represent errors.

For example, see the default lock script error codes: [secp256k1 error codes](https://github.com/nervosnetwork/ckb-system-scripts/wiki/Error-codes)

> A common mistake is mixing up lock script errors and type script errors. A simple debugging method is to remove the type script, then run again; if the error still exists, you can be sure the error is being caused by the lock script; otherwise, it is caused by the type script.


## Debug syscall

When we want to output additional information from the script; the [debug syscall](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md#debug) is used.

By default, the CKB node does not output the debug syscall message, however `ckb.toml` can be configured to enable it.

```
[logger]
filter = info,ckb-script=debug
```

You can also choose to run the script under a debugging environment like [ckb-cli](https://github.com/nervosnetwork/ckb-cli), [VM debugger](https://github.com/xxuejie/ckb-standalone-debugger), or [ckb-contract-tool](https://github.com/jjyr/ckb-contract-tool).

> For language / toolchain implementers, it is recommended that you integrate [debug syscall](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md#debug) to print the error backtrace if your language supports it. For example: if you are using Rust with [ckb-contract-std](https://github.com/jjyr/ckb-contract-std), you can see the panic location where the program crashed.


## ckb-cli

[ckb-cli](https://github.com/nervosnetwork/ckb-cli) supports generation of a mock transaction and verification under the debugging environment.


### 1. Generate mock-tx template

```
ckb-cli mock-tx template --lock-arg <your lock-arg> --output-file debug-tx.json
```



### 2. Modify the template

Add your script cell to the `cell_deps` and modify the transaction structure to use a lock script or type script.


### 3. Complete the template

```
ckb-cli mock-tx complete --tx-file debug-tx.json
```


This command signs the transaction with the private key according to your lock arg.


### 4. Verify the transaction

```
ckb-cli mock-tx verify --tx-file debug-tx.json
```


You will see the verification result and the debug output.

See the [transaction RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md) for instructions on how to construct a transaction.


## Using VM debugger and GDB

### 1. Install ckb-standalone-debugger

```
git clone https://github.com/nervosnetwork/ckb-standalone-debugger
cd ckb-standalone-debugger/bins
cargo build --release
```



### 2. Start standalone debugger

[ckb-standalone-debugger](https://github.com/xxuejie/ckb-standalone-debugger) supports a ckb-cli generated template. To debug a script, we indicate the script group type with `-g <script type>` . This indicates the script group we want to debug with the referenced `-h <script hash>`.


```
ckb-debugger -l 0.0.0.0:2000 -g type -h <type script hash> -t debug-tx.json
```



### 3. Start GDB

```
docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191012 bash
# start gdb
riscv64-unknown-elf-gdb <path of script binary>
# connect to debugger server
target remote <ip>:2000
```


To learn more, you can view this tutorial: [introduction to CKB script programming](https://xuejie.space/2019_07_05_introduction_to_ckb_script_programming_validation_model/).


## Report bugs

When you find security-related bugs in script, please don't post them on public issues. Instead, try to contact maintainers privately, they can be found on the [CKB dev telegram](https://t.me/nervos_ckb_dev). Responsible disclosure could help maintainers, as well as prevent users from losing funds.

When you find security-related bugs in CKB official scripts or CKB VM, join the [bug bounty program](https://bounty.nervos.org/) to be rewarded for your valuable contribution!













