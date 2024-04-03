---
id: script
title: Script
---

If you are used to blockchains like Ethereum, you will recognize that CKB leverages a drastically different verification model: instead of creating a transaction that alters blockchain state when executing, a transaction in CKB contains state transitions directly in the form of cells. To alter the state of an existing cell, one just destroys the original cell, then create a new one in a single, atomic transaction. CKB scripts, running on CKB VM, actually perform series of validation rules on the input cells and output cells of the transaction.

In this section we will look closer at the data structure of scripts, and explain how lock scripts and type script work together to ensure the validation rules of CKB.

Notes: we will distinguish between **script code** and **script**：

* **script code** refers to the compiled program you write and deploy to CKB. It is the actual binary CKB VM will run to perform validation rules.
* **script** refers to the script data structure use by `lock script` and `type script` in [Cell](cell.md) data structure.

## Data Structure

Both `lock script` and `type script` use the same data structure：**Script**

**Example:**

```
{
  "hash_type": "type",
  "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  "args": "0xc285e812f6a35c2479d6f5b9bbaa357dd4e60da1"
}

{
  "hash_type": "data",
  "code_hash": "0xe7f93d7120de3ca8548b34d2ab9c40fe662eec35023f07e143797789895b4869",
  "args": "0x42b5561f13c2a8f7c710843bea7d179656dc6133a98b7d763cebc6e74c8ba72a"
}
```

A script has three fields：

* `code_hash`: A hash denoting which script in the transaction to execute. For space consideration, the actual script code is kept in the cell data part of a [live cell](cell#live-cell) on CKB. The current transaction should reference the live cell using a [cell dep](transaction) so as to locate and execute the script.
* `hash_type`: The interpretation of `code_hash` when looking for script code to run from cell deps.
    + If `hash_type` contains `data`, `code_hash` should match the blake2b hash of data(which is also the actual script code) in a dep cell;
    + if `hash_type` contains `type`, `code_hash` should instead match the blake2b hash of type script contained by a a dep cell. Note CKB will throw a validation error when a) we are locating a script code using `type` as `hash_type`; and b) more than one cell referenced by cell deps contains the specified hash of type script.

    The combination of a `code_hash` and a `hash_type`, will uniquely identify a script code in CKB.
* `args`: Auxiliary arguments for a script. This is why we need to distinguish between `script code` and `script` above: through `args`, a `script` actually represents an **instance** of a `script code`. Typical examples include:
    + While a single `script code` will be used for secp256k1 implementation, different people might include different public keys into `args` to create different `script`s, which lead to different wallets.
    + While a single `script code` might provide implementation for the [UDT](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) specification, different people might inject different `args` for different types of tokens.

We will talk about how to execute a script to validate transaction structure in sections below.

Depending on the different types, scripts will be executed at different times:

1. All lock scripts from all input cells in a transaction will be executed.
2. All type scripts(if exist) from all input cells and output cells in a transaction will be executed.

We will consider the transaction valid only when all the required scripts complete with a success status. Failure in any script will mark the transaction as invalid.

## Execution

Here we are providing a basic introduction for script execution flow, for the more precise definition, please refer to the following RFCs:

* [CKB VM](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0003-ckb-vm/0003-ckb-vm.md)
* [VM Syscalls](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md)
* [VM Cycle Limits](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0014-vm-cycle-limits/0014-vm-cycle-limits.md)

Each script that needs to be executed from a CKB transaction, will be run in a [CKB VM](https://github.com/nervosnetwork/ckb-vm) instance. At its core, CKB VM is just an implementation of the [RISC-V](https://riscv.org/) Instruction Set Architecture(ISA). It means any RISC-V standard compliant program(RV64IMC to be more precise, see the RFCs for more details) will be accepted by CKB VM. The common [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) format is used to package a binary.

To use a RISC-V program as a script on CKB, one simply needs to create a new [cell](cell) with the full program binary in the cell's data part. One the transaction generating the new cell is committed on CKB, scripts can then be assembled to use the program as script code. As mentioned above, a cell dep entry must be also create to reference the newly created cell containing script code.

There are cases that RISC-V ISA is not be enough, for example, a script might want to read information from the enclosing transaction to enforce validation rules, CKB provides a series of `syscalls` that will handle this task. Notice `syscall` is a concept also designed and included by the RISC-V standard ISA, we are confronting to RISC-V standard specification as much as we can.

To prevent infinite loops, `cycles` are introduced to CKB VM. Each executed RISC-V instruction and each syscall made will consume certain amount of cycles. At consensus layer, CKB has a hard limit on the maximum cycles that is allowed in a single block. The total cycles consumed by all executed scripts, from all transactions included in a blocks, must not exceed this number. Otherwise the block will be rejected.

## Use Cases

Lock script and type script share the identical running environment, they can all access all the information contained in its enclosing transaction. But due to the fact they are executed in different times, they have formed into different use cases.

### Lock Script

Lock scripts are more for representing ownerships. Typical use cases for lock scripts include:

* Signature verification
* Lock period ensurance

You might notice that type script can actually replace all functionalities of a lock script, meaning a cell can use a dummy lock script that does nothing, and rely on type script for all behaviors. But that is an anti-pattern of CKB now. By making lock script mandatory, we want to ensure each cell at least uses a secure lock script.

Lock script can be viewed as the last defense to ensure that your tokens stay safe. So we do recommend to keep your lock as simple as possible, to avoid the potential of vulnerabilities.

### Type Script

Type script, on the other hand, is where innovations would more likely to happen on CKB. Some use cases of type scripts include:

* User Defined Token(UDT) implementation
* Ensuring cell data confronts to a certain format
