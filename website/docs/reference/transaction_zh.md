---
id: transaction_zh
title: 交易
---

通常，我们是通过交易的方式与 Nervos CKB 进行交互。在 layer 1，我们专注于状态， CKB 作为 layer 1 区块链网络，其设计上也重点强调状态。在 CKB 上，交易是触发状态改变的唯一方式。

CKB 上状态的改变其实是一笔交易销毁此前交易生成的 Cells，然后生成新的 Cells 的过程。状态其实就是 CKB 上一系列 `可用 cell（live Cell）` 的集合（包含每个 Cell 中的数据）。交易是原子性的，要么被接收，要么被拒绝。不存在有部分交易内容没提交到 Nervos CKB 的情况。

由于 CKB 的上述特性，状态改变通常是在 Nervos CKB 之外进行计算的，然后计算得出的状态结果会被组装到交易中，随后由 Nervos CKB 提交，验证并最终接受该交易，然后将其广播到整个网络。

## 数据结构

**例子：**

```
{
  "cell_deps": [
    {
      "dep_type": "dep_group",
      "out_point": {
        "index": "0x0",
        "tx_hash": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37"
      }
    },
    {
      "dep_type": "code",
      "out_point": {
        "index": "0x0",
        "tx_hash": "0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958"
      }
    }
  ],
  "hash": "0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200",
  "header_deps": [],
  "inputs": [
    {
      "previous_output": {
        "index": "0x0",
        "tx_hash": "0x6e64c2a3f248da5115c49ef8100b3a29c4f665517626a513b340821ba8b95f80"
      },
      "since": "0x0"
    }
  ],
  "outputs": [
    {
      "capacity": "0x34e62ce00",
      "lock": {
        "args": "0x927f3e74dceb87c81ba65a19da4f098b4de75a0d",
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hash_type": "type"
      },
      "type": {
        "args": "0x6e9b17739760ffc617017f157ed40641f7aa51b2af9ee017b35a0b35a1e2297b",
        "code_hash": "0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212",
        "hash_type": "data"
      }
    },
    {
      "capacity": "0x711befb618",
      "lock": {
        "args": "0x927f3e74dceb87c81ba65a19da4f098b4de75a0d",
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hash_type": "type"
      },
      "type": null
    }
  ],
  "outputs_data": [
    "0x40420f00000000000000000000000000",
    "0x"
  ],
  "version": "0x0",
  "witnesses": [
    "0x55000000100000005500000055000000410000007926ec98874bb86143d178826253e18425e50bf85fbb4b7cf9188462e7e87bc810ac602e55b9c73890ab8306368d7d02d96234f250750269e1aa023eb5b71b5100"
  ]
}
```

以下两份 RFCs 对交易的结构进行了详细的介绍：

* [数据结构](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0019-data-structures/0019-data-structures.zh.md)
* [交易结构](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md)
