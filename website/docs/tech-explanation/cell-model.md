---
id: cell-model
title: Cell Model
---

> Nervos CKB inherits Bitcoin’s architecture and creates the Cell Model, a generalized UTXO model as state storage.
> This approach maintains Bitcoin's simplicity and consistency.
> In CKB, all states are stored in Cells, computation is done off-chain, and nodes handle all verification.

## Cell Model

Inspired by Bitcoin's UTXO model, Cell Model defines the behavior of individual Cells within Nervos, as well as the process for updating their contained data.

Cells are immutable. No changes can be made once the Cells have been added on-chain. Updating data within a Cell requires a process called **Consumption**. This involves consuming the existing Cell, extracting and updating the data, followed by creating a new Cell with the updated data, which is then added on-chain.

Each Cell can be consumed only once. A non-consumed Cell is a **Live Cell**. A consumed Cell is a **Dead Cell**. Once a Cell is dead, it can no longer be used.

Transactions reflect the state change of Cells, where a group of Live Cells are consumed and new Cells are created. The network validates transactions by executing all associated Lock Scripts and Type Scripts. This ensures adherence to developer-defined rules and prevents fraudulent activities.

<img src="/img/cell/cell-lifecycle.png" alt="Cell lifecycle" width="688" height="387" />

## First-Class Assets

In Cell Model, all digital assets (e.g., CKBytes, tokens, collectibles) are considered first-class, exclusively owned by their respective owners. While assets must comply with smart contracts rules during transactions, they are inherently owned by the user, not the smart contracts. This ownership structure ensures that only the owner has permission to use the assets, regardless of how the smart contract defines the token. If a contract exploit, attackers would be unable to access the asset, as it remains under the user's control, effectively mitigating the negative impact.

This ownership structure also defines the responsibility for asset upkeep. As assets occupy space on Nervos, the owner are subject to a small recurring upkeep fee, known as **state rent,** which is elaborated in the [Tokenomics](/docs/tech-explanation/economics) section.

## Flexible Transaction Fee Coverage

When transferring tokens, typically, those who initiate the transaction or execute smart contracts must cover the transaction fees. This poses a usability challenge in adoption.

Cell Model provides the flexibility by allowing any party to cover the transaction fees, eliminating the need for the sender to possess CKBytes (transaction fee in Nervos). Instead, either the receiver or a third-party can cover the fee, significantly enhancing user experience.

## Scalability

Cell Model’s unique structure inherently grants scalability, reflected in the three perspectives below.

<img src="/img/cell/cell-scalability.png" alt="Cell Model's scalability" width="688" height="387" />

Cell Model separates computation and validation for smart contract execution. Computation happens off-chain, where new data is generated. This data is subsequently sent to the network to undergo on-chain validation. Full nodes execute the validation to ensures compliance with developer-set rules.

In Cell Model, smart contract execution is parallel. Each transaction runs independently in its own virtual machine; multiple virtual machines run simultaneously. This gives the Cell Model dramatic scaling improvements on modern computers with increasing CPU cores.

Transactions are highly flexible and effective in Cell Model. Multiple smart contract operations can be batched into a single transaction, thereby minimizing transactions overhead and processing fees.

---

For more details and the rationale behind the Cell Model, refer to [this post](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571).
