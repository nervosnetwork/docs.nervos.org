---
id: economics
title: Tokenomics
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## CKByte Tokenomics

CKByte is the native token of Nervos, covering three types of fees: Cycles (computation), Transaction Fees (security), and State Rent (storage).

- **Cycles** compensate miners based on the computational resources used to verify a transaction, measured by CKB-VM during the execution of smart contracts.
- **Transaction Fees** are paid to miners for providing the computing power to safeguard network security.
- **State Rent** compensates miners for providing storage space to persist transaction data.

Cycles and transaction fees are one-time payments required to process the transaction and add it on the blockchain. State Rent is continuously paid for data persistence.

Ownership of CKByte grants the holder to one byte of data storage on Nervos. To create a new Cell, users must possess CKBytes equivalent to the space the Cell occupies. These CKBytes remain locked for the Cell’s duration. When the Cell is consumed, the CKBytes are released and can be reused. State Rent is automatically paid during the lock period of CKBytes.

All assets on Nervos require data storage, making them subject to State Rent. This creates direct value alignment because CKBytes are indispensable for asset maintenance on Nervos.

## Value Alignment

The platform’s security must scale with its stored value to prevent vulnerability. CKBytes compensate miners for safeguarding the network. Increasing CKBytes value augments rewards for network protection, ensuring adequate security for stored value.

However, on multi-asset platforms, a “heavy asset problem” emerges when the native token fails to increase in tandem with the growth in asset value, due to their weak correlation. Nervos addresses this by tying CKByte to data storage and mandating State Rent. This creates long-term demand because assets necessitate CKBytes for storage and incur State Rent throughout the duration.

## State Rent

Miners ensure data validity and preservation on the network, while cycles and transaction fees ensure proper validation. However, once the fees are settled, miners lack further incentive for data preservation. As a solution, State Rent continuously compensate miners for data preservation.

When users store data on Nervos, they incur a small State Rent fee based on the space occupied. Recurring upfront fee is inconvenient for users, so Nervos uses targeted inflation on users occupying network space.

During data storage, a portion of CKBytes must be locked and cannot earn rewards. Although the locked CKBytes remain constant in number, their value slowly decreases due to inflation, affecting only users storing data on Nervos. This small depreciation constitutes State Rent.

The inflation funding State Rent comes from a process known as Secondary Issuance. Nervos users who do not occupy space on the network may gain rewards from Secondary Issuance by locking their CKBytes in Nervos DAO. The following sections will delve deeper into this mechanism.

## Base Issuance

At the network’s initial launch, CKBytes had lower value, indicating lower security. To boost Nervos’ appeal for asset storage, security is temporarily subsidized through Base Issuance, similar to Bitcoin's mining process. Miners receive fixed CKBytes rewards for processing transactions. Over time, the subsidies diminishes as stored assets gain value.

Base Issuance follows a transparent, predictable inflation schedule, [halving](https://ckbdapps.com/halving) about every four years until reaching the caps at 33.6 billion CKBytes.

## Secondary Issuance

After Base Issuance, relying solely on transaction fees may not suffice for miner incentives or data persistence. Secondary Issuance, with an small annual fixed inflation of 1.344 billion CKBytes, addresses these concerns.

Unlike Base Issuance, Secondary Issuance only targets at users occupying Nervos space or holding CKBytes outside Nervos DAO. Secondary Issuance are distributed to:

- Miners (as State Rent)
- Nervos DAO users
- The Nervos Treasury for continued development

## Nervos DAO

CKBytes holders can earn rewards by locking tokens in Nervos DAO. Rewards accrues proportionally to Secondary Issuance, offsetting the long-term inflationary effects of the latter, thus maintaining value. Users occupying space in Nervos have their CKBytes locked, making them ineligible to be placed in Nervos DAO. Once the space-occupying Cells are consumed and the CKBytes are released, they can be placed in Nervos DAO. This mechanism incentivizes the removal of unnecessary data, ensuring long-term manageability of the blockchain.

---

For more information, refer to the [RFC Crypto-Economics of the Nervos Common Knowledge Base](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md).
