---
id: header
title: header
---

# header

`header` is a sub-structure of `Block` and `UncleBlock`, including `raw` and `nonce`.

<img src={"/img/tech_explanation/header-structure.png"} width={688} height={391} alt="Structure of header" />

## Fields & Description

| Name    | Type      | Description                                                                                   |
| ------- | --------- | --------------------------------------------------------------------------------------------- |
| `raw`   | RawHeader | The payload of the block header. For more, see [RawHeader](/docs/tech-explanation/rawheader). |
| `nonce` | uint128   | The solution of the PoW puzzle. Similar to [Bitcoin nonce](https://en.bitcoin.it/wiki/Nonce). |

## Verification Process for Header

This following snippet describes the process to validate the PoW for a block header in the Nervos CKB blockchain:

1. Serializing and hashing the block's raw data.
2. Concatenating the hash with the nonce.
3. Running the concatenated result through the Eaglesong algorithm.
4. (Optional) Re-hashing for the Testnet.
5. Converting the final output to an integer and ensuring it meets the required difficulty target.

```
pow_hash := ckbhash(molecule_serialize(raw))
pow_message := pow_hash || to_le(nounce)
pow_output := eaglesong(pow_message)
// for Testnet, there is another round of hash
// pow_output = ckbhash(pow_output)

from_be(pow_output) <= compact_to_target(raw.compact_target)
```

Functions used in the pseudocode

- `:=`: assignment
- `||`: binary concatenation
- `ckbhash`: [Blake2b hash](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0027-block-structure/0027-block-structure.md#ckbhash) with CKB specific configuration
- `to_le`: converts unsigned integer to bytes in little-endian. The bytes count is the same with the integer width.
- `from_be`: converts bytes encoded in big-endian to an unsigned integer
- `molecule_serialize`: serializes a structure into binary using its schema
- `eaglesong`: CKB’s Proof-of-Work consensus algorithm. See [RFC0010: Eaglesong](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)
- `compact_to_target`: restores the target from its compact form, which is the difficulty target encoded by `raw.compact_target`

## Header Hash Derivation & Usage

The `header` is hashed to produce a unique `header_hash`. This `header_hash` is then used to reference the block.

```
header_hash := ckb_hash(molecule_serialize(header))
```
