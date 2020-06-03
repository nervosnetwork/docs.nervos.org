---
id: devchain
title: How to use a development blockchain
---

Nervos CKB supports a `dev` mode that is particularly useful for development and testing. We also support to modify some parameters to run quickly for improving development efficiency. In addition，we also provide  `ckb-cli`  to support transfer、query balance (with local index)  and etc. 

You may follow these instructions which are explained in detail below：

* Initialize the development blockchain
* Modify parameters to run quickly
* Run the development blockchain
* Use `ckb-cli`  to transfer CKB

## Initialize the development blockchain

* Download the latest ckb binary file from the CKB releases page on [GitHub](_https://github.com/nervosnetwork/ckb/releases_), then check if it works with:

```
ckb --version
ckb-cli --version
```
<details>
<summary>(click here to view response)</summary>
```bash
ckb 0.32.0-pre (80e0bef 2020-05-06)
ckb-cli 0.31.0 (a531b3b 2020-04-17)
```
</details>

* Initialize the development blockchain, will generate some configuration files

```
ckb init --chain dev
```

<details>
<summary>(click here to view response)</summary>
```bash
WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /PATH/ckb_v0.32.0-rc1_x86_64-apple-darwin-dev
create specs/dev.toml
create ckb.toml
create ckb-miner.toml
```
</details>


## Modify parameters to run quickly

In the development process, sometimes we want to make the blockchain to run quickly for getting results faster.We will introduce how to modify parameters to make it. 

###  Change the epoch length

You can change the `genesis_epoch_length` in `specs/dev.toml`

```
[params]
initial_primary_epoch_reward = 1_917_808_21917808
secondary_epoch_reward = 613_698_63013698
max_block_cycles = 10_000_000_000
cellbase_maturity = 0
primary_epoch_reward_halving_interval = 8760
epoch_duration_target = 14400
**genesis_epoch_length** = 1000 （The unit of meansurement is "block".）

```

The default epoch length is 1000 blocks，if `genesis_epoch_length = 100` that means the epoch lengh is 100 blocks.

### Change the mining idle interval

Change the `value` in `ckb-miner.toml`

```
[[miner.workers]]
worker_type = "Dummy"
delay_type = "Constant"
**value** = 5000 (The unit of measurement is "ms".)
```

The default mining idle interval is 5000ms, if `value = 50` that means the mining idle interval is 50ms.

## Run the development blockchain

We need to run a miner for running the development blockchain, firstly configure the `block-assembler` in `ckb.toml` for mining.

###  configure `block-assembler`

* Use `ckb-cli` to generate a miner account, we will use `lock_arg` next step, so please backup it.

```
ckb-cli account new
```

<details>
<summary>(click here to view response)</summary>
```bash
Your new account is locked with a password. Please give a password. Do not forget this password.
Password: 
Repeat password: 
address:
  mainnet: ckb1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qud28sv
  testnet: ckt1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qpg5cus
  lock_arg: 0x8d627decece439977a3a0a97815b63debaff2874
lock_hash: 0x3c78a0ea094f0d7abedde67f95143bcf8af391458cec798ceeaa3549ff53c4cb
```
</details>

* Fill in  `args` and  `message` of the `block_assembler`

```
[block_assembler]
code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8" //don't have to change
args = "0x8d627decece439977a3a0a97815b63debaff2874" // the lock_arg 
hash_type = "type" // don't need to change
message = "A 0x-prefixed hex string"// "0x"(recommendation)

```

### Run the development blockchain

* Start a ckb node

```
ckb run
```
<details>
<summary>(click here to view response)</summary>
```bash
2020-05-15 16:39:49.457 +08:00 main INFO sentry sentry is disabled
2020-05-15 16:39:49.620 +08:00 main INFO ckb-memory-tracker track current process: unsupported
2020-05-15 16:39:49.620 +08:00 main INFO main ckb version: 0.32.0-pre (80e0bef 2020-05-06)
2020-05-15 16:39:49.620 +08:00 main INFO main chain genesis hash: 0x120ab9abd48e3b82f93b88eba8c50a0e1304cc2fffb5573fb14b56c6348f2305
2020-05-15 16:39:49.624 +08:00 NetworkRuntime INFO ckb-network p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }
2020-05-15 16:39:49.625 +08:00 NetworkRuntime INFO ckb-network Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/QmcdT17iho5X7D4NGZKjzrgonQ4oQRGx5UHrwPbUWiaAwG
```
</details>

* Start a miner, you may open another terminal

```
ckb miner

```
<details>
<summary>(click here to view response)</summary>
```bash
2020-05-15 16:33:55.215 +08:00 main INFO sentry sentry is disabled
Dummy-Worker ⠁ [00:00:00]
Found! #1 0x70949ff02180743faee29ed728d8afaf165d8922a45aa728d7187511f2a72b37
Found! #2 0x74afc3bac2f085918a093181c046c767c2b8060a9ec6c5b503f1ef3468c7d6e0
Found! #3 0x6570ec5c0d4434287cf53a99f23769dba923e511dced32e1f3462470fdf2fe99
Found! #4 0x334cf2af7cedb70bad4dd2001bfe9ef043a98c3cd66f679636e6153cd3c1be64
```
</details>

## Use `ckb-cli`  to transfer CKB

`ckb-cli` is included in the ckb releases，it’s the command line tool for CKB. You can use it to invoke RPC call to node、manage accounts、transfer/check balance、construct mock transactions, etc. You can refer to [ckb-cli](https://github.com/nervosnetwork/ckb-cli)  for more details. We will introduce how to transfer CKB here.

 **Please note that `ckb-cli` is only used for developing/testing purpose.** 

* Enter into the interface of  **ckb-cli**

```
ckb-cli
```
<details>
<summary>(click here to view response)</summary>
```bash
[  ckb-cli version ]: 0.31.0 (a531b3b 2020-04-17)
[              url ]: http://127.0.0.1:8114 (network: Dev)
[              pwd ]: /Users/zengbing/Documents/projects/ckb_v0.32.0-rc1_x86_64-apple-darwin-dev
[            color ]: true
[            debug ]: false
[    output format ]: yaml
[ completion style ]: List
[       edit style ]: Emacs
[   index db state ]: Waiting for first query
```
</details>

* Create a new account

```
account new
```
<details>
<summary>(click here to view response)</summary>
```bash
Your new account is locked with a password. Please give a password. Do not forget this password.
Password:
Repeat password:
address:
mainnet: ckb1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqw4c8mg
testnet: ckt1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqnsxch5
lock_arg: 0xf4143a99934c34913a771a0b38bd1257cbf4ef32
lock_hash: 0xea4db70029dd393789a6be0e4137a3e95cd8d20b2b028a0fc0eab07622a894f4
```
</details>


* Check the balance of miner account

You have already created a miner account for mining above, we can check the balance:

```
wallet get-capacity --address "miner's address" 
```
<details>
<summary>(click here to view response)</summary>
```bash
CKB> wallet get-capacity --address "ckt1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qpg5cus"
immature: 8027902.89083717 (CKB)
total: 46253677.72927512 (CKB)
```
</details>

* Transfer 10000 CKB to the new account

```
wallet transfer --from-account "miner's address" --to-address "new account's address" --capacity 10000 —tx-fee 0.00001
```
<details>
<summary>(click here to view response)</summary>
```bash
CKB> wallet transfer --from-account ckt1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qpg5cus --to-address ckt1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqnsxch5 --capacity 10000 --tx-fee 0.00001
Password: 
0x1b66aafaaba5ce34de494f60374ef78e8f536bb3af9cab4fa63c0f29374c3f89
```
</details>

* Check the new account’s balance

```
get-capacity —address "new account's address"
```

<details>
<summary>(click here to view response)</summary>
```bash
CKB> wallet get-capacity —address ckt1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqnsxch5
total: 10000.0 (CKB)
```
</details>

 The transfer successes !
