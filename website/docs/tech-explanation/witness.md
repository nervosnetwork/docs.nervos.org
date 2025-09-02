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

This structure is a [`table`](https://github.com/nervosnetwork/molecule/blob/master/docs/encoding_spec.md#table) defined in [Molecule](https://github.com/nervosnetwork/molecule). All three fields are optional (`Opt`), and can be chosen depending on the contract’s requirements.

On CKB, different Scripts run at different times:

- A [Lock Script](/docs/tech-explanation/lock-script) only runs on input Cells (when they are being spent).
- A [Type Script](/docs/tech-explanation/type-script) runs on both input and output Cells (when they are being spent and created)

Because of this, the WitnessArgs structure has three optional fields:

- `lock`: data used by Lock Script
- `input_type`: data used by Type Script when validating inputs
- `output_type`: data used by Type Script when validating outputs

By this convention, all Scripts read their Witness data from WitnessArgs.

The **order** of WitnessArgs items in the `witnesses` field is also important, as it corresponds to the index in the virtual array created by [script grouping](/docs/tech-explanation/script-group-exe).

#### Example and Test

- [Contract: Group Exec](https://github.com/joii2020/docs.nervos.org/tree/dev.witnesses_args/examples/rust-script-examples/contracts/group_exec)
- [Unit Test](https://github.com/joii2020/docs.nervos.org/blob/dev.witnesses_args/examples/rust-script-examples/tests/src/tests.rs#L457)

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

(This transaction is just exchanging two `TypeScripts`. This is just for demonstration, in fact, this transaction has no special meaning.)

The groups formed are:

- **lock_script_1**: inputs\[0], inputs\[1]
- **type_script_1**: inputs\[0], outputs\[1]
- **type_script_2**: inputs\[1], outputs\[0]

In a CKB transaction, **Witnesses** are independent from **Inputs** and **Outputs**. However, the index of each witness corresponds to the index of the Script group it belongs to.

For example, if `type_script_1` is grouped with `inputs[0]` and `outputs[1]`, then when loading the Witnesses of this group, both `witnesses[0]` and `witnesses[1]` will be accessed. (Note that here you must use the corresponding **GroupInput** and **GroupOutput**—their Witnesses may differ, or they may be the same.)

After grouping, the Scripts load Witnesses as follows:

- **lock_script_1** : `witnesses[0]`, `witnesses[1]` (via GroupInput)
- **type_script_1** : `witnesses[0]` (via GroupInput), `witnesses[1]` (via GroupOutput)
- **type_script_2** : `witnesses[1]` (via GroupInput), `witnesses[0]` (via GroupOutput)

From this, we can see that multiple Scripts may end up using the same Witness. This situation is common in real transactions. To resolve potential conflicts, CKB introduces a standard convention: **WitnessArgs**.

The three fields in WitnessArgs map precisely to the three possible positions above. For example, when `lock_script_1` obtains `witnesses[0]`, it can extract only the `lock` field; similarly, `type_script_1` can take the `input_type` field from `witnesses[0]`.

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
