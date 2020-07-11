---
id: devchain
title: Run a CKB Dev Blockchain
---

Nervos CKB supports the `dev` mode that is particularly useful for development and testing. You can run a developement CKB blockchain with `Dummy-Worker` or `Eaglesong-Worker` locally for development and testing.

It is recommended to use `Dummy-Worker` for most of development scenarios because the block time is stable. `Eaglesong-Worker` is just for scenarios of validating PoW function. Please note that the block time can be extremely unstable when the mining hashrate is low in `Eaglesong-Worker`.

You may follow these instructions which are explained in detail below：

In `Dummy-Worker`：
* Initialize the development blockchain
* Modify parameters to run quickly
* Run the development blockchain
* Use `ckb-cli`  to transfer CKB

In `Eaglesong-Worker`：
* Initialize the development blockchain
* Change the PoW function to Eaglesong
* Run the development blockchain

## In `Dummy-Worker`

### Initialize the development blockchain

* Download the latest ckb binary file from the CKB releases page on [GitHub](https://github.com/nervosnetwork/ckb/releases), then check if it works with:

```
ckb --version
ckb-cli --version
```
<details>
<summary>(click here to view response)</summary>
```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
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
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create specs/dev.toml
create ckb.toml
create ckb-miner.toml
```
</details>

### Modify parameters to run quickly

In the development process, sometimes we want to make the blockchain to run quickly for getting results faster. There are certain parameters you can tweak:

* Change the epoch length

You can change the `genesis_epoch_length` in `specs/dev.toml`

```
[params]
initial_primary_epoch_reward = 1_917_808_21917808
secondary_epoch_reward = 613_698_63013698
max_block_cycles = 10_000_000_000
cellbase_maturity = 0
primary_epoch_reward_halving_interval = 8760
epoch_duration_target = 14400
genesis_epoch_length = 1000  # The unit of meansurement is "block".
```

The default epoch length is 1000 blocks，if `genesis_epoch_length = 100` that means the epoch lengh is 100 blocks.

* Use permanent difficulty

The `params` section above has a different parameter `permanent_difficulty_in_dummy` that you can use:

```
[params]
# ... omitted parameters

genesis_epoch_length = 10
permanent_difficulty_in_dummy = true
```

When `permanent_difficulty_in_dummy` is set to `true`. The whole difficulty adjustment algorithm will be skipped. All epochs will use the same length as the genesis epoch length. Typically, you would see the 2 parameters `genesis_epoch_length` and `permanent_difficulty_in_dummy` used together. In the above example, we are ensuring each epoch, in our current dev chain, has 10 blocks. This can be super helpful if you are testing scripts that relate to epoch, such as NervosDAO.

* Change the mining idle interval

Change the `value` in `ckb-miner.toml`

```
[[miner.workers]]
worker_type = "Dummy"
delay_type = "Constant"
value = 5000  # The unit of measurement is "ms".
```

The default mining idle interval is 5000ms, if `value = 50` that means the mining idle interval is 50ms.

### Run the development blockchain

We need to run a miner for running the development blockchain, firstly configure the `block-assembler` in `ckb.toml` for mining.

1. configure `block-assembler`

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
  mainnet: ckb1qyqyrm8w0w8uq7puwhdp7s6xqzdjuknhf2tqzdztph
  testnet: ckt1qyqyrm8w0w8uq7puwhdp7s6xqzdjuknhf2tqlgu5dt
lock_arg: 0x41ecee7b8fc0783c75da1f4346009b2e5a774a96
lock_hash: 0xeb31c5232b322905b9d52350c0d0cf55987f676d86704146ce67d92ddef05ed3
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

2. Run the development blockchain

* Start a ckb node

```
ckb run
```
<details>
<summary>(click here to view response)</summary>
```bash
2020-06-05 18:31:14.970 +08:00 main INFO sentry  sentry is disabled
2020-06-05 18:31:15.058 +08:00 main INFO ckb-db  Initialize a new database
2020-06-05 18:31:15.136 +08:00 main INFO ckb-db  Init database version 20191127135521
2020-06-05 18:31:15.162 +08:00 main INFO ckb-memory-tracker  track current process: unsupported
2020-06-05 18:31:15.164 +08:00 main INFO main  ckb version: 0.32.1 (9ebc9ce 2020-05-29)
2020-06-05 18:31:15.164 +08:00 main INFO main  chain genesis hash: 0x823b2ff5785b12da8b1363cac9a5cbe566d8b715a4311441b119c39a0367488c
2020-06-05 18:31:15.166 +08:00 main INFO ckb-network  Generate random key
2020-06-05 18:31:15.166 +08:00 main INFO ckb-network  write random secret key to "/PATH/ckb_v0.32.1_x86_64-apple-darwin/data/network/secret_key"
2020-06-05 18:31:15.177 +08:00 NetworkRuntime INFO ckb-network  p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }
2020-06-05 18:31:15.179 +08:00 NetworkRuntime INFO ckb-network  Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/QmSHk4EucevEuX76Q44hEdYpRxr3gyDmbKtnMQ4kxGaJ6m
2020-06-05 18:31:15.185 +08:00 main INFO ckb-db  Initialize a new database
2020-06-05 18:31:15.211 +08:00 main INFO ckb-db  Init database version 20191201091330
2020-06-05 18:31:26.586 +08:00 ChainService INFO ckb-chain  block: 1, hash: 0x47995f78e95202d2c85ce11bce2ee16d131a57d871f7d93cd4c90ad2a8220bd1, epoch: 0(1/1000), total_diff: 0x200, txs: 1
```
</details>

* Start a miner, you may open another terminal

```
ckb miner
```
<details>
<summary>(click here to view response)</summary>
```bash
2020-06-05 18:31:21.558 +08:00 main INFO sentry  sentry is disabled
Dummy-Worker ⠁ [00:00:00] 
Found! #1 0x47995f78e95202d2c85ce11bce2ee16d131a57d871f7d93cd4c90ad2a8220bd1
Found! #2 0x19978085abfa6204471d42bfb279eac0c20e3b81745b48c4dcaea85643e301f9
Found! #3 0x625b230f84cb92bcd9cb0bf76d1397c1d948ab25c19df3c4edc246a765f94427
Found! #4 0x4550fb3b62d9d5ba4d3926db6704b25b90438cfb67037d253ceceb2d86ffdbf7

```
</details>

### Use `ckb-cli`  to transfer CKB

`ckb-cli` is included in the ckb releases，it’s the command line tool for CKB. You can use it to invoke RPC call to node,manage accounts、transfer/check balance、construct mock transactions, etc. You can refer to [ckb-cli](https://github.com/nervosnetwork/ckb-cli)  for more details. We will introduce how to transfer CKB here.

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

 ## In `Eaglesong-Worker`

 ### Initialize the development blockchain

* Download the latest ckb binary file from the CKB releases page on [GitHub](https://github.com/nervosnetwork/ckb/releases),it requires version v0.32.0 or above,then check if it works with:

```
ckb --version
ckb-cli --version
```
<details>
<summary>(click here to view response)</summary>
```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```
</details>

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
  mainnet: ckb1qyqtxam3dpjftjm7ljehu5jeeg6r4ph966lswxq87x
  testnet: ckt1qyqtxam3dpjftjm7ljehu5jeeg6r4ph966lsnr7cj6
lock_arg: 0xb37771686495cb7efcb37e5259ca343a86e5d6bf
lock_hash: 0xceabcf383964ac0485b4ef7eec3321abef9f8493210c750e3a6f7832ffac0b2e
```
</details>

* Initialize the development blockchain with the test miner account

```
ckb init -c dev --ba-arg 0xb37771686495cb7efcb37e5259ca343a86e5d6bf // lock_arg
```
<details>
<summary>(click here to view response)</summary>
```bash
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create specs/dev.toml
create ckb.toml
create ckb-miner.toml
```
</details>

### Change the PoW function to Eaglesong

* Edit specs/dev.toml and change to last line to

```
func = "Eaglesong"
```
* Edit ckb-miner.toml and change the whole [[miner.workers]] section to

```
[[miner.workers]]
worker_type = "EaglesongSimple"
threads     = 1
```
### Run the development blockchain

* Start a ckb node

```
ckb run
```
<details>
<summary>(click here to view response)</summary>
```bash
2020-06-05 11:25:31.433 +08:00 main INFO sentry  sentry is disabled
2020-06-05 11:25:31.508 +08:00 main INFO ckb-db  Initialize a new database
2020-06-05 11:25:31.590 +08:00 main INFO ckb-db  Init database version 20191127135521
2020-06-05 11:25:31.604 +08:00 main INFO ckb-memory-tracker  track current process: unsupported
2020-06-05 11:25:31.604 +08:00 main INFO main  ckb version: 0.32.1 (9ebc9ce 2020-05-29)
2020-06-05 11:25:31.604 +08:00 main INFO main  chain genesis hash: 0x823b2ff5785b12da8b1363cac9a5cbe566d8b715a4311441b119c39a0367488c
2020-06-05 11:25:31.604 +08:00 main INFO ckb-network  Generate random key
2020-06-05 11:25:31.604 +08:00 main INFO ckb-network  write random secret key to "/PATH/ckb_v0.32.1_x86_64-apple-darwin/data/network/secret_key"
2020-06-05 11:25:31.608 +08:00 NetworkRuntime INFO ckb-network  p2p service event: ListenStarted { address: "/ip4/0.0.0.0/tcp/8115" }
2020-06-05 11:25:31.610 +08:00 NetworkRuntime INFO ckb-network  Listen on address: /ip4/0.0.0.0/tcp/8115/p2p/QmcCGH7VeXbpV4jj7VgSEM7NANuud6TmGHV2DXPsSVrRkR
2020-06-05 11:25:31.612 +08:00 main INFO ckb-db  Initialize a new database
2020-06-05 11:25:31.638 +08:00 main INFO ckb-db  Init database version 20191201091330
```
</details>

* Start a miner, you may open another terminal

```
ckb miner
```
<details>
<summary>(click here to view response)</summary>
```bash
2020-06-05 11:25:37.867 +08:00 main INFO sentry  sentry is disabled
EaglesongSimple-Worker-0 ⠁ [00:00:00] 
2020-06-05 11:25:37.870 +08:00 main INFO ckb-memory-tracker  track current proceFound! #1 0x57e6ad0f15bacc4f30e53811d488d895e6619c17222981eca5484f0115f84acd
Found! #2 0xe5831f39f928dca599a02e490c482a881ccdc47a2376371dec4e440e363fa5c0
Found! #3 0x605b3e6449954c2daa996c06b2412bbf60b8231763149742119fb623f9de27b2
Found! #4 0x64064e7257ea4589e8cb177cf119c68ab1b4559de005a20dc13ef3d42949e04b
```
</details>


