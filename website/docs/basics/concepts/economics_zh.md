# Economics 经济模型

## The Economics of the CKByte CKByte 的经济模型

The CKByte is the native token of Nervos, and it is used to pay for the three types of fees that exist: Cycles (computation), Transaction Fees (security), and State Rent (storage).

* Cycles are fees paid to miners based on the amount of computer resources that are used to verify a transaction. These are measured by CKB-VM during the execution of any smart contracts in a transaction.
* Transaction Fees are paid to miners for providing the computing power that provides security to the network.
* State Rent is paid to miners for providing storage space to persist the data in a transaction.

CKByte 是 Nervos 的原生代币，可用于支付现有的三种费用：Cycles（计算），交易费用（安全），状态租金（存储）。

* 计算费用（Cycles）是根据用于验证交易的计算资源量支付给矿工的费用，由 CKB-VM 进行测量。
* 交易费用支付给矿工，作为矿工提供算力保障网络安全的补偿。
* 状态租金支付给矿工，作为提供存储空间保存交易数据的补偿。

Cycles and Transaction Fees are paid one time to process and insert the transaction into the blockchain. State Rent is paid continuously to persist the data until it is removed.

计算费用和交易费用在发起交易时一次性付清，状态租金则需要持续支付以保存数据直到删除数据为止。

Owning one CKByte entitles the holder to one byte of data storage on Nervos. When a new Cell is created, the user must own an amount of CKBytes equal to the space the Cell will occupy. These CKBytes will remain locked the entire time the Cell exists. When the Cell is consumed, the lock is released, and the CKBytes can be used again. State Rent is automatically paid while the CKBytes are locked.

拥有 1 个 CKByte 意味着持有者拥有 Nervos 上的 1 字节数据存储空间。当一个新 Cell 生成时，用户必须拥有该 Cell 占用的字节空间等额的 CKBytes。只要这个 Cell 尚存在，这些 CKBytes 就会处于锁定状态。当这个 Cell 被消耗了，锁也自然释放了，对应的 CKBytes 也可以自由使用了。当 CKBytes 被锁定时，状态租金会自动从中扣除。

All assets on Nervos require data storage, which means they are subject to State Rent. This creates direct value alignment because CKBytes are required to maintain an asset on Nervos. More about Value Alignment and State Rent are covered in the following sections.

Nervos 上的所有资产都需要数据存储，这意味着它们都需要缴纳状态租金。因为需要 CKBytes 来维护 Nervos 上的资产，这将产生直接的价值匹配。以下章节将介绍有关价值匹配和状态租金的更多信息。

## Value Alignment 价值匹配

As the value on a platform grows, it is important that the security of the platform also grows. If it does not, you can end up in a scenario where there is too little security for the value being stored. It would be like adding more and more gold into a bank vault, but never adding any additional guards. This makes it a potential target for attack.

随着平台价值的增长，平台安全性也必须增长。否则，平台将陷入存储的价值缺乏足够的安全保护的困境。这就像你不断向银行保险库中新添黄金，却从不增派安全守卫同个道理，早晚会成为攻击目标。

When miners are paid for their contributions, they are paid using the native token, the CKByte. As the value of the CKByte increases, so do the rewards for protecting the network. This ensures that a scenario is not created where the value of the CKBytes being stored on the network is very high, but the reward for securing the network is too low.

在 Nervos 中矿工获得的回报是 CKByte，随着 CKByte 的价值提高，矿工保障网络安全的回报也会同等提高。

However, a problem can develop on multi-asset platforms if the total value of the assets gain value but the native token providing security does not. This is known as the “heavy asset problem”, and it is common among multi-asset platforms.

但是，如果多资产平台上的其他总资产的价值提高了，但原生代币价值却没有，便会衍生出一个问题，即“重资产问题（heavy asset problem）”，这在多资产平台中十分常见。

The heavy asset problem exists when there isn’t a strong enough value correlation between the assets and the native token used to secure the underlying platform. Usage of CKBytes for the payment of Cycle and Transaction fees creates some demand similar to Bitcoin and Ethereum. However, history has demonstrated that this model does not rectify the problem.

重资产问题存在的原因是由于用于保障平台安全的原生代币与平台资产之间的价值不具备强相关性。CKBytes 用于支付计算和交易费用的用途会产生一些类似于比特币和以太坊的持有需求，但是历史证明，该模型无法解决问题。

Nervos addresses this by aligning the CKByte with data storage and mandating State Rent. This creates long-term demand directly, because assets require data storage. Every asset requires CKBytes and is subject to State Rent for the entire duration of its existence.

Nervos 通过将 CKByte 与数据存储和状态租金征收进行绑定的方式解决此问题。由于资产需要数据存储，因此这将直接产生了长期需求。每种资产都需要 CKByte，并且在整个存续期间都需要缴纳状态租金。

## State Rent 状态租金

Miners are responsible for ensuring that the data on the network is valid and preserved. The Cycle and Transaction fees are paid to ensure proper validation, but once the fee is paid there is no continued incentive for a miner to ensure the data is preserved. State Rent addresses this by continuously providing fees to miners for their participation in preserving the data on the network.

矿工负责确保网络中的数据有效并完好存储。支付计算和交易费用是确保正确验证，但此次支付后，或许就没有持续的激励矿工去确保数据得到完好存储。状态租金通过持续给矿工提供费用以激励他们参与存储网络中的数据的方式解决了该问题。

When a user puts data on Nervos they must pay a small amount of State Rent for the space their data occupies. Paying an upfront recurring fee presents a user experience problem since this requires continuous time and attention. Nervos solves this by using targeted inflation on users who are occupying space on Nervos.

当用户在 Nervos 存储数据时，他们必须为数据占用的空间支付一小笔状态租金。若需要不断重复的预付费用势必带来用户体验问题，因为这意味着需要用户后续不断花时间精力为状态租金续费。

When data is stored on Nervos, an amount of CKBytes is required to be locked. The locked CKBytes are ineligible for interest payments. Even though the number of CKBytes does not change while locked, the value is slowly decreasing because of inflation that only affects users who are storing data on Nervos. This small decrease in value is how State Rent is paid.

当数据存储在 Nervos 中，需要锁定一定量的 CKBytes。锁定的 CKBytes 没资格享受利息支付。即使在锁定的时候，CKBytes 的数量没有变，其价值也会因为通胀而缓慢下降，这就是收取状态租金的方式。

The inflation that pays the State Rent is created through a process called Secondary Issuance. Users who are not occupying space on Nervos have the option of gaining interest from Secondary Issuance by locking their CKBytes in the Nervos DAO. We will cover more on these topics in the following sections.

这个用于支付状态租金的通胀其实叫作二级发行。那些没有占用 Nervos 存储空间的用户可以选择将其持有的 CKBytes 锁定在 Nervos DAO 中赚取来自二级通胀的利息。在以下各节中，我们将详细介绍这些主题。

## Base Issuance 基础发行

During the initial launch of the network the value of the CKByte will be low, which means the security on the network is low. In order to make Nervos a safe and attractive place to store assets, the security must be temporarily subsidized through a process known as Base Issuance.

在 Nervos 网络初始启动期间，CKByte 的价值会较低，这意味着网络安全性也会较低。为了使 Nervos 成为一个存储资产的安全且有吸引力的平台，必须通过基础发行的方式来安全性进行临时补贴。

Base Issuance is very similar to the mining process found in Bitcoin. Miners are paid a fixed amount of CKBytes for providing the computer resources to process transactions and secure the network. Over time the assets stored on the network will gain value, and fewer subsidies are necessary.

基础发行跟比特币的挖矿奖励十分相似。为矿工提供固定数量的 CKBytes，用于提供计算资源来处理交易和保障网络安全。随着存储在网络上的资产逐渐获得价值，CKByte 价值自然也会得到提升，矿工补贴也会随时间逐渐减少。

Base Issuance is paid for through using a fixed inflationary schedule. Approximately every four years the subsidy amount is halved until eventually stopping when the cap of 33.6 billion CKBytes have been issued. This provides a monetary policy that is transparent and predictable.

基础发行是通过一个固定的通胀计划来完成分发的。大约每四年挖矿奖励减半，直到 336 亿 CKBytes 发行完毕。这提供了一个透明可预测的货币政策。

## Secondary Issuance 二次发行

After the Base Issuance has ended, some have theorized that the incentive to miners will not provide enough security if it is only paid with fees from Cycles and Transactions. At the same time, miners require long term incentives that are directly aligned to ensure the data in Nervos is persisted. Both of these concerns are addressed through a process called Secondary Issuance.

有观点认为，基础发行结束后，如果仅从靠计算和交易费用来激励矿工保障网络安全可能不够。同时，矿工需要与保障 Nervos 中的数据存储工作相匹配的长期激励。二级发行便可以解决这两个问题。

Secondary Issuance follows a fixed inflation schedule of 1.344 billion CKBytes per year. This amount does not change. Unlike Base Issuance, Secondary Issuance does not affect everyone on the network. It is a small and targeted inflation from users that occupy space on Nervos or hold their CKBytes outside of the Nervos DAO.

二级发行的固定发行速率为每年 13.44 亿 CKBytes。不同于基础发行，二级发行并不会影响网络上的所有人。它只是针对占用 Nervos 存储空间以及持有在 Nervos DAO 之外的用户的 CKBytes 的小通胀。

The CKBytes from Secondary Issuance are distributed to:

* Miners maintaining the network (State Rent).
* Users of the Nervos DAO.
* The Nervos Treasury for continued development.

二级发行的 CKBytes 如下分发：

* 维护网络的矿工（状态租金）
* Nervos DAO 用户
* Nervos 财政部，用于未来生态发展
## Nervos DAO

Holders of CKBytes have the option of locking them in the Nervos DAO to gain interest in a process similar to staking on other platforms. When this is done, the holder will accrue CKByte interest at a rate directly proportional to that of Secondary Issuance. This offsets the long-term inflationary effects of Secondary Issuance exactly, resulting in no loss of value over time.

CKBytes 持有者可以选择将他们的 CKBytes 代币锁定在 Nervos DAO 中以获取利息，类似于其他平台的质押分红。锁仓后，持有者获得的 CKByte 利息恰好抵消了二级发行的通胀影响。

Users who are occupying space on Nervos have their CKBytes locked, which are then ineligible to be placed in the Nervos DAO. Once the Cells occupying space are consumed, the CKBytes are released, and can then be placed in the Nervos DAO. This provides an incentive to remove unnecessary data from Nervos, therefore keeping the blockchain more manageable in the long term.

用户占用 Nervos 存储空间所被锁定的 CKBytes 则没有资格存放到 Nervos DAO 中。一旦占用空间的 Cell 被消耗，CKBytes 会被释放，便可以存放到 Nervos DAO 中。这样可以激励用户从 Nervos 中删除不必要的数据，从长期来看，使区块链更易于管理。

## Further Reading 扩展阅读

* For more information on the economics of Nervos, please see the[Crypto-Economics RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md).
* 有关 Nervos 经济模型的更多信息，请参阅[Crypto-Economics RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)。
