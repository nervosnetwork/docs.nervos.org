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

WitnessArgs is an actively used convention in CKB community, with a structure including 3 fields:

```
table WitnessArgs {
    lock:                   BytesOpt,          // Lock args
    input_type:             BytesOpt,          // Type args for input
    output_type:            BytesOpt,          // Type args for output
}
```

<img src={"/img/tech_explanation/witnessArg-structure.png"} width={688} height={353} alt="Structure of WitnessArg" />

Under this convention, each item in the witnesses field is a byte array serialized by Molecule from a WitnessArgs structure. Each WitnessArgs contains multiple proof data read by the input Lock Script, input Type Script, and the output Type Script. The order of WitnessArgs item in the `witnesses` field also matters, corresponding to the index of the virtual array created by the [Scripts grouping](/docs/tech-explanation/script-group-exe).

### CoBuild

CoBuild is a protocol that describes an off-chain procedure for multiple parties to collaboratively create a CKB Transaction. It also aims to create a composable and automation-friendly transaction witness layout standard, replacing the existing WitnessArgs.

However, CoBuild protocol is still in its early stage, so it is not widely used for the moment, and the standard is not finalized yet. You can learn more about CoBuild from [the proposal](https://talk.nervos.org/t/ckb-transaction-cobuild-protocol-overview/7702).

For a detailed explanation of transaction structure, see [RFC0022: CKB Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#header-deps).
