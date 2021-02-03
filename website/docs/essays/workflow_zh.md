---
id: rules
title: 构造交易的一般工作流程
---

本文档将解释如何以最简单、最常见的方式在 CKB 上构造一个可验证的交易。它不涉及构造验证脚本、合约等。

在 CKB 上，任何交易都必须有至少一个输入和一个输出。要构造一笔交易，首先需要的是能够有效定位输入，这个过程被称为 "cell 收集"。

## Cell 收集

首先要了解的是，CKB 的 [cell 模型](https://docs.nervos.org/basic-concepts/cell-model.html)与 UTXO 模型非常相似，这意味着在没有任何预缓存的情况下，不可能知道任何地址的当前状态。构成地址当前状态的信息可能分散在区块链上的不同 cells 中，cell 收集方法是正确使用 CKB 的前提。CKB 的 cell 模型将在 [Cell](reference/cell_zh.md) 中详细介绍。

当前有两种方式可用于收集 cell：

### 使用 ckb 索引器服务

本节介绍一种简单的方法，可以识别指定地址的有限信息（如 live cell 数、交易数、总容量）。但是，这种方法是基于 CKB 节点的索引功能，只适合简单的使用（也会消耗CKB节点的资源）。

这种方法也不能根据更详细的搜索条件进行 cell 收集。例如，用这种方法无法找到合约 cell。

我们先不管这些缺陷，先用这个方法来帮助我们理解 cell 收集的工作原理。默认情况下，这个功能在 CKB 节点中是关闭的。要打开它，请按照下面的说明手动更改配置文件，然后重新启动 CKB 节点。

在 `ckb.toml` 文件中找到下面配置项：

```
[rpc]
...
# List of API modules: ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Indexer", "Experiment"]
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment"]

```

上面示例的配置中，索引服务是没有开启的，我们将 “indexer” 加入数组中以开启索引服务。

```
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment", "Indexer"]

```

使用 `ckb run -C <path>` 命令重启 CKB 节点后，通过RPC方法 [index_lock_hash](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md#index_lock_hash) 注册你要索引的地址。

*需要注意的是，`index_from` 参数控制了索引的起始点：空值从当前链尾（最新的区块）开始索引，而值为 0 的则从创世区块开始索引。*

等待索引服务重编译，然后使用索引服务的 RPC 接口查看对应地址的可用 cell/交易/容量值。可以参考 [JSON-RPC](reference/rpc.md)。

要关闭索引服务，请按照以下流程进行：通过 RPC 取消注册观察列表，关闭服务，并从`ckb.toml` 文件中的数组中删除 "Indexer"。

### 打造你自己的 Cell 收集服务 

**打造你自己的 Cell 收集服务有何优势？**

我们都知道，一笔交易包括 cell 的创建和销毁。然而，由于 cell 模型的灵活性，任何有用的数据都可以存储在 cell 数据字段中，各种类型的合约都可以通过类型脚本（type scripts）来表达。因此，每个用户或用例可能对 cell 收集有不同的要求。

有很多问题需要探讨，每个问题的背景不同，答案也不同。

* 消耗的顺序是怎样的？先进先出，根据大小排序，最佳适配原则等？
* 能消耗什么类型的 cell？是只能特定的类型还是任意类型都行？ 
* 有没有什么 cell 数据或者 cell 类型需要特殊进行处理的？
* 选定 cells 后是否需要进行过滤/确认？

CKB 节点自带的索引服务并不能满足这些要求，也不能配置成包含未来可能需要的额外要求。cell 收集最有效的方法是自行构建服务。

**如何构建 Cell 收集服务**

当一个新的区块被添加到链中时，作为区块输入的 cells 必须从可用 cells（live cells）集合中移除，而由区块创建的输出必须添加到可用 cells（live cells）集合中。

我们知道，在 PoW 链中，小段分叉的情况是存在的。当一个分叉推翻了之前接受的区块的状态变更，该区块的输入和输出变更必须回滚。缓存设计可能有助于加快同步速度，例如，缓存链中最后 n 个区块，并删除这些区块中消耗的可用 cells（live cells）。


## 构造一笔交易

现在我们已经介绍了 cell 的收集，我们可以开始构造交易。有一系列的概念需要解释，包括见证（witnesses）的构造、交易费用的计算和一些小技巧的使用。更详细的信息请参考[RFC0022：交易结构](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md)。

所有的类型都是通过 [molecule](https://github.com/nervosnetwork/molecule) 序列化系统进行序列化的，核心结构如下：

```
table RawTransaction {
  version:        Uint32,
  cell_deps:      CellDepVec,
  header_deps:    Byte32Vec,
  inputs:         CellInputVec,
  outputs:        CellOutputVec,
  outputs_data:   BytesVec,
}

table Transaction {
  raw:            RawTransaction,
  witnesses:      BytesVec,
}
```

`cell_deps` 和 `inputs` 指向链上一系列可用 cells（live cells）的指针。区别是 `cell_deps` 是一种只读的 cell 引用，`inputs` 引用的 cells 则会在该交易中消耗：

```
struct OutPoint {
  tx_hash:        Byte32,
  index:          Uint32,
}

struct CellDep {
  out_point:      OutPoint,
  dep_type:       byte,
}
```

`tx_hash` 和 `index` 用于定位 cells（分别对创建 cell 的交易的一个引用，以及 cell 对应在输出中的索引位置）。`cell_dep` 还有一个额外的字段 `dep_type` ，用于表明 cell 中的数据是 `code` 还是 `dep_group`。存储在多个 cells 中的代码可以使用  `dep_group` 功能进行组合。

对于 `dep_type`：

* 值为 0 表示是 `code` ，表示 cell 数据能够直接使用。
* 值为 1 表示是 `dep group` ，表示 cell 中的数据是一个重定向字段（此处不允许递归）。引用的 `dep group` 数据使用  `vector OutPointVec <OutPoint>`  来列出所有需要的 OutPoint。

`dep_group` 的使用实例：默认锁 cell 使用 `dep group` 功能，将 secp256k1 库分成两个 cell 来存储乘法表和代码。之所以需要这样做，是因为区块大小有限，如果总的dep 数据太大，无法放在一个区块中，可以将其存储在多个 cell 中（分别在不同的事务中添加，在不同的区块中确认），之后可以在运行时通过 `dep_group` 功能一起加载。

`outputs` 和 `outputs_data` 是两个一对一的列表。 `output` 只有容量（capacity ）和类型/锁（type/lock）脚本。输出数据放在与索引对应的 `outputs_data` 中。

`header_dep` 是过去区块头哈希的列表。CKB 脚本在执行过程中可以访问这个列表中引用的头数据。

现在已经解释了交易结构的基本原理，让我们来探讨一个稍微复杂的结构。

### 脚本

```
table Script {
  code_hash:      Byte32,
  hash_type:      byte,
  args:           Bytes,
}
```

`code_hash` and `hash_type` are used to specify a lock cell, `args` are the parameters required by the lock script. The `hash_type` field has two possible values:

`code_hash` 和 `hash_type` 用于指定锁 cell，args 是锁脚本（lock script）所需的参数。`hash_type` 字段有两个可能的值：

* 为 0 时， `code_hash ` 表示锁 cell 的数据哈希。
* 为 1 时， `code_hash ` 表示锁 cell 的类型脚本（type script）。

当 `hash_type` 的值为代码（即 0）时，很容易理解会发生什么，但为类型（即 1） 时呢，这对合约开发者来说意味着什么？

当值为类型时，指定的值是 cell 类型脚本哈希。CKB 的默认锁脚本是以类型为索引的。事务中的 dep cells 将被检查是否有一个 cell 以这个值作为其类型脚本，该 cell 中的数据将被用作类型脚本执行的代码。

为了了解如何使用这个功能，我们可以看看 TypeID 的实现，它是用来通过引用来引用一个 cell 的。你可以看到，创世区块的第二个输出的类型脚本是一个 TypeID 脚本。如果你发布的库也绑定了这个 TypeID 脚本，就会生成一个唯一的id（代码哈希，code hash），用于索引数据。然后，你可以在不改变 typeid 的情况下更新这个库的内容。任何引用这个库（通过唯一的 type 脚本值）的合约，即使库被改变，也仍然可以使用。这是一个更新链上库的解决方案。

### 见证（witness）

现在所有的 `RawTransaction` 字段都已经设置好了，我们来看看见证（witnesses）字段。这个字段确保交易不能篡改其他交易，这个字段还允许包含合约可能需要的临时变量。它由一系列的见证（witnesses）组成：

```
table WitnessArgs {
  lock:                   BytesOpt,          // Lock args
  input_type:             BytesOpt,          // Type args for input
  output_type:            BytesOpt,          // Type args for output
}
```

一个输入需要一个见证（witnesses）来验证。然而，如果多个输入使用相同的锁脚本（lock script），那么为每个输入加入一个见证（witnesses）将是低效的。当对每个单独的交易进行验证时，脚本将首先被分成若干组（具有相同脚本哈希值的交易将被分组），然后以脚本组为单位依次执行。

这相当于将多个脚本验证合并为一个执行，减少了资源消耗和见证（witness）数据的大小。但这确实需要开发者在编写脚本时注意，应该考虑到用这种方式验证多个 cells 的情况。

见证（witness）是对整个交易的 blake2b-hash 的签名，包括 `tx_hash`，长度，以及一个清零的见证数据占位符（一旦签名生成，它将被放在这个字段中）。具体的签名过程以及不同脚本组的见证数据如何排列的约定可以在这个 [wiki](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction) 中找到。

### 格式和手续费

通过上述过程，我们已经获得了一个完整的交易结构。此时，为了得出矿工所能接受的绝对最低费用，我们需要做一些回测（根据实际消耗的周期）以及修改现有的交易。

### 如何预估交易手续费？

交易手续费是序列化交易的大小（molecule）和执行指令实际消耗的计算资源（cycles）之和。大小单位默认为1,000 shannons / KB（ shannons 是 CKByte 的1/100,000,000）。

不过，矿工可以修改这个默认单位。如果你需要查看实时交易费用估算，可以通过RPC使用 `estimate_fee_rate` 查看。

如果你想用最低的费用，你可以不断调整交易的输入容量（input capacity）和输出容量（input capacity）之间的差距，并重新生成交易，直到你满意为止（使用二分法搜索）。