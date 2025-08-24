---
id: witness
title: witnesses
---

# witnesses

`witnesses` is provided by transaction creator to enable the successful execution of the corresponding Script. For example, signatures might be included to ensure a signature verification Lock Script passes.

In CKB convention, public key information is stored in the `args` of the Script, while signature information is in `witnesses`.

`witnesses` is a bytes vector. You can serialize any proof data required by the transaction into bytes vector in the `witnesses` field. The serialization can be done using [Molecule](https://github.com/nervosnetwork/molecule) or any other custom serialization method.

:::note

A transaction without the `witnesses` field is referred to as a Raw Transaction. The transaction hash is calculated from this raw transaction. However, the length of `witnesses`, which affects the transaction size, is considered into the transaction fee.

:::

## Conventional Usage

`witnesses` is highly flexible in CKB transaction, allowing the Scripts to use various methods to read `witnesses` data for transaction validation. To ensure compatibility and non-interference among Scripts, certain conventions are established. So far there are two: **WitnessArgs** and **CoBuild**.

### WitnessArgs

**WitnessArgs** is a convention actively used in the CKB community. Its structure includes three fields:

```
table WitnessArgs {
    lock:                   BytesOpt,          // Lock args
    input_type:             BytesOpt,          // Type args for input
    output_type:            BytesOpt,          // Type args for output
}
```

<img src={"/img/tech_explanation/witnessArg-structure.png"} width={688} height={353} alt="Structure of WitnessArg" />

This structure is a `table` defined in [Molecule](https://github.com/nervosnetwork/molecule). All three fields are optional (`Opt`), and can be chosen depending on the contract’s requirements.

- A **Lock Script** executes only when the Cell is an **input**.
- A **Type Script** executes for both **input** and **output** Cells.

Therefore, WitnessArgs provides three optional fields to carry proof data for these cases.

Under this convention, all contracts must read their Witness data through WitnessArgs.  
The **order** of WitnessArgs items in the `witnesses` field is also important, as it corresponds to the index in the virtual array created by [script grouping](/docs/tech-explanation/script-group-exe).

#### Example and Test

To illustrate this mechanism, here is a Script that does the following:

1. Prints the contents of its Args (UTF-8 string in this example).
2. Uses `load_script_hash` to get its own ScriptHash.
3. Uses `load_cell_lock_hash` and `load_cell_type_hash` to inspect other Cells’ Lock/Type scripts and print their indices.
4. Uses `load_witness_args` to obtain all GroupInput and GroupOutput data and print them (Witness values stored as UTF-8 strings).

The test transaction is constructed as follows:

```yaml
Inputs:
  0:
    Lock:
      Code Hash: lock_script_1
    Type:
      Code Hash: type_script_1
  1:
    Lock:
      Code Hash: lock_script_1
    Type:
      Code Hash: type_script_2
Outputs:
  0:
    Lock:
      Code Hash: lock_script_1
    Type:
      Code Hash: type_script_2
  1:
    Lock:
      Code Hash: lock_script_1
    Type:
      Code Hash: type_script_1
```

The groups formed are:

- **lock_script_1**: inputs\[0], inputs\[1]
- **type_script_1**: inputs\[1], outputs\[0]
- **type_script_2**: inputs\[0], outputs\[1]

#### Quick Reference Table (summary, log below)

| Script group (label)     | Entry Witness (by convention)       | Relevant WitnessArgs fields | Log section               |
| ------------------------ | ----------------------------------- | --------------------------- | ------------------------- |
| lock_script_1 (`lock 1`) | `witnesses[index of GroupInput[0]]` | `lock`                      | `[contract debug] lock 1` |
| type_script_2 (`type 2`) | `witnesses[index of GroupInput[0]]` | `input_type`, `output_type` | `[contract debug] type 2` |
| type_script_1 (`type 1`) | `witnesses[index of GroupInput[0]]` | `input_type`, `output_type` | `[contract debug] type 1` |

> Each group always uses the Witness corresponding to its first input (`GroupInput[0]`) as its entry point.
> Different groups may reference the same Witness item, but each reads only its own field (`lock`, `input_type`, or `output_type`).

#### Raw Test Output (full logs)

```text
---- tests::test_group_exec stdout ----
[contract debug] lock 1
[contract debug] Inputs Lock:  [00, 01]
[contract debug] Inputs Type:  None
[contract debug] Outputs Type: None
[contract debug] Index: 0, Lock Witnes:  Witness 0, Lock
[contract debug] Index: 1, Lock Witnes:  Witness 1, Lock
[contract debug] type 2
[contract debug] Inputs Lock:  None
[contract debug] Inputs Type:  [01]
[contract debug] Outputs Type: [00]
[contract debug] Index: 0, InputType Witnes:  Witness 1, Input Type
[contract debug] Index: 0, OutputType Witnes:  Witness 1, Output Type
[contract debug] Index: 0, InputType Witnes:  Witness 0, Input Type
[contract debug] Index: 0, OutputType Witnes:  Witness 0, Output Type
[contract debug] type 1
[contract debug] Inputs Lock:  None
[contract debug] Inputs Type:  [00]
[contract debug] Outputs Type: [01]
[contract debug] Index: 0, InputType Witnes:  Witness 0, Input Type
[contract debug] Index: 0, OutputType Witnes:  Witness 0, Output Type
[contract debug] Index: 0, InputType Witnes:  Witness 1, Input Type
[contract debug] Index: 0, OutputType Witnes:  Witness 1, Output Type
consume cycles: 245118
```

In this test, all three fields (`lock`, `input_type`, `output_type`) are filled for demonstration purposes. Whether Lock or Type, each script group retrieves its entry Witness from its first input index. When multiple groups share the same input index, they may appear to “reuse” the same Witness, but they only read their relevant field, avoiding conflicts.

### CoBuild

CoBuild is a protocol that describes an off-chain procedure for multiple parties to collaboratively create a CKB Transaction. It also aims to create a composable and automation-friendly transaction witness layout standard, replacing the existing WitnessArgs.

However, CoBuild protocol is still in its early stage, so it is not widely used for the moment, and the standard is not finalized yet. You can learn more about CoBuild from [the proposal](https://talk.nervos.org/t/ckb-transaction-cobuild-protocol-overview/7702).

For a detailed explanation of transaction structure, see [RFC0022: CKB Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#header-deps).
