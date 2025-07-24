---
id: uncles
title: uncles
---

# uncles

`uncles` is a list of [uncle blocks](/docs/tech-explanation/uncle-block) referenced by this block. Each item in `uncles` is of type `UncleBlock`, which contains the uncle’s header and proposals, but no transactions.

<img src={"/img/tech_explanation/uncleblock-structure.png"} width={688} height={304} alt="Structure of UncleBlock" />

## Structure of UncleBlock

| Name        | Type   | Description                                                                                                                 |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| `header`    | Header | The block header of the uncle block. See [header](/docs/tech-explanation/header) for more.                                  |
| `proposals` | [H80]  | A list of short transaction IDs proposed by this uncle block. See [`proposals`](/docs/tech-explanation/proposals) for more. |
