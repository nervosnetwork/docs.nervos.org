---
id: tx-pool
title: Transaction Pool
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## Transaction Chaining

In CKB, transactions are organized in chains, whereby one transaction spends or `dep` references the outputs of the previous transaction (known as the parent)  and creates outputs for the subsequent transaction (known as the child).

## Orphan Transaction

When a chain of transactions is transmitted across the network, they don’t always arrive in order. Sometimes, the child arrives before the parent. In that case, the nodes that see the child first can see the parent transaction it refers to, which is not yet known. Rather than rejecting the child, they put it in a temporary pool and await the arrival of its parent before propagating it to every other node. The pool of transactions without parents is known as the orphan transaction pool. Once the parent arrives, any orphans that reference the Cell created by the parents are released from the pool, revalidated recursively, then the entire chain of transactions can be included in the transaction pool, ready to be mined in a block.

Two limits are set on the number of orphan transactions stored in memory, to prevent a denial-of-service attack against CKB nodes. They are defined as DEFAULT_MAX_ORPHAN_TRANSACTIONS and ORPHAN_TX_EXPIRE_TIME in the source code of the CKB client. If the number of orphan transactions in the pool exceeds DEFAULT_MAX_ORPHAN_TRANSACTIONS, one or more randomly selected orphan transactions are evicted, until the pool size is reduced within the limits. If the time of the orphan transactions remaining in the pool exceeds ORPHAN_TX_EXPIRE_TIME, the orphans will also be cleared.

## Transaction Weight

Transaction weight is a measurement of the size and the cycles of a transaction. The calculation is as follows:
```
const BYTES_PER_CYCLES: f64 = 0.000_170_571_4_f64;

max(size, (cycles * BYTES_PER_CYCLES))
```

Miners select transactions to fill the limited block space that awards the highest fee. Because of the two different limits, serialized size and consumed cycles, the selection algorithm is a multi-dimensional knapsack problem (MDKP). By introducing transaction weight, MDKP is reduced to a typical knapsack problem.

For more details on max block size and cycles, see Consensus Parameters.

## Fee Rate

Fee rate is the total transaction fees divided by the transaction weight.

## Transaction Prioritization

When CKB generates a block template to package transactions, it sorts the transactions according to certain rules to ensure that:

- Packaged transactions are topologically sorted, meaning that any parent of a transaction is also included. They must appear somewhere in the list before the transaction.
- Packaged transactions should not conflict.

On top of that, packages are designed for [incentive-compatibility](https://en.wikipedia.org/wiki/Incentive_compatibility). Packaged transactions are not prioritized in terms of individual transactions, but rather in terms of transaction chains.

Let's use an example to simply show the selection process when packaging a transaction. As illustrated below, there are two transaction chains: A and B.

<img src={useBaseUrl("img/tx AB 1.png")}/>

The transaction information in Chain A is as follows:

- Ta1 fee: 10, weight: 10
- Ta2 fee: 20, weight: 5
- Ta3 fee: 10, weight: 10

The transaction information in Chain B is as follows:

- Tb1 fee: 15, weight: 10
- Tb2 fee: 15, weight: 10
- Tb3 fee: 15, weight: 10

At this point we can obtain the fee rate of A as 1.6 (10 + 20 + 10) / (10 + 5 + 10) and that of B as 1.5 (15 + 15 + 15) / (10 + 10 + 10). This gives priority to the first transaction in Chain A, Ta1, even though the fee rate of Ta1 is lower than Tb1.

<img src={useBaseUrl("img/tx AB 2.png")}/>

After picking out Ta1, the fee rate of Chain A changes, and at this point we no longer count Ta1 in A. The overall fee rate of A changes to 2 (20 + 10) / (5 + 10). By the same reasoning, it can be shown that the next candidate is Ta2.

<img src={useBaseUrl("img/tx AB 3.png")}/>

Next, after Ta1 and Ta2 are picked out, A's fee rate changes to 1 (10 / 10), exceeded by B's fee rate. So the next candidate is not Ta3 but Tb1.

<img src={useBaseUrl("img/tx AB 4.png")}/>

The above is a brief description of the process of selecting a transaction for the block_template. The specific implementation of the algorithm also involves several other factors, such as size_limit, cycles_limit.

## Child-Pays-For-Parent (CPFP) 
In the case of a transaction sent with a small fee, it might be necessary to speed up the confirmation time for it to be considered settled. At this point, there is no way to directly increase the fee of the transaction itself. Instead, it is possible to create a new transaction that takes the unconfirmed transaction as its input, and spend it at a higher fee. Miners who want to benefit from this second, more profitable transaction will also need to confirm the first transaction. This is known as child-pays-for-parent (CPFP).
