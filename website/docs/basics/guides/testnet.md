---
id: testnet
title: Run a CKB Testnet Node
---

We have launched Aggron Testnet for developers to test their integration and smart contracts in real environment.The Aggron Testnet’s info has been published via Wiki:
[Chains](https://github.com/nervosnetwork/ckb/wiki/Chains) .Please refer it for more details. Because of the hash rate surge, Aggron will reset regularly.

### Run a CKB Testnet node

**System Requirements**

Any modern computer with macOS/Linux/Windows operating system should be able to run a CKB node and mining programs. Alternatively, you can also use [Docker](https://github.com/nervosnetwork/ckb/blob/develop/docs/run-ckb-with-docker.md) if your operating system is not properly supported by CKB for now.

To run a CKB node, please follow the instructions explained in detail below:

Step 1: Download the latest ckb binary file from the CKB releases page on [GitHub] (https://github.com/nervosnetwork/ckb/releases), then check if it works with:

```
ckb --version 
ckb-cli --version
```

<details><summary>(click here to view response)</summary>

```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```

</details>

**Step 2: Connect to Aggron Testnet**

* Init CKB node with `ckb init --chain testnet`

```
ckb init --chain testnet
```

<details><summary>(click here to view response)</summary>

```bash
WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create ckb.toml
create ckb-miner.toml
```

</details>

**Step 3: Start the CKB Testnet node**

```
<p>ckb run</p>
```
<details><summary>(click here to view response)</summary>

```bash
2020-06-05 18:23:10.086 +08:00 main INFO sentry  **Notice**: The ckb process will send stack trace to sentry on Rust panics. This is enabled by default before mainnet, which can be opted out by setting the option `dsn` to empty in the config file. The DSN is now https://dda4f353e15f4b62800d273a2afe70c2@sentry.nervos.org/4
2020-06-05 18:23:10.172 +08:00 main INFO main  Miner is disabled, edit ckb.toml to enable it
2020-06-05 18:23:10.176 +08:00 main INFO ckb-db  Initialize a new database
2020-06-05 18:23:10.263 +08:00 main INFO ckb-db  Init database version 20191127135521
2020-06-05 18:23:10.283 +08:00 main INFO ckb-memory-tracker  track current process: unsupported
2020-06-05 18:23:10.284 +08:00 main INFO main  ckb version: 0.32.1 (9ebc9ce 2020-05-29)
2020-06-05 18:23:10.284 +08:00 main INFO main  chain genesis hash: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
2020-06-05 18:23:10.285 +08:00 main INFO ckb-network  Generate random key
2020-06-05 18:23:10.285 +08:00 main INFO ckb-network  write random secret key to "/PATH/ckb_v0.32.1_x86_64-apple-darwin/data/network/secret_key"
2020-06-05 18:23:10.296 +08:00 NetworkRuntime INFO ckb-network  p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }
2020-06-05 18:23:10.298 +08:00 NetworkRuntime INFO ckb-network  Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/QmWpdvd65BhJV3KVyidSkGjd3SuTdCSNgk1WuRpnggMLWj
2020-06-05 18:23:10.303 +08:00 main INFO ckb-db  Initialize a new database
2020-06-05 18:23:10.336 +08:00 main INFO ckb-db  Init database version 20191201091330
2020-06-05 18:23:10.484 +08:00 NetworkRuntime INFO ckb-sync  SyncProtocol.connected peer=SessionId(1)
2020-06-05 18:23:10.484 +08:00 NetworkRuntime INFO ckb-relay  RelayProtocol(1).connected peer=SessionId(1)
2020-06-05 18:23:10.732 +08:00 NetworkRuntime INFO ckb-sync  Ignoring getheaders from peer=SessionId(1) because node is in initial block download
2020-06-05 18:23:10.927 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0xd5ac7cf8c34a975bf258a34f1c2507638487ab71aa4d10a9ec73704aa3abf9cd, epoch: 0(1/1000), total_diff: 0x1800060, txs: 1

```

</details>
