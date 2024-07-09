---
id: uncles
title: uncles
---

import Tooltip from "@components/Tooltip";

# uncles

`UncleBlock` is a sub-structure of `Block`. It is the ordered list of uncle blocks.

<img src={"/img/tech_explanation/uncleblock-structure.png"} width={688} height={304} alt="Structure of UncleBlock" />

## Fields & Description

| Name        | Type   | Description                                                                                                                                       |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `header`    | Header | Block header of the uncle block. The structure is the same as the [header](/docs/tech-explanation/header).                                        |
| `proposals` | [H80]  | An array of short transaction IDs of the proposed transactions in this uncle block. For more, see [`proposals`](/docs/tech-explanation/proposals) |

## Uncle Block

Uncle blocks are created when 2 blocks are mined and submitted to the ledger at roughly the same time. Only 1 can enter the ledger as an included block, and the other does not.

<img src={"/img/tech_explanation/uncle-block-relationship.png"} width={688} height={271} alt="Uncle Block Condition" />

Block B1 is considered to be the uncle of block B2 if all the following conditions are met:

- B1 should not be on the main chain.
- Both are in the same <Tooltip>epoch</Tooltip> with identical difficulty.
- B2 has higher block number/height than B1.
- B1's parent is either B2's ancestor or an uncle embedded in B2, or any of B2's ancestors.
- B2 is the first block in its chain to reference B1.
