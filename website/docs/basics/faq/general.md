---
id: general
title: General FAQ
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

### **Q**: Which consensus does Nervos use?

**A**: Consensus refers to the consistent state of distributed network participants, in other words, the historical data and current ledger state of the blockchain that the nodes on the network agree on unanimously. The ledger state consists of records of user accounts and asset balances, such as the number of CKBytes and tokens they own. The consensus algorithm Nervos is using is called NC-MAX. NC-MAX is based on Proof of Work (PoW) and Nakamoto consensus (used by Bitcoin) and is an ambitious project as much as Nervos. It is a consensus solution with zero compromise in terms of security and decentralization, while maximizing the use of network bandwidth. After thoughtful considerations, Nervos believed Proof of Work (PoW) is the best solution.

Proof of Stake (PoS) is one of PoW's competitors. One advantage that PoS has is that it requires less power to operate. Compared with PoS, PoW has the following incomparable advantages: 1) PoW mining is affected by external changes in technology, energy production and regulation. This means that PoW is energy efficiency. Moreover, the continuous reinvestment is necessary to maintain a leading position in the competition, which makes long-term monopoly difficult. 2) PoW will not bring monopolistic advantages to early participants in the system. In PoS, rewards are obtained with complete in-protocol resource and determinism, which means that early participants have advantages over latecomers. 3) PoW is simpler and requires far fewer assumptions, therefore, the probability of a security breach is much lower. To achieve the same level of security, PoW is more efficient than PoS except it exhibits security budget in a more explicit way. 4）

Based on the Satoshi Nakamoto consensus of Bitcoin, NC-MAX significantly increases the transaction volume per second and reduces the confirmation time without affecting security or decentralization. Compared with Ethereum, Nervos currently provides 10 times the throughput growth, which is expected to increase exponentially with the development of Layer 2 solutions.

For more information, see <Link to={useBaseUrl('/docs/concepts/consensus')}>Consensus</Link>. 

More discussions on POS and POW: https://talk.nervos.org/t/pow-pos-discussion-in-history/5457.

---

### **Q**: What is CKByte?

**A**: CKByte is the token required for the use of the basic functions of the Nervos network. CKByte is the native token of the Nervos CKB blockchain, which can be redeemed for transaction fees, and is also a unit of CKB on-chain space. Possessing 1 CKByte means having 1 byte of storage capacity on CKB, i.e. ownership of 1 byte of a common knowledge base. Instead of cloud servers or general distributed storage, data stored in Common Knowledge Base has a higher value density as the data will be verified by permissionless global consensus and smart contracts throughout the network before being stored on countless nodes in the distributed network. Either the fungible token or non-fungible token, for example, is typical of data held in the common knowledge base.

The initial amount of CKByte in design is 33.6 billion, of which 25%, or 8.4 billion CKBytes were reserved for Satoshi Nakamoto (using his/her/their address found in Bitcoin genesis block). However, the “tribute to Satoshi“ was later cancelled due to security concerns, and the 8.4 billion CKBytes are sent to [an all-zero address](https://explorer.nervos.org/address/ckb1qgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqchfq7c4e0e864p98x0t7mc0k58thz83s97znnd) in the genesis block, making them effectively “burnt” and will never enter circulation. The real initial amount of CKByte in genesis is thus 25.2 billion.

Burning is not the same as not-issued, as these 8.4 billion CKBytes will impact the second issuance. 15% of the 8.4 billion CKBytes will be filled with data (make them occupied capacity), while the remaining 10% of the 8.4 billion CKbytes will be left empty (free capacity). By this setting, miners are guaranteed 15% of secondary issuance, which is effectively the minimal security budget of Nervos, solves perhaps the only unsolved problem in Bitcoin. The 10% empty capacity means at minimum 10% of secondary issuance is “burnt” until Nervos Treasury is enabled. (note: the description of “burnt” 8.4 billion’s impact on secondary issuance [in this article](https://talk.nervos.org/t/nervos-ckbyte-distribution-and-why-we-are-burning-25-in-the-genesis-block/3503) is correct, but the 8.4 billion is sent to all-zero address, not Satoshi’s address).

In addition to the CKBytes generated in the Genesis block, a primary issuance of 33.6 billion CKBytes and a secondary issue of 13.44 billion CKBytes per year are set in the protocol. Similar to the Bitcoin mining process, miners are compensated in CKBytes as they provide computing resources to process transactions and secure the network. The primary issuance halves every four years, while the secondary issuance is constant every year. In the beginning, miners will be rewarded by both primary and secondary issuance. After all the 33.6 billion primary issuance has been released, there will only be a secondary issue of 1.344B CKBytes per year. The secondary issue can be seen as payment-by-inflation from CKB users to use the common knowledge base.

The secondary issuance is shared by miners, the Nervos DAO and the future Nervos treasury based on common knowledge base usage. CKB can be utilised as a secure store of value, just like BTC. It’s also the fuel of smart contracts and decentralised applications, like ETH, for transaction processing and on-chain storage. The unique crypto-economic of CKByte ensures secure storage of value, value capture of the layered Nervos network, and incentive compatibility of users, miners, developers and node operators.

More information is available at:

- [Token | Nervos Network](https://www.nervos.org/token)
- [RFC0015: Crypto-Economics of the Nervos Common Knowledge Base](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)
- [The CKByte Issuance Model of Nervos](https://talk.nervos.org/t/the-ckbyte-issuance-model-of-nervos/5321)

---

### **Q**: What is SUDT?

**A**: SUDT is the abbreviation of Simple User Defined Token, which is equivalent to the ERC20 standard on Ethereum. It defines an easy-to-understand token standard, which contains the content that DApp developers need while minting their own tokens on Nervos CKB. You can check [SUDT RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md) for more details. For the method of writing and mining SUDT, please refer to the following documents:

- <Link to={useBaseUrl('/docs/labs/sudtbycapsule')}>Write an SUDT script by Capsule</Link>
- <Link to={useBaseUrl('/docs/essays/mint-sudt-via-contract')}>Mint SUDT via Contract</Link>

---
