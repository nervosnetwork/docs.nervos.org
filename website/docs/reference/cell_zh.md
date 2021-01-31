---
id: cell_zh
title: Cell 模型
---

Nervos CKB (Common Knowledge Base，共同知识库) 是一个去中心化的、安全的 layer 1 区块链网络，托管维护着网络的共同知识（Common Knowledge）。这里的共同知识指的是已经具备全球共识的状态数据。 

**Cells 是 CKB 中的主要状态单元**，也是用户所拥有的资产。它们必须遵循脚本指定的验证规则。在比特币网络中，账本中记录的是比特币的余额。而在 Nervos CKB 网络中，我们更进一步，除了存储 CKB 余额数据，还可以存储其他任意的资产状态数据。我们采用了类似比特币网络的 PoW 共识架构，在保留比特币协议的一致性与简单性的同时，将 UTXO 模型进行泛化，创造了 [Cell 模型](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571) 。

## 数据结构

**例子:**

```
{
  "capacity": "0x19995d0ccf",
  "lock": {
    "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
    "args": "0x0a486fb8f6fe60f76f001d6372da41be91172259",
    "hash_type": "type"
  },
  "type": null
}
```

Cell 的数据结构中有三个字段：

* `容量 capacity`: Capacity 字段起到两个作用：第一，它代表着当前 Cell 中所存储的 CKB 代币数量；第二，它同时也对应着当前 Cell 所能存储的信息容量的上线。容量的最小单位是 `shannon`，不过我们常用的单位是 CKByte，通常我们简写为 CKB。 1 CKB 等于 `10**8` shannons，1 CKB 也意味着 Cell 能够存储 1 字节的状态数据。有关如何计算 Cell 的总信息量大小，请参见下文。
* `锁脚本（lock script）`:  `锁脚本（lock script） ` 脚本用于保护 Cell：当指定的 Cell 在交易中被作为输入 Cell 使用时，Cell 中的 `锁脚本（lock script）` 脚本就会执行。若 `锁脚本（lock script）` 脚本在执行失败了，那么交易将被拒绝。`锁脚本（lock script）` 的一个经典使用场景是代表着 Cell 的所有权，也就是说签名验证阶段通常包含在 Cell 中。
* `类型脚本（type script）`：类型脚本（type script）`脚本用于验证 Cell 结构。不管在交易中是作为输入 Cell 还是输出 Cell，Cell 中的 `类型脚本（type script）` 脚本都会执行。由于这一特性，`类型脚本（type script）` 通常被用于验证应用逻辑，例如创建 UDTs。

每个 Cell 都必须有 `锁脚本（lock script）` 脚本，但是 `类型脚本（type script）` 脚本是可选的，可以忽略。 请参考[脚本](script_zh.md)章节深入了解这两种脚本的实际格式。

### Cell 数据

除了以上的字段，Cell 还包含一个数据字段。Cell 数据是只是一系列未格式化的二进制数据。具体取决于实际的 dapp，任何数据都可以存储到 Cell 的数据字段中：

* 脚本代码， [脚本](script_zh.md) 章节会详细讲解。
* UDTs 的代币数量。
* 具体应用的相关数据统计。

为了未来的开发潜力，Cell 数据没有直接存储在 Cell 中，数据直接保存在交易的数据结构中。在每笔交易中，你可以发现有一个名为 `outputs_data` 的字段。该字段数组的长度应该与 `outputs` 的长度相同。在每处索引位置，都可以为交易中的输出 Cell 定位到对应的 Cell 数据。但从概念上讲，我们仍然将 Cell 数据视为输出 Cell 的一部分。   

### Cell 数据大小计算

Nervos CKB 上的每一个 Cell，其容量不得低于该 Cell 中存储的信息总大小。Cell 的数据大小可由以下字段的总和得出：

1. Cell 的 `capacity` 字段占用 8 字节；
2. `锁脚本（lock script）` 脚本中的 code hash 占用 32 字节；
3. `锁脚本（lock script）` 脚本中的 hash type 占用 1 字节；
4. `锁脚本（lock script）` 脚本中 `args` 字段的实际占用大小；
5. 如果存在 `类型脚本（type script） `，则其 code hash 占用 32 字节；
6. 如果存在 `类型脚本（type script） `，则其 hash type 占用 1 字节；
7. 如果存在 `类型脚本（type script） `，则需要算上 `args ` 字段的实际占用大小；
8. Cell 数据的实际占用大小；

通过汇总以上所有字段的字节占用大小，我们便可以获得 Cell 存储所有数据所需的容量大小。Cell 的 `capacity`代表着其可以存储的最大数据容量，也就意味着一个有效的 Cell 必须确保其容量大于等于总数据大小。

## 可用 cell（live cell）

`可用 cell（live cell）`指的是 CKB 中未花费的 Cell，与比特币的 [UTXO](https://en.wikipedia.org/wiki/Unspent_transaction_output) 概念相似。CKB 上的完整 `可用 cell（live cell）`集合就是 CKB 上对应时间点的完整状态。CKB 上的所有交易都会在交易被提交前消耗掉一些 `可用 cell（live cell） `，然后在交易提交后生成一些新的 `可用 cell（live cell）`。

##  ’索引-查询-组装‘ 模式

Nervos CKB 是基于 Cell 概念展开设计的。一笔交易，本质上就只是消耗一些 Cells，然后生成一组新的 Cells。因此，在构建任何 CKB dApp 时，定位和转化 Cell 就变得尤为重要，`索引-查询-组装（index-query-assemble） ` 模式也因此油然而生。 

* 索引（Index）：当有新区块提交到 CKB 时，dApp 应该能够将相关的 Cells 索引到自己的存储中以供后续使用。
* 查询（Query）：当请求用户操作时，从 dApp 自身的存储中查询满足特定条件的 Cells。
* 组装（Assemble）：基于查询所得的 Cells，将组装一个新的交易来满足用户请求。

我们相信，按照这种模式，所有 CKB dApp 都可以拆分为单独的操作。例如：

* 在普通的 CKB 钱包中，应该基于 `锁脚本（lock script）s` 对 Cells 进行索引。一个转账操作首先应该查询发送者的 Cells，然后组装一个转 CKBytes 给接受者的交易。

* NervosDAO 管理器可能只需索引与 NervosDAO 相关的 Cells。然后用户可能会选择一个 NervosDAO 的 Cell 来执行赎回操作。即使只有一个相关的 Cell，我们依旧可以将其视为从 NervosDAO 管理器中查询来的 Cell 集合，然后组装一笔交易执行实际的赎回操作。
* 一款基于状态的 dApp 可能会选择在一个 CKB Cell 中存储最新的状态。dApp 将需要跟踪最新的`可用 cell（live cell）`，这一步其实就等同于索引操作；然后，对状态的任何操作都会触发查询最新的`可用 cell（live cell）`，组装成一笔交易并提交到 CKB，交易提交完成后，生成包含已更新状态的输出 Cells。

### 工具

索引 & 查询功能在任何 CKB dApp 中都扮演着核心角色。在大多数情况下，你不必从头开始构建一个索引器。目前有几个现成的工具可以用来完成该功能：

#### lumos

我们的 dApp 框架 [lumos](https://github.com/nervosnetwork/lumos) 已经包含了一个现成的索引器。当你使用 lumos 时，索引器很可能已经安装完毕可以使用了。请参与我们的开发实验室章节了解如何安装 lumos。

#### ckb-indexer

[ckb-indexer](https://github.com/quake/ckb-indexer) 也可以用于处理索引 Cells 的任务，它提供了 RPC 机制，可用于查询相关 Cells。请参阅 ckb-indexer 文档以获取更多详细信息。

#### perkins-tent

如果你正在寻找一站式解决方案， [Perkins' Tent](https://github.com/xxuejie/perkins-tent) 提供了一个 docker 镜像，该镜像在一个 docker 实例中同时启动了 CKB 和 ckb-indexer。使用单条命令，你就可以启动 CKB 实例，并且使用内置的 ckb-indexer 来查询任务。