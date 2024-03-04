---
id: ckb-vm
title: CKB-VM
---

## What is the CKB-VM?

Ethereum’s virtual machine-based programmability opened the door for Turing complete development on the blockchain. Nervos takes this one step further by utilizing the RISC-V instruction set to create the CKB-VM.

The CKB-VM is a virtual machine that executes smart contracts on Nervos. It is a full computer being emulated through software. It provides developers with the maximum amount of power and flexibility while maintaining a secure high-performance environment.

## RISC-V

RISC-V is a computer instruction set similar to the one that powers your computer and the smartphone in your pocket. It is the lowest level of the software stack that provides raw instructions directly to the CPU.

RISC-V is an award-winning open standard developed and backed by some of the largest and most recognized tech industry leaders. Support and adoption are already prevalent and several large hardware manufacturers have announced plans to implement RISC-V in their mainstream consumer products.

The standard is mature, established, and built for modern hardware development. This guarantees a simple, modular design that will always be backward-compatible. It is an ideal fit for blockchain development.

## Flexibility

With CKB-VM, operations that have traditionally been problematic in blockchains, like rolling out new cryptographic primitives such as Schnorr, BLS, zk-SNARKs, and zk-STARKs, no longer require a hard fork. The process is as simple as adding a new library to your codebase. 

Developers have complete flexibility to rely on existing open-source libraries rather than being forced to retool everything from scratch. This allows for a less restrictive developer experience and quicker adoption of next-generation technological advancements, such as cross-blockchain interaction, scaling innovations, and direct integration with secure hardware enclaves.

Any programming language that can target RISC-V can be used natively for Nervos development. Use your existing tooling, favorite IDEs, and debug tools. There is no need to rely on immature and untested tools; use whatever is best for the job.

Nervos CKB offers native SDKs in a growing number of well-known general-purpose programming languages, such as JavaScript, Rust, and C. Direct support for emerging smart contract languages, such as Solidity, Vyper, and Plutus is also planned.

## Further Reading

* For more technical information on CKB-VM, please see the [CKB-VM RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md). 
