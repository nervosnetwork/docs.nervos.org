---
id: economics
title: Economics
---

## The Economics of the CKByte

The CKByte is the native token of Nervos, and it is used to pay for the three types of fees that exist: Cycles (computation), Transaction Fees (security), and State Rent (storage).

* Cycles are fees paid to miners based on the amount of computer resources that are used to verify a transaction. These are measured by CKB-VM during the execution of any smart contracts in a transaction.
* Transaction Fees are paid to miners for providing the computing power that provides security to the network. 
* State Rent is paid to miners for providing storage space to persist the data in a transaction. 

Cycles and Transaction Fees are paid one time to process and insert the transaction into the blockchain. State Rent is paid continuously to persist the data until it is removed.

Owning one CKByte entitles the holder to one byte of data storage on Nervos. When a new Cell is created, the user must own an amount of CKBytes equal to the space the Cell will occupy. These CKBytes will remain locked the entire time the Cell exists. When the Cell is consumed, the lock is released, and the CKBytes can be used again. State Rent is automatically paid while the CKBytes are locked.

All assets on Nervos require data storage, which means they are subject to State Rent. This creates direct value alignment because CKBytes are required to maintain an asset on Nervos. More about Value Alignment and State Rent are covered in the following sections.

## Value Alignment

As the value on a platform grows, it is important that the security of the platform also grows. If it does not, you can end up in a scenario where there is too little security for the value being stored. It would be like adding more and more gold into a bank vault, but never adding any additional guards. This makes it a potential target for attack. 

When miners are paid for their contributions, they are paid using the native token, the CKByte. As the value of the CKByte increases, so do the rewards for protecting the network. This ensures that a scenario is not created where the value of the CKBytes being stored on the network is very high, but the reward for securing the network is too low.

However, a problem can develop on multi-asset platforms if the total value of the assets gain value but the native token providing security does not. This is known as the “heavy asset problem”, and it is common among multi-asset platforms.

The heavy asset problem exists when there isn’t a strong enough value correlation between the assets and the native token used to secure the underlying platform. Usage of CKBytes for the payment of Cycle and Transaction fees creates some demand similar to Bitcoin and Ethereum. However, history has demonstrated that this model does not rectify the problem.

Nervos addresses this by aligning the CKByte with data storage and mandating State Rent. This creates long-term demand directly, because assets require data storage. Every asset requires CKBytes and is subject to State Rent for the entire duration of its existence.

## State Rent

Miners are responsible for ensuring that the data on the network is valid and preserved. The Cycle and Transaction fees are paid to ensure proper validation, but once the fee is paid there is no continued incentive for a miner to ensure the data is preserved. State Rent addresses this by continuously providing fees to miners for their participation in preserving the data on the network.

When a user puts data on Nervos they must pay a small amount of State Rent for the space their data occupies. Paying an upfront recurring fee presents a user experience problem since this requires continuous time and attention. Nervos solves this by using targeted inflation on users who are occupying space on Nervos.

When data is stored on Nervos, an amount of CKBytes is required to be locked. The locked CKBytes are ineligible for interest payments. Even though the number of CKBytes does not change while locked, the value is slowly decreasing because of inflation that only affects users who are storing data on Nervos. This small decrease in value is how State Rent is paid.

The inflation that pays the State Rent is created through a process called Secondary Issuance. Users who are not occupying space on Nervos have the option of gaining interest from Secondary Issuance by locking their CKBytes in the Nervos DAO. We will cover more on these topics in the following sections.

## Base Issuance

During the initial launch of the network the value of the CKByte will be low, which means the security on the network is low. In order to make Nervos a safe and attractive place to store assets, the security must be temporarily subsidized through a process known as Base Issuance.

Base Issuance is very similar to the mining process found in Bitcoin. Miners are paid a fixed amount of CKBytes for providing the computer resources to process transactions and secure the network. Over time the assets stored on the network will gain value, and fewer subsidies are necessary.

Base Issuance is paid for through using a fixed inflationary schedule. Approximately every four years the subsidy amount is halved until eventually stopping when the cap of 33.6 billion CKBytes have been issued. This provides a monetary policy that is transparent and predictable.

## Secondary Issuance

After the Base Issuance has ended, some have theorized that the incentive to miners will not provide enough security if it is only paid with fees from Cycles and Transactions. At the same time, miners require long term incentives that are directly aligned to ensure the data in Nervos is persisted. Both of these concerns are addressed through a process called Secondary Issuance.

Secondary Issuance follows a fixed inflation schedule of 1.344 billion CKBytes per year. This amount does not change. Unlike Base Issuance, Secondary Issuance does not affect everyone on the network. It is a small and targeted inflation from users that occupy space on Nervos or hold their CKBytes outside of the Nervos DAO.

The CKBytes from Secondary Issuance are distributed to:

* Miners maintaining the network (State Rent).
* Users of the Nervos DAO.
* The Nervos Treasury for continued development.

## Nervos DAO

Holders of CKBytes have the option of locking them in the Nervos DAO to gain interest in a process similar to staking on other platforms. When this is done, the holder will accrue CKByte interest at a rate directly proportional to that of Secondary Issuance. This offsets the long-term inflationary effects of Secondary Issuance exactly, resulting in no loss of value over time.

Users who are occupying space on Nervos have their CKBytes locked, which are then ineligible to be placed in the Nervos DAO. Once the Cells occupying space are consumed, the CKBytes are released, and can then be placed in the Nervos DAO. This provides an incentive to remove unnecessary data from Nervos, therefore keeping the blockchain more manageable in the long term.

## Further Reading

* For more information on the economics of Nervos, please see the [Crypto-Economics RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md).
