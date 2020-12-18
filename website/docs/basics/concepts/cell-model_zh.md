---
id: cell-model_zh
title: Cell 模型
---

## What is a Cell? 什么是 Cell ?

A Cell is the most basic structure needed to represent a single piece of data in Nervos. The data contained in a Cell can take many forms, including CKBytes or tokens, code like Javascript, or even serialized data like JSON strings. There are no restrictions on the type of data included, so developers have complete flexibility in what they choose to work with.

Cell 是表示 Nervos 中的单个数据所需的最基本结构。Cell 中的数据可以是多种形式的，包括 CKBytes、代币、代码段（如 JavaScript 代码）、甚至可以是序列化数据（如 JSON 字符串）。可包含的数据类型没有限制，因此开发者可以自行灵活选择。

Every Cell contains a tiny program called a Lock Script that defines who has permission to use it. Most commonly a Lock Script will define a single user as the owner of the Cell, but it can also do more complex operations such as having multiple owners (multi-sig) or time-locking for conditional usage within certain time-frames.

每个 Cell 都包含一个叫作 Lock Script 的小型程序，该程序定义谁有权限使用这个 Cell。通常 Lock Script 都是指定单个用户作为 Cell 的所有者，但它也可以执行更复杂的操作，例如指定多用户（多签）作为 Cell 所有者，或者在一定的时间范围内有条件的使用的时间锁。

A Cell can optionally include a second program called a Type Script that enforces a set of rules on how the Cell can be used. This gives developers the ability to create complex smart contracts that have a wide range of use cases from CryptoKitties to tokens, DeFi, and everything in between.

每个 Cell 都可以可选地包含另一个叫作 Type Script 的小型程序，该程序可以强制执行有关如何使用 Cell 的一组规则。这有利于开发者打造更复杂、用途更广的智能合约，从加密猫到代币、DeFi 等。

## What is the Cell Model? 什么是 Cell 模型？

The Cell Model defines how individual Cells behave and interact with each other within Nervos, and the process that must be followed to update the data contained within Cells. Those who are familiar with Bitcoin’s UTXO model will notice similarity since the Cell Model is directly inspired by it.

Cell 模型定义了在 Nervos 中各个 Cells 的行为，彼此之间的交互，以及更新 Cell 中数据所必须遵循的流程。熟悉比特币 UTXO 模型的用户应该已经察觉到相似之处了。对的，Cell 模型的设计灵感来自于 UTXO 模型。

Cells are immutable, meaning they cannot change once added to the blockchain. To update any data, the containing Cell must undergo a process called “consumption”. When a Cell is “consumed” the data is extracted and the Cell is destroyed. While extracted, the data can be updated as necessary. A new Cell is then created with the updated data and added to the blockchain.

Cells 是不可变的，这意味着它们一旦添加到区块链中就无法更改。若要更新数据，包含对应数据的 Cells 必须经历一个叫作“消耗(consumption)”的过程。当 Cell 被“消耗”后，数据会被提取出来，而这个 Cell 将被销毁。数据提取出来后并如期更新后，会使用更新的数据生成一个新的 Cell 并添加到区块链中。

A Cell can only be consumed one time. A Cell that has not been consumed is known as a Live Cell. A Cell that has been consumed is known as a Dead Cell. Once a Cell is dead, it can never be used again.

一个 Cell 只能被消耗一次，未被消耗的 Cell 我们称为活跃 Cell（LIve Cell），已被消耗的 Cell 我们称为已销毁 Cell（Dead Cell）。只要 Cell 已被销毁，将无法再被使用。

Transactions are used to explain changes in Cell data. Specified within the transaction is a group of Live Cells to consume, and a group of new Cells to create with updated data. The transaction is validated by the network by executing all the Lock Scripts and Type Scripts in every Cell within the transaction. This ensures that all the rules defined by the developers are being followed and that no one has cheated.

交易会改变 Cell 中的数据。从交易信息中，我们可以看到有一组活跃 Cells 将用于消耗，并且会有附带更新后的数据的一组新的 Cells 生成。交易通过区块链网络进行验证，具体是通过执行交易中的每个 Cell 中的所有 Lock Scripts 和 Type Scripts。这将确保开发者定义的所有规则都被遵循，没有人会被欺骗。

## First-Class Assets 头等资产

Nervos’ Cell Model treats all digital assets, such as CKBytes, tokens, and digital collectibles, as the exclusive property and responsibility of their owner. Assets must adhere to smart contract rules when they are included in transactions, but the asset itself belongs to the user, not the smart contract. The difference is subtle, but it is important.

Nervos 的 Cell 模型将所有数字资产（如 CKBytes，其他代币和数字收藏品）视为其所有者的专有财产和责任。交易中的资产必须遵守智能合约的规则，但资产本身属于用户，而非智能合约。这个差异虽然很小，却至关重要。

When a user owns the asset, only they have permission to use it. Not even the smart contract that defines the token has permission to the asset. This means that even if an exploit was found in the contract code, the attacker would still be locked out of the assets because they are under user control. This completely mitigates the effects of the attack.

用户拥有的资产只有用户自己有权限使用，即使是该资产对应的智能合约也没有权限使用。这意味着即使合约代码有漏洞，黑客也无法触及资产，因为资产只受控于用户本身。这完全减轻了攻击的影响。

Clearly defining ownership of an asset also makes it clear who should be responsible for its upkeep. Assets take up space on Nervos, and therefore require a small recurring upkeep fee commonly known as State Rent. The user is the owner and is therefore responsible for this, not the smart contract. We will cover more about State Rent in the[Economics](https://docs.nervos.org/docs/basics/concepts/economics)section.

明确定义资产所有权还可以清楚地确定谁应对资产负责。资产占用了 Nervos 的空间，因此需要支付少量的维护费用，业内称之为状态租金。用户是所有者，因此应对此负责，而不是智能合约。我们将在“[经济模型”](https://docs.nervos.org/docs/basics/concepts/economics)部分中介绍有关状态租金的更多信息。

## Transaction Fees Paid by Anyone 交易费用可由任何人代付

Transaction fees are most often paid by the person sending funds or executing a smart contract. However, there are cases where it is beneficial to have a different party cover the associated fees.

交易费用通常是由交易发起者支付。然而，在某些场景下，可由其他人承担相关费用具备一定的好处。

A common scenario is the transfer of tokens from one party to another. The sender must own the token then want to transfer and enough CKBytes to cover the cost of the transaction. This creates a usability problem for the user.

常见的情况是向他人转账某代币。发送者必须拥有需要准备转账的代币以及足够的 CKBytes 来支付交易费用。这给用户带来了可用性问题。

The flexibility of the Cell Model allows transaction fees to be paid by any party. This can significantly improve the experience for a user since owning CKBytes is no longer an absolute requirement. The receiver or a third-party can pay the fee, greatly simplifying the process for the user.

Cell 模型的灵活性可以让交易费用由任何人代付。这将显著提高用户体验，因为用户可以不用一定得持有 CKBytes。接受者或者任何第三方都可以支付交易费用，大大简化了用户的支付流程。

## Scalability 可扩展性

The Cell Model separates the concepts of computation and validation for smart contract execution. Computation is the process of generating new data and it is done off-chain before a transaction is sent to the network. Validation ensures that the data conforms with the rules set by the developer and is done on-chain by full nodes after being received by the network. Offloading computation reduces the burden on full nodes, raising the total processing capacity of the network.

在智能合约执行流程中，Cell 模型将计算与验证的概念区分开来。计算是生成新数据的过程，它可以在交易上链之前在链下完成。验证则确保数据符合开发者的代码规则，会在交易上链后由全节点在链上完成。将计算分流到链下完成减轻了全节点的负担，提高了网络的总处理性能。

Smart contract execution is parallelized in the Cell Model. Every transaction runs independently in its own virtual machine, and multiple virtual machines run simultaneously instead of having to run one after the other. This allows the Cell Model dramatic scaling improvements on modern computers that increase the number of CPU cores they offer with every new generation.

智能合约操作在 Cell 模型中并行执行。每个交易都在其自己的虚拟机中独立运行，并且多个虚拟机可以同时运行，而不需要等这个执行完另一个才能执行。这可以让 Cell 模型在现代电脑上实现显著的可扩展性优化。

Transactions are very flexible in the Cell Model. Multiple smart contract operations can often be batched into a single transaction instead of having to construct multiple distinct transactions. This cuts down on the overhead involved with a transaction, streamlining the process by reducing the amount of processing and transaction fees required.

Cell 模型中的交易十分灵活。通常可以将多个智能合约操作批处理为一个交易，而不必构造多个不同的交易。这减少了交易涉及的开销，通过减少所需的处理量和交易费用来简化流程。

The unique structure of the Cell Model makes it inherently scalable. By combining these methods together, Nervos is able to achieve much higher levels of smart contract scalability that would not be possible otherwise.

Cell 模型的独特结构使其天然具备可扩展性。综合这些方法，Nervos 可以实现更高水平的智能合约可扩展性。

## Further Reading 扩展阅读

* For more information, please see Nervos Network’s blog post on the[Cell Model](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571).
* 有关更多信息，请参见 Nervos 官方博客文章[Cell 模型](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571)。
