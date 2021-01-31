---
id: faq_zh
title: CKB 常见问答
---

## 交易费用如何分配给提交者（committer）和提议者（proposer）？

假设交易费用为 F Shannon，则提议者得到

```
floor(F * 4 / 10)
```

提交者得到

```
F - floor(F * 4 / 10)
```
我们应该将每笔交易费用单独分配，而不是将所有交易费用相加，然后分配给提交者和提议者。

---


## RPC `send_transaction` 中的 `Outputs validator`  是什么 ？

Outputs validator 防止虚假交易进入交易池，在大多数情况下，客户端发送这些交易的主要原因只是由于错误代码或滥用 SDK，这使得交易无法锁定。

**实现细节**

CKB 提供了两个内置的验证器： `default` and `passthrough`.

对于 `default` 验证器， 这些检查应该符合下面描述的伪代码：

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

对于 `passthrough` 验证器，它将跳过验证。

---

## 在区块间，基础奖励以及二级奖励是如何分配的？

假设 epoch 奖励为 R，epoch 长度为 L，纪元的起始区块高度为 S。

```
M = R mod L
```

对于高度在 S(包含) 到 S+M(不包含) 之间的区块，奖励为：

```
floor(R / L) + 1
```

对于高度在 S+M(包含) 到 S+L(不包含) 之间的区块，奖励为：

```
floor(R / L)
```

---


## 如何计算交易费用？

普通二进二出的交易大小为 597 字节， 为了计算交易费用，我们需要额外增加 4 个字节的大小作为在区块中序列化交易的成本。

`(tx_size + 4) * fee_rate / 1000`

假设我们用 `1000 shannons/KB` 作为 fee_rate（每 KB 收费多少 shannons），交易费用是（597+4）*1000/1000，601 shannons （0.00000601 CKB）。

> 注意：此费用计算方法可能不匹配消耗了太多 cycles 的交易。在这种情况下，除非你支付更多的费用，否则节点将以低优先级的方式打包这类交易。

---


## `min_fee_rate` 是什么意思?

CKB 节点运营者可以在 `ckb.toml` 中设置名为 `min_fee_rate` 的值来决定忽略费用低于 `min_fee_rate` 的交易。

* `send_transaction` RPC 不接受低于 `min_fee_rate` 费用的交易。
* 如果交易费用低于 `min_fee_rate` ，节点将会停止转发交易。

 `min_fee_rate` 的默认值为 `1000`。

``` toml
min_fee_rate = 1_000 # shannons/KB
```

这意味着交易至少需要 `(tx_size + 4) * 1000 / 1000` shannons 作为交易费用。

> 注意：即使你可以将 `min_fee_rate` 设置的比默认值低，网络中的其他节点仍然可能会使用默认值，这可能会导致你接受的交易仍然无法转发到其他节点，除非你的节点也是一个矿工或矿池，这样你就可以自己挖矿打包这些交易。

---


## 能够预估交易费用吗？

CKB 节点支持预估交易费用，你可以在 `ckb.toml` 中的 RPC 模块中开启 `Experiment ` 来使用该功能。更多细节可以参考 [预估交易费用](https://github.com/nervosnetwork/ckb/tree/develop/rpc#estimate_fee_rate)。

---


## 区块头中的 `compact_target` 是什么意思？

`compact_target` 是目标阈值（target threshold）在区块头中的编码形式。

它类似于比特币的 `nBits`，最初的 `nBits` 实现继承了一个有符号数据类的属性，如果设置了有效位数的高位，目标阈值将为负，这是没有用的，头哈希被认为是一个无符号数，所以它永远不可能等于或低于负的目标阈值。

在CKB中，“紧凑”的格式是用一个无符号的32位数来表示一个整数 N，这类似于浮点格式。

* 最重要的 8 位是 256 基的无符号指数。
* 指数可以认为是 “N的字节数”。
* 低 24 位是尾数。

```
N = mantissa * 256^(exponent-3)
```

下面有 Python3 版的测试实例，你可以参考 [这里](https://github.com/nervosnetwork/ckb/blob/develop/util/types/src/utilities/difficulty.rs#L103) 了解更多：
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


## 如何设置 Cell 中的`capacity`  值？

Cell 中的字段 `capacity` 必须大于等于 Cell 自身占用的容量。一个 secp256k1  Cell 的最小占用容量为 61 字节。

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

下面为 JavaScript 版示例：

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


这是测试用例：

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

## 如何使用 RPC 订阅？
RPC订阅需要全双工连接。CKB 通过 tcp（启用 rpc.tcp_listen_address 配置选项）和 websockets （启用 rpc.ws_listen_address）提供这种连接。

tcp rpc 订阅示例：
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

websocket rpc 订阅示例：
```js
let socket = new WebSocket("ws://localhost:28114")

socket.onmessage = function(event) {
  console.log(`Data received from server: ${event.data}`);
}

socket.send(`{"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}`)

socket.send(`{"id": 2, "jsonrpc": "2.0", "method": "unsubscribe", "params": [0]}`)
```

---


## CKB 中有哪些特殊的可用 cells（live cells） 吗？

在测试网的确有部署一些特殊的 live cells。

**duktape VM (JavaScript) cell**

该 VM cell 是通过[这笔交易](https://explorer.nervos.org/aggron/transaction/0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036)进行部署的，输出索引为`0`。

我们应该将 `out_point` 放置在 `cell_deps` 中，如下：

``` javascript
{
  "out_point": {
    "tx_hash": "0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036",
    "index": "0x0"
  },
  "dep_type": "code"
}
```
你的 `type script` 可以如下使用这个 VM：
``` javascript
{
  "code_hash": "0xfb8e791d70c4622ae0bd0127ee9597aea612e42929e725f7f3f25475bb954ce9",
  "hash_type": "data",
  "args": "0x<your javascript code in hex>",
}
```
这是一个使用 duktape VM 的[示例交易](https://explorer.nervos.org/aggron/transaction/0xbbe58d19e6177ea16336e566c6cdbb91cb6ad74e0f76ccb17d980e5702e4615a) 。如果在 `ckb.toml` 文件中你的日志设置为：`filter = "info,ckb-script=debug"` ，你便会看到如下日志：

```
DEBUG ckb-script  script group: Byte32(0xafe527276275a4a25defee32ed59ecebf4813256866a7577431e5293acd2048b) DEBUG OUTPUT: I'm running in JS!
```

如果你想要自行部署 duktape VM cell，请参考[这篇文章](https://xuejie.space/2019_07_13_introduction_to_ckb_script_programming_script_basics/#introducing-duktape)。

**mruby VM (Ruby)cell**

该 VM cell 是通过[这笔交易](https://explorer.nervos.org/aggron/transaction/0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a)进行部署的，输出索引为`0`。

我们应该将 `out_point` 放置在 `cell_deps` 中，如下：

``` javascript
{
  "out_point": {
    "tx_hash": "0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a",
    "index": "0x0"
  },
  "dep_type": "code"
}
```
你的 `type script` 可以如下使用这个 VM：
``` javascript
{
  "code_hash": "0xc3815b09286d825574f672bf4e04566ae6daaf1b45f3f1bcfd20c720198652ec",
  "hash_type": "data",
  "args": "0x<your ruby code in hex>",
}
```

如果你想要自行部署 duktape VM cell，你可以按照以下说明：

* 步骤一：编译 mruby 二进制包；
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

* 步骤二：通过创建一个带有二进制数据的 Cell 来部署二进制包：
```
$ ckb-cli wallet transfer --from-account <from-account> --to-address <to-address> --capacity 462000 --to-data-path build/entry --tx-fee 0.01
0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a
```

* 步骤三：查询二进制包的数据哈希；
```
$ ckb-cli rpc get_live_cell --tx-hash 0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a --index 0 --with-data
```

---


## 如何预估 CKB 的时间戳？

在 CKB 中，基于链的确定性状态，没有办法知道一个交易会被打包到哪个区块，也没有办法得到准确的时间，所以我们可以这样估算时间戳。

```
median of previous 37 block timpstamp < timestamp <= local_time + 15s
```

---


## 在 [Nervos DAO](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md) 中，有什么问题需要注意的吗？

由于 CKB 独特的灵活性，它也有一些需要注意的小问题。否则可能会有永远锁定你的 cell 而无法解锁的风险。在这里，我们尽量把我们知道的小问题记录下来。

* Nervos DAO 取回资金时，只支持绝对 epoch 数作为 since 值。因此，如果你使用的是支持锁定周期的锁，比如系统中包含的[多重签名脚本](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_multisig_all.c)，请务必只使用绝对 epoch 数作为锁定周期。否则被锁定的 Nervos DAO cell无法被花费。
* CKB 对引用头有一个成熟度的限制：cell 想要引用一个区块头，必须等这个区块头至少过了 4 个 epoch。这意味着在使用头文件的情况下，4 个 epoch 的限制也适用。例如，Nervos DAO 在以下地方受到限制。
   + 资金存入 4 个 epochs 时间后，才能提交阶段 1 取款交易。
   + 只有阶段 1 交易提交 4 个 epochs 时间后，阶段 2 交易才能提交。

