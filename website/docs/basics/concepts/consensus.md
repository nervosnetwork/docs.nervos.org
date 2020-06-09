---
id: consensus
title: Consensus
---

## What is Consensus?

Consensus is a state of agreement between the participants of a decentralized network. This means that the nodes on the network agree on the history and current state of the blockchain. State represents data such as the amount of CKBytes every user owns and which digital assets they have.

The Nervos Network has thousands of computers and millions of transactions that are constantly flowing through the network. The computers on the network must come to an agreement on which transactions are valid and the order in which they occurred. This is a challenge because nodes are positioned all over the world, and internet transmission isn’t instant or completely reliable.

Nodes pass messages to each other, sharing information about transactions and blocks that have been created. The messages might arrive out of order, or very late, or not at all. It also cannot be guaranteed that all of the nodes are functioning correctly or are being honest. 

Billions of dollars of value are at stake. The challenge is great, and robust solutions are of absolute importance.

## NC-Max

A project as ambitious as Nervos requires a zero-compromise solution for consensus. Many options were considered and it was determined that Proof of Work (PoW) is still the best solution.

Proof of Stake (PoS) is one of the strongest contenders to PoW. The single greatest advantage PoS has is that it requires substantially less electricity to operate. However, PoW still offers several advantages over PoS:

* PoW mining is subject to external changes in technology, energy production, and regulation. This means that continued reinvestment is necessary to stay ahead of the competition, making long term monopolization difficult. 
* PoW does not give strong advantages to the early participants of the system. In PoS, rewards are attained completely deterministically, meaning there is no way for a late-comer to compete with an early participant.
* PoW is more simplistic and requires far fewer assumptions to be made. This means the potential for security holes is substantially lower.

Bitcoin’s Nakamoto Consensus is the PoW algorithm that has successfully defended Bitcoin from countless attacks for over a decade. The technology is well understood and proven through the test of time. Nervos’ NC-MAX builds on Nakamoto Consensus by improving block propagation, block throughput, and resistance to selfish mining.

## Improved Block Propagation

When a transaction is broadcast to all the nodes on the network, it remains in queue until it is included in a future block. A bottleneck can occur when a transaction broadcast is not fully successful. Some nodes might be aware of the transaction, and others may not. If a block is broadcast to the network that includes a transaction that some of the nodes do not have, those nodes will need to sync the missing transactions before the block can be properly verified. This causes network delays as the missing transactions are found and distributed to all the nodes that need them.

This bottleneck limits the performance of a blockchain because its impact becomes greater as the time between blocks is lowered. It can also lead to selfish mining attacks where miners intentionally create network delays to give themselves a slight advantage over other participants to gain more mining rewards.

NC-MAX solves this by splitting the confirmation process into two steps: propose and commit. A transaction is first proposed to the network. A proposed transaction cannot be confirmed until several blocks later. This gives more time for transaction propagation without slowing down block propagation. Once a transaction has been proposed and fully propagated, then it can be committed. This eliminates transaction propagation as a delay factor to block propagation, eliminating the bottleneck and selfish mining attack.

## Improved Block Throughput

A shorter block interval results in blocks being created more frequently. This results in faster transaction confirmation and higher throughput for the network. The downside of a lower block interval is that internet congestion has a greater effect on the ability of the network to properly synchronize. Blocks are sometimes created while the network not fully in sync, creating what is known as an Orphan Block. This means that the efforts towards network security are temporarily divided. Having some Orphan Blocks is unavoidable, but if too many occur in a short period it becomes counterproductive.

NC-MAX improves this by automatically adjusting the block interval based on network performance. The number of Orphan Blocks created within a time frame is tracked and taken into consideration by the consensus protocol. The network is then able to adjust the block interval to maximize throughput while maintaining an expected Orphan Rate. This results in dramatically shorter block times without sacrificing security.  

## Improved Resistance to Selfish Mining

Selfish mining is a practice where certain miners are able to secretly gain a larger share of mining rewards while contributing less hash power to the network. This is discouraged because it weakens the overall network security and can lead to irregular block times while causing congestion problems.

NC-MAX offers the most accurate measurement of the network’s computing power by taking into account both external and internal factors. This new model makes all known selfish mining attacks unprofitable because the actions they would perform to exploit the computing power calculation are now properly accounted for.

## Eaglesong

Bitcoin’s Nakamoto Consensus internally utilizes a well-known hashing function known as SHA256. The majority of mining infrastructure that exists in the world is based around this algorithm.

Any new cryptocurrency that is also based on SHA256 immediately benefits from hardware availability. However, there is a downside in that the substantial amount of infrastructure available for a large cryptocurrency, like Bitcoin, can be used maliciously towards a small cryptocurrency during their early days. Having dedicated mining hardware available for your ecosystem is overall beneficial since it significantly increases the challenges of attacking the network. For these reasons, a new cryptographic hashing function was created specifically for Nervos, called Eaglesong.

Eaglesong successfully blends novelty, simplicity, and security in a way that is easily implemented in both software and hardware. This advancement gives Nervos an edge in blockchain security while allowing for complete hardware sovereignty.

## Further Reading

* For more information on the topic of consensus, please see the [Consensus Protocol RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md). 
* For more information on the Eaglesong algorithm, please see the [Eaglesong RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md).
