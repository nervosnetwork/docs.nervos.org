---
id: mainnet_zh
title: 运行 CKB 主网节点
---

*运行 CKB 主网节点不仅有助于 CKB 网络的稳健性和去中心化，同时也意味着你不需要依赖第三方来获取链上数据，从而提高自身安全性。*

运行节点需要用到命令行。如果你此前从未使用过命令行，可以自行参考网络资料[如何使用命令行工具](https://www.google.com/search?q=learn+command+line) 。尽管其乍一看似乎很复杂，但其实十分简单，按照以下教程说明，你可以很轻松就运行起 CKB 节点。

步骤1：从 [GitHub的CKB版本页面](https://github.com/nervosnetwork/ckb/releases) 下载最新版本的 CKB 二进制文件

步骤2：将下载的文件解压缩到易于访问的文件夹中。对于Windows，我们建议`C:\ckb` ；在Mac上，我们建议 `~/Documents`。

步骤3：打开终端（Mac）或命令行（Windows）。

* Mac 环境:

    * 以下两种方式选一种：1) 打开你的“应用程序”文件夹，然后打开“实用程序”并双击“终端”；或者 2) 按 `Command - Spacebar `或 `Control -Spacebar `以启动 Spotlight 并键入“ Terminal”，然后双击搜索结果，然后在 Terminal 上执行以下步骤。

* Windows 环境:

    * 注意：如果你熟悉 Windows 上的命令行操作，则可以跳过此步骤，而是打开 `cmd` 或 `Power Shell` 终端。
    * 从 [Git-Downloads](https://git-scm.com/downloads) 下载适用于 Windows 的 [Git](https://git-scm.com/downloads)，双击安装它并在开始菜单中打开 Git Bash。以下步骤将在 Git Bash 中执行。

步骤4：将以下命令复制并粘贴到终端（Mac）/命令行（Windows）中：

* 注意：你计算机上的目录和文件夹名称必须与以下命令匹配，如果不匹配，请相应地修改命令脚本。

* Mac

```
cd /Users/(NAME)/Documents/ckb_v0.32.1_x86_64-apple-darwin
./ckb --version
./ckb-cli --version
```

* Windows

```
cd C:/ckb_v0.32.1_x86_64-pc-windows-msvc 
ckb --version 
ckb-cli --version
```

<details>
<summary>(单击此处查看响应)</summary>
```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```
</details>

步骤5：要运行 CKB 节点，请将以下命令复制并粘贴到终端（Mac）/命令行（Windows）中：

* 初始化节点（仅运行一次）

```
ckb init --chain mainnet
```

<details>
<summary>(点击此处查看响应)</summary>
```bash
WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create ckb.toml
create ckb-miner.toml
```
</details>

* 启动节点。

```
ckb run
```

<details>
<summary>(点击此处查看响应)</summary>
```bash
2020-06-05 18:10:19.785 +08:00 main INFO sentry  sentry is disabled
2020-06-05 18:10:19.869 +08:00 main INFO main  Miner is disabled, edit ckb.toml to enable it
2020-06-05 18:10:19.942 +08:00 main INFO ckb-memory-tracker  track current process: unsupported
2020-06-05 18:10:19.942 +08:00 main INFO main  ckb version: 0.32.1 (9ebc9ce 2020-05-29)
2020-06-05 18:10:19.942 +08:00 main INFO main  chain genesis hash: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
2020-06-05 18:10:19.944 +08:00 NetworkRuntime INFO ckb-network  p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }
2020-06-05 18:10:19.946 +08:00 NetworkRuntime INFO ckb-network  Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/QmWKGXVhYx2T8YmbsC1RYjnrRf1hfz2ZNTMywrkN9y2bVg
2020-06-05 18:10:19.951 +08:00 main INFO ckb-db  Initialize a new database
2020-06-05 18:10:19.983 +08:00 main INFO ckb-db  Init database version 20191201091330
2020-06-05 18:10:20.146 +08:00 NetworkRuntime INFO ckb-relay  RelayProtocol(1).connected peer=SessionId(1)
2020-06-05 18:10:20.146 +08:00 NetworkRuntime INFO ckb-sync  SyncProtocol.connected peer=SessionId(1)
2020-06-05 18:10:20.451 +08:00 NetworkRuntime INFO ckb-sync  Ignoring getheaders from peer=SessionId(1) because node is in initial block download
2020-06-05 18:10:20.749 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0x2567f226c73b04a6cb3ef04b3bb10ab99f37850794cd9569be7de00bac4db875, epoch: 0(1/1743), total_diff: 0x3b1bb3d4c1376a, txs: 1
```
</details>

