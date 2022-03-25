---
id: economics
title: Economics
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## The Economics of the CKByte

The CKByte is the native token of Nervos, and it is used to pay for the three types of fees that exist: Cycles (computation), Transaction Fees (security), and State Rent (storage).

* Cycles are fees paid to miners based on the amount of computer resources that are used to verify a transaction. These are measured by CKB-VM during the execution of any smart contracts in a transaction.
* Transaction Fees are paid to miners for providing the computing power that provides security to the network. 
* State Rent compensates miners for providing storage space to persist the data in a transaction. 

Cycles and Transaction Fees are paid once to process and insert the transaction into the blockchain. State Rent is paid continuously to persist the data until it is removed.

Owning one CKByte entitles the holder to one byte of data storage on Nervos. To create a new <Link to={useBaseUrl('/docs/basics/concepts/cell-model#what-is-a-cell')}>cell</Link>, the user must own an amount of CKBytes equal to the space the cell will occupy. These CKBytes will remain locked the entire time the cell exists. When the cell is consumed, the lock is released, and the CKBytes can be used again. State Rent is automatically paid while the CKBytes are locked.

All assets on Nervos require data storage, which means they are subject to State Rent. This creates direct value alignment because CKBytes are required to maintain an asset on Nervos. The following sections provide more information about Value Alignment and State Rent.

## Value Alignment

The security of a platform must grow along with the value that the platform stores. Otherwise, the value stored will have too little security. It would be like adding more and more gold to a bank vault without adding any additional guards. This makes it vulnerable to attack. 

The native tokens, CKBytes, are used to pay miners for their contributions. As the value of the CKBytes increases, so do the rewards for protecting the network. This prevents a scenario where the value of the CKBytes being stored on the network is very high, but the reward for securing the network is very low.

However, a problem can develop on multi-asset platforms if the total value of the assets gains value but the native token providing security does not. This is known as the “heavy asset problem”, and it is common among multi-asset platforms.

The heavy asset problem exists when there isn’t a strong enough value correlation between the assets and the native token used to secure the underlying platform. Usage of CKBytes for the payment of Cycle and Transaction fees creates some demand similar to Bitcoin and Ethereum. However, history has demonstrated that this model does not rectify the problem.

Nervos addresses this by aligning the CKByte with data storage and mandating State Rent. This directly creates long-term demand because assets require data storage. Every asset requires CKBytes and is subject to State Rent for the entire duration of its existence.

## State Rent

Miners are responsible for ensuring that the data on the network is valid and preserved. Cycles and transaction fees are paid to ensure proper validation. However, once the fees have been paid, there is no further incentive for the miner to preserve the data. As a solution, State Rent continuously pays miners to participate in preserving the data on the network.

When a user puts data on Nervos they must pay a small amount of State Rent for the space their data occupies. An upfront recurring fee is inconvenient for users since it requires constant attention and time. Nervos solves this issue by using targeted inflation on users who are occupying space on the Nervos network.

A certain amount of CKBytes must be locked when data is stored on Nervos. These CKBytes are ineligible for interest payments. Even though the number of CKBytes does not change while locked, the value is slowly decreasing because of inflation that only affects users who are storing data on Nervos. This small decrease in value is how State Rent is paid.

The inflation that pays the State Rent is created through a process called Secondary Issuance. Nervos users who do not occupy space on the network may gain interest from Secondary Issuance by locking their CKBytes in Nervos DAO. The following sections will cover these topics in more detail.

## Base Issuance

During the initial launch of the network, CKBytes had a low value, which indicates the network had a low level of security. To make Nervos a safe and attractive place to store assets, the security must be temporarily subsidized through a process called Base Issuance.

Base Issuance is very similar to Bitcoin's mining process. Miners are paid a fixed amount of CKBytes for providing the computer resources to process transactions and secure the network. The assets stored on the network will gain value over time, and fewer subsidies will be required.

Base Issuance is paid for with a fixed inflationary schedule. Approximately every four years, the subsidy amount is halved, and it eventually stops, when the cap of 33.6 billion CKBytes is issued. This provides a monetary policy that is transparent and predictable.

## Secondary Issuance

It has been suggested that after the Base Issuance ends, the incentive to miners will not provide sufficient security if it is only paid with fees from cycles and transactions. Additionally, miners require long-term incentives to ensure that Nervos data persists. Both of these concerns are addressed through a process called Secondary Issuance.

Secondary Issuance follows a fixed inflation schedule of 1.344 billion CKBytes per year. This amount does not change. Unlike Base Issuance, Secondary Issuance does not affect everyone on the network. The inflation is small and targeted at users who occupy space on Nervos or hold their CKBytes outside of Nervos DAO.

The CKBytes from Secondary Issuance are distributed to:

* Miners who maintain the network (State Rent).
* Nervos DAO users.
* The Nervos Treasury for continued development.

## Nervos DAO

CKBytes holders can lock their tokens in Nervos DAO to gain interest in a similar manner to staking on other platforms. When this is done, the holder will accrue CKByte interest at a rate directly proportional to that of Secondary Issuance. This offsets the long-term inflationary effects of Secondary Issuance exactly, resulting in no loss of value over time.

Users who occupy space on Nervos have their CKBytes locked, which makes them ineligible to be placed in Nervos DAO. Once the cells occupying the space are consumed, the CKBytes are released, and they can then be placed in Nervos DAO. This provides an incentive to remove unnecessary data from Nervos, in order to keep the blockchain manageable in the long term.

## Further Reading

* For more information about Nervos economics, see the [Crypto-Economics RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md).

