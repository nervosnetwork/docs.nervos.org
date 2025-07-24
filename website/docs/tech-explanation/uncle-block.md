---
id: uncle-block
title: Uncle Block
---

import Tooltip from "@components/Tooltip";

Uncle blocks are created when 2 blocks are mined and submitted to the ledger at roughly the same time. Only 1 can enter the ledger as an included block, and the other does not.

<img src={"/img/tech_explanation/uncle-block-relationship.png"} width={688} height={271} alt="Uncle Block Condition" />

Block B1 is considered to be the uncle of block B2 if all the following conditions are met:

- B1 should not be on the main chain.
- Both are in the same <Tooltip>epoch</Tooltip> with identical difficulty.
- B2 has higher block number/height than B1.
- B1's parent is either B2's ancestor or an uncle embedded in B2, or any of B2's ancestors.
- B2 is the first block in its chain to reference B1.

## Example

```json
{
  "header": {
    "compact_target": "0x1a9c7b1a",
    "hash": "0x87764caf4a0e99302f1382421da1fe2f18382a49eac2d611220056b0854868e3",
    "number": "0x129d3",
    "parent_hash": "0x815ecf2140169b9d283332c7550ce8b6405a120d5c21a7aa99d8a75eb9e77ead",
    "nonce": "0x78b105de64fc38a200000004139b0200",
    "timestamp": "0x16e62df76ed",
    "transactions_root": "0x66ab0046436f97aefefe0549772bf36d96502d14ad736f7f4b1be8274420ca0f",
    "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "version": "0x0",
    "epoch": "0x7080291000049",
    "dao": "0x7088b3ee3e738900a9c257048aa129002cd43cd745100e000066ac8bd8850d00"
  },
  "proposals": ["0x7b7c9b1a", "0x91d23aef"]
}
```
