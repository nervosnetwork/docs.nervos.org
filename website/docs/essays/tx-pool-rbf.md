---
id: tx-pool-rbf
title: Replace-By-Fee (RBF)
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## What is RBF?

When a transaction is broadcasted to the network, all nodes verify the transaction and add it to their transaction pool (tx-pool) if it is valid. The transaction will stay in the tx-pool until it is mined into a block.

There is a scenario where a transaction maybe stuck in the tx-pool for a long time because the transaction fee is not high enough. In this case, the transaction can be replaced by a new transaction with a higher fee. This strategy is called Replace-By-Fee (RBF), RBF was first introduced by Bitcoin in [BIP: 125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki).

In most cases, RBF is usefull for spenders to adjust their previously-sent transactions to deal with unexpected confirmation delays or to perform other useful replacements, such as merging multiple transactions into one.

The new transaction must have the at least one same inputs as the old one(may includes other extra inputs), and the outputs can be different. The new transaction will replace the old one in the tx-pool, the old one will be removed from the tx-pool and with the status Rejected.

<img src={useBaseUrl("img/rbf.png")}/>


## Check rules for RBF

There are several check rule for RBF:

1. The old transaction being replaced can not be confirmed.

2. The new transaction does not include new, unconfirmed inputs. New transaction all don't have any `cell_deps` inputs which are the outputs of old transactions.

3. The transaction fee of the new transaction must be higher than old transaction fee plus extra minimal replace fee(be calculated by transaction size and a parameter configured by Node).

4. The number of sub-transactions for the transaction to be replaced must not exceed 100 (i.e., all the sub-transactions will be removed from the `tx-pool` when the transaction is replaced).

5. The descendants of old transactions can not contains any transaction which is a ancestor of the new transaction.

## How to use RBF in CKB

CKB begin to support RBF in [0.112.1](https://github.com/nervosnetwork/ckb/releases/tag/v0.112.1), and the RBF feature is disabled by default.

The parameter for RBF in `ckb.toml` is `min_rbf_rate`, which means the minimum extra fee rate for RBF, the unit is shannons/KB and default value is 1500.

```toml
min_fee_rate = 1_000 # Here fee_rate are calculated directly using size in units of shannons/KB
min_rbf_rate = 1_500 # calculated with the same way of min_fee_rate
```

To disable RBF for a Node, set `min_rbf_rate` to a value less than `min_fee_rate`.

To use RBF, the most important thing we need to know is the `min_replace_fee`, which is calculated with the following formula:

```rust
min_replace_fee = sum(replaced_tx_fee) + (min_rbf_rate * new_tx_size)
```

To simplify use model, we add new field `min_replace_fee` in the result of `get_transaction`, which means the minimum fee for RBF.

The API for RBF is `send_transaction`, which is the same as creating a new transaction, RBF rules will be checked if the new transaction contains any conflicted inputs with an old transactions in the tx-pool.