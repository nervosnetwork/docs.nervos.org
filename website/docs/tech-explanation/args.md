---
id: args
title: args
---

`args` refers to the arguments imported into the CKB-VM instance as input for the Scripts. In CKB, public key information is conventionally stored in `args`, while signature information is in `witnesses`, though it's not mandatory.

:::note
When a Script is validated, CKB runs it in a RISC-V VM, and `args` must be loaded via special CKB syscalls. The UNIX standard `argc`/`argv` convention is NOT used in CKB. For more information on CKB-VM, please refer to [RFC003: CKB-VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md).
:::
