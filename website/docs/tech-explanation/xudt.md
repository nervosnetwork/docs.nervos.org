---
id: xudt
title: xUDT
---

# xUDT (Extensible User-Defined Token)

xUDT (Extensible User-Defined Token) is a token standard for creating and managing fungible tokens on Nervos CKB. You can think of it as the equivalent of [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) on Ethereum — but with more flexibility.

xUDT builds upon the foundational [Simple User-Defined Token (sUDT)](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md), which uses a minimal, predefined validation model. In contrast, xUDT introduces **extensibility** by allowing developers to attach **custom validation logic** via external Scripts — enabling more advanced governance, minting rules, and token behaviors.

## Use Cases

xUDT is ideal for scenarios where tokens require on-chain programmable behavior or governance logic that sUDT cannot provide. Common use cases include:

- **Enforcing a Maximum Token Supply**: Use an extension Script to ensure that the total number of tokens in transaction outputs stays below a predefined cap.
- **Restricting Token Transfers by Time**: Implement a time-lock mechanism in the Script to allow transfers only after a specific time.
- **Efficient Exchange Account Representation**: Represent all user balances in a Sparse Merkle Tree stored within a single Cell. The Script validates each update to ensure correctness and integrity.
- **Programmatic Token Minting via Script Logic**: Enable token minting only if certain cryptographic conditions are met — for example, validating that a secp256k1 public key matches a predefined owner hash, effectively enabling Script-based "owner mode" without additional control Cells.

## Additional Resources

- [DApp Tutorial: Create a Fungible Token](/docs/dapp/create-token)
- [How xUDT Work](/docs/common-scripts/xudt#how-xudt-works)
- [xUDT RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0052-extensible-udt/0052-extensible-udt.md)
