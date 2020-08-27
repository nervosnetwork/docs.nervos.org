---
title: Transaction Fee
id: Transaction--Transaction-Fee
---

* Transaction size - the size of a serialized transaction
* Fee rate - fee rate indicates how many shannons per KB charge.

## Calculate transaction fee

Size of a normal two-in-two-out transaction is 597 bytes, to calculate transaction fee we need plus extra 4 bytes size due to the cost to serialize tx in a block.

`(tx_size + 4) * fee_rate / 1000`

Assume we use `1000 shannons/KB` as fee_rate, the transaction fee is `(597 + 4) * 1000 / 1000`, 601 shannons (0.00000601 CKB).

> NOTICE: this fee calculation may do not suite txs that consume too many cycles. In that case, the node will package tx in low priority unless you pay more fees.

## Min transaction fee rate

CKB Node operator can set a value `min_fee_rate` in `ckb.toml` to decide ignore txs which fee lower than `min_fee_rate`.

* `send_transaction` RPC will not accept txs which fee lower than `min_fee_rate`
* A node will stop to relay txs which fee lower than `min_fee_rate`

The default value of `min_fee_rate` is `1000`.

``` toml
min_fee_rate = 1_000 # shannons/KB
```

Which mean a tx need at least `(tx_size + 4) * 1000 / 1000` shannons as tx fee.

> NOTICE: even you can set `min_fee_rate` lower than the default value, the other nodes in the network may still use the default value, it's may cause the tx you accept still can't relay to other nodes. Unless your node is also a miner or mining pool that you can mine those txs yourself.

## Transaction fee estimate

CKB node support transaction fee estimate feature, open the `Experiment` in `ckb.toml` RPC modules.

Details [estimate_fee_rate](https://github.com/nervosnetwork/ckb/tree/develop/rpc#estimate_fee_rate)
