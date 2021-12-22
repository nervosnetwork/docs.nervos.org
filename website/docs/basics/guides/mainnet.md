---
id: mainnet
title: Run a CKB Mainnet Node
---

*Fun Fact: Running a CKB Mainnet node not only helps contribute to the robustness and decentralized nature of the Network, it also means you do not need to rely on any 3rd party to provide data from the blockchain, which increases your security.*

Running a node requires using the command line. If you have never used a command line before, you may refer to [how to use the command line tool](https://www.google.com/search?q=learn+command+line) on your computer. Although it may seem complicated at first, it is quite simple and you should be able to easily run a CKB node following the specific instructions below.

Step 1: Download the latest release CKB binary file from [CKB releases page on GitHub](https://github.com/nervosnetwork/ckb/releases) 

Step 2:  Unzip / extract the downloaded file to an easily accessible folder. 
For Windows we recommend `C:\ckb` 
On Mac we recommend `~/Documents`

Step 3: Open up Terminal (Mac) or command line (Windows).

* On Mac:

    * Either 1) open your Applications folder, then open Utilities and double-click on Terminal, or 2) press `Command - Spacebar` or `Control -Spacebar` to launch Spotlight and type "Terminal," then double-click the search result and the following steps are performed on Terminal.

* On Windows:

    * Please note: if you are familiar with command line operation on Windows, you can skip this step and open the `cmd` or `Power Shell` terminal instead.
    * Download Git for windows from [Git-Downloads](https://git-scm.com/downloads), double-click to install it and open Git Bash in start menu. The following steps will be performed in Git Bash.

Step 4：Copy and paste the commands below into the Terminal (Mac) / Command Line (Windows):

* Please note: the directory and folder name on your computer must match the commands below, if not, please modify the command script correspondingly. 

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

<details><summary>(click here to view response)</summary>

```bash

ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```

</details>

Step 5: To run the CKB node, copy and paste the commands below into the Terminal (Mac) / Command Line (Windows):

* Initialize the node (run only once)

```
ckb init --chain mainnet
```

<details><summary>(click here to view response)</summary>

```bash

WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create ckb.toml
create ckb-miner.toml
```

</details>

** Start the node.

```
ckb run
```

<details><summary>(click here to view response)</summary>

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
2020-06-05 18:10:20.749 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0x2567f226c73b04a6cb3ef04b3bb10ab99f37850794cd9569be7de00bac4db875, epoch: 0(1/1743), total_diff: 0x3b1bb3d4c1376a, txs:1
```

</details>
