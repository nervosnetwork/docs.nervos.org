---
id: cell-model
title: Cell Model
---

## What is a Cell?

A Cell is the most basic structure needed to represent a single piece of data in Nervos. The data contained in a Cell can take many forms, including CKBytes or tokens, code like Javascript, or even serialized data like JSON strings. There are no restrictions on the type of data included, so developers have complete flexibility in what they choose to work with.

Every Cell contains a tiny program called a Lock Script that defines who has permission to use it. Most commonly a Lock Script will define a single user as the owner of the Cell, but it can also do more complex operations such as having multiple owners (multi-sig) or time-locking for conditional usage within certain time-frames.

A Cell can optionally include a second program called a Type Script that enforces a set of rules on how the Cell can be used. This gives developers the ability to create complex smart contracts that have a wide range of use cases from CryptoKitties to tokens, DeFi, and everything in between.

## What is the Cell Model?

The Cell Model defines how individual Cells behave and interact with each other within Nervos, and the process that must be followed to update the data contained within Cells. Those who are familiar with Bitcoin’s UTXO model will notice similarity since the Cell Model is directly inspired by it.

Cells are immutable, meaning they cannot change once added to the blockchain. To update any data, the containing Cell must undergo a process called “consumption”. When a Cell is “consumed” the data is extracted and the Cell is destroyed. While extracted, the data can be updated as necessary. A new Cell is then created with the updated data and added to the blockchain.

A Cell can only be consumed one time. A Cell that has not been consumed is known as a Live Cell. A Cell that has been consumed is known as a Dead Cell. Once a Cell is dead, it can never be used again.

Transactions are used to explain changes in Cell data. Specified within the transaction is a group of Live Cells to consume, and a group of new Cells to create with updated data. The transaction is validated by the network by executing all the Lock Scripts and Type Scripts in every Cell within the transaction. This ensures that all the rules defined by the developers are being followed and that no one has cheated.

## First-Class Assets

Nervos’ Cell Model treats all digital assets, such as CKBytes, tokens, and digital collectibles, as the exclusive property and responsibility of their owner. Assets must adhere to smart contract rules when they are included in transactions, but the asset itself belongs to the user, not the smart contract. The difference is subtle, but it is important. 

When a user owns the asset, only they have permission to use it. Not even the smart contract that defines the token has permission to the asset. This means that even if an exploit was found in the contract code, the attacker would still be locked out of the assets because they are under user control. This completely mitigates the effects of the attack.

Clearly defining ownership of an asset also makes it clear who should be responsible for its upkeep. Assets take up space on Nervos, and therefore require a small recurring upkeep fee commonly known as State Rent. The user is the owner and is therefore responsible for this, not the smart contract. We will cover more about State Rent in the [Economics](economics) section.

## Transaction Fees Paid by Anyone

Transaction fees are most often paid by the person sending funds or executing a smart contract. However, there are cases where it is beneficial to have a different party cover the associated fees.

A common scenario is the transfer of tokens from one party to another. The sender must own the token then want to transfer and enough CKBytes to cover the cost of the transaction. This creates a usability problem for the user.

The flexibility of the Cell Model allows transaction fees to be paid by any party. This can significantly improve the experience for a user since owning CKBytes is no longer an absolute requirement. The receiver or a third-party can pay the fee, greatly simplifying the process for the user.

## Scalability

The Cell Model separates the concepts of computation and validation for smart contract execution. Computation is the process of generating new data and it is done off-chain before a transaction is sent to the network. Validation ensures that the data conforms with the rules set by the developer and is done on-chain by full nodes after being received by the network. Offloading computation reduces the burden on full nodes, raising the total processing capacity of the network.

Smart contract execution is parallelized in the Cell Model. Every transaction runs independently in its own virtual machine, and multiple virtual machines run simultaneously instead of having to run one after the other. This allows the Cell Model dramatic scaling improvements on modern computers that increase the number of CPU cores they offer with every new generation.

Transactions are very flexible in the Cell Model. Multiple smart contract operations can often be batched into a single transaction instead of having to construct multiple distinct transactions. This cuts down on the overhead involved with a transaction, streamlining the process by reducing the amount of processing and transaction fees required.

The unique structure of the Cell Model makes it inherently scalable. By combining these methods together, Nervos is able to achieve much higher levels of smart contract scalability that would not be possible otherwise.

## Further Reading

* For more information, please see Nervos Network’s blog post on the [Cell Model](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571). 
