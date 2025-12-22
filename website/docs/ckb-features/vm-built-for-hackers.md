---
id: vm-built-for-hackers
title: Virtual Machine for Hackers
---

Blockchains need a deterministic virtual machine to run code (smart contracts). A virtual machine decides what you can build on the blockchain. When we started designing CKB, we knew we wanted a VM that felt like working with real hardware.

**CKB-VM** is our answer—a virtual machine that takes a totally different approach to blockchain computation. Instead of inventing a new, blockchain-specific instruction set (like the EVM) or adapting a web standard (like WebAssembly), CKB-VM emulates a real hardware CPU architecture: **RISC-V**.

This choice isn’t just a technical detail; it’s a philosophy. By emulating hardware instead of software, CKB-VM gives you flexibility, stability, and future-proofing that’s hard to find in the blockchain world.

## Why RISC-V?

[RISC-V](https://riscv.org/) is an open standard Instruction Set Architecture (ISA) based on tried-and-true reduced instruction set computer (RISC) principles. It’s modular, extensible, and free from licensing fees—basically, the "Linux of CPUs."

Nervos picked RISC-V for some pretty solid reasons:

1.  **A Real Hardware Standard**: RISC-V is built for physical hardware. Engineers from academia and industry have tested it to be efficient, simple, and reliable.
2.  **Stability**: Hardware ISAs don’t change much. Code written for an Intel 8086 in the 1970s can still run on modern x86 processors. By using a standardized hardware ISA, CKB ensures that smart contracts written today will still work decades from now.
3.  **Broad Toolchain Support**: RISC-V is a global standard, so it’s supported by major compilers like GCC, LLVM, and Rust. This means CKB developers get top-notch optimization and tools "out of the box."

## What Makes CKB-VM Unique?

CKB-VM is a pure software implementation of the RISC-V instruction set. Specifically, it uses the **RV64IMC_ZBA_ZBB_ZBC_ZBS** instruction set:

- **RV64**: 64-bit address space and registers.
- **I**: Integer instructions (basic arithmetic).
- **M**: Integer Multiplication and Division.
- **C**: Compressed instructions (smaller code size).
- **B**: Bit manipulation extension.

### The "No Precompiles" Philosophy

One of the coolest things about CKB-VM is what it _doesn’t_ have: **Precompiles**.

In the Ethereum Virtual Machine (EVM), expensive operations like SHA-256 hashing or ECDSA signature verification are "precompiled" into the client software. These are special opcodes that cost less gas because they’re run natively by the node.

The problem with precompiles? **They’re rigid.**

- Want to use a new cryptographic algorithm (e.g., Schnorr signatures or BLS)? You’re stuck until the chain developers add a new precompile via a hard fork.
- You’re limited to the specific version of the algorithm the chain supports.

**CKB-VM has zero precompiles.**
Because CKB-VM runs a hardware ISA, it’s fast enough to run cryptographic primitives _as script code_.

- **Secp256k1**: On CKB, this is just a C library compiled to RISC-V.
- **Blake2b**: Just a library.
- **Schnorr / BLS / ZK-SNARKs**: Just libraries.

This makes CKB **crypto-agnostic**. Developers can use any cryptographic primitive they want, whenever they want, without waiting for a hard fork. That’s how CKB already supports quantum-resistant algorithms like SPHINCS+, while other chains are still figuring it out.

To keep things fast without precompiles, CKB-VM uses some clever optimization tricks:

1. **Macro-op Fusion**

CKB-VM uses **Macro-op Fusion**, a technique found in modern high-end CPUs. It spots common instruction sequences and merges them into a single, internal "macro-operation."

- **Example**: A comparison followed by a branch (`CMP` + `BNE`) becomes a single "Compare-and-Branch" operation.
- **Benefit**: This cuts down the overhead of the interpreter loop, speeding up complex logic.

2. **B Extension (Bit Manipulation)**

CKB-VM supports the RISC-V **B Extension**, which adds special instructions for bit manipulation (like rotation, bit counting, etc.).

- **Benefit**: Cryptographic algorithms rely heavily on bitwise operations. The B extension makes these way faster, so crypto verification on CKB-VM is blazing fast.

### Feels Like a Single-Core Linux Environment

CKB-VM doesn’t have an MMU unit and uses a simple linear memory model. Each script instance gets its own memory space (defaulting to 4MB), which is cleared after execution. The VM’s runtime memory includes space for executable code pages, stack space, heap space, and mmapped pages of external cells. To keep things secure, **W^X (Write XOR Execute)** memory protection is enforced. A memory page can be either Writable or Executable, but never both at the same time. This stops common attacks like buffer overflows.

CKB-VM is strictly single-threaded, so RISC-V atomic instructions aren’t needed. Contracts can include their own coroutines. For simplicity and deterministic behavior, CKB doesn’t support floating-point numbers. If you really need them, we suggest using a softfloat solution.

These designs make the execution model super simple—kind of like early-era CPUs or embedded systems. To keep the virtual machine as close to a real CPU as possible, CKB also uses the Linux ELF format directly as the contract format.

This gives you maximum tooling and debugging support and **makes running a contract almost the same as running an executable in a single-core Linux environment**:

- Contracts start from the `main` function in the ELF-formatted contract file.
- Arguments are passed in via standard `argc` and `argv`.
- When `main` returns 0, the contract is considered successful.

Due to space constraints, we might not store full input and output data in `argv`. Instead, we provide metadata in `argv` and use additional libraries and syscalls to handle input/output loading. This keeps runtime costs low.

When interacting with the blockchain, CKB-VM uses **Syscalls** (System Calls), just like a program talks to a Linux OS. CKB-VM syscalls handle communication between the RISC-V-based CKB-VM and the main CKB process, letting scripts read transaction info and general blockchain data. Common syscalls include `Exit`, `Load Transaction Hash`, `Load Cell Data`, `Load Input`, `Debug`, etc. Using syscalls instead of custom instructions keeps the RISC-V implementation standard-compliant and widely supported.

Resource usage in CKB-VM is measured in **Cycles**. Unlike "Gas," which can feel arbitrary, Cycles are a deterministic measure of the actual CPU instructions executed. To measure contract costs, CPU cycles are tracked for each instruction. The total cycles at the end of execution represent the runtime cost. We also track the cost of reading/writing additional cells during contract execution. This gives developers a predictable and fair cost model.

## Virtual Machine for Hackers

Since CKB-VM acts like a bare-metal computer, it’s a playground for creative hackers. You’re not limited to a specific blockchain virtual machine—it’s more like working with regular Linux executables.

One of the coolest things is the flexibility of programming languages for CKB smart contracts. CKB only defines the low-level virtual machine. In theory, any language with a RISC-V backend can be used for CKB contract development:

- CKB can use standard `riscv-gcc`, `riscv-llvm`, or even upstream GCC/LLVM for C/C++ contract development. Executables from these compilers can be directly used as CKB contracts.
- C-based Bitcoin or Ethereum VMs can be compiled into RISC-V binaries as common cells. Contracts can load these common cells to run Bitcoin or Ethereum-compatible contracts.
- Higher-level language VMs, like Duktape or mruby, can be compiled and loaded to run contracts written in JavaScript or Ruby.
- System languages like Rust can also be used to write contracts targeting RISC-V.

CKB-VM is like a mini-computer based on RISC-V, making things like running a [Bitcoin VM](https://github.com/xxuejie/ckb-bitcoin-vm) in a smart contract totally doable by porting original C++ codes from Bitcoin. The possibilities are endless. We encourage low-level engineers and curious hackers to dive in and explore.

## Comparison with Other VMs

| Feature          | EVM (Ethereum)         | WASM (Polkadot, Near)     | CKB-VM (Nervos)                          |
| :--------------- | :--------------------- | :------------------------ | :--------------------------------------- |
| **Abstraction**  | Software Emulation     | Web Standard              | **Hardware Emulation**                   |
| **Word Size**    | 256-bit                | 32/64-bit                 | **64-bit**                               |
| **Cryptography** | Hardcoded Precompiles  | Host Functions            | **Libraries (Scripts)**                  |
| **Flexibility**  | Low (Hard Fork needed) | Medium                    | **High (Permissionless)**                |
| **Languages**    | Solidity, Vyper        | Rust, C++, AssemblyScript | **Any Language, Rust, C, Go, Lua, etc.** |

### vs EVM

The EVM uses 256-bit words to make crypto math easier, but this doesn’t match real CPUs (which are 64-bit). This forces the EVM to do expensive software emulation for basic math operations. CKB-VM uses 64-bit registers, mapping 1:1 with the host CPU for maximum performance.

### vs WASM

WebAssembly is great for the web, but it’s complex and always evolving (WASI, GC, Threads). It’s designed for JIT compilation in browsers. RISC-V is simpler and more stable, designed for bare-metal execution—perfect for blockchain needs.

## Future-Proofing

The biggest risk for any blockchain is becoming obsolete. By anchoring on the RISC-V standard, CKB ensures its VM will never become "legacy tech." As RISC-V hardware gets faster and more common, CKB-VM benefits automatically.

CKB-VM isn’t just a virtual machine; it’s a **universal computer** embedded in the blockchain, ready to run the cryptography and logic of tomorrow, today.
