---
id: lumos-nervosdao
title: Introduction to Lumos via NervosDAO
---

In the real world, one hardly sees a blockchain exposed and used directly by the ordinary users. Apps, websites or other services are built on top of blockchains to provide a seamless service. Based on this belief, we built [lumos](https://github.com/nervosnetwork/lumos), a JavaScript/TypeScript framework, that aids dapp development on CKB. Lumos should be able to free you from most, if not all of the hassles for dealing with CKB, and let you focus on the specific logic in your dapp.

In this tutorial, we will provide an introduction on lumos via a real example: [Nervos DAO](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md), while quite valuable on CKB, can be a real pain to integrate for many dapps. Here we will demonstrate that how lumos can be used to streamline Nervos DAO integration.

## Components

Lumos is designed as a framework, meaning it is expected to be used in a intrinsic way: certain setup code will be needed when you first boot your application. Global states might also be kept in your application memory space for bookkeeping purposes. That being said, lumos is also organized into several components, some of which might be used in a non-intrinsic stateless fashion. In general, lumos consists of the following components:

* [indexer](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/indexer): a CKB cell indexer that fulfills [Index-Query-Assemble](../reference/cell#index-query-assemble-pattern) pattern. For now, this package only contains RocksDB backed indexer. A [separate pacakge](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/sql-indexer) contains SQL backed indexer using the same interface. Later, we might merge the 2 packages into one for consistency.
* [base](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/base): a base package containing common types and utilities that are used by most packages. If there is a CKB specific task you need to perform, you might want to look here first. Chances are they are already provided.
* [helpers](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/helpers): a helper package containing more utilities. The difference between `helpers` and `base`, is that `base` contains pure stateless functions, while `helpers` works in a more intrinsic way: it requires `config-manager` mentioned below to be setup.
* [common-scripts](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/common-scripts): integrations for known scripts on CKB. While we try our best to provide integrations for popular CKB scripts, people might be working on innovations everyday. As a result, we are also designing a set of APIs, so developers can freely integrate their own scripts into lumos for everyone to use. One integrated, `common-scripts` should be able to leverage those new scripts as well.
* [config-manager](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/config-manager): a manager for dealing with differences between different chains, such as mainnet, testnet, or numerous dev chains. We abstract each chain into individual config file. Once loaded, config manager will be able to handle the chain specific logic, so you don't have to deal with this in your own code.
* [transaction-manager](https://github.com/nervosnetwork/lumos/tree/v0.4.0/packages/transaction-manager): a transaction manager for CKB. One problem with UTXO based blockchains, is that a certain amount of gap period exists between a transaction is accepted by a blockchain, and when it is actually committed on chain. During this gap, new cells created by the pending transaction will not be available. Transaction manager package takes care of this. It wraps an indexer instance, and makes sure cells created in pending transactions, are also exposed and available for assembling new transactions. This means you are no longer bounded to one transaction at a time, you can freely send series of transactions as you wish.

## Initial CKB Setup

To ease the whole process so we don't have to wait too long to see the results, let's setup our own dev chain with [tweaks](basics/guides/devchain#modify-parameters-to-run-quickly):

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

Here we are making the following configuration:

* Create a dev chain
* Modify the chain config to skip difficulty adjustment, and set all epoch to contain 10 blocks
* Modify miner config to generate a new block every second
* Use a specific private key as the wallet used in miner. Please do not use this private key elsewhere!
* Start a CKB node with the dev chain

In a different terminal, we can also start the CKB miner:

```bash
$ export TOP=$(pwd)
$ export PATH=$PATH:$TOP/ckb_v0.33.0_x86_64-unknown-linux-gnu
$ ckb miner -C devnet
```

## Node Skeleton

Now with CKB ready, we can create the node skeleton used to run our JS code:

```bash
$ mkdir nervosdao-skeleton
$ cd nervosdao-skeleton
$ yarn init
$ yarn add @ckb-lumos/indexer@0.4.3 @ckb-lumos/common-scripts@0.4.3
```

In this lab, we will run the operation needed from a node shell with async/await enabled:

```bash
$ node --experimental-repl-await
Welcome to Node.js v12.16.2.
Type ".help" for more information.
>
```

But this is only for demonstration purposes. There's nothing stopping you from copying the same code into a file that is then executed by node.

## Config Manager Setup

The first step in using lumos, is setting up config manager. Even though CKB has a unified programming model, different configurations would still be required for different chain instances, such as mainnet, testnet or dev chains. Config manager allows the node app to boot with a specific chain configuration, so other parts in lumos can consult config manager directly for information.

If you are using a well known chain configuration, you can use `LUMOS_CONFIG_NAME` environment variable to setup config manager:

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

Supported well known configurations include:

* `LINA`: mainnet config;
* `AGGRON4`: current testnet config. Note at certain time, we might reset testnet, in that case, lumos might be upgraded with new testnet configurations.

However there might be cases, where you don't use a pre-defined configuration. For example, the dev chain we use here, does not have a pre-defined configuration. Lumos also supports setting up config manager via a local config file. You can use `LUMOS_CONFIG_FILE` environment variable to point to the config file. If neither config variable is set, lumos will try to read config file from `config.json` file in current directory.

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

Now config manager is successfully setup, we can proceed to the next step.

## Booting Indexer

Lumos is designed based on the [Index-Query-Assemble](../reference/cell#index-query-assemble-pattern) pattern, meaning a dapp shall hava an indexer that keeps indexing new blocks in a format that is easier to query. This means any dapp built with lumos, should also have an indexer configured and running at all time:

```
> const { Indexer } = require("@ckb-lumos/indexer");
> const indexer = new Indexer("http://127.0.0.1:8114", "./indexed-data");
> indexer.startForever();
```

Here we are using the RocksDB backed indexer for simplicity. Lumos provides 2 indexer types:

* RocksDB backed indexer
* SQL backed indexer, supported SQL databases now include MySQL and PostgreSQL.

If you want to test against the SQL indexer, some modifications to the above setup code might be required.

You can check current indexed tip with the following code snippet:

```
> await indexer.tip()
{
  block_number: "0x29c",
  block_hash: "0x3e44b571c82a09117231baee1939d38440d71f56de8bc600ac32b1dead9be46d"
}
```

Please wait a while till lumos has caught up with the current chain tip. This should not take much time for a dev chain.

## Deposit

To deposit to Nervos DAO, we need to first create a deposit transaction. You could of course go the hard way and create a transaction manually, but lumos has already provide a solution for simplifying transaction creation. Let's look at `TransactionSkeleton` and how it works in lumos first.

### Transaction Skeleton

CKB provides great flexibility for dapp developers to build anything they want. But we all know that **with great power comes great responsibility**, a flexible programming model also significantly complicates transaction assembling. This includes but might not be limited to the following hurdles:

* Different scripts used in transaction inputs will require separate message generation, and also separate signing steps.
* Some cells might require special argument setup in witness, due to type script validation rules.
* Coordination might be required, since both lock script and type script in a cell might require arguments in the same witness construct.

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

Now we have successfully deposited CKBytes into Nervos DAO using lumos!

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
