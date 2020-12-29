---
id: lumos-nervosdao_zh
title: 通过 NervosDAO 示例入门 Lumos
---

在真实环境中，普通用户几乎没有不与区块链网络直接交互。基于区块链之上的 dApp、网站以及其他服务会提供一个无缝衔接的服务，在 CKB 上也同样如此。我们打造了 [lumos](https://github.com/nervosnetwork/lumos)，一个辅助在 CKB 上开发 dApp 的 JavaScript/TypeScript 框架。Lumos 可以让你从与 CKB 底层的繁琐交互中解脱出来，专注于完善 dApp 的具体业务逻辑。

在本教程中，我们会通过一个真实案例 [Nervos DAO](https://github.com/mazhuping/docs/blob/master/docs/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.zh.md) 给你介绍 Lumos。虽然 Nervos DAO 在 CKB 上很有价值，但对于许多 dApp 来说，整合起来非常麻烦。在这里，我们将演示如何使用 Lumos 来简化Nervos DAO 的集成。

## 组件

Lumos 作为一个框架，通常会以一种内部调用的方式进行使用，例如：当你首次启动程序时需要某些设置代码；出于记录目的，全局状态可能需要保存在你的应用程序内存中。不过，lumos 也分为多个组件，某些组件可以以非内部的无状态方式进行使用。通常，lumos 由以下组件组成：

* [索引器 indexer](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/indexer)：CKB Cell indexer 实现了[索引-查询-组装](../reference/cell_zh#索引-查询-组装 模式)模式。目前该包只包含支持 RockDB 的索引器， [这个包](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/sql-indexer)包含使用相同接口的支持 SQL 的索引器。未来，考虑到一致性，我们可能会把这两个包合并为一个包。 
* [基础包 base](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/base)：这是一个包含最常用的通用类型和工具的包。如果你需要完善一个特定的 CKB 任务，可以先在这个包中找找是否有现成实现。
* [辅助包 helpers](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/helpers)：包含更多的工具，其跟 `base` 组件的不同是：`base` 组件包含的是纯碎的无状态函数，而 `helper` 更多地是以一种内部形式运行，需要预装 `config-manager` （下文会提及）。
* [常用脚本 common-scripts](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/common-scripts)：CKB 上已知脚本的集成。虽然我们竭尽所能提供热门 CKB 脚本的集成，但也不可能永远能够及时集成社区所有优秀脚本。因此，我们也设计了一套 APIs，开发者可以自由地将他们自己的脚本集成到 lumos 以供所有人使用。集成后，`common-scripts` 也可以利用这些新的脚本了。
* [配置管理器 config-manager](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/config-manager)：一个处理不同链之间差异的管理器，例如主网、测试网以及其他开发链之间的差异。我们将每条链抽象成单独的配置文件。该组件加载完成后，便可以处理链的具体逻辑，无需你在自己的代码进行处理。
* [交易管理器 transaction-manager](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/transaction-manager)：CKB 的交易管理器。基于 UTXO 的区块链有一个问题，就是一笔交易被区块链接受，到它实际被提交到链上，之间存在一定的时间间隔。在此期间，由 pending 状态的交易新建的 Cells 是无效的。交易管理器负责处理这个问题。它封装了一个索引器实例，确保 pending 状态的交易创建的 Cells 也被暴露出来并用于组装新的交易。 这意味着你不再受制于每次只能发送一次交易，你可以根据自己的意愿自由发送系列交易。

## 初始化 CKB 安装

To ease the whole process so we don't have to wait too long to see the results, let's setup our own dev chain with [tweaks](basics/guides/devchain_zh#调整参数以缩短出块间隔（可选）):

为了方便整个过程，让我们不用等太久就能看到结果，我们可以[微调](basics/guides/devchain_zh#调整参数以缩短出块间隔（可选）)自己的开发链设置：

```bash
$ export TOP=$(pwd)
# I'm testing this on a Linux machine, if you use other platforms, please adjust
# this accordingly.
$ curl -LO https://github.com/nervosnetwork/ckb/releases/download/v0.33.0/ckb_v0.33.0_x86_64-unknown-linux-gnu.tar.gz
$ tar xzf ckb_v0.33.0_x86_64-unknown-linux-gnu.tar.gz
$ export PATH=$PATH:$TOP/ckb_v0.33.0_x86_64-unknown-linux-gnu
$ ckb -V
ckb 0.33.0
$ ckb init -C devnet -c dev
$ ed devnet/specs/dev.toml <<EOF
91d
90a
genesis_epoch_length = 10
permanent_difficulty_in_dummy = true
.
wq
EOF
$ ed devnet/ckb-miner.toml <<EOF
39s/5000/1000/
wq
EOF
$ ed devnet/ckb.toml <<EOF
143a
[block_assembler]
code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
# private key: 0x29159d8bb4b27704b168fc7fae70ffebf82164ce432b3f6b4c904a116a969f19
args = "0xcbfbb9edb5838e2d61061c3fc69eaaa5fdbd3273"
hash_type = "type"
message = "0x"
.
wq
EOF
$ ckb run -C devnet
```

这里我们做如下配置：

* 创建一条开发链；
* 修改配置以跳过难度调整，将所有 epoch 设置为包含 10 个区块；
* 修改矿工配置，设置每秒生成一个新区块；
* 使用特定的私钥作为矿工的使用钱包，请不要将此私钥用于其他地方；
* 启动一个开发链节点；

在另一个终端中，我们启动 CKB 矿工程序：

```bash
$ export TOP=$(pwd)
$ export PATH=$PATH:$TOP/ckb_v0.33.0_x86_64-unknown-linux-gnu
$ ckb miner -C devnet
```

## Node 脚手架

现在 CKB 已经准备好了，我们可以创建用于运行我们 JS 代码的 Node 脚手架：

```bash
$ mkdir nervosdao-skeleton
$ cd nervosdao-skeleton
$ yarn init
$ yarn add @ckb-lumos/indexer@0.4.3 @ckb-lumos/common-scripts@0.4.3
```

在本教程中，我们将从启用了 async/await 的 Node shell 中运行需要的操作：

```bash
$ node --experimental-repl-await
Welcome to Node.js v12.16.2.
Type ".help" for more information.
>
```

这只是处于演示目的。你也可以把同样的代码复制到一个文件中，然后由 node 执行。

## 设置配置管理器

使用 lumos 的第一步，就是设置配置管理器。即使 CKB 有统一的编程模型，但对于不同的链实例，如主网、测试网或开发链，仍然需要不同的配置。配置管理器允许节点应用以特定的链配置启动，所以 lumos 中的其他部分可以直接向配置管理器获取信息。

如果你使用的是众所周知的链配置，你可以使用 `LUMOS_CONFIG_NAME` 环境变量来设置配置管理器。

```
$ LUMOS_CONFIG_NAME=LINA node --experimental-repl-await
Welcome to Node.js v12.16.2.
Type ".help" for more information.
> const { initializeConfig, getConfig } = require("@ckb-lumos/config-manager");
> initializeConfig();
> getConfig();
{
  PREFIX: 'ckb',
  SCRIPTS: {
    SECP256K1_BLAKE160: {
      CODE_HASH: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      HASH_TYPE: 'type',
      TX_HASH: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
      INDEX: '0x0',
      DEP_TYPE: 'dep_group',
      SHORT_ID: 0
    },
    SECP256K1_BLAKE160_MULTISIG: {
      CODE_HASH: '0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8',
      HASH_TYPE: 'type',
      TX_HASH: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
      INDEX: '0x1',
      DEP_TYPE: 'dep_group',
      SHORT_ID: 1
    },
    DAO: {
      CODE_HASH: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
      HASH_TYPE: 'type',
      TX_HASH: '0xe2fb199810d49a4d8beec56718ba2593b665db9d52299a0f9e6e75416d73ff5c',
      INDEX: '0x2',
      DEP_TYPE: 'code'
    }
  }
}
```

已支持的众所周知的配置包括：

- `LINA`：主网配置;

* `AGGRON4`：当前测试网配置。注意：在未来某个时刻，我们可能会重置测试网，届时 lumos 可能也会更新对应为新的测试网配置。

然而也存在一些情况你不使用预定义的配置。例如，本教程使用的开发链就没有使用预定义的配置。Lumos 也支持通过本地配置文件设置配置管理器。你可以使用 `LUMOS_CONFIG_FILE` 环境变量指向配置文件路径。如果没有设置有效配置，lumos 会尝试从当前目录的 `config.json` 文件中读取配置。

```
$ cat <<EOF > config.json
{
  "PREFIX": "ckt",
  "SCRIPTS": {
    "SECP256K1_BLAKE160": {
      "CODE_HASH": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      "HASH_TYPE": "type",
      "TX_HASH": "0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708",
      "INDEX": "0x0",
      "DEP_TYPE": "dep_group",
      "SHORT_ID": 0
    },
    "SECP256K1_BLAKE160_MULTISIG": {
      "CODE_HASH": "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8",
      "HASH_TYPE": "type",
      "TX_HASH": "0xace5ea83c478bb866edf122ff862085789158f5cbff155b7bb5f13058555b708",
      "INDEX": "0x1",
      "DEP_TYPE": "dep_group",
      "SHORT_ID": 1
    },
    "DAO": {
      "CODE_HASH": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
      "HASH_TYPE": "type",
      "TX_HASH": "0xa563884b3686078ec7e7677a5f86449b15cf2693f3c1241766c6996f206cc541",
      "INDEX": "0x2",
      "DEP_TYPE": "code"
    }
  }
}
EOF
$ LUMOS_CONFIG_FILE="config.json" node --experimental-repl-await
Welcome to Node.js v12.16.2.
Type ".help" for more information.
> const { initializeConfig, getConfig } = require("@ckb-lumos/config-manager");
> initializeConfig();
```

现在配置管理器已经成功设置，我们可以继续下一步。

## 启动索引器

Lumos 基于[索引-查询-组装](../reference/cell_zh#索引-查询-组装 模式)模式，也就意味着 dApp 应该有具备一个索引器以更易于查询的格式保持对新区块的索引。也就是说任何用 lumos 构建的 dApp，都应该配置一个索引器并保持永久运行。

```
> const { Indexer } = require("@ckb-lumos/indexer");
> const indexer = new Indexer("http://127.0.0.1:8114", "./indexed-data");
> indexer.startForever();
```

这里为了简单起见，我们使用的是支持 RocksDB 的索引器。Lumos 提供了 2 种索引器类型。

* 支持 RocksDB 的索引器
* 支持 SQL 的索引器，当前支持的 SQL 数据库有：MySQL 和 PostgreSQL。

如果你想要使用 SQL 索引器进行测试，可能需要对上述设置代码进行一些修改。

你可以使用以下代码片段来检查当前的索引 tip（indexer tip）：

```
> await indexer.tip()
{
  block_number: "0x29c",
  block_hash: "0x3e44b571c82a09117231baee1939d38440d71f56de8bc600ac32b1dead9be46d"
}
```

请等待一段时间，直到 lumos 同步至当前链的 tip。对于开发链来说，这应该不会花费太多时间。

## 存款

要想 Nervos DAO 中存款，我们需要先创建一笔存款交易。你可以手动创建交易，但 lumos 已经内置了简化交易创建的方案。我们看看 `交易脚手架 TransactionSkeleton` ，了解在 lumos 中它的工作原理。

### 交易脚手架

CKB 为 dApp 开发者提供了极大的灵活性进行应用开发，不过 “能力越大，责任也越大”，一个灵活的编程模型也会大大复杂化交易的组装。其中包括但不限于以下这些难题：

* 交易输入中的不同脚本要求消息生成分离以及签名步骤分离。
* 由于 `type script` 的验证规则，部分 Cells 可能需要在见证（witness）中设置特殊的参数。
* 因为 Cell 中的 `lock script` 和 `type script` 都可能需要同一见证结构中的参数，所以可能需要协调。



Those problems will haunt you even when you are dealing with a single NervosDAO transaction. It is only gonna get more complicated, when we consider multiple cells containing different CKB scripts composed together. Looking into the future, we will definitely need a solution to this issue.

`TransactionSkeleton` is the answer we propose in lumos. Each transaction skeleton corresponds to an action, and will be built into a single transaction that is ready to be submitted to CKB. Surrounding the idea of TransactionSkeleton, a series of conveniences are provided to aid transaction assembling:

* A well designed component should automatically query and include cells to provide capacities required by the transaction.
* Individual script logic should be managed and respected by the general transaction skeleton.
* Scripts sharing the same behavior should be managed together in a unified interface. Developers can rely on abstractions instead of catering for every single detail.

This still sounds quite complicated, let's walkthrough an example to see how we can leverage TransactionSkeleton.

```
> // In practice, you might already have the address at your hand, here we just
> // want to demonstrate how this works.
> const script = {
  code_hash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  hash_type: "type",
  args: "0xcbfbb9edb5838e2d61061c3fc69eaaa5fdbd3273"
};
> const {generateAddress, parseAddress, createTransactionFromSkeleton,
  sealTransaction, TransactionSkeleton } = require("@ckb-lumos/helpers");
> const address = generateAddress(script);

> // Now let's create the actual skeleton, and deposit CKBytes into the skeleton
> let skeleton = TransactionSkeleton({ cellProvider: indexer });
> const { secp256k1Blake160, dao } = require("@ckb-lumos/common-scripts");

> // Using utility provided in common-scripts, let's deposit 1000 CKBytes into
> // the skeleton. We will introduce common-scripts separately below. Here we are
> // using the same address as from and to, but this does not have to be the case
> // everywhere.
> skeleton = await dao.deposit(skeleton, address, address, 100000000000n);

> // createTransactionFromSkeleton is designed to build a final transaction, but
> // there is nothing stopping you from using it to peek into the current skeleton.
> console.log(JSON.stringify(createTransactionFromSkeleton(skeleton), null, 2));

> // But this transaction is not yet complete, we still need 2 parts:
> // * Transaction fee is not taken into consideration
> // * The transaction is not signed yet
> // Let's take a look at them separately.

> // First, since we are using the default secp256k1-blake160 lock script, an
> // existing module in common-scripts can be leveraged to incur transaction
> // fee. Here we are using the same address to provide 1 CKByte as transaction
> // fee.
> skeleton = await secp256k1Blake160.payFee(skeleton, address, 100000000n);

> // If you checked the transaction skeleton after incurring fees. You will
> // notice that it only has one input. This might raise a question: if NervoDAO
> // deposit consumes one input cell, transaction fee requires a different input
> // cell, shouldn't there be 2 input cells with 3 output cells(a deposited cell,
> // and 2 change cell)? The trick here, is that common-scripts is smart enough
> // to figure out that the 2 actions here use the same address. Hence it just
> // rewrite the change cell generated in the NervosDAO deposit action to pay
> // enough transaction fee.
> createTransactionFromSkeleton(skeleton).inputs.length;
1

> // Now the transaction is more or less complete, we can start generate messages
> // used for signing.
> skeleton = secp256k1Blake160.prepareSigningEntries(skeleton);
> // This method actually loops through the skeleton, and create `signingEntries`
> // that are using the default secp256k1-blake160 lock script:
> skeleton.get("signingEntries").toArray();
[
  {
    type: 'witness_args_lock',
    index: 0,
    message: '0x40811fd6ed74b9042f603dc7f2f577da7ebe0e05175d349dbb5c539b1111b83f'
  }
]
```

Lumos, for now, does not handle message signing for the following reasons:

* This is a serious matter that relates to the overall security of the dapp, we want to make sure we are doing this properly if/when we decide to do it.
* Different dapps might have different requirements, some don't do signing at all, having signing built-in might render certain dapps hard to build.

Using a secp256k1 tool, it's not hard to generate a signature here based on the private key listed above, and the message. And we can continue with this process:

```
> const signatures = ["0x1cb952fd224d1d14d07af621587e91a65ccb051d55ed1371b3b66d4fe169cf7758173882e4c02587cb54054d2de287cbb1fdc2fc21d848d7b320ee8c5826479901"];
> const tx = sealTransaction(skeleton, signatures);
```

Now we have a complete transaction assembled, and we can send it to CKB:

```
> const { RPC } = require("ckb-js-toolkit");
> const rpc = new RPC("http://127.0.0.1:8114");
> await rpc.send_transaction(tx);
'0x88536e8c25f5f8c89866dec6a5a1a6a72cccbe282963e4a7bfb5542b4c15d376'
```

Now we have successfully deposited CKBytes into CKB using lumos!

## Withdraw

The following code can help us list all deposited Nervos DAO cells for an address:

```
> for await (const cell of dao.listDaoCells(indexer, address, "deposit")) { console.log(cell); }
{
  cell_output: {
    capacity: '0x174876e800',
    lock: {
      code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hash_type: 'type',
      args: '0xcbfbb9edb5838e2d61061c3fc69eaaa5fdbd3273'
    },
    type: {
      code_hash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
      hash_type: 'type',
      args: '0x'
    }
  },
  out_point: {
    tx_hash: '0x88536e8c25f5f8c89866dec6a5a1a6a72cccbe282963e4a7bfb5542b4c15d376',
    index: '0x0'
  },
  block_hash: '0xa1ec7dc291774bc0fc229efba4a162c099a8d88ffa7ae2fa410cc574e0701ced',
  block_number: '0x196',
  data: '0x0000000000000000'
}
```

Here we can find the cell we just deposited to Nervos DAO. Let's now try to withdraw it from Nervos DAO:

```
> // First, we will need to locate the cell. In a real dapp this is most likely
> // coming from user selection.
> const cell = (await dao.listDaoCells(indexer, address, "deposit").next()).value;
> // For a new action, let's create a new transaction skeleton
> skeleton = TransactionSkeleton({ cellProvider: indexer });
> // This time, we invoke withdraw method to prepare a withdraw skeleton
> skeleton = await dao.withdraw(skeleton, cell, address);
> // Fees are also necessary
> skeleton = await secp256k1Blake160.payFee(skeleton, address, 100000000n);
> // And let's generate signing entries again.
> skeleton = secp256k1Blake160.prepareSigningEntries(skeleton);
> skeleton.get("signingEntries").toArray();
[
  {
    type: 'witness_args_lock',
    index: 0,
    message: '0x24370c5cedc03c34ae0a00a10d9e62324bce07e8d155c839ff10991d73684c34'
  }
]
> // After we signed the message, we can get the signature:
> const signatures2 = ["0x5aed4480c82844506fefc1d92dd18422a123b8e880018ea4cfa7f95891c4781e6578facedd765676831cf3cca04492ec3ec3885ac8d0b6d90cb6c1d6f99e6ffb01"];
> // Now we can seal and send the transaction
> const tx2 = sealTransaction(skeleton, signatures2);
> await rpc.send_transaction(tx2);
'0xe411eb6a3cf4f659461cc7a9df9ff95a72b9624bf850b9ccad0c4d7f2ab444f6'
```

See that withdrawing transaction is not so hard!

### Locktime Pool

We could've just showed the [unlock](https://github.com/nervosnetwork/lumos/blob/ac96a3220ab2a148425120eaac216abe246ee1da/packages/common-scripts/index.d.ts#L262) method in `dao` module, which let you complete the withdrawing from Nervos DAO. But here I want to talk about a different construct in lumos: locktime pool.

If you look closer, you would notice that the cell consumed in [withdraw phase 2](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md#withdraw-phase-2), is really nothing but a cell with a certain lock period. Likewise, there might be other scripts on CKB, when combined with certain cell, just provide lock periods. The multisig script included in genesis cell, is one such example. So the idea arises: what if we build a unified pool, that handles all cells that have lock periods? When designed properly, we can ignore the fact that they might come from different dapps, using different scripts. What we do care, is that each of those cells comes with a capacity and lock period, when the lock period is reached, they are nothing but ordinary cells in one's wallet.

Given this thought, we designed `locktime pool` in lumos. Right now it only processes Nervos DAO cells in withdraw phase 2 and multisig cells, but in the future there is nothing stopping us from integrating more scripts that provide lock periods. From a developer point of view, locktime pool, can be used to manage all of them, provide a unified view in dapps.

As usual, we can query for all cells currently in the locktime pool:

```
> const { locktimePool } = require("@ckb-lumos/common-scripts");
> for await (const cell of locktimePool.collectCells(indexer, address)) { console.log(cell); }
{
  cell_output: {
    capacity: '0x174876e800',
    lock: {
      code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hash_type: 'type',
      args: '0xcbfbb9edb5838e2d61061c3fc69eaaa5fdbd3273'
    },
    type: {
      code_hash: '0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e',
      hash_type: 'type',
      args: '0x'
    }
  },
  out_point: {
    tx_hash: '0xe411eb6a3cf4f659461cc7a9df9ff95a72b9624bf850b9ccad0c4d7f2ab444f6',
    index: '0x0'
  },
  block_hash: '0xb468ec0a1aed1f7070fc00952453ac882dbe36b1afbfb520c822fe46b3b81dfe',
  block_number: '0x543',
  data: '0x9601000000000000',
  maximumCapacity: 100153459536n,
  since: '0x20000a00060000dc',
  depositBlockHash: '0xa1ec7dc291774bc0fc229efba4a162c099a8d88ffa7ae2fa410cc574e0701ced',
  withdrawBlockHash: '0xb468ec0a1aed1f7070fc00952453ac882dbe36b1afbfb520c822fe46b3b81dfe',
  sinceBaseValue: undefined
}
```

Here we can found the cell just created from NervosDAO withdrawing step. Let's try to consume it using locktimePool:

```
> // Notice you will wait till the lock period of the cell has passed, otherwise this function would throw an error:
> skeleton = await locktimePool.transfer(skeleton, [address], address, 100153459536n, (await rpc.get_tip_header()));
> console.log(JSON.stringify(createTransactionFromSkeleton(skeleton), null, 2));
{
  "version": "0x0",
  "cell_deps": [],
  "header_deps": [],
  "inputs": [],
  "outputs": [],
  "outputs_data": [],
  "witnesses": []
}
```

This might actually be a surprise: we invoked transfer method, but it does nothing! Turns out the reason here, is that we are using the same address as both transfer input, and transfer output. Lumos is smart enough to figure out that when you are using the same input and output, we don't need to perform the action so as to save certain transaction fee.

One different question you might ask, is that we use the same address in deposit and withdraw steps, why those previous attempts work? The reason for this, is that deposited cell, or created cell in withdraw step 1 has special purposes, they represent unique **actions** that we want to perform, hence they are **freezed** in the transaction skeleton, so later when we optimize the transaction to combine inputs/outputs, we won't touch those specially created cells. On the other hand, in locktime pool design, we treat a cell with expired lock period the same as a normal cell, they really have nothing different, hence here, lumos will try to optimize the transaction, by removing the action transferring amount from an address to itself. In lumos' eye, this is a no-op.

Now let's try the same step using a different target address:

```
> skeleton = await locktimePool.transfer(skeleton, [address], "ckt1qyqx57xrsztnq7g5mlw6r998uyc2f5hm3vnsvgsaet", 100153459536n, (await rpc.get_tip_header()));
> skeleton = await secp256k1Blake160.payFee(skeleton, address, 100000000n);
> skeleton = secp256k1Blake160.prepareSigningEntries(skeleton);
> skeleton.get("signingEntries").toArray();
[
  {
    type: 'witness_args_lock',
    index: 0,
    message: '0xf01fb9988ba0265597760f50df92a56162d650b119cc95e8508079af584bdbc7'
  }
]
```

We can generate the signature as always:

```
> const signatures3 = ["0x6edde41592b41d445fabfd1b1d6854cf643bba724a338b5751827d991affa5a979d12339250bf5ade45f7f2742cba1e3de0791e37ef03914459bcdd099908ec601"];
> const tx3 = sealTransaction(skeleton, signatures3);
> await rpc.send_transaction(tx3);
'0xbaa7bdd71b7ec975f5a75c49d300857981f333c4346d6d6de1297d8d9d9ce0e0'
```

This is really the core part of this post, if you are not understanding this part, we recommend you to read it again, and try it in CKB by yourself. What we are showing here, is that by designing a set of common APIs, we can build a general facility, that manages many different script instances, given the fact that they share the same behavior. And it is really not only the secp256k1-blake160 single signing script that shall be managed by a wallet. Any scripts that follow certain behavior, can be treated as a cell managed in a wallet.

## Common Script

As we show above, locktime pool is one step ahead of the journey at managing different cells/scripts with similar behaviors. But we are not stopping here, we can continue further down the path: it is mentioned above, that those cells with lock period already passed, can be thought as normal cells. Can we treat them as usual, without needing to deal with locktime pool?

We have build `common` module for this. Given a set of address/configurations(since for some P2SH script, address alone won't be enough), it can manage all cells using those scripts, including cells with expired lock period. Right now this includes the following:

* secp256k1-blake160 single signing script
* secp256k1-blake160 multiple signing script
* NervosDAO script(only cells in withdraw phase 2 are managed)

And the list doesn't stop here, we are working to provide a common API specification, that once implemented, can enable `common` and `locktime pool` to support those additional scripts as well. We do hope those 2 modules can help enable a unified cell manager in lumos, in which `common` handles all consumable cells, while `locktime pool` gives insights into cells that are locked now but will be usable in the future.

## Recap

Lumos aims to take care of the full lifecycle of your CKB dapp. In this post, we are just taking a sneak peek at all the powers. We will continue to work on documents as well as sample projects to showcase all the powers enabled by lumos. We welcome all of you to try out lumos, and tell us what you think of it. So we can continue enhancing it, to make it the beloved framework for building CKB dapps.
