---
id: script
title: Script
---

# Script

## Structure

In addition to the rules defined by the CKB protocol, verification based on the Scripts in the input and output Cells of the transaction is also required.

```bash
Script: {
  code_hash: HexString
  args: HexString
  hash_type: Uint8, there are 4 allowed values: {0: "data", 1: "type", 2: "data1", 4: "data2"}
}
```

## Fields & Description{#fields-and-description}

| Name        | Type                                                                         | Description                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `code_hash` | H256                                                                         | Hash of the ELF formatted RISC-V binary that contains a CKB Script. For more, see [`code_hash`](/docs/tech-explanation/code-hash)  |
| `hash_type` | Uint8, one of the 4 values: \{0: "data", 1: "type", 2: "data1", 3: "data2"\} | Interpretation of the code hash when looking for matching dep cells. For more, see [`hash_type`](/docs/tech-explanation/hash-type) |
| `args`      | H256                                                                         | Arguments as the Script input. For more, see [`script_args`](/docs/tech-explanation/script-args)                                   |

## Script vs. Code

We differentiate the terms Script and Code as follows:

- Script is a data structure referencing to runnable on-chain code.
- Code refers to the RISC-V binary, runnable in CKB-VM and can be referenced to by the Script structure.
- A code Cell is a Cell containing RISC-V binary code.
- Script does not directly include code; it simply stores a pointer to reference the code.
