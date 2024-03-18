---
id: cell-model
title: Cell Model
sidebar_position: 2
---

> Nervos CKB inherits Bitcoin’s architecture and creates the Cell model, a generalized UTXO model as state storage.
> This approach maintains Bitcoin's simplicity and consistency.
> In CKB, all states are stored in Cells, computation is done off-chain, and nodes handle all verification.


## What is a Cell?

A **Cell** represents the fundamental data storage unit in Nervos. It can encompass various data types, such as CKBytes, tokens, JavaScript code, or serialized data like JSON strings, offering extensive flexibility in data storage.


<img src="https://github.com/linnnsss/docs.nervos.org/blob/concepts-v2/website/static/img/Cell%20-%20data.png" alt="Cell Data" width="800" height="450">

Each cell contains a small program known as a Lock Script that determines the owner of the cell. While typically assigning ownership to a single user, Lock Script can also handle complex operations, such as having multiple owners (multi-sig) or conditional usage within specific timeframes.

A cell may include a **Type Script** to execute specific rules governing its usage. This empowers developers to customize smart contracts across diverse use-cases, such as issuing Non-Fungible Tokens, limiting the supply of fungible tokens, and implementing custom functionalities to suit unique requirements.

The collection of cells constitutes the **state** of CKB. A state verified and held by CKB is any data considered valuable and universally recognized.

<img src="https://github.com/linnnsss/docs.nervos.org/blob/concepts-v2/website/static/img/Cell%20-%20ckb-state.png" alt="CKB State" width="800" height="450">


## What is the Cell Model?

Inspired by Bitcoin's UTXO model, cell model defines the behavior of individual cells within Nervos, as well as the process for updating their contained data.

Cells are immutable. No changes can be made once the cells have been added on-chain. Updating data within a cell requires a process called **consumption**. This involves consuming the existing cell, extracting and updating the data, followed by creating a new cell with the updated data, which is then added on-chain. 

Each cell can be consumed only once. A non-consumed cell is a **live cell**. A consumed cell is a **dead cell**. Once a cell is dead, it can no longer be used.

Transactions reflect the state change of cells, where a group of live cells are consumed and new cells are created. The network validates transactions by executing all associated Lock Scripts and Type Scripts. This ensures adherence to developer-defined rules and prevents fraudulent activities.

<img src="https://github.com/linnnsss/docs.nervos.org/blob/concepts-v2/website/static/img/Cell%20-%20immutable.png" alt="Immutable Cell" width="800" height="450">

## First-Class Assets

In cell model, all digital assets (e.g., CKBytes, tokens, collectibles) are considered first-class, exclusively owned by their respective owners. While assets must comply with smart contracts rules during transactions, they are inherently owned by the user, not the smart contracts. This ownership structure ensures that only the owner has permission to use the assets, regardless of how the smart contract defines the token. If a contract exploit, attackers would be unable to access the asset, as it remains under the user's control, effectively mitigating the negative impact.

This ownership structure also defines the responsibility for asset upkeep. As assets occupy space on Nervos, the owner are subject to a small recurring upkeep fee, known as **state rent,** which is elaborated in the [Tokenomics](https://github.com/linnnsss/docs.nervos.org/blob/concepts-v2/website/docs/concepts/economics.md) section.

## Flexible Transaction Fee Coverage

When transferring tokens, typically, those who initiate the transaction or execute smart contracts must cover the transaction fees. This poses a usability challenge in adoption. 

Cell model provides the flexibility by allowing any party to cover the transaction fees, eliminating the need for the sender to possess CKBytes (transaction fee in Nervos). Instead, either the receiver or a third-party can cover the fee, significantly enhancing user experience.

## Scalability

Cell model’s unique structure inherently grants scalability, reflected in the three perspectives below.

<img src="https://github.com/linnnsss/docs.nervos.org/blob/concepts-v2/website/static/img/Cell%20-%20scalability.png" alt="Scalability Cell" width="800" height="450">

Cell model separates computation and validation for smart contract execution. Computation happens off-chain, where new data is generated. This data is subsequently sent to the network to undergo on-chain validation. Full nodes execute the validation to ensures compliance with developer-set rules.

In cell model, smart contract execution is parallel. Each transaction runs independently in its own virtual machine; multiple virtual machines run simultaneously. This gives the cell model dramatic scaling improvements on modern computers with increasing CPU cores.

Transactions are highly flexible and effective in cell model. Multiple smart contract operations can be batched into a single transaction, thereby minimizing transactions overhead and processing fees.

***

For more details and the rationale behind the cell model, refer to [this post](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571).
