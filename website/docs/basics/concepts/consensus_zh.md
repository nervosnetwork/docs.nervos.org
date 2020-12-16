# Consensus 共识

## What is Consensus? 什么是共识？

Consensus is a state of agreement between the participants of a decentralized network. This means that the nodes on the network agree on the history and current state of the blockchain. State represents data such as the amount of CKBytes every user owns and which digital assets they have.

共识是去中心化网络中的参与者之间达成一致的状态。这意味着网络中的节点认同区块链的历史以及当前状态。状态代表着数据，例如每个用户所拥有的 CKBytes 数量以及数字资产类型。

The Nervos Network has thousands of computers and millions of transactions that are constantly flowing through the network. The computers on the network must come to an agreement on which transactions are valid and the order in which they occurred. This is a challenge because nodes are positioned all over the world, and internet transmission isn’t instant or completely reliable.

Nervos 网络中拥有数千台节点计算机以及数百万笔不断在网络中流动的交易。网络中的计算机必须就哪些为有效交易以及其发生的顺序达成一致。这十分有挑战性，因为这些节点分布在全球各地，网络传输并不是即时的，同时也非完全可靠。

Nodes pass messages to each other, sharing information about transactions and blocks that have been created. The messages might arrive out of order, or very late, or not at all. It also cannot be guaranteed that all of the nodes are functioning correctly or are being honest.

节点之间传递消息，共享已生成的区块以及交易信息。这些消息可能没有按照正确顺序到达，可能很晚到达，可能根本无法到达。同时也无法保证所有节点都正常运行或保持诚实。

Billions of dollars of value are at stake. The challenge is great, and robust solutions are of absolute importance.

价值数十亿美元利害攸关，挑战巨大，稳健可靠的解决方案至关重要。

## NC-Max

A project as ambitious as Nervos requires a zero-compromise solution for consensus. Many options were considered and it was determined that Proof of Work (PoW) is still the best solution.

像 Nervos 这样雄心勃勃的项目需要一个零妥协的共识方案。经过多种可选方案的对比以及深思熟虑后，我们觉得工作量证明机制（PoW）仍是最佳解决方案。

Proof of Stake (PoS) is one of the strongest contenders to PoW. The single greatest advantage PoS has is that it requires substantially less electricity to operate. However, PoW still offers several advantages over PoS:

* PoW mining is subject to external changes in technology, energy production, and regulation. This means that continued reinvestment is necessary to stay ahead of the competition, making long term monopolization difficult.
* PoW does not give strong advantages to the early participants of the system. In PoS, rewards are attained completely deterministically, meaning there is no way for a late-comer to compete with an early participant.
* PoW is more simplistic and requires far fewer assumptions to be made. This means the potential for security holes is substantially lower.

权益证明机制（PoS）是当前市面上最流行的共识机制之一。其最大的优势是运行所需的电量大大减少。但是，与 PoS 相比，PoW 仍具有一些优势：

* PoW 挖矿受技术，能源生产和监管等外部因素变化的影响。这意味着必须持续进行再投资才能保持竞争优势，从而使长期垄断变得困难。
* PoW 并未给系统的早期参与者带来巨大的优势。在 PoS 中，奖励是完全确定性地获得的，这意味着后来者无法与早期参与者竞争。
* PoW 更简单，前提假设更少，这意味着潜在的安全漏洞大大降低。

Bitcoin’s Nakamoto Consensus is the PoW algorithm that has successfully defended Bitcoin from countless attacks for over a decade. The technology is well understood and proven through the test of time. Nervos’ NC-MAX builds on Nakamoto Consensus by improving block propagation, block throughput, and resistance to selfish mining.

比特币的中本聪共识 PoW 算法在过去十多年中成功抵御了无数次攻击。该技术已广为人知且已被证明经得住时间的考验。Nervos 的 NC-MAX 共识算法基于中本聪共识，消除了区块传播瓶颈、增加了吞吐量并减少了自私挖矿攻击。

## Improved Block Propagation 优化区块传播

When a transaction is broadcast to all the nodes on the network, it remains in queue until it is included in a future block. A bottleneck can occur when a transaction broadcast is not fully successful. Some nodes might be aware of the transaction, and others may not. If a block is broadcast to the network that includes a transaction that some of the nodes do not have, those nodes will need to sync the missing transactions before the block can be properly verified. This causes network delays as the missing transactions are found and distributed to all the nodes that need them.

当一笔交易被广播给网络中的所有节点时，它将一直处于队列中，直到被包含在未来的区块中。当交易广播未完全成功时，便会出现性能瓶颈。一些节点可能接收到了交易，但部分节点没有。如果广播出去的区块中的部分交易有部分节点没有接收到，那么这些节点就需要在区块被正确验证之前，花时间同步这些丢失的交易，这就造成了网络的延迟。

This bottleneck limits the performance of a blockchain because its impact becomes greater as the time between blocks is lowered. It can also lead to selfish mining attacks where miners intentionally create network delays to give themselves a slight advantage over other participants to gain more mining rewards.

这个瓶颈限制了区块链的性能，因为随着出块时间的缩短，其造成的影响就越大。这也会导致自私挖矿攻击，因为矿工可以故意造成网络延迟，从而让自己比其他矿工多点优势，好获得更多的挖矿奖励。

NC-MAX solves this by splitting the confirmation process into two steps: propose and commit. A transaction is first proposed to the network. A proposed transaction cannot be confirmed until several blocks later. This gives more time for transaction propagation without slowing down block propagation. Once a transaction has been proposed and fully propagated, then it can be committed. This eliminates transaction propagation as a delay factor to block propagation, eliminating the bottleneck and selfish mining attack.

NC-MAX 解决此问题的方法是，通过将确认过程分为两步：交易提出（propose）和交易确认（commit）。一笔交易首先会在网络中提出，直到过了数个区块后，该交易才会被确认。这为交易广播提供了更多时间，也不会减慢区块传播。只要交易被提出并且完全广播给所有节点，便可以提交交易。这消除了交易传播延迟导致的区块传播延迟，消除了性能瓶颈以及自私挖矿攻击。

## Improved Block Throughput 增加区块吞吐量

A shorter block interval results in blocks being created more frequently. This results in faster transaction confirmation and higher throughput for the network. The downside of a lower block interval is that internet congestion has a greater effect on the ability of the network to properly synchronize. Blocks are sometimes created while the network not fully in sync, creating what is known as an Orphan Block. This means that the efforts towards network security are temporarily divided. Having some Orphan Blocks is unavoidable, but if too many occur in a short period it becomes counterproductive.

更短的出块间隔意味着更频繁的出块，从而实现更快的交易确认以及网络吞吐量。缺点就是互联网连接阻塞对区块链网络正确同步的能力有很大影响。新区块有时候在网络尚未完全同步时就创建了，即孤块。这将保障网络安全算力的分流。出现部分孤块是在所难免的，但如果在短时间内出现大量孤块，则网络算力付出为无用功的同时，也不利于网络安全。

NC-MAX improves this by automatically adjusting the block interval based on network performance. The number of Orphan Blocks created within a time frame is tracked and taken into consideration by the consensus protocol. The network is then able to adjust the block interval to maximize throughput while maintaining an expected Orphan Rate. This results in dramatically shorter block times without sacrificing security.

NC-MAX 通过根据网络性能自动调节区块间隔来改善这点。共识协议会追踪度量一定时间范围内的孤块数量，在保持预期孤块率的同时，网络会通过调节区块间隔以最大化吞吐量。在无需牺牲安全性的前提下，显著缩短区块时间。

## Improved Resistance to Selfish Mining 减少自私挖矿

Selfish mining is a practice where certain miners are able to secretly gain a larger share of mining rewards while contributing less hash power to the network. This is discouraged because it weakens the overall network security and can lead to irregular block times while causing congestion problems.

自私挖矿是矿工在网络贡献较少算力时却秘密获得大部分挖矿奖励的行为。这是值得唾弃的行为，因为这样不仅削弱了整体网络的安全，也会造成不规律的出块时间以及阻塞问题。

NC-MAX offers the most accurate measurement of the network’s computing power by taking into account both external and internal factors. This new model makes all known selfish mining attacks unprofitable because the actions they would perform to exploit the computing power calculation are now properly accounted for.

NC-MAX 通过考虑外部和内部因素，提供了最精确的网络算力度量方式，在调节难度时将叔块考虑在内，让所有自私挖矿无利可图。

## Eaglesong

Bitcoin’s Nakamoto Consensus internally utilizes a well-known hashing function known as SHA256. The majority of mining infrastructure that exists in the world is based around this algorithm.

比特币的中本聪共识使用的是著名的 SHA256 哈希算法。目前全球主流的挖矿基础设施都是基于该算法。

Any new cryptocurrency that is also based on SHA256 immediately benefits from hardware availability. However, there is a downside in that the substantial amount of infrastructure available for a large cryptocurrency, like Bitcoin, can be used maliciously towards a small cryptocurrency during their early days. Having dedicated mining hardware available for your ecosystem is overall beneficial since it significantly increases the challenges of attacking the network. For these reasons, a new cryptographic hashing function was created specifically for Nervos, called Eaglesong.

基于 SHA256 的新项目也会受益于当前的这种硬件基础设施。但缺点是，现在的这些大规模硬件基础设施可以被恶意用于新项目的早期阶段进行算力攻击。能拥有网络生态专用的挖矿硬件设备总体上是有好处的，因此这可以大大增强网络的抗攻击性。处于这方面的考虑，我们为 Nervos 专门创造了一个新的加密哈希函数 Eaglesong。

Eaglesong successfully blends novelty, simplicity, and security in a way that is easily implemented in both software and hardware. This advancement gives Nervos an edge in blockchain security while allowing for complete hardware sovereignty.

Eaglesong 成功地将新颖性、简单性与安全性融会贯通，且易于在软件与硬件中实现。这项进步让 Nervos 在区块链安全方面更具优势，同时具备完整的硬件主权。

## Further Reading 扩展阅读

* For more information on the topic of consensus, please see the[Consensus Protocol RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md).
* For more information on the Eaglesong algorithm, please see the[Eaglesong RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md).
* 有关共识主题的更多信息，请参阅[共识协议RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md)。
* 有关 Eaglesong 算法的更多信息，请参见[Eaglesong RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)。

