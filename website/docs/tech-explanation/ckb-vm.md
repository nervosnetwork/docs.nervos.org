---
id: ckb-vm
title: CKB-VM
---

Nervos introduces CKB-VM, a virtual machine powered by the RISC-V instruction set, further leveraging Turing-complete programmability, transforming smart contract execution on the Nervos blockchain. It provides considerable amount of power and flexibility while maintaining a secure and high-performance environment.

## RISC-V

[RISC-V](https://riscv.org/) is an instruction set architecture that serves as the foundation for processor design. As the lowest level of the software stack, it directly provides raw instructions to the CPU. RISC-V standard is mature, established, and built for modern hardware development. Underscored by widespread recognition, RISC-V offers a modular, backward-compatible design ideal for blockchain development.

## Enhanced Flexibility and Simplified Development Experience

With CKB-VM, developers can seamlessly integrate cryptographic primitives (e.g., Schnorr, BLS, zk-SNARKs, and zk-STARKs) into smart contracts without hardforks. The process is as simple as adding a new library to your codebase. This fasters a smoother developer experience, accelerating the adoption of advanced technologies, such as cross-chain interaction, scaling innovations, and seamless integration with secure hardware enclaves.

Any programming language that can target RISC-V can be used natively for development on Nervos. From JavaScript to Rust, developers can utilize preferred tools and languages, eliminating the need for untested tooling and enabling efficient, secure smart contract deployment.

Nervos CKB offers native SDKs in several mainstream programming languages, such as JavaScript, Rust, Go, Java, and Ruby.

---

For more information on CKB-VM, please refer to the [RFC CKB-VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md).
