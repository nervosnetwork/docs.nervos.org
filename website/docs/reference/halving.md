---
id: halving
title: Halving
---
import useBaseUrl from "@docusaurus/useBaseUrl";

The base issuance of CKBytes are rewarded to miners for securing the network, and the reward halves approximately every **4 years** until all the base issuance tokens (**33.6 billion**) are mined out.

## How CKByte-Halving works?

In order to make the halving plan work as expected, a concept of time called **epoch** was introduced.

>An epoch is a period of time for a set of blocks. 
>
>In Nervos, the PoW difficulty changes on a new epoch. All the blocks in the same epoch share the same difficulty target. The difficulty adjustment algorithm aims to stabilize the orphan block rate at 2.5% and the epoch duration at 4 hours.

Epochs per halving is `4 * 365 * (24 / 4)` = `8760`, and the Nth halving of CKBytes firstly occurs on epoch: `the_Nth_halving_epoch = 8760 * N `.

So, The CKByte halving event occurs on the specified epoch, e.g. 8760, 17520. 

## How many times halving will the block rewards stop?

The consensus protocol does not specify how many times it will stop, but if the reward of a block is less than 61 ckb, then the reward for this block will not be issued. So if we count up to 1800 blocks in an epoch, **after the 4th halving**, then the base block rewards may not be issued.

The chart below details the next halving schedule and the corresponding base issuance rewards.

|Event              |Date                  |Epoch number      |Epoch reward |Block reward(If we count up to 1800 blocks in an epoch)|Daily reward  |Total new CKB between events|
|-------------------|----------------------|------------------|-------------|-------------------------------------------------------:|--------------:|----------------------------:|
|Nervos launches    |16 November 2019      |0 (genesis epoch) |1,917,808 CKB|1,065 CKB                                                  |11,506,849 CKB|16,800,000,000 CKB          |
|**First halving**      |**Expected November 2023**|**8,760**             |**958,904 CKB**  |**533 CKB**                                                    |**5,753,424 CKB** |**8,400,000,000 CKB**           |
|Second halving     |Expected November 2027|17,520            |479,452 CKB  |266 CKB                                                   |2,876,712 CKB |4,200,000,000 CKB           |
|3rd halving        |Expected November 2031|26,280            |239,726 CKB  |133 CKB                                                    |1,438,356 CKB |2,100,000,000 CKB           |
|4th halving        |Expected November 2035|35,040            |119,863 CKB  |67 CKB                                                     |719,178 CKB   |2,100,000,000 CKB           |
|Base Issuance Stops|Expected November 2043|52,560            |0            |0 CKB                                                      |0             |0                           |


<img src={useBaseUrl("img/halving-rewards.jpg")}/>
