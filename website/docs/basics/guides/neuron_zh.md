---
id: neuron_zh
title: Neuron 钱包指南
---

Neuron 钱包是 Nervos 基金会开发的 CKB 钱包，它可以保存你的私钥，并代表你创建并广播交易。目前 Neuron 钱包会默认在本地运行一个 CKB 全节点，并且已配置为连接 CKB 主网。安装完成后，当你打开 Neuron 钱包时，本地全节点便会开始同步数据。

你也可以自己 [运行一个主网全节点](mainnet_zh.md)，然后启动 Neuron 钱包，这样 Neuron 就不会启动默认的本地全节点，而是直接连接你的节点。

本教程将分为以下多个小节，每个小节都会有对应详细教程：

- 下载安装 Neuron 钱包
- 等待数据同步完成
- 创建一个新的钱包或将你的 keystore 文件或助记词导入 Neuron 钱包
- 申领被锁定的代币
- 存入 Nervos DAO
- 从 Nervos DAO 提取代币
- 将 CKBytes 从 Neuron 钱包转移到其他钱包和交易所

---

注意： `资产账户` 功能目前处于实验状况，目前只能在 Aggron 测试网使用。

-  管理 `资产账户`

如果在操作本教程的过程中遇到异常，请加入 [discord 频道](https://discord.gg/n6tx7uC) 咨询讨论。

**重要提醒：Nervos 团队绝不会主动要求你提供私钥、keystore 文件、助记词以及钱包密码。你切勿与任何人共享此信息，否则可能会导致丢失所有代币。**

* * *

## 1. 下载安装 Neuron 钱包

从 [Github](https://github.com/nervosnetwork/neuron/releases) 的 [Neuron 钱包发行页面](https://github.com/nervosnetwork/neuron/releases)下载 Neuron 钱包的最新发行版并进行安装。**请确保该版本为最新版本。**导入先前由 Neuron 钱包生成的 keystore 文件或助记词（下面有完整指南），等待数据同步完成，然后你就可以看到钱包的余额已更改。

## 2. 等待数据同步完成
你可以通过匹对 CKB 浏览器上的最新区块数来验证数据同步是否完成。

<img src="../../assets/neuron-wallet-guide/synchronize.png" width = "600"/>

## 3. 创建一个新的钱包或将你的 keystore 文件或助记词导入 Neuron 钱包

如果你使用的是新钱包，则只需按照 Neuron 钱包中的步骤操作。

如果你已经备份了钱包并拥有 keystore 文件（使用`备份当前钱包`）或已经记下助记词，则需要导入现有的 keystore 文件或助记词，请按照以下步骤操作。

* 备份当前钱包: 

<img src="../../assets/neuron-wallet-guide/backupwallet.png" width = "600"/>

- 若是要导入助记词，则选择 “导入钱包 > 导入助记词”，然后填写密码等待同步即可。密码不需要跟此前的钱包密码一致。

<img src="../../assets/neuron-wallet-guide/importseed1.png" width = "600"/>

  - 若是要导入 keystore 文件，则选择 “导入钱包 > 导入 keystore 文件”，然后等待同步即可。这里的密码需要跟此前设置的密码一致。

<img src="../../assets/neuron-wallet-guide/importkeystore.png" width = "600"/>

<img src="../../assets/neuron-wallet-guide/keystorefile.png" width = "600"/>

只要 Neuron 钱包同步完成，你就可以进行操作了。你可以发送接收 CKBytes，或者存 CKBytes 到 Nervos DAO 中。

## 4. 申领被锁定的代币

你可以使用最新版本（或更高版本）申领被锁定的代币。不过在此之前，请耐心等待 Neuron 同步，同步完成后，在 “自定义资产” 页面会自动显示账户的资产，在你进行转账或者存款到 Nervos DAO 前，你必须手动申领资产。

* 在 “自定义资产” 页查看详情

<img src="../../assets/neuron-wallet-guide/viewlockedtoken.png" width = "600"/>

* 申领被锁定的代币

达到锁定时间后，单击申领并输入钱包密码。

<img src="../../assets/neuron-wallet-guide/claim.png" width = "600"/>

<img src="../../assets/neuron-wallet-guide/password.png" width = "600"/>

## 5. 将 CKBytes 存入 Nervos DAO

The [economic model](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md) of Nervos CKB is designed to allow token holders to lock tokens in the Nervos DAO to mitigate the inflationary effect of the secondary issuance. In this case, the inflationary effect of secondary issuance is expected to be nominal, equivalent to holding tokens with a hard cap. Please refer to [Nervos DAO Explained](https://medium.com/nervosnetwork/nervos-dao-explained-95e33898b1c) for more details). 

Nervos CKB 的[经济模型](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md) 可以让代币持有者将代币锁定在Nervos DAO中，以减轻二级发行的通胀效应。在这种情况下，二级发行的通货胀效就只是名义上的通胀，持有者等同于持有总量恒定的代币。更多有关详细信息，请参考《[Nervos DAO解释](https://medium.com/nervosnetwork/nervos-dao-explained-95e33898b1c)》。

请确保你的余额大于 102 CKB。

- 打开Neuron 钱包（最新版本），选择 “Nervos DAO” 和 “存入”。

<img src="../../assets/neuron-wallet-guide/deposit.png" width = "600"/>

<img src="../../assets/neuron-wallet-guide/deposit2.png" width = "600"/>

## 6. 从 Nervos DAO 提取代币

> 在主网上进行交易之前，请阅读以下[免责声明](https://docs.nervos.org/references/neuron-wallet-guide#disclaimer)

你可以点击 “取回” 按钮取回你的代币。

<img src="../../assets/neuron-wallet-guide/withdraw1.png" width = "600"/>

<img src="../../assets/neuron-wallet-guide/withdraw2.png" width = "600"/>

## 7. 将 CKBytes 从 Neuron 钱包转移到其他钱包和交易所

> 在主网上进行交易之前，请阅读以下[免责声明](https://docs.nervos.org/references/neuron-wallet-guide#disclaimer)

你需要拥有第三方钱包/交易所地址，同时请确保你的账户余额大于 62 CKB。

- 点击 “转账” ，填写相关转账信息，可以打开高级设置开关自定义交易费用，点击发送，交易完成。

<img src="../../assets/neuron-wallet-guide/send.png" width = "600"/>

## 8. 管理 `资产账户`

`Asset Account` is used for managing the accounts which include anyone-can-pay( [RFC: anyone-can-pay lock](https://talk.nervos.org/t/rfc-anyone-can-pay-lock/4438)) cells and SUDTs ( [RFC: Simple UDT Draft Spec](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)). It's recommended to use `ckb-udt-cli`to issue or transfer UDTs, you may refer the [github repository](https://github.com/ququzone/ckb-udt-cli) for more details. Please note that the feature is experimental and only can be used on the Testnet Aggron now.  

`资产账户`

### Manage the SUDT account
#### Preparation

* Run a CKB Testnet Node
You may refer to [Run a CKB Testnet Node](testnet.md)

* Use `ckb-cli` to create a new account with `lock_arg` and export the privkey by using the `lock_arg`.

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
  mainnet: ckb1qyqwuea9tpxr2equ75rskyn30r3wjans7fnq477mmm
  testnet: ckt1qyqwuea9tpxr2equ75rskyn30r3wjans7fnqgmqyh8
lock_arg: 0xee67a5584c35641cf5070b127178e2e97670f266
lock_hash: 0x8b2595bb1c4720951a5363fbf0adb0ab1e2ff5acd7391f123837242712fc8490

```
</details>

```
ckb-cli account export --extended-privkey-path wallet --lock-arg `Your lock_arg`
```
<details>
<summary>(click here to view response)</summary>
​```bash
./ckb-cli account export --extended-privkey-path wallet --lock-arg 0xee67a5584c35641cf5070b127178e2e97670f266
Password: 
Success exported account as extended privkey to: "wallet", please use this file carefully

```
</details>

```
cat wallet 
```
The first line of the result is exported private key.
<details>

<summary>(click here to view response)</summary>
```bash
0a348a7cd1449ece26f1cede3916266793ce18beb280b75dda690057ebfcda3c  // It is the privkey
c152037977043a11e7e6ef220ba050da12da16455a0ef303907865a15fa9c484% 

```
</details>

* Use `ckb-udt-cli` to issue UDTs

Please clone and build it firstly,then use [Nervos Aggron Faucet](https://faucet.nervos.org/) to claim testnet CKB for issuing.

```
git clone https://github.com/ququzone/ckb-udt-cli.git

cd ckb-udt-cli

export GOPROXY=https://goproxy.io
go mod download
go build .
```
Issue the UDTs，please backup the `uuid`.

```
ckb-udt-cli issue -c config.yaml -k YOUR_PRIVATE_KEY -a AMOUNT // AMOUNT means the number of issued tokens
```
<details>
<summary>(click here to view response)</summary>
```bash
./ckb-udt-cli issue -c config.yaml -k 0a348a7cd1449ece26f1cede3916266793ce18beb280b75dda690057ebfcda3c -a 1000000
Issued sUDT transaction hash: 0x6b4458143b25e8aa37d36c1035f15e63e5051144685a4da20cf92fd7af59e56e, uuid: 0x8b2595bb1c4720951a5363fbf0adb0ab1e2ff5acd7391f123837242712fc8490

```
</details>

#### Add the SUDT account to the `Asset Accounts` in Neuron Wallet 

* Open `Asset Account` in Neuron Wallet, create a SUDT account.

<img src="../../assets/neuron-wallet-guide/createsudt.png" width = "600"/>

You may fill `uuid` in `Token id`.

<img src="../../assets/neuron-wallet-guide/tokeninfo.png" width = "600"/>

Please wait untill the transaction is successful. 

### Manage the CKB account
`CKB account` can be used for anyone-can-pay cells and accepted by any amount of payment. It is accepted by any amount of payment between `CKB account`.

* Create two `CKB account` "Anyone-can-pay1" and "Anyone-can-pay2"

   The following screenshots are examples for creating "Anyone-can-pay1"

<img src="../../assets/neuron-wallet-guide/createckb1.png" width = "600"/>

<img src="../../assets/neuron-wallet-guide/ckbtokeninfo.png" width = "600"/>

* Claim Testnet CKB for "Anyone-can-pay1" by [Nervos Aggron Testnet](https://faucet.nervos.org/)
    
    Get the address of "Anyone-can-pay1" and fill in [Nervos Aggron Testnet](https://faucet.nervos.org/).

<img src="../../assets/neuron-wallet-guide/receiveckb.png" width = "600"/>

* Transfer 1 CKB from "Anyone-can-pay1" to "Anyone-can-pay2"

<img src="../../assets/neuron-wallet-guide/sendckb.png" width = "600"/>

   Fill the address of "Anyone-can-pay2" in `Address`

<img src="../../assets/neuron-wallet-guide/sendckb2.png" width = "600"/>
  
   The transfer is successful!

<img src="../../assets/neuron-wallet-guide/successckb.png" width = "600"/>

## Troubleshooting

### Sync failed, please check network. /Sync is slow.

1. Quit and restart app several times.

Note: The Neuron bundled CKB node requires [VC++ redistributable](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads) on Windows to work properly. 

2. If step1 can't resolve, please [run a CKB mainnet node](/getting-started/run-node) and make sure the version is v0.32.0 or later instead of running the Neuron bundled node. 

3. if it still doesn't work out, please join the [Support](https://discord.gg/n6tx7uC) channel, export debug information and send it.

<img src="../../assets/neuron-wallet-guide/export.png" width = "600"/>

## Important

The bootstrapping of a proof-of-work (PoW) chain is difficult. A new PoW chain is in many ways like a newborn baby — weak in the beginning, but with unlimited potential when mature.

For a new PoW chain, risks may come from:

1. **Unstable Hashrate：**as the mining rewards will change drastically upon mainnet launch, an increase of hashrate is anticipated. It will create forks and uncle blocks in the first few weeks and the block time may be longer than expected due to NC-MAX's self adjustment. **For security, using a sufficiently large confirmation number is recommended before transferring CKBytes.**
2. **Immature Toolchain：**Early adopters of CKB technology should have a good understanding of NC-MAX, Cell model and CKB-VM to begin, otherwise mistakes or bugs may be created unintentionally. **The SDKs provided by Nervos Foundation are convenient tools to simplify RPC invocation and transaction building/signing/sending but have not been tested in a production environment yet, Please use them cautiously.**

We recommend CKB users exercise strong diligence in making any transactions during the first 2 to 4 weeks of mainnet as the chance of a re-org (reorganization of the current valid chain) is possible and may reverse transactions that had previous been sent. **If you need to send transaction in the early weeks, choose a sufficiently large confirmation number before transferring CKBytes.**

## Disclaimer

AS A DECENTRALIZED BLOCKCHAIN, NERVOS FOUNDATION DOES NOT CONTROL NERVOS CKB OR CKBYTES AND DOES NOT HAVE THE ABILITY TO STOP, BLOCK OR REVERSE ANY TRANSACTIONS. NERVOS FOUNDATION DOES NOT MAKE ANY WARRANTIES WHATSOEVER WITH RESPECT TO THE NERVOS CKB OR CKBYTES, INCLUDING ANY (i) WARRANTY OF MERCHANTABILITY; (ii) WARRANTY OF FITNESS FOR A PARTICULAR PURPOSE; (iii) WARRANTY OF TITLE; OR (iv) WARRANTY AGAINST INFRINGEMENT OF INTELLECTUAL PROPERTY RIGHTS OF A THIRD PARTY; WHETHER ARISING BY LAW, COURSE OF DEALING, COURSE OF PERFORMANCE, USAGE OF TRADE, OR OTHERWISE. YOU ACKNOWLEDGE THAT YOU HAVE NOT RELIED UPON ANY REPRESENTATION OR WARRANTY MADE BY THE FOUNDATION OR ANY OTHER PERSON ON ITS BEHALF. YOU ASSUME ALL RISKS AND LIABILITIES FOR THE RESULTS OBTAINED BY THE USE OF ANY CKBYTES AND REGARDLESS OF ANY ORAL OR WRITTEN STATEMENTS MADE BY THE FOUNDATION, BY WAY OF TECHNICAL ADVICE OR OTHERWISE.

```