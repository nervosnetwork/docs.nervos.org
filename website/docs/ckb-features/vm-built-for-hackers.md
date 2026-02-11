---
id: vm-built-for-hackers
title: Virtual Machine for Hackers
---

Blockchains rely on a deterministic virtual machine to execute code (smart contracts). The design of a virtual machine directly shapes what can be built on top of the blockchain. When designing CKB, one of the core goals was to provide a VM that feels closer to working with real hardware rather than a highly specialized runtime.

**CKB-VM** reflects this approach. Instead of introducing a new blockchain-specific instruction set (such as the EVM, a custom set of low-level operations designed only for one blockchain), or adapting a web standard (such as WebAssembly), CKB-VM emulates a real hardware CPU architecture: **RISC-V**.

This decision goes beyond implementation details. By emulating hardware—executing programs the way a real CPU would, rather than relying on higher-level software abstractions—CKB-VM prioritizes long-term flexibility and stability, making the system more resilient to future changes.

## Why RISC-V?

[RISC-V](https://riscv.org/) is an open standard Instruction Set Architecture (ISA)—the specification that defines the basic operations a CPU can execute—based on established reduced instruction set computer (RISC) principles. It is modular, extensible, and free from licensing fees, making it suitable for long-term, open systems.

Nervos CKB selected RISC-V for several key reasons:

1. **A hardware-oriented standard**  
   RISC-V is designed for real, physical CPUs. Engineers across academia and industry have tested it with a focus on efficiency, simplicity, and reliability.
2. **Long-term stability**  
   Hardware ISAs tend to evolve slowly and preserve backward compatibility. For example, code written for early x86 processors decades ago can still run on modern systems. By using a standardized hardware ISA, CKB helps ensure that Scripts (smart contracts) written today remain executable in the future.
3. **A mature tooling ecosystem**  
   As a widely adopted standard, RISC-V is supported by major compilers such as GCC, LLVM, and Rust. This allows CKB developers to reuse well-tested compiler optimizations and development tools without relying on blockchain-specific tooling.

## What Makes CKB-VM Unique?

CKB-VM is a pure software implementation of the RISC-V instruction set. More specifically, CKB-VM supports the **RV64IMC_ZBA_ZBB_ZBC_ZBS** instruction set configuration. This configuration defines the set of basic operations the VM can execute:

- **RV64**: A 64-bit address space and registers.
- **I**: Integer instructions. It supports the core set of basic arthmetic operations, such as addtion and subtraction.
- **M**: Integer Multiplication and Division.
- **C**: Compressed instructions. Allows instructions to be encoded in a smaller format, reducing code size and improving efficiency.
- **B**: Bit manipulation extension. Provides low-level operationss for manipulating individual bits, which are particularly useful in cryptographic and performance-sensitive code.

### The "No Precompiles" Philosophy

One notable design choice in CKB-VM is the absence of **precompiles**.

In the Ethereum Virtual Machine (EVM), certain expensive operations like SHA-256 hashing or ECDSA signature verification are implemented as special built-in functions. These are special opcodes that are cheaper to run than equivalent logic written in Scripts.

While this approach improves performance, it also introduces rigidity:

- Adding a new cryptographic algorithm (e.g., Schnorr signatures or BLS) typically requires adding a new precompile through a hard fork.
- Developers are limited to the specific versions of algorithms provided by protocol.

**CKB-VM has zero precompiles.**
CKB-VM takes a different approach, as it **introduces zero precopiles**. Cryptographic primitives are implemented directly as code running inside the virtual machine.

For example,

- **Secp256k1** is implemented as a C library compiled to RISC-V.
- **Blake2b** is implemented as a library.
- **Schnorr / BLS / ZK-SNARKs** are implemented as libraries.

Because these algorithms are not embedded in consensus rules, CKB is **crypto-agnostic**. Developers can introduce any new cryptographic primitive whenever they want, without waiting for a hard fork. That’s how CKB is [quantum-resistant](/docs/ckb-features/quantum-resistant) natively and already enabled early experimentation with post-quantum cryptography, such as SPHINCS+.

To maintain performance without relying on precompiled operations, CKB-VM uses some optimization techniques:

1. **Macro-op Fusion**

CKB-VM uses **Macro-op Fusion**, a technique commonly used in modern high-end CPUs. It spots common instruction sequences and merges them into a single, internal "macro-operation."

- **Example**: A comparison followed by a branch (`CMP` + `BNE`) becomes a single "Compare-and-Branch" operation.
- **Benefit**: This cuts down the overhead of the interpreter loop, speeding up complex logic.

2. **Bit Manipulation Extensions**

CKB-VM supports the RISC-V **B Extension**, which adds special instructions for bit manipulation (like rotation, bit counting, etc.).

- **Benefit**: Cryptographic algorithms rely heavily on bitwise operations. The B extension makes these way faster, so crypto verification on CKB-VM is blazing fast.

### Feels Like a Single-Core Linux Environment

CKB-VM uses a simple linear memory model and does not include an MMU (memory management unit). Each Script execution gets its own memory space (defaulting to 4MB), which is cleared after execution.

The VM’s runtime memory includes:

- Space for executable code pages
- Stack space
- Heap space
- Memory-mapped pages for accessing external Cells.

To keep things secure, **W^X (Write XOR Execute)** memory protection is enforced: a memory page can be either writable or executable, but never both. This prevents common attacks like buffer overflows.

CKB-VM is strictly single-threaded, so RISC-V atomic instructions aren’t needed. Contracts can include their own coroutines. Floating-point instructions are not supported, as floating-point arthmetic can introdue non-determinism. When needed, softfloat solution can be used instead.

### ELF Executables and Syscalls

To remain as close as possible to a real hardware execution, CKB-VM also uses the standard Linux ELF (Executable and Linkable Format) directly as the Script's format.

This gives developers maximum tooling and debugging support and **makes running a Script almost the same as running an executable in a single-core Linux environment**:

- Scripts start from the `main` function in the ELF-formatted contract file.
- Arguments are passed in via standard `argc` and `argv`.
- When `main` returns 0, the Script is considered successful.

Due to space constraints, full input and output data are not always passed directly through `argv`. Instead, metadata is provided through arguments, and additional data is accessed through syscalls.

Interaction with the blockchain is handled through syscalls, similar to how programs interact with a Linux OS. CKB-VM syscalls handle communication between the RISC-V-based CKB-VM and the main CKB process, letting Scripts read transaction info and general blockchain data. Common syscalls include `Exit`, `Load Transaction Hash`, `Load Cell Data`, `Load Input`, `Debug`, etc. Using syscalls instead of custom instructions keeps the RISC-V implementation standard-compliant and widely supported.

### Predictable Resource Accounting

CKB-VM measures execution cost in **Cycles**. Unlike arbitrary gas models, cycles is a deterministic measure of computational effort. Each instruction consumes a predictable number of cycles, and additional costs are tracted for operations such as reading or writing Cell data. This final cycle count represents the total execution cost of a Script, which provides developers with a transparent, fair, and deterministic cost model.

## Virtual Machine for Hackers

Since CKB-VM acts like a bare-metal computer, it’s a playground for creative hackers. Developers are not limited to a specific blockchain virtual machine—it’s more like working with regular Linux executables.

CKB only defines the low-level virtual machine. In theory, any language with a RISC-V backend can be used for CKB Script development:

- Standard toolchains such as `riscv-gcc`, `riscv-llvm`, or upstream GCC/LLVM can be used for for C/C++ Script development. Executables from these compilers can be directly used as CKB Scripts.
- C-based Bitcoin or Ethereum VMs can be compiled into RISC-V binaries as reusable common Cells. Scripts can then load these Cells to execute Bitcoin or Ethereum-compatible logic.
- Higher-level language VMs, like Duktape or mruby, can be compiled and loaded to run Scripts written in JavaScript or Ruby.
- System languages like Rust can also be used to write Scripts targeting RISC-V.

CKB-VM functions as a mini-computer based on RISC-V, making things like running a [Bitcoin VM](https://github.com/xxuejie/ckb-bitcoin-vm) in a Script totally doable by porting original C++ codes from Bitcoin. The model encourages experimentation at the execution layer without requiring changes to the underlying protocol.

## Comparison with Other VMs

| Feature          | EVM (Ethereum)         | WASM (Polkadot, Near)     | **CKB-VM (Nervos)**                   |
| :--------------- | :--------------------- | :------------------------ | :------------------------------------ |
| **Abstraction**  | Software emulation     | Web standard              | **Hardware emulation**                |
| **Word Size**    | 256-bit                | 32/64-bit                 | **64-bit**                            |
| **Cryptography** | Hardcoded precompiles  | Host functions            | **User-defined libraries (Scripts)**  |
| **Flexibility**  | Low (Hard Fork needed) | Medium                    | **High (Script-level extensibility)** |
| **Languages**    | Solidity, Vyper        | Rust, C++, AssemblyScript | **Any language that targets RISC-V**  |

### vs EVM

The EVM uses 256-bit words to simplify cryptography, but real CPUs are 64-bit. That mismatch forces the EVM to do expensive software emulation for basic math operations.
CKB-VM uses native 64-bit registers, matching CPUs 1:1 for maximum performance.

### vs WASM

WebAssembly shines in the browser, but it is complex and constantly evolving (WASI, GC, threads). It is designed for JIT-compiled, high-level environments.
CKB-VM is based on RISC-V: minimal, stable, and designed for bare-metal execution—perfect for blockchain needs.

## Future-Proofing

Blockchains don’t just fail due to security—they fail when they become outdated. By anchoring the VM to the RISC-V standard, CKB avoids that trap. As RISC-V hardware becomes faster and more widely adopted, CKB-VM benefits automatically, without redesigns or migrations.

CKB-VM isn’t just a virtual machine—it is a **universal computer** embedded in the blockchain, designed to run the cryptography and logic of today and tomorrow.
