---
id: tx-pool-rbf
title: Replace-By-Fee (RBF)
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## What is RBF?

When a transaction is broadcasted to the network, all nodes verify the transaction and add it to their transaction pool (tx-pool) if it is valid. The transaction will stay in the tx-pool until it is mined into a block.

There is a scenario that a transaction maybe stuck in the tx-pool for a long time because the transaction fee is not high enough. In this case, the transaction can be replaced by a new transaction contains same inputs but with a higher fee. This strategy is called Replace-By-Fee (RBF), first introduced by Bitcoin in [BIP 125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki).

The new transaction must have at least one same input with the old transaction (may include other extra inputs), while the outputs can be different. The new transaction will replace the old one in the tx-pool, and the old one will be removed from tx-pool with status "Rejected".

<img src={useBaseUrl("img/rbf.png")} width="70%" height="70%"/>

In the above example, the transaction `tx-a` is already in tx-pool and the new `tx-b` has a conflicted input `input1` with `tx-a`, so `tx-a` will be replaced by `tx-b` in the tx-pool if all RBF rules are satisfied.

In most cases, RBF is useful for spenders to adjust their previously-sent transactions to deal with unexpected confirmation delays or to perform other useful replacements, such as merging multiple transactions into one.

<img src={useBaseUrl("img/rbf-merge.png")} width="70%" height="70%"/>

For instance, the above transaction `tx-a`, `tx-b` and their descendants are already in the tx-pool, a new transaction `tx-e` has conflicted inputs with `tx-a` and `tx-b`, so `tx-a`,`tx-b`, `tx-c`, `tx-d` are all replaced by `tx-e` when RBF happens.

Another way to speed up the confirmation is creating a new transaction that takes the unconfirmed transaction as its input, and spend it at a higher fee. This is known as `child-pays-for-parent` (CPFP).

## Check Rules for RBF

The general process of RBF is adding another extra check, to get the conflicted transactions in the `tx-pool` from a new transaction, then remove them before adding the new transaction into the `tx-pool`.

<img src={useBaseUrl("img/rbf-process.png")} width="70%" height="70%"/>

There are several check rules for RBF, mainly to prevent malicious users from abusing the RBF feature:

1. The replaced old transaction must not be confirmed; the new transaction must be valid.

2. The new transaction must not include new, unconfirmed inputs, or any `cell_deps` inputs that are outputs of old transactions.

3. The transaction fee of the new transaction must surpass the old transaction fee, including an extra minimal replacement fee calculated based on the transaction size and a parameter configured by node.

4. The number of sub-transactions for the transaction to be replaced must not exceed 100. In other words, all sub-transactions will be removed from the `tx-pool` when the transaction is replaced.

5. The descendants of old transactions must not contain any transaction that is a ancestor of the new transaction.

While the rules may seem complicated, they are implementated in a single function `check_rbf` in [pool.rs](https://github.com/nervosnetwork/ckb/blob/2f44fb0ca6a73ae77b4805b8f087a3b9913ac8f5/tx-pool/src/pool.rs#L527-L629).

## How to Use RBF in CKB

### Enable/Disable RBF in ckb.toml

CKB began to support RBF in [0.112.1](https://github.com/nervosnetwork/ckb/releases/tag/v0.112.1), it is enabled by default.

The parameter for RBF in `ckb.toml` is `min_rbf_rate`, indicating the minimum extra fee rate for RBF. The unit is shannons/KB and default value is `1500`.

```toml
min_fee_rate = 1_000 # calculated directly using size in units of shannons/KB
min_rbf_rate = 1_500 # calculated with the same way of min_fee_rate
```

To manually disable RBF for a CKB node, please set `min_rbf_rate` to a value less or equal with `min_fee_rate`.

### Use RBF in RPC

To use RBF, the most important thing we need to know is the `min_replace_fee`, calculated with the following formula:

```rust
min_replace_fee = sum(replaced_tx_fee) + (min_rbf_rate * new_tx_size)
```

To simplify the use model, we add a new field `min_replace_fee` in the result of `get_transaction`, indicating the minimal fee to replace the transaction:

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

The response will be:

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
    "fee": "0x5f5e100",
    "min_replace_fee": "0x5f5e26b",
    "tx_status": {
      "block_hash": null,
      "status": "pending",
      "reason": null
    }
  }
}
```

The API for invoking RBF is `send_transaction`, which is same as creating a new transaction:

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

All RBF rules will be checked if the new transaction contains any conflicted inputs with an old transaction in the tx-pool. If RBF succeeds, the result will be:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "result": "0xa0ef4eb5f4ceeb08a4c8524d84c5da95dce2f608e0ca2ec8091191b0f330c6e3"
}
```

Otherwise, the result will be like:

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

The `message` field contains the reason why RBF is rejected, for example if the transaction
fee is not high enough, the message will be like:

```json
Tx's current fee is 1000000000, expect it to >= 2000000363 to replace old txs
```