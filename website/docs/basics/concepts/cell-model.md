---
id: cell-model
title: Cell Model
---

## What is a Cell?

Cell is the most basic structure for representing a single piece of data in Nervos. The data contained in a Cell can take many forms, including CKBytes, tokens, code in Javascript, or even serialized data like JSON strings. As there is no restriction on the type of data included, developers have full flexibility in their choices.

Each Cell contains a small program called a **Lock Script** that defines who has permission to use it. In general, the Lock Script defines one user as the owner of a Cell, it can also do more complex operations such as having multiple owners (multi-sig) or conditional uses of time-locking within particular time-frames.

A Cell can opt to include a second program, called a **Type Script**, to execute a set of rules on the usage of cell. As a result, developers are empowered to create complex smart across a wide range of use cases, from CryptoKitties to tokens, DeFi, and everything in between.

## What is the Cell Model?

The cell model defines how each cell in Nervos acts and interacts with each other, and the process must be followed for updating the data contained within the cells. People familiar with Bitcoin’s UTXO model may notice the similarities, because the cell model was inspired by it.

Cells are immutable. This means no changes can be mande once cells have been added to the blockchain. For any data update, the containing cell must undergo a process called **consumption**. When a Cell is **consumed**, data gets extracted and the cell gets destroyed. The data can be updated as needed while being extracted. A new cell with updated data will then be created and added to the blockchain.

Each Cell can be consumed only once. A non-consumed cell is known as a **live cell**. A consumed cell is known as a **dead cell**. Once dead, the cell can no longer be used.

Transactions serve to explain the changes in cell data. The transaction specifies a group of live cells to consume and a group of new cells to create by using the updated data. The network validates the transaction by executing all lock scripts and type scripts of each cell contained in the transaction. This ensures that all rules defined by the developers are being followed without any fraud.

## First-Class Assets

Nervos’ cell model treats all digital assets, such as CKBytes, tokens, and digital collectibles, as the exclusive property and responsibility of their owner. Assets must adhere to smart contract rules when being included in transactions, but the asset inherently belongs to the user instead of the smart contract. The difference is subtle but critical. 

When a user owns an asset, then only that user has permission to use the asset. Even the smart contract that defines the token has no permission to the asset. This means that even if an attacker found an exploit in the contract code, he or she would remain locked out of the asset because the asset is under user control. The impact of the attack is fully mitigated.

Having a defined ownership of the asset also clarifies who is responsible for its upkeep. As assets take up space on Nervos, there will be a small recurring upkeep fee, commonly known as **state rent**. User is the owner and is responsible as such, not the smart contract. More about state rent will be covered in the [Economics](economics) section.

## Transaction Fees Paid by Anyone

In most cases, people who send funds or execute smart contracts pay the transaction fees. However, to have a different party cover the associated fees can be beneficial in some cases.

A common scenario is the transfer of tokens from one party to another. The sender must own the tokens wanted to be transferred and sufficient CKBytes to cover the transaction cost. This creates an usability problem to users.

The flexibility of the cell model allows any party to pay the transaction fees. This can significantly improve the user experience since owning CKBytes is no longer an absolute requirement. The receiver or a third-party can pay the fee, easing the process for users.

## Scalability

The cell model separates the concepts of computation and validation for smart contract execution. Computation is the process of generating new data, which is done off-chain before the transaction gets sent to the network. Validation ensures that the data conforms to the rules set by the developers, which is done on-chain by full nodes after being received by the network. Offloading computation reduces the burden on full nodes and improves the total processing capacity of the network.

Smart contract execution is parallel in the cell model. Each transaction runs independently in its own virtual machine. And, multiple virtual machines run simultaneously rather than sequentially. This gives the cell model dramatic scaling improvements on modern computers - computers that increase the number of CPU cores with each generation.

Transactions are very flexible in the cell model. Multiple smart contract operations can often be batched into a single transaction, eliminating the need to construct multiple distinct transactions. This decreases the overhead involved in transactions and simplifies the process by reducing the required processing and transaction fees.

The unique structure of the cell model grants an inherent scalability. The conbination of these methods enables Nervos to achieve a greater level of smart contract scalability. A level that would not be possible in other ways.

## Further Reading

* For more information, please see Nervos Network’s blog post on the [Cell Model](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571). 
