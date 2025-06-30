---
id: assets-overview
title: Assets & Token Standards on Nervos
---

Nervos CKB uses [Cell Model](/docs/tech-explanation/cell-model), an evolution of Bitcoin’s UTXO model, where all digital assets (fungible, non-fungible tokens, collectibles) are represented as immutable Cells exclusively owned by users. Each Cell contains ownership rules enforced by [Scripts](/docs/tech-explanation/script), ensuring that assets comply with protocol rules during transactions while remaining under the sole control of their owners.

## What Counts as an On-Chain Asset?

Within this framework, any token or digital object represented with Cell—and capable of being owned, transferred, or redeemed by users—is considered a true on-chain digital asset. These assets include:

- Native tokens (CKBytes)
- User-defined tokens (sUDTs, xUDTs)
- On-chain digital objects (DOBs via Spore Protocol)
- Assets validated via RGB++ protocol linking Bitcoin and Nervos CKB

:::note
Assets that are only off-chain references or rely on external hosting (e.g., simple URLs) are not considered on-chain assets on Nervos.
:::

## Overview of Token Standards

| Asset                                            | Type                 | Equivalent        | Description                                                                                                         | Protocol       |
| ------------------------------------------------ | -------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- | -------------- |
| [CKByte (CKB)](/docs/tech-explanation/economics) | Native               | /                 | Native utility and governance token                                                                                 | Native         |
| [xUDT Tokens](/docs/tech-explanation/xudt)       | User-defined         | ERC-20            | Extensive user-defined fungible tokens                                                                              | xUDT           |
| [Spore](/docs/tech-explanation/spore-protocol)   | Digital Object (DOB) | ERC-721, Ordinals | Unique digital objects with redeemable intrinsic value, true on-chain ownership, privacy, and multi-content support | Spore Protocol |
| [RGB++](/docs/tech-explanation/rgbpp)            | Cross-chain          | /                 | Enables cross-chain asset issuance and interoperability between Nervos and Bitcoin using UTXO binding               | RGB++ Protocol |
