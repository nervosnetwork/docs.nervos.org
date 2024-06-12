---
id: script-args
title: script_args
---

`script_args` refers to the arguments imported into the CKB-VM instance as input for the Scripts. In CKB, public key information is conventionally stored in `script_args`, while signature information is in `witnesses`, though it's not mandatory.

:::note
When a Script is validated, CKB runs it in a RISC-V VM, and `script_args` must be loaded via special CKB syscalls. The UNIX standard `argc`/`argv` convention is NOT used in CKB. For more information on CKB-VM, please refer to [RFC003: CKB-VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md).
:::
