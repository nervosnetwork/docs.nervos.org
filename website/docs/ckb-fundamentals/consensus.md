---
id: consensus
title: Consensus
---

Consensus in Nervos refers to a state of agreement among participants on the blockchain’s history and current state. The state encompasses data such as each user's CKBytes holdings and their respective digital assets.

Nervos Network, comprising thousands of computers and millions of transactions, constantly requires consensus on valid transactions and their order. Achieving consensus poses challenges due to the global distribution of nodes and the imperfect reliability of internet transmission. Nodes exchange messages to share transaction and block information, but these messages may arrive out of order, late, or not at all. Additionally, node functionality and honesty cannot be guaranteed. Given the substantial value involved, robust solutions for achieving consensus are crucial.

## Proof-of-Work Over Proof-of-Stake

To achieve Nervos' objectives, a consensus mechanism without compromise is imperative. Proof of Work (PoW) emerged as the optimal choice with the following advantages over Proof of Stake (PoS):

- **Decentralization**: PoW mining adapts to external factors, such as mining equipment, energy consumption, and regulation. This necessitates ongoing reinvestment to maintain competitiveness, thereby discouraging monopolization in the long run.
- **Security**: PoW offers a simpler and more robust framework, requiring fewer assumptions than alternative consensus mechanisms. This reduces the potential for security vulnerabilities and ensures a more secure network overall.
- **Fairness**: PoW mitigates advantages favoring early participants. Unlike PoS, where rewards are deterministically awarded and favor those who enter the system early, PoW ensures a more equitable distribution of rewards over time.

## NC-Max Consensus Algorithm

Bitcoin’s Nakamoto Consensus (NC) is the PoW algorithm that has successfully defended Bitcoin from countless attacks for over a decade. The technology is well understood and proven through the test of time.

Nervos’ NC-MAX consensus is built on Nakamoto Consensus, while addressing NC‘s limitations without compromising security. It offers robust resistance against transaction withholding attacks, while showcasing its superior performance, maximizing network throughput and considerably reducing transaction confirmation latency compared to traditional NC implementations.

### Improved Block Propagation

In traditional blockchains, transaction propagation delays can create bottlenecks, leading to network congestion and potential security vulnerabilities. NC-MAX addresses this challenge by splitting the confirmation process into two steps: propose and commit, thereby allowing transactions to be fully propagated before being committed, eliminating delays and vulnerabilities associated with incomplete transaction distribution.

### Enhanced Block Throughput

Shorter block intervals in blockchain networks can increase transaction throughput, but may also result in higher orphan block rate due to network synchronization issues. NC-MAX dynamically adjusts block intervals based on network performance to maximize throughput, while maintaining an expected orphan block rate. This adaptive approach ensures shorter block times without compromising network security.

### Robust Resistance to Selfish Mining

Selfish mining practices undermine network security by allowing miners to gain a disproportionate share of rewards while contributing less hash power. NC-MAX confronts this challenge by accurately measuring the network's computing power and mitigating known selfish mining attacks. By considering both external and internal factors, NC-MAX makes selfish mining strategies unprofitable, enhancing overall network security.

---

For a comprehensive understanding of NC-MAX, refer to [NC-Max: Breaking the Security-Performance Tradeoff in Nakamoto Consensus](https://eprint.iacr.org/2020/1101) and [RFC Consensus Protocol](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0020-ckb-consensus-protocol/0020-ckb-consensus-protocol.md).

## Eaglesong Hash Function

Bitcoin’s Nakamoto Consensus utilizes the widely-used SHA256 hash function. Any new cryptocurrency, as long as based on SHA256, can make benefits by leveraging the existing mining infrastructure. The substantial amount of infrastructure available for Bitcoin can be used maliciously, making it susceptible to potential attacks.

To address this vulnerability, Nervos developed Eaglesong, a novel cryptographic hash function tailored for its ecosystem. Eaglesong offers a balance of novelty, simplicity, and security, ensuring easy implementation in both software and hardware. This innovation enhances Nervos' security and ensures complete hardware sovereignty, providing a secure alternative to SHA256.

---

For more information on Eaglesong, refer to [RFC Eaglesong](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md).
