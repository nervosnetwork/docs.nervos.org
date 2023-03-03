---
id: halving
title: Halving
---
import useBaseUrl from "@docusaurus/useBaseUrl";

The base issuance of CKBytes are rewarded to miners for securing the network, and the reward halves approximately every **4 years** until all the base issuance tokens (**33.6 billion**) are mined out.

## How does the CKByte-Halving work?

In order to make the halving plan work as expected, a concept of time called **epoch** was introduced.

>An epoch is a period of time for a set of blocks. 
>
>In Nervos, the PoW difficulty changes on a new epoch. All the blocks in the same epoch share the same difficulty target. The difficulty adjustment algorithm aims to stabilize the orphan block rate at 2.5% and the epoch duration at 4 hours.

Epochs per halving is `4 * 365 * (24 / 4)` = `8760`, and the Nth halving of CKBytes firstly occurs on epoch: `the_Nth_halving_epoch = 8760 * N `.

So, The CKByte halving event occurs on the specified epoch, e.g. 8760, 17520. 

## When will CKByte be halved?

The following table details the schedule for several upcoming CKB halvings and their corresponding base issuance rewards:

|Event              |Date                  |Epoch number      |Epoch reward     |Block reward(Calculated based on 1800 blocks per epoch)|Daily reward  |Total new CKB between events|
|-------------------|----------------------|------------------|-----------------|------------------:|------------------:|---------------------------:|
|Nervos launches    |16 November 2019      |0 (genesis epoch) |1,917,808 CKB    |1,065 CKB          |11,506,849 CKB     |16,800,000,000 CKB          |
|**First halving**  |**Expected November 2023**|**8,760**     |**958,904 CKB**  |**533 CKB**        |**5,753,424 CKB**  |**8,400,000,000 CKB**       |
|Second halving     |Expected November 2027|17,520            |479,452 CKB      |266 CKB            |2,876,712 CKB      |4,200,000,000 CKB           |
|3rd halving        |Expected November 2031|26,280            |239,726 CKB      |133 CKB            |1,438,356 CKB      |2,100,000,000 CKB           |
|4th halving        |Expected November 2035|35,040            |119,863 CKB      |67 CKB             |719,178 CKB        |1,050,000,000 CKB           |
|5th having         |Expected November 2039|43,800            |59,932 CKB       |359,589 CKB        |525,000,000 CKB    |525,000,000 CKB             |
|6th having         |Expected November 2043|52,560            |29,966 CKB       |179,794 CKB        |262,500,000 CKB    |262,500,000 CKB             |
|7th having         |Expected November 2047|61,320            |14,983 CKB       |89,897 CKB         |131,250,000 CKB    |131,250,000 CKB             |
|8th having         |Expected November 2051|70,080            |7,491 CKB        |44,948 CKB         |65,625,000 CKB     |65,625,000 CKB              |
|9th having         |Expected November 2055|78,840            |3,746 CKB        |22,474 CKB         |32,812,500 CKB     |32,812,500 CKB              |
|10th having        |Expected November 2059|87,600            |1,873 CKB        |11,237 CKB         |16,406,250 CKB     |16,406,250 CKB              |



<img src={useBaseUrl("img/ckb_base_issuance_trend.jpg")}/>

⚠️ Note that CKB block rewards include **Base (issuance) reward**, **Secondary (issuance) reward**, **Commit reward**, and **Proposal reward**:

<img src={useBaseUrl("img/block-rewards.png")}/>

However, when we are discussing CKB halving, it only relates to **Base issuance rewards**. Therefore, the block rewards listed in the table only include the portion of rewards from base issuance to help with understanding.