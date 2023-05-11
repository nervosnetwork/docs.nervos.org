---
id: mainnet
title: Run a CKB Node
---

Running a CKB node not only contributes to the robustness and decentralized nature of the network, but also allows you to access data from the blockchain without any third party, which in turn increases your security.

To run a node, you need to use the command line. If you have never used it before, you may refer to [how to use the command line tool](https://www.google.com/search?q=learn+command+line) to get started on your computer. Although it may seem complicated at first, it is quite simple and following the specific instructions below should allow you to easily run a CKB mainnet node.

## Run a CKB Mainnet Node

Step 1: Download the latest CKB binary file from [CKB releases page on GitHub](https://github.com/nervosnetwork/ckb/releases) 

Step 2:  Unzip and extract the downloaded file to an easily accessible folder. We recommend `C:\ckb` for Windows and `~/Documents` for Mac.

Step 3: Open Terminal on Mac or Command Prompt on Windows.

* On Mac:

You can open Terminal in two ways: either go to the Applications folder, then open Utilities and double-click on Terminal, or launch Spotlight search by pressing `Command - Spacebar` or `Control -Spacebar`, then type "Terminal" and double-click on the search result. The subsequent steps will be executed in Terminal.

* On Windows:

(If you are familiar with command line in Windows, you can skip this step and open `cmd` or `Power Shell` instead.)

Download Git for Windows from [Git-Downloads](https://git-scm.com/downloads), double-click to install and open Git Bash in the start menu. The subsequent steps will be executed in in Git Bash.

Step 4：Copy and paste the commands below into the Terminal (Mac) or Command Prompt (Windows):

Note: make sure the directory and folder names on your computer match the commands below. Modify the commands according if they don't match. 

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

Step 5: To run the CKB mainnet node, copy and paste the commands below into Terminal (Mac) / Command Prompt (Windows):

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

## Run a Public RPC Node
CKB nodes have built-in RPC functionality, which becomes available as soon as the node is started.

RPC is private by default. Exposing RPC through the `rpc.listen_address` configuration option allows arbitrary machines to access the JSON-RPC port, posing a security risk. Therefore, it is strongly discouraged. 

However, if you have to expose them, make sure to strictly limit the access to trusted machines only, by following the method below.

### RPC Access Control
Here we use Nginx API Gateway to configure the RPC access control.

Step 1: Install Docker-Compose and Docker

```jsx
apt install docker-compose
apt install docker
```

Step 2: Clone Code

```jsx
git clone https://github.com/jiangxianliang007/ckb-nginx-proxy.git
```

Step 3: Replace Default Value With Your CKB RPC Address

```jsx
cd ckb-nginx-proxy

sed -i "s/YOUR_CKR_RPC_IP:8114/192.168.1.100:8114/" nginx.conf
```

Step 4: Run Proxy

```
docker-compose up -d
```

### Example

Get tip block hash and number:
```
echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_tip_header",
    "params": []
}' \
| tr -d '\n' \
| curl -H 'content-type: application/json' -d @- \
http://192.168.1.100:80

// Note that http://192.168.1.100:80 needs to be changed to your proxy IP!
```

Result:
```
{
    "jsonrpc": "2.0",
    "result": {
        "compact_target": "0x1d090fbe",
        "dao": "0xba17553fab3db84154bc4aa9f09b2600e826a2b0df99010400ed51b4686b5808",
        "epoch": "0x7080687001539",
        "extra_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "hash": "0x7a46e779a3fc2d5b55c82aad852e721b0097bf873927b9751409b1d185599ce4",
        "nonce": "0xd265e70dfd205dbbed33b29294121856",
        "number": "0x7037f2",
        "parent_hash": "0x3d105fe9ec60f138baa6623abd16af70ba1be90ad23d1943bcaa55d5f14fcb6f",
        "proposals_hash": "0x2581d1769886226a8c90ee99baf2d8696e24c7f6bb6751748ff8b4452f8006e5",
        "timestamp": "0x1847a2bfad2",
        "transactions_root": "0x28157a5962c4ae1d3e153b1d8d331e5fd3c158866287f5398ab7f7d38210dfb0",
        "version": "0x0"
    },
    "id": 2
}
```
Execute `clear_tx_pool`:

```jsx
echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "clear_tx_pool",
    "params": []
}' | tr -d '\n' | curl -H 'content-type: application/json' -d @- \
http://192.168.1.100:80
```

Result:
```
This method has been banned
```

### List of Restricted Methods
```
clear_banned_addresses
set_ban
set_network_active
add_node
remove_node
remove_transaction
clear_tx_pool
```
