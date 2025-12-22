---
id: spore-protocol
title: Spore Protocol
---

# Spore Protocol

Spore is an **on-chain Digital Object (DOB) protocol** built on Nervos CKB that enables secure, efficient, and flexible creation and transfer of digital objects. It supports features like intrinsic value redemption, privacy-preserving ownership, and zero-fee transactions — all natively on-chain.

## Use Cases

- Non-fungible Tokens (NFTs)
- Digital collectibles
- Gaming assets
- Redeemable digital vouchers or certificates

## Comparison Table

Spore is comparable to Ethereum’s [ERC-721](https://eips.ethereum.org/EIPS/eip-721) and Bitcoin [Ordinals](https://docs.ordinals.com/overview.html), both of which are token standards for representing unique digital assets.

| Features           | ERC-721 (Ethereum)          | Ordinals (Bitcoin) | Spore Protocol (Nervos CKB)                                |
| ------------------ | --------------------------- | ------------------ | ---------------------------------------------------------- |
| Content            | Mostly off-chain            | On-chain           | On-chain                                                   |
| Model              | Account-based               | UTXO               | UTXO-based [Cell Model](/docs/ckb-fundamentals/cell-model) |
| Privacy            | No                          | Maybe              | Yes                                                        |
| Immutability       | Variable                    | Yes, immutable     | Yes, immutable                                             |
| Redeemable         | No                          | No                 | Yes                                                        |
| Simplicity         | Complex                     | Simple             | Simple (1 Cell per DOB)                                    |
| Content Size Limit | -                           | 4MB / 400KB        | 500KB                                                      |
| Transaction Cost   | Gas in ETH                  | BTC fees           | Zero-fee (optional payment)                                |
| Basis of Value     | Market, manufactured rarity | Rarity of sats     | Intrinsic + market value                                   |

## What Makes Spore Protocol Unique?

### Intrinsic Value & Redemption

Spore is a unique class of digital assets linked to the native currency of the Nervos Network, CKBytes (CKB). This intrinsic connection ensures that every Spore has a foundational value that reflects the amount of CKBytes allocated to it during its creation.

- **Redemption of Intrinsic Value**: Spores can be melted back into the underlying CKBytes at any time. This is achieved through the `meltSpore` API provided by the [`spore-sdk`](https://github.com/sporeprotocol/spore-sdk), granting owners the flexibility to convert their digital assets into CKBytes currency whenever they choose.

- **Tokenomics and Intrinsic Value Growth**: As the utilization of on-chain space on the Nervos CKB grows, the value of the CKBytes locked within each Spore naturally appreciates. This growth is organic and driven by CKB’s economic model, which includes a structured issuance schedule and a state rent mechanism, as detailed in the [CKB Cryptoeconomics RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0019-economic-model/0019-economic-model.md).

### On-Chain Ownership & Privacy

Spore Protocol offers enhanced privacy and security features that are not inherent in account-based NFT protocols, particularly addressing the challenges faced by NFT holders.

- **Privacy through Cell Model**: Unlike account-based blockchains, where all transactions are tied to a single address, Nervos CKB uses a UTXO-based [Cell Model](/docs/ckb-fundamentals/cell-model), which leverages independent Cells. In this model, each transaction uses a new address — even though it is controlled by the same key — effectively splitting ownership across multiple addresses and making it difficult to link them to a single identity.

### Zero-Fee Transfers

Spore Protocol supports zero-fee transfers by reserving a small amount of CKBytes when creating a Spore or Cluster.

- **Capacity Margin**: When a Spore or Cluster is created, the `createSpore` or `createCluster` API allows specifying a `capacityMargin` — typically 1 CKB — which is reserved to cover future transaction fees. With a 1 CKB margin, a Spore can be transferred approximately **100,000 times** before requiring additional funding. This enables a seamless user experience where new holders can interact with Spores without needing to manage or acquire CKBytes.

- **Preserving Privacy**: By removing the need to fund transactions externally, Spore Protocol reduces the risk of linking wallet addresses through fee payments — a common vector for de-anonymization on public blockchains. This design improves privacy while maintaining full on-chain integrity.

### Support for Multiple Content Types

Spore Protocol is designed to support a wide range of digital content formats — far beyond static images like JPEGs. This flexibility enables developers and creators to store and manage diverse types of media and data directly on-chain.

---

## DOB/0 Protocol

The DOB/0 protocol is a standard configuration and interface specification for defining and decoding the attributes of a Digital Object (DOB). It includes the concepts of:

- **DNA** – the core data structure
- **Pattern** – a template or schema for interpretation
- **Decoder** – a logic layer to parse and render the DOB

DOB/0 standardizes how applications interact with and extract meaning from DOBs, significantly reducing integration complexity.

## DOB/1 Protocol

The DOB/1 protocol builds on DOB/0 by introducing standardized support for SVG image rendering. It allows DOBs to express visual content directly on-chain by:

- Defining how DOB attributes are translated into SVG
- Allowing automatic generation of visual representations
- Making digital objects both interpretable and displayable

This opens doors for NFT-style use cases with fully on-chain art.

## Additional Resources

- [DApp Tutorial: Create a DOB using Spore Protocol](/docs/dapp/create-dob)
- [How Spore Protocol Works](/docs/ecosystem-scripts/spore-protocol)
- [Spore Docs](https://docs.spore.pro)
