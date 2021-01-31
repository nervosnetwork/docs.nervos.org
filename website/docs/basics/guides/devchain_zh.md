---
id: devchain_zh
title: 运行CKB开发链
---

Nervos CKB 支持一种特殊的开发模式，该模式对于构建和测试应用程序特别有用。这种操作模式是高度可配置的，并且使开发者无需进行工作量证明（PoW）挖矿即可加快区块间隔，调整 epochs 长度，创建区块。

运行开发链时，你有 `Dummy-Worker` 和 `Eaglesong-Worker` 两种模式可以选择。`Dummy-Worker` 提供的功能可以在没有 PoW 的情况下以恒定的出块时间出块。`Eaglesong-Worker` 使用真实的 PoW 出块。

注意：强烈建议将 `Dummy-Worker` 用于大多数开发方案。`Eaglesong-Worker ` 仅在需要验证 PoW 功能时才应使用此方法，因为在极低的哈希率下，区块时间可能会表现异常。

## 搭建 Dummy-Worker 模式的开发链

### 1.下载最新的 CKB 二进制文件

从 [GitHub](https://github.com/nervosnetwork/ckb/releases) 的 CKB 版本页面下载最新的 ckb 二进制文件。

以下命令可用于验证二进制文件是否正常工作并检查版本信息：

```bash
ckb --version
ckb-cli --version
```

<details>
<summary>(单击此处查看结果)</summary>
```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```
</details>
### 2.初始化配置

使用以下命令初始化开发链并生成所需的配置文件：

```bash
ckb init --chain dev
```

<details>
<summary>(单击此处查看结果)</summary>
```bash
WARN: mining feature is disabled because of lacking the block assembler config options
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create specs/dev.toml
create ckb.toml
create ckb-miner.toml
```
</details>
### 3.配置接收区块奖励

该配置主要指定一个用于接受挖矿区块奖励的地址。

#### 3.1创建一个新账户

必须创建一个接收区块奖励的地址。我们可以使用 `ckb-cli` 命令完成操作。

注意：确保记录返回值中的 `lock_arg` 值，我们在下一步中需要使用该值。

```
ckb-cli account new
```

<details>
<summary>(单击此处查看结果)</summary>
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
#### 3.2 更新配置

修改 `ckb.toml` 文件中 `block_assembler` 节段的 `args` 和 `message` 参数：

```
[block_assembler]
code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8" // Do not change this.
args = "0x8d627decece439977a3a0a97815b63debaff2874" // Change this to your lock_arg value. 
hash_type = "type" // Do not change this.
message = "A 0x-prefixed hex string" // Change this to "0x" to supply an empty message.

```

### 4. 调整参数以缩短出块间隔（可选）

对于大多数开发而言，默认配置应该足够了，但有时加快某些操作的速度可以快速查看结果，节省时间。

#### 4.1 修改一个 Epoch 的区块数量

epoch 的默认长度是 `1000` 个区块。将其降低到  `10` 或 `100`  有助于 Nervos DAO 的相关测试操作。

修改

修改 `specs/dev.toml` 文件中 `params` 节段的 `genesis_epoch_length` 参数:

```
[params]
genesis_epoch_length = 1000  # The unit of meansurement is "block".
```

#### 4.2 Use Permanent Difficulty 使用固定挖矿难度

当 `permanent_difficulty_in_dummy` 参数设置 `true`为时，所有的 epochs 将使用与创世 epoch 相同的长度，直接跳过难度调整。该参数通常与 `genesis_epoch_length`搭配使用。

修改 `specs/dev.toml` 文件中 `params` 节段的 `permanent_difficulty_in_dummy` 参数:

```
[params]
genesis_epoch_length = 10
permanent_difficulty_in_dummy = true
```

#### 4.3 修改挖矿间隔

默认挖矿间隔为 `5000`，单位为毫秒，即5秒。降低该数值可以加速出块。

修改 `ckb-miner.toml` 文件中 `miner.workers` 节段的 `value` 参数:

```
[[miner.workers]]
worker_type = "Dummy"
delay_type = "Constant"
value = 5000  # The unit of measurement is "ms".
```

### 5. 启动 CKB 节点

```
ckb run
```
<details>
<summary>(单击此处查看结果)</summary>
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
### 6. 启动 CKB Miner

这条命令得在单独的终端命令窗口执行

```
ckb miner
```
<details>
<summary>(单击此处查看结果)</summary>
```bash
2020-06-05 18:31:21.558 +08:00 main INFO sentry  sentry is disabled
Dummy-Worker ⠁ [00:00:00] 
Found! #1 0x47995f78e95202d2c85ce11bce2ee16d131a57d871f7d93cd4c90ad2a8220bd1
Found! #2 0x19978085abfa6204471d42bfb279eac0c20e3b81745b48c4dcaea85643e301f9
Found! #3 0x625b230f84cb92bcd9cb0bf76d1397c1d948ab25c19df3c4edc246a765f94427
Found! #4 0x4550fb3b62d9d5ba4d3926db6704b25b90438cfb67037d253ceceb2d86ffdbf7
```
</details>
## 搭建 Eaglesong-Worker 模式的开发链

### 1. 下载最新 CKB 二进制文件

从 [GitHub](https://github.com/nervosnetwork/ckb/releases) 的 CKB 版本页面下载最新的 ckb 二进制文件。

以下命令可用于验证二进制文件是否正常工作并检查版本信息：

```bash
ckb --version
ckb-cli --version
```

<details>
<summary>(单击此处查看结果)</summary>
```bash
ckb 0.32.1 (9ebc9ce 2020-05-29)
ckb-cli 0.32.0 (0fc435d 2020-05-22)
```
</details>

#### 2. 创建一个新账户

我们需要创建一个用于接收区块奖励的地址，可以使用 `ckb-cli` 命令。

注意：确保记录返回值中的`lock_arg`值，我们在下一步中需要使用该值。

```
ckb-cli account new
```

<details>
<summary>(单击此处查看结果)</summary>
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

### 3. 使用矿工账户初始化配置

```
ckb init -c dev --ba-arg 0x41ecee7b8fc0783c75da1f4346009b2e5a774a96 // Change this to your lock_arg value. 
```
<details>
<summary>(单击此处查看结果)</summary>
```bash
Initialized CKB directory in /PATH/ckb_v0.32.1_x86_64-apple-darwin
create specs/dev.toml
create ckb.toml
create ckb-miner.toml
```
</details>

### 4. 将PoW函数修改为 Eaglesong

修改 `specs/dev.toml` 文件中 `pow` 节段的 `func` 参数:

```
func = "Eaglesong"
```

将 `specs/dev.toml` 文件中的 `miner.workers` 节段替换为以下配置：

```
[[miner.workers]]
worker_type = "EaglesongSimple"
threads = 1
```

### 5. 启动 CKB 节点

```
ckb run
```
<details>
<summary>(单击此处查看结果)</summary>
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

### 6. 启动 CKB Miner

该命令需要在单独的终端命令窗口中执行：

```
ckb miner
```
<details>
<summary>(单击此处查看结果)</summary>
```bash
2020-06-05 11:25:37.867 +08:00 main INFO sentry  sentry is disabled
EaglesongSimple-Worker-0 ⠁ [00:00:00] 
2020-06-05 11:25:37.870 +08:00 main INFO ckb-memory-tracker  track current proceFound! #1 0x57e6ad0f15bacc4f30e53811d488d895e6619c17222981eca5484f0115f84acd
Found! #2 0xe5831f39f928dca599a02e490c482a881ccdc47a2376371dec4e440e363fa5c0
Found! #3 0x605b3e6449954c2daa996c06b2412bbf60b8231763149742119fb623f9de27b2
Found! #4 0x64064e7257ea4589e8cb177cf119c68ab1b4559de005a20dc13ef3d42949e04b
```
</details>

## 使用`ckb-cli`进行 CKBytes 转账

CKB 开发包中包含 `ckb-cli` 命令行工具。可使用该工具直接发起 RPC 调用执行如管理账户、CKBytes 转账以及检查账户余额等操作。下面我们将演示如何进行 CKBytes 转账。请参阅 [ckb-cli](https://github.com/nervosnetwork/ckb-cli) 以获取完整说明。

注意：建议仅在开发测试时才使用 `ckb-cli`进行 CKBytes 转账。实际操作资金资产，请使用钱包操作。

### 1. 进入`ckb-cli`命令窗口界面

```
ckb-cli
```
<details>
<summary>(单击此处查看结果)</summary>
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

### 2. 创建新账户

```
account new
```
<details>
<summary>(单击此处查看结果)</summary>
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
### 3.检查已有账户余额

上一小节中我们已经创建了一个矿工账户用于接收挖矿奖励。下面的命令我们使用此前生成的矿工账户显示 CKBytes 余额：

```
wallet get-capacity --address "miner's address" 
```
<details>
<summary>(单击此处查看结果)</summary>
```bash
CKB> wallet get-capacity --address "ckt1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qpg5cus"
immature: 8027902.89083717 (CKB)
total: 46253677.72927512 (CKB)
```
</details>

### 4. 给新账户转 10,000 CKBytes

```
wallet transfer --from-account "miner's address" --to-address "new account's address" --capacity 10000 --tx-fee 0.00001
```
<details>
<summary>(单击此处查看结果)</summary>
```bash
CKB> wallet transfer --from-account ckt1qyqg6cnaankwgwvh0gaq49uptd3aawhl9p6qpg5cus --to-address ckt1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqnsxch5 --capacity 10000 --tx-fee 0.00001
Password: 
0x1b66aafaaba5ce34de494f60374ef78e8f536bb3af9cab4fa63c0f29374c3f89
```
</details>

### 5. 检查新账户余额

```
wallet get-capacity --address "new account's address"
```

<details>
<summary>(单击此处查看结果)</summary>
```bash
CKB> wallet get-capacity --address ckt1qyq0g9p6nxf5cdy38fm35zech5f90jl5aueqnsxch5
total: 10000.0 (CKB)
```
</details>

转账成功！

## 添加创世发行的 Cells 

当使用 `ckb init --chain dev` 这个开发链配置时，会创建一些具有大容量的 Cells。具体配置可在  `specs/dev.toml` 中修改，仅用于测试用途。

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

### 1. 创建私钥文件

必须先将私钥添加到文本文件，然后才能使用它们。

```
echo 0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc > pk1
echo 0x63d86723e08f0f813a36ce6aa123bb2289d90680ae1e99d4de8cdb334553f24d > pk2
```

### 2. 导入私钥

使用`ckb-cli`命令导入私钥文件：

```
CKB> account import --privkey-path pk1
CKB> account import --privkey-path pk2
```

<details>
<summary>(单击此处查看结果)</summary>
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
