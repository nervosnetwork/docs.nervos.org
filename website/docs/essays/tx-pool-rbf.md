---
id: tx-pool-rbf
title: Replace-By-Fee (RBF)
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## What is RBF?

When a transaction is broadcasted to the network, all nodes verify the transaction and add it to their transaction pool (tx-pool) if it is valid. The transaction will stay in the tx-pool until it is mined into a block.

There is a scenario that a transaction maybe stuck in the tx-pool for a long time because the transaction fee is not high enough. In this case, the transaction can be replaced by a new transaction with a higher fee. This strategy is called Replace-By-Fee (RBF), RBF was first introduced by Bitcoin in [BIP: 125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki).

In most cases, RBF is usefull for spenders to adjust their previously-sent transactions to deal with unexpected confirmation delays or to perform other useful replacements, such as merging multiple transactions into one.

The new transaction must have the at least one same inputs as the old one(may includes other extra inputs), and the outputs can be different. The new transaction will replace the old one in the tx-pool, the old one will be removed from the tx-pool and with the status Rejected.

<img src={useBaseUrl("img/rbf.png")} width="70%" height="70%"/>

In the above example, the transaction `tx-a` is already in tx-pool and the new `tx-b` has a conflicted input `input1` with `tx-a`, so `tx-a` will be replaced by `tx-b` in the tx-pool if other RBF rules are satisfied.

Another way to speed up the confirmation is creating a new transaction that takes the unconfirmed transaction as its input, and spend it at a higher fee. This is known as `child-pays-for-parent` (CPFP).

## Check rules for RBF

There are several check rule for RBF:

1. The old transaction being replaced can not be confirmed, the new transaction is a valid transaction.

2. The new transaction does not include new, unconfirmed inputs. New transaction all don't have any `cell_deps` inputs which are the outputs of old transactions.

3. The transaction fee of the new transaction must be higher than old transaction fee plus extra minimal replace fee(be calculated by transaction size and a parameter configured by Node).

4. The number of sub-transactions for the transaction to be replaced must not exceed 100 (i.e., all the sub-transactions will be removed from the `tx-pool` when the transaction is replaced).

5. The descendants of old transactions can not contains any transaction which is a ancestor of the new transaction.

While the rules may seem complicated, they are designed to prevent malicious users from abusing the RBF feature, and implementated in a single function `check_rbf` in [pool.rs](https://github.com/nervosnetwork/ckb/blob/2f44fb0ca6a73ae77b4805b8f087a3b9913ac8f5/tx-pool/src/pool.rs#L527-L629).

## How to use RBF in CKB

### Enable/Disable RBF in ckb.toml

CKB begin to support RBF in [0.112.1](https://github.com/nervosnetwork/ckb/releases/tag/v0.112.1), and the RBF feature is disabled by default.

The parameter for RBF in `ckb.toml` is `min_rbf_rate`, which means the minimum extra fee rate for RBF, the unit is shannons/KB and default value is `1500`.

```toml
min_fee_rate = 1_000 # calculated directly using size in units of shannons/KB
min_rbf_rate = 1_500 # calculated with the same way of min_fee_rate
```

To disable RBF for a CKB node, set `min_rbf_rate` to a value less than `min_fee_rate`.

### Use RBF in RPC

To use RBF, the most important thing we need to know is the `min_replace_fee`, which is calculated with the following formula:

```rust
min_replace_fee = sum(replaced_tx_fee) + (min_rbf_rate * new_tx_size)
```

To simplify the use model, we add new field `min_replace_fee` in the result of `get_transaction`, which means the minimal fee to replace the transaction:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "method": "get_transaction",
  "params": [
    "0xa0ef4eb5f4ceeb08a4c8524d84c5da95dce2f608e0ca2ec8091191b0f330c6e3"
  ]
}
```

The response will be like:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "result": {
    "transaction": {
      "cell_deps": [
        .....
      ],
      "inputs": [
        .....
      ],
      "outputs": [
        .....
      ],
      "outputs_data": [
        "0x"
      ],
      "version": "0x0",
      "witnesses": []
    },
    "cycles": "0x219",
    "time_added_to_pool" : "0x187b3d137a1",
    "fee": "0x16923f7dcf",
    "min_replace_fee": "0x16923f7f6a",
    "tx_status": {
      "block_hash": null,
      "status": "pending",
      "reason": null
    }
  }
}
```

The API for invoking RBF is `send_transaction`, which is the same as creating a new transaction:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "method": "send_transaction",
  "params": [
    {
      "cell_deps": [
        .....
      ],
      "header_deps": [
        .....
      ],
      "inputs": [
        .....
      ],
      "outputs": [
        .....
      ],
      "outputs_data": [
        "0x"
      ],
      "version": "0x0",
      "witnesses": []
    },
    "passthrough"
  ]
}
```

RBF rules will be checked if the new transaction contains any conflicted inputs with an old transactions in the tx-pool, if RBF success the result will be like:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "result": "0x365698b50ca0da75dca2c87f9e7b563811d3b"
}
```

otherwise, the result will be:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "error": {
    "code": -301,
    "message": "RBFRjected: ....."
  }
}
```