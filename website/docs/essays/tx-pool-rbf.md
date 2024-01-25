---
id: tx-pool-rbf
title: Replace-By-Fee (RBF)
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## What is RBF?

When a transaction is broadcasted to the network, all nodes verify its validity. If the transaction is valid, they add it to their transaction pool (tx-pool) and relay it to other nodes for further propagation. The transaction will stay in the tx-pool in a pending state until it is mined into a block.

Under certain conditions, such as during a period of congestion, a transaction may reside in the tx-pool for an extended period of time. This typically occurs when blocks are consistently full, and the fee attached to the transaction is not high enough to be included during a high traffic period since transactions with the highest fees are selected first.

There are two common resolutions for this issue. If the congestion resolves itself, all the transactions in the tx-pool may eventually go through. However, there is no guarantee this will happen or how long it will take. The second option is to initiate a new transaction with a fee that is high enough to prioritize it for faster inclusion.

The strategy used to replace an existing transaction in the tx-pool with one with a higher fee is known as Replace-By-Fee (RBF). This was first introduced by Bitcoin in [BIP 125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki).

To use RBF to replace an existing transaction in the tx-pool with a new one, the new transaction must share at least one input with the old transaction and include a sufficiently high RBF fee. (RBF fees are outlined below.) All other inputs and outputs in the transaction can be different. The new transaction will replace the old transaction in the tx-pool, and the old transaction will be removed from tx-pool with status "Rejected".

## Why Use RBF?

RBF allows for adjustment of pending transactions and can be beneficial in several scenarios. RBF allows pending transactions to:

- **Accelerate Transaction Confirmation**: RBF allows transactions that are not confirming fast enough to increase their fee to get higher prioritization. This can happen if an incorrect fee was paid or if network conditions change suddenly, resulting in a fee that is too low under current conditions.
- **Transaction Cancellation**: RBF enables the cancellation of a pending transaction. This is done by submitting a new transaction that consumes the same inputs as the old transaction but redirects the funds back to the sender instead of the original recipient.
- **Transaction Batching**: RBF allows multiple small batchable transactions to be combined into a single large transaction. This leads to better optimization, reducing the total fees paid for all batched transactions, and potentially resulting in quicker inclusion of all batched transactions.

## Examples of RBF

Let's examine a few examples of RBF, starting with the most basic one.

<img src={useBaseUrl("img/rbf.png")} width="50%"/>

In the example above, `tx-a` is a pending transaction in the tx-pool, and `tx-b` is a new transaction which may replace it. Both transactions include `input-1`. This creates a conflict as the same input cannot be used in two different transactions. If `tx-b` satisfies all the RBF requirements, it will replace `tx-a` in the tx-pool.

Next, let's examine a more complex scenario where multiple old transactions are replaced by a single new transaction.

<img src={useBaseUrl("img/rbf-merge.png")} width="60%"/>

In the example above, transaction `tx-a` and `tx-b`, and their descendants `tx-c` and `tx-d`, are in the tx-pool. A new transaction, `tx-e` has been created with two conflicted inputs, `input-2` and `input-3`. If `tx-e` meets the requirements of RBF, it will replace `tx-a`, `tx-b`, and consequently, it will also replace their descendants `tx-c` and `tx-d`.

Now, let's explore another method for accelerating a pending transaction, known as `Child-Pays-For-Parent` (CPFP).

<img src={useBaseUrl("img/rbf-cpfp.png")} width="70%"/>

In the example above, `tx-a` is in the tx-pool and the fee is not high enough to confirm. We speed this up using two different examples.

On the left, we use RBF to replace `tx-a` with `tx-b`. Both `tx-a` and `tx-b` have the same output, but `tx-b` includes a higher fee to ensure faster confirmation.

On the right, we use CPFP to speed up the confirmation of `tx-a` by submitting tx-b, which does not have any conflicting inputs. Instead of using RBF to replace `tx-a`, we create `tx-b` as a decendent of `tx-a` and include a higher fee with `tx-b`. If the combined fees from `tx-a` and `tx-b` are high enough, it will allow both to confirm.

## RBF Check Rules

RBF introduces extra procedures to validate incoming new transactions and remove old transactions from the tx-pool if the criteria for RBF is met.

<img src={useBaseUrl("img/rbf-process.png")} width="60%" />

RBF includes several check rules to safeguard the system by ensuring proper functionality and preventing malicious misuse of the feature:

1. The old transaction to be replaced must still be in a pending status, meaning it is in the tx-pool but is not confirmed.
2. The new transaction must not include any inputs that are still unconfirmed, unless the inputs on the new transaction match the inputs on the old transaction that is being replaced.
3. The new transaction must include a sufficiently high fee that is higher than the old transaction it is replacing, meeting the RBF minimum replacement fee rate requirement. (RBF fees are outlined below.)
4. The old transaction which will be replaced must not have more than 100 decendent transactions in the tx-pool.
5. The new transaction must not include any inputs or cell_deps that are decendants (outputs) of the old transaction. This would be invalid because replacing the old transaction means its outputs will no longer exist, and therefore they cannot be included in any future transactions.

These rules are implementated in the function `check_rbf()` in [pool.rs](https://github.com/nervosnetwork/ckb/blob/2f44fb0ca6a73ae77b4805b8f087a3b9913ac8f5/tx-pool/src/pool.rs#L527-L629).

## How to Use RBF in CKB

### How to Enable and Disable RBF

RBF support was added to CKB in [v0.112.1](https://github.com/nervosnetwork/ckb/releases/tag/v0.112.1), and it is enabled by default.

RBF is enabled and disabled in `ckb.toml` using the `min_rbf_rate` parameter, which also controls the minimum extra fee required to activate RBF.

The parameter for RBF in `ckb.toml` is `min_rbf_rate`, indicating the minimum extra fee rate for RBF. The `min_rbf_rate` value is expressed in Shannons/KB, the same as `min_fee_rate`.

To disable RBF on your CKB node, set `min_rbf_rate` to a value less or equal with `min_fee_rate`.

In the example below, RBF is enabled. These are the default values in `ckb.toml`.
```toml
min_fee_rate = 1_000
min_rbf_rate = 1_500
```

In the example below, RBF is disabled because `min_rbf_rate` is less than `min_fee_rate`.
```toml
min_fee_rate = 1_000
min_rbf_rate = 0
```

### Calculating the Minimum RBF Fee

The formula for calculating the minimum RBF replacement fee for a new transaction is as follows:

```
min_replace_fee = sum(replaced_tx_fee) + (min_rbf_rate * new_tx_size)
```

`sum(replaced_tx_fee)` is the sum of the fees from all old transactions that are being directly replaced by the new transaction.

`(min_rbf_rate * new_tx_size)` is the `min_rbf_rate` from `ckb.toml` and it is expressed in Shannons/KB. This is multiplied by the size of the new transaction.

`min_replace_fee` is the total of all the fees being removed from the tx-pool, plus the new transaction calculated at the RBF rate. A single new transaction can replace multiple old transactions in the tx-pool, so it only makes sense that the replacement new transaction offers more fees than those it is replacing.

### Using RBF via the CKB RPC

The `min_replace_fee` field has been added to the result of `get_transaction` as a simple way to get the required fees to replace a single transaction with one of am identical size.

> Note: If your new transaction is a different size, or it is a more complicated replacement of multiple transactions in the tx-pool, you must use the formula above to properly calculate the RBF fees.

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

An example response:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "result": {
    "transaction": {
      "cell_deps": [
        ...
      ],
      "inputs": [
        ...
      ],
      "outputs": [
        ...
      ],
      "outputs_data": [
        "0x"
      ],
      "version": "0x0",
      "witnesses": [
        ...
      ]
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

To invoke an RBF transaction, you would use the `send_transaction` method in the exact same way as creating a new transaction:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "method": "send_transaction",
  "params": [
    {
      "cell_deps": [
        ...
      ],
      "header_deps": [
        ...
      ],
      "inputs": [
        ...
      ],
      "outputs": [
        ...
      ],
      "outputs_data": [
        "0x"
      ],
      "version": "0x0",
      "witnesses": [
        ...
      ]
    },
    "passthrough"
  ]
}
```

Once the RBF transaction is submitted, the RBF rules will be checked. If successful, the transaction hash will be returned in the same format as when creating a regular transaction:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "result": "0xa0ef4eb5f4ceeb08a4c8524d84c5da95dce2f608e0ca2ec8091191b0f330c6e3"
}
```

If the RBF transaction fails the check, an error will be returned:

```json
{
  "id": 42,
  "jsonrpc": "2.0",
  "error": {
    "code": -301,
    "message": "RBFRjected: ..."
  }
}
```

The `message` field contains the reason why RBF is rejected. For example, if the transaction fee is not high enough, the message would be similar to this:

```json
Tx's current fee is 1000000000, expect it to >= 2000000363 to replace old txs.
```
