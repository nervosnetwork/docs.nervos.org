---
id: devchain
title: Run a CKB Dev Blockchain
---

Nervos CKB supports a special development mode that is particularly useful for building and testing applications. This mode of operation is highly configurable, and allows the developer to speed up the block interval, adjust epochs lengths, create blocks without having to do Proof-of-Work (PoW) mining.

When running a development blockchain you have the option of selecting between `Dummy-Worker` and `Eaglesong-Worker`. `Dummy-Worker` allows the mining of blocks at a constant block interval without PoW. `Eaglesong-Worker` uses real PoW to produce blocks.

Note: It is highly recommended that `Dummy-Worker` be used for most development scenarios. `Eaglesong-Worker` should only be used when validating the PoW function is necessary, because the block time can behave erratically with extremely low hashrates.

## Setup a Dummy-Worker Blockchain

### 1. Download the Latest CKB Binary

Download the latest `ckb` binary file from the CKB releases page on [GitHub](https://github.com/nervosnetwork/ckb/releases).

The following commands can be used to verify the binaries are working and to check versions:

```bash
ckb --version
ckb-cli --version
```

<details>
<summary>(click here to view result)</summary>
```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```
</details>

### 2. Initialize the Configuration

Use the following command to initialize the development blockchain and generate the required configuration files:

```bash
ckb init --chain dev
```

<details>
<summary>(click here to view result)</summary>
```bash
WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create specs/dev.toml
create ckb.toml
create ckb-miner.toml
```
</details>

### 3. Configure the Block Assembler

The Block Assembler configuration specifies which address should be receive block rewards for mining.

#### 3a. Create a New Account

An address to receive the block rewards must be created. We can do this using `ckb-cli`.

Note: Be sure to record the `lock_arg` value in the response which we will use in the next step.

```
ckb-cli account new
```

<details>
<summary>(click here to view result)</summary>
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

#### 3b. Update the Configuration

Modify the `args` and `message` parameters in the `ckb.toml` file under the `block_assembler` section:

```
[block_assembler]
code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8" // Do not change this.
args = "0x8d627decece439977a3a0a97815b63debaff2874" // Change this to your lock_arg value. 
hash_type = "type" // Do not change this.
message = "A 0x-prefixed hex string" // Change this to "0x" to supply an empty message.

```

### 4. Adjust the Parameters to Shorten the Block Interval (Optional)

For most development the default configuration should be sufficient, but sometimes it is beneficial to speed up certain operations so results can be viewed quickly.

#### 4a. Change the Number of Blocks in an Epoch

The default epoch length is `1000` blocks. Reducing this to `10` or `100` can help with testin Nervos DAO operations.

Modify the `genesis_epoch_length` parameter in the `specs/dev.toml` file under the `params` section:

```
[params]
genesis_epoch_length = 1000  # The unit of meansurement is "block".
```

#### 4b. Use Permanent Difficulty

When `permanent_difficulty_in_dummy` is set to `true`, all epochs will use the same length as the genesis epoch length, skipping the difficulty adjustment entirely. This param is typically used in conjunction with `genesis_epoch_length`.

Modify the `permanent_difficulty_in_dummy` parameter in the `specs/dev.toml` file under the `params` section:

```
[params]
genesis_epoch_length = 10
permanent_difficulty_in_dummy = true
```

#### 4c. Change the Mining Interval

The default mining interval is `5000`, which is a value in milliseconds, meaning 5 seconds. Reducing this value will create blocks faster.

Modify the `value` parameter in the `ckb-miner.toml` file under the `miner.workers` section:

```
[[miner.workers]]
worker_type = "Dummy"
delay_type = "Constant"
value = 5000  # The unit of measurement is "ms".
```

### 5. Start the CKB Node

```
ckb run
```
<details>
<summary>(click here to view result)</summary>
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

### 6. Start the CKB Miner

This should be performed in a separate terminal.

```
ckb miner
```
<details>
<summary>(click here to view result)</summary>
```bash
2020-06-05 18:31:21.558 +08:00 main INFO sentry  sentry is disabled
Dummy-Worker ⠁ [00:00:00] 
Found! #1 0x47995f78e95202d2c85ce11bce2ee16d131a57d871f7d93cd4c90ad2a8220bd1
Found! #2 0x19978085abfa6204471d42bfb279eac0c20e3b81745b48c4dcaea85643e301f9
Found! #3 0x625b230f84cb92bcd9cb0bf76d1397c1d948ab25c19df3c4edc246a765f94427
Found! #4 0x4550fb3b62d9d5ba4d3926db6704b25b90438cfb67037d253ceceb2d86ffdbf7

```
</details>

 ## Setup an Eaglesong-Worker Blockchain

### 1. Download the Latest CKB Binary

Download the latest ckb binary file from the CKB releases page on [GitHub](https://github.com/nervosnetwork/ckb/releases).

The following commands can be used to verify the binaries are working and to check versions:

```bash
ckb --version
ckb-cli --version
```

<details>
<summary>(click here to view result)</summary>
```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```
</details>

#### 2. Create a New Account

An address to receive the block rewards must be created. We can do this using `ckb-cli`.

Note: Be sure to record the `lock_arg` value in the response which we will use in the next step.

```
ckb-cli account new
```

<details>
<summary>(click here to view result)</summary>
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

### 3. Initialize the Configuration with the Miner Account

```
ckb init -c dev --ba-arg 0x41ecee7b8fc0783c75da1f4346009b2e5a774a96 // Change this to your lock_arg value. 
```
<details>
<summary>(click here to view result)</summary>
```bash
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create specs/dev.toml
create ckb.toml
create ckb-miner.toml
```
</details>

### 4. Change the PoW Function to Eaglesong

Modify the `func` parameter in the `specs/dev.toml` file under the `pow` section:

```
func = "Eaglesong"
```

Replace the `miner.workers` section in the `specs/dev.toml` file with the following:

```
[[miner.workers]]
worker_type = "EaglesongSimple"
threads = 1
```

### 5. Start the CKB Node

```
ckb run
```
<details>
<summary>(click here to view result)</summary>
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

### 6. Start the CKB Miner

This should be performed in a separate terminal.

```
ckb miner
```
<details>
<summary>(click here to view result)</summary>
```bash
2020-06-05 11:25:37.867 +08:00 main INFO sentry  sentry is disabled
EaglesongSimple-Worker-0 ⠁ [00:00:00] 
2020-06-05 11:25:37.870 +08:00 main INFO ckb-memory-tracker  track current proceFound! #1 0x57e6ad0f15bacc4f30e53811d488d895e6619c17222981eca5484f0115f84acd
Found! #2 0xe5831f39f928dca599a02e490c482a881ccdc47a2376371dec4e440e363fa5c0
Found! #3 0x605b3e6449954c2daa996c06b2412bbf60b8231763149742119fb623f9de27b2
Found! #4 0x64064e7257ea4589e8cb177cf119c68ab1b4559de005a20dc13ef3d42949e04b
```
</details>

## Transferring CKBytes Using `ckb-cli`

Included in CKB releases is the `ckb-cli` command line tool. This is can be used to directly invoke RPC calls to perform actions such as managing accounts, transferring CKBytes, and checking account balances. We will demonstrate a CKBytes transfer below. Please refer to [ckb-cli](https://github.com/nervosnetwork/ckb-cli) for full instructions.

Note: Using `ckb-cli` to transfer CKBytes is recommended for developing and testing purposes only. For management of real funds and assets please use a wallet.

### 1. Enter the `ckb-cli` Interface

```
ckb-cli
```
<details>
<summary>(click here to view result)</summary>
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

### 2. Create a New Account

```
account new
```
<details>
<summary>(click here to view result)</summary>
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

3. Check the Balance of an Existing Account

In the previous sections you created a miner account that collects all mining rewards. Using the following command with the correct address will show you the current CKByte balance:

```
wallet get-capacity --address "miner's address" 
```
<details>
<summary>(click here to view result)</summary>
```bash
CKB> wallet get-capacity --address "ckt1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qpg5cus"
immature: 8027902.89083717 (CKB)
total: 46253677.72927512 (CKB)
```
</details>

### 4. Transfer 10,000 CKBytes to the New Account

```
wallet transfer --from-account "miner's address" --to-address "new account's address" --capacity 10000 --tx-fee 0.00001
```
<details>
<summary>(click here to view result)</summary>
```bash
CKB> wallet transfer --from-account ckt1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qpg5cus --to-address ckt1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqnsxch5 --capacity 10000 --tx-fee 0.00001
Password: 
0x1b66aafaaba5ce34de494f60374ef78e8f536bb3af9cab4fa63c0f29374c3f89
```
</details>

### 5. Check the New Account's Balance

```
wallet get-capacity --address "new account's address"
```

<details>
<summary>(click here to view result)</summary>
```bash
CKB> wallet get-capacity --address ckt1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqnsxch5
total: 10000.0 (CKB)
```
</details>

The transfer is successful!

## Adding the Genesis Issued Cells

When the development blockchain configuration is generated with `ckb init --chain dev`, a few Cells are created with large amounts of capacity. These are specified in `specs/dev.toml` and exist only for your local development blockchain, and they can be useful for testing purposes.

<table>
  <tr>
    <td colspan="2">Genesis Issued Cell #1</td>
  </tr>
  <tr>
    <td>Private Key</td><td>0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc</td>
  </tr>
  <tr>
    <td>Lock Arg</td><td>0xc8328aabcd9b9e8e64fbc566c4385c3bdeb219d7</td>
  </tr>
  <tr>
    <td>Testnet Address</td><td>ckt1qyqvsv5240xeh85wvnau2eky8pwrhh4jr8ts8vyj37</td>
  </tr>
  <tr>
    <td>Capcity</td><td>20,000,000,000 CKBytes</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="2">Genesis Issued Cell #2</td>
  </tr>
  <tr>
    <td>Private Key</td><td>0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d</td>
  </tr>
  <tr>
    <td>Lock Arg</td><td>0x470dcdc5e44064909650113a274b3b36aecb6dc7</td>
  </tr>
  <tr>
    <td>Testnet Address</td><td>ckt1qyqywrwdchjyqeysjegpzw38fvandtktdhrs0zaxl4</td>
  </tr>
  <tr>
    <td>Capcity</td><td>5,198,735,037 CKBytes</td>
  </tr>
</table>

### 1. Create Private Key Files

Private keys must be added to a text file before they can be used.

```
echo 0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc > pk1
echo 0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d > pk2
```

### 2. Import the Private Keys

Import the private key files using `ckb-cli`:

```
CKB> account import --privkey-path pk1
CKB> account import --privkey-path pk2
```

<details>
<summary>(click here to view result)</summary>
```
Password:
address:
  mainnet: ckb1qyqvsv5240xeh85wvnau2eky8pwrhh4jr8ts6f6daz
  testnet: ckt1qyqvsv5240xeh85wvnau2eky8pwrhh4jr8ts8vyj37
lock_arg: 0xc8328aabcd9b9e8e64fbc566c4385c3bdeb219d7
Password:
address:
  mainnet: ckb1qyqywrwdchjyqeysjegpzw38fvandtktdhrsj8renf
  testnet: ckt1qyqywrwdchjyqeysjegpzw38fvandtktdhrs0zaxl4
lock_arg: 470dcdc5e44064909650113a274b3b36aecb6dc7
```
</details>



