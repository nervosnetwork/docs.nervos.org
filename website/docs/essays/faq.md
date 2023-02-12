---
id: faq
title: CKB FAQs
---

## How do you allocate transaction fees to the committer and proposer?

one transaction fee is F Shannon, poposer will get

```
floor(F * 4 / 10)
```

and committer will get

```
F - floor(F * 4 / 10)
```
We should allocate each transaction fee separately, instead of summing all transaction fees and then allocating to the committer and proposer.


---


## What is the RPC `send_transaction` Outputs Validator?

Outputs validator prevents improperly formed transactions from entering the tx-pool, in most cases, the main reason for the client to send these transactions is simply due to error codes or abuse of the SDK, which makes the transactions unlockable.

**Implementation details**

CKB provides two built-in validators: `default` and `passthrough`.

For `default` validator, these checks should conform to the pseudocode described below

```
transaction.outputs.all{ |output|
    script = output.script
    (script.code_hash == secp256k1_blake160_sighash_all && script.hash_type == "type" && script.args.size == 20) ||
    (script.code_hash == secp256k1_blake160_multisig_all && script.hash_type == "type" && （script.args.size == 20 || (script.args.size == 28 && script.args[20..28].is_valid_since_format))
}
transaction.outputs.all{ |output|
    script = output.type
    script.is_null || script.code_hash == dao && script.hash_type == "type"
}
```

For `passthrough` validator, it will skip validation.


---


## How the primary and secondary epoch reward is allocated among blocks?

Let's suppose that the epoch reward is R, and the epoch length is L. The start block number of the epoch is S.

```
M = R mod L
```

For block from S (inclusively) to S + M (exclusively), the reward is

```
floor(R / L) + 1
```

And for block from S + M (inclusively) to S + L (exclusively), the reward is

```
floor(R / L)
```

---


## How do you calculate transaction fee?

Let's start with a brief introduction to Transaction Weight.

### Transaction Weight

The miners select transactions to fill the limited block space which gives the highest fee. Because there are two different limits, serialized size and consumed cycles, the selection algorithm is a multi-dimensional knapsack problem. Introducing the Transaction weight converts the multi-dimensional knapsack to a typical knapsack problem.

```
/// Equal to MAX_BLOCK_BYTES / MAX_BLOCK_CYCLES, see [glossary](https://docs.nervos.org/docs/basics/glossary).
pub const BYTES_PER_CYCLES: f64 = 0.000_170_571_4_f64;

get_transaction_weight(tx_size: usize, cycles: u64) -> u64 {
    max(
        tx_size as u64,
        (cycles as f64 * BYTES_PER_CYCLES) as u64,
    )
}
```

### Estimate cycles

The cycles of the transaction can be obtained via rpc [estimate_cycles](https://github.com/nervosnetwork/ckb/tree/master/rpc#method-estimate_cycles)

Here depends on the type of transaction to be built, if the transaction consists of small cycles of scripts, you can disregard cycles and directly replace weight with tx_size to calculate the transaction fee

```
(tx_size + 4) * fee_rate / 1000
```

If the transaction consists of large cycles of script, then you need to include cycles in the calculation of the fee, otherwise the fee rate of the transaction will not meet the expectations, of course, it also depends on the scenario, if the priority of the transaction confirm does not need so precise control, you can also directly use a rough estimate of the cycles, or do not consider cycles can also be, according to your own needs trade-offs.

### Estimate FeeRate

Normally, you can just use the majority of the default values, which is [min_fee_rate](#what-is-the-min_fee_rate), but when network congestion occurs, if you want the confirmation time of the transaction to be manageable, then you need to focus on fee rate of the on-chain transaction, through [get_fee_rate_statics](https://github.com/nervosnetwork/ckb/tree/master/rpc#method-get_fee_rate_statics) rpc can get the statistics of the fee rate of confirmed  transactions on the chain in the recent history, you can use it according to your needs, for example, directly using the mean of the rates of the transactions in the last 21 blocks, or if you want to reduce the confirmation time even further, you can use the mean * 1.2.

### Transaction Fee

The size of a normal two-in-two-out transaction is 597 bytes, to calculate transaction fee we need to add extra 4 bytes size due to the cost of serialized tx in a block.

```
get_transaction_weight(tx_size + 4, cycles) * fee_rate / 1000
```

Let's suppose that we use `1000 shannons/KB` as fee_rate(how many shannons per KB charge),3_600_000 as cycles, the transaction weight is `max((597 + 4), 3_600_000 * 0.000_170_571_4)`, 614.05704, the transaction fee is `614.05704 * 1000 / 1000`, approximately 615 shannons (0.00000615 CKB).

---


## What is the `min_fee_rate`?

CKB Node operator can set the value called `min_fee_rate` in `ckb.toml` to decide ignore txs with lower fees than `min_fee_rate`.

* `send_transaction` RPC will not accept txs which fee lower than `min_fee_rate`
* The node will stop to relay txs with lower fee than `min_fee_rate`

The default value of `min_fee_rate` is `1000`.

``` toml
min_fee_rate = 1_000 # shannons/KB
```

Which mean a tx need at least `(tx_size + 4) * 1000 / 1000` shannons as the tx fee. `min_fee_rate` is used for cheap check threshold, so cycles are not considered in the calculation, this is different from when fee rate is used as a transaction processing priority.

> NOTICE: Even though you can set `min_fee_rate` lower than the default value, other nodes in the network may still use the default value, which may cause the tx you accept still can't be relayed to other nodes, unless your node is also a miner or mining pool so that you can mine those txs by yourself.


---


## Can you estimate transaction fee?

The CKB node supports to estimate transaction fee, you can open the `Experiment` in `ckb.toml` RPC modules to use the feature. For more details, you may refer to [estimate_fee_rate](https://github.com/nervosnetwork/ckb/tree/develop/rpc#estimate_fee_rate)


---


## What is `compact_target` in the block header?

`compact_target` is the encoded form of the target threshold which appears in the block header.

It is similar to `nBits` of bitcoin, the original `nBits` implementation inherits properties from a signed data class,if the high bit of the effective number of bits is set, the target threshold will be negative. This is useless—the header hash is considered as an unsigned number, so it can never be equal to or lower than a negative target threshold.

In CKB, the "compact" format is represented a whole number N using an unsigned 32bit number,which is similar to a floating-point format.

* The most significant 8 bits are the unsigned exponent of base 256.
* The exponent can be considered as "number of bytes of N".
* The lower 24 bits are the mantissa.

```
N = mantissa * 256^(exponent-3)
```

There are example and test vectors in Python 3, you may refer [here](https://github.com/nervosnetwork/ckb/blob/develop/util/types/src/utilities/difficulty.rs#L103) for more details :
```python
import unittest

def compact_to_target(compact):
    exponent = compact >> 24
    mantissa = compact & 0x00ffffff
    rtn = 0
    if (exponent <= 3):
        mantissa >>= (8 * (3 - exponent))
        rtn = mantissa
    else:
        rtn = mantissa
        rtn <<= (8 * (exponent - 3))
    overflow = mantissa != 0 and (exponent > 32)
    return rtn, overflow


def target_to_compact(target):
    bits = (target).bit_length()
    exponent = ((bits + 7) // 8)
    compact = target << (
        8 * (3 - exponent)) if exponent <= 3 else (target >> (8 * (exponent - 3)))
    compact = (compact | (exponent << 24))
    return compact


class TestCompactTarget(unittest.TestCase):

    def test_compact_target1(self):
        compact = target_to_compact(0x2)
        self.assertEqual('0x1020000', hex(compact))
        target, overflow = compact_to_target(0x1020000)
        self.assertTupleEqual((2, False), (target, overflow))

    def test_compact_target2(self):
        compact = target_to_compact(0xfe)
        self.assertEqual('0x1fe0000', hex(compact))
        target, overflow = compact_to_target(0x1fedcba)
        self.assertTupleEqual((0xfe, False), (target, overflow))


if __name__ == '__main__':
    unittest.main()

```

---


## How do you set the value of `capacity` in a Cell?

The field `capacity` in a cell must be larger than or equal to cell's own occupied capacity. The minimal occupied capacity of a secp256k1 cell is 61 bytes.

```
occupied(cell: Cell) = sum of
- capacity: 8 bytes
- data: len(data) bytes
- lock: occupied(lock: Script)
- type:
	- when present: occupied(type: Script)
	- when absent: 0 bytes

occupied(script: Script) = sum of:
- args: len(args) bytes
- code\_hash: 32 bytes
- hash\_type: 1 byte
```

There is a demo in JavaScript:

```js
function hex_data_occupied_bytes(hex_string) {
  // Exclude 0x prefix, and every 2 hex digits are one byte
  return (hex_string.length - 2) / 2;
}

function script_occupied_bytes(script) {
  if (script !== undefined && script !== null) {
    return (
      1 + hex_data_occupied_bytes(script.code_hash) +
      hex_data_occupied_bytes(script.args)
    );
  }
  return 0;
}

function cell_occupied_bytes(cell) {
  return (
    8 +
    hex_data_occupied_bytes(cell.data) +
    script_occupied_bytes(cell.lock) +
    script_occupied_bytes(cell.type)
  );
}
```


There is the test case:

```js
console.log(
  cell_occupied_bytes({
    capacity: "4500000000",
    data: "0x72796c6169",
    lock: {
      args: "0x",
      hash_type: "data",
      code_hash:
        "0xb35557e7e9854206f7bc13e3c3a7fa4cf8892c84a09237fb0aab40aab3771eee"
    },
    type: null
  })
);
// => 46
```

---

## How do you use the RPC subscription?
RPC subscriptions require a full duplex connection. CKB provides this kind of connection by tcp (enable with rpc.tcp_listen_address configuration option) and websockets (enable with rpc.ws_listen_address).

tcp rpc subscription example:
```shell
telnet localhost 18114
> {"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}
< {"jsonrpc":"2.0","result":0,"id":2}
< {"jsonrpc":"2.0","method":"subscribe","params":{"result":"...block header json...","subscription":0}}
< {"jsonrpc":"2.0","method":"subscribe","params":{"result":"...block header json...","subscription":0}}
< ...
> {"id": 2, "jsonrpc": "2.0", "method": "unsubscribe", "params": [0]}
< {"jsonrpc":"2.0","result":true,"id":2}
```

websocket rpc subscription example:
```js
let socket = new WebSocket("ws://localhost:28114")

socket.onmessage = function(event) {
  console.log(`Data received from server: ${event.data}`);
}

socket.send(`{"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}`)

socket.send(`{"id": 2, "jsonrpc": "2.0", "method": "unsubscribe", "params": [0]}`)
```

---


## What are the special live cells in CKB?

 There are some special live cells deployed in Testnet.


**duktape VM (JavaScript) cell**

The VM cell is deployed in transaction [`0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036`](https://explorer.nervos.org/aggron/transaction/0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036) output index `0`.
We should put the `out_point` in `cell_deps`, looks like:
``` javascript
{
  "out_point": {
    "tx_hash": "0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036",
    "index": "0x0"
  },
  "dep_type": "code"
}
```
And your type script may use this VM like:
``` javascript
{
  "code_hash": "0xfb8e791d70c4622ae0bd0127ee9597aea612e42929e725f7f3f25475bb954ce9",
  "hash_type": "data",
  "args": "0x<your javascript code in hex>",
}
```
There is an [example transaction](https://explorer.nervos.org/aggron/transaction/0xbbe58d19e6177ea16336e566c6cdbb91cb6ad74e0f76ccb17d980e5702e4615a) using duktape VM. If your logger(in `ckb.toml`) filter is set to `filter = "info,ckb-script=debug"` , you will see a log:

```
DEBUG ckb-script  script group: Byte32(0xafe527276275a4a25defee32ed59ecebf4813256866a7577431e5293acd2048b) DEBUG OUTPUT: I'm running in JS!
```

If you want to deploy the duktape VM cell by yourself, please refer to [this article](https://xuejie.space/2019_07_13_introduction_to_ckb_script_programming_script_basics/#introducing-duktape).

**mruby VM (Ruby)cell**

The VM cell is deployed in transaction [`0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a`](https://explorer.nervos.org/aggron/transaction/0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a) output index `0`.
We should put the `out_point` in `cell_deps`, looks like:
``` javascript
{
  "out_point": {
    "tx_hash": "0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a",
    "index": "0x0"
  },
  "dep_type": "code"
}
```
And your type script may use this VM like:
``` javascript
{
  "code_hash": "0xc3815b09286d825574f672bf4e04566ae6daaf1b45f3f1bcfd20c720198652ec",
  "hash_type": "data",
  "args": "0x<your ruby code in hex>",
}
```

If you want to deploy the mruby VM (Ruby)cell by yourself, you may follow these instructions below

* Step 1, build the mruby binary:
```
$ git clone --recursive https://github.com/nervosnetwork/ckb-mruby
$ cd ckb-mruby
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191012 bash
root@982d1e906b76:/# apt-get update
root@982d1e906b76:/# apt-get install -y ruby
root@982d1e906b76:/# cd /code
root@982d1e906b76:/code# make
root@982d1e906b76:/code# exit
```

* Step 2, deploy the binary via create a cell with the binary data:
```
$ ckb-cli wallet transfer --from-account <from-account> --to-address <to-address> --capacity 462000 --to-data-path build/entry --tx-fee 0.01
0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a
```

* Step 3, query the data hash of the binary:
```
$ ckb-cli rpc get_live_cell --tx-hash 0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a --index 0 --with-data
```

---


## How do you estimate the timestamp in CKB?

In CKB, based on the deterministic state of the chain,there is no way to know which block a transaction will be packaged into, and there is no way to get an accurate time,so we can estimate the timestamp like this:

```
median of previous 37 block timpstamp < timestamp <= local_time + 15s
```

---


## What gotchas should you pay attention to in [Nervos DAO](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)?

Due to CKB's unique flexibility, it also comes with some gotchas to be aware of. Otherwise there might be risk locking your cell forever with no way to unlock them. Here, we try our best to document the gotchas we know:

* Nervos DAO only supports *absolute epoch number* as since value when withdrawing from Nervos DAO. So if you are using a lock that supports lock period, such as the system included [multi-sign script](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_multisig_all.c), please make sure to ONLY use *absolute epoch number* as lock period. Otherwise the locked Nervos DAO cell cannot be spent.
