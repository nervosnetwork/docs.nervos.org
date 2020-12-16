# CKB-VM

## What is the CKB-VM? 什么是 CKB-VM？

Ethereum’s virtual machine-based programmability opened the door for Turing complete development on the blockchain. Nervos takes this one step further by utilizing the RISC-V instruction set to create the CKB-VM.

以太坊基于虚拟机的可编程性开创了在区块链上实现图灵完备开发的先河。Nervos 通过利用 RISC-V 指令集来创建 CKB-VM，实现更完善的图灵完备开发。

The CKB-VM is a virtual machine that executes smart contracts on Nervos. It is a full computer being emulated through software. It provides developers with the maximum amount of power and flexibility while maintaining a secure high-performance environment.

CKB-VM 是 Nervos 上执行智能合约的虚拟机，通过软件模拟实现计算机的完整功能，为开发人员提供了最大程度的功能性和灵活性，同时保持了安全的高性能环境。

## RISC-V

RISC-V is a computer instruction set similar to the one that powers your computer and the smartphone in your pocket. It is the lowest level of the software stack that provides raw instructions directly to the CPU.

RISC-V 是一种计算机指令集，类似于计算机和智能手机的指令集。它是软件堆栈的最底层，可直接向 CPU 提供原始指令。

RISC-V is an award-winning open standard developed and backed by some of the largest and most recognized tech industry leaders. Support and adoption are already prevalent and several large hardware manufacturers have announced plans to implement RISC-V in their mainstream consumer products.

RISC-V 是屡获殊荣的开放标准，由一些最大，最受认可的技术行业领导者开发和支持。RISC-V 的支持和采用已经很普遍，几家大型硬件制造商已经宣布了在其主流消费产品中实现 RISC-V 的计划。

The standard is mature, established, and built for modern hardware development. This guarantees a simple, modular design that will always be backward-compatible. It is an ideal fit for blockchain development.

RISC-V 是十分成熟资深的标准，为现代硬件开发而生。这保证了始终向后兼容的简单模块化设计，非常适合区块链开发。

## Flexibility 灵活性

With CKB-VM, operations that have traditionally been problematic in blockchains, like rolling out new cryptographic primitives such as Schnorr, BLS, zk-SNARKs, and zk-STARKs, no longer require a hard fork. The process is as simple as adding a new library to your codebase.

使用 CKB-VM，传统上在区块链中存在问题的操作（如推出新的加密原语 Schnorr，BLS，zk-SNARK 和 zk-STARK）不再需要硬分叉。该过程就像将新库添加到您的代码库一样简单。

Developers have complete flexibility to rely on existing open-source libraries rather than being forced to retool everything from scratch. This allows for a less restrictive developer experience and quicker adoption of next-generation technological advancements, such as cross-blockchain interaction, scaling innovations, and direct integration with secure hardware enclaves.

开发人员具有完全的灵活性，可以依靠现有的开放源代码库，而不必被迫从头开始重新构建一切。这样可以减少对开发人员的限制，并更快地采用下一代技术进步，例如跨链交互，扩展创新以及与安全硬件专用区的直接集成。

Any programming language that can target RISC-V can be used natively for Nervos development. Use your existing tooling, favorite IDEs, and debug tools. There is no need to rely on immature and untested tools; use whatever is best for the job.

适用于 RISC-V 的任何编程语言都可以直接用于 Nervos 开发。你可以使用你当前的工具，常用的 IDE 和调试工具。无需依赖未成熟且未经测试的工具，直接使用最适合的工具。

Nervos CKB offers native SDKs in a growing number of well-known general-purpose programming languages, such as JavaScript, Rust, and C. Direct support for emerging smart contract languages, such as Solidity, Vyper, and Plutus is also planned.

Nervos CKB 根据主流通用编程语言提供了一些原生 SDKs，例如 JavaScript、Rust 和 C，未来会提供更多编程语言的 SDKs。还计划直接支持新兴的智能合约语言，例如 Solidity，Vyper 和 Plutus。

## Further Reading 扩展阅读

* For more technical information on CKB-VM, please see the[CKB-VM RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md).
* 有关 CKB-VM 的更多技术信息，请参阅[CKB-VM RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md)。
