---
id: glossary
title: Glossary
---

## 术语小节

- [通用类术语](#通用类术语)
- [经济类术语](#经济类术语)
- [技术类术语](#技术类术语)

---

## 通用类术语

### 地址
支付地址的简称。

#### 同义词
- [支付地址](#支付地址)

---

### 资产
数字资产的简称。

#### 同义词
- [数字资产](#数字资产)
- [代币](#代币)

---

### 区块
区块链中用于包含并且确认交易的记录。

#### 参考
- [区块链](#区块链)
- [确认](#确认)
- [交易](#交易)

---

### 区块高度
区块高度是指区块链上已确认的区块总数。

具体制定某个区块高度时通常指的是特定的某个区块，因为通常在同个高度只有一个区块。

#### 同义词
- [高度](#高度)

#### 参考
- [区块](#区块)
- [区块链](#区块链)
- [确认](#确认)

---

### 区块间隔时间
区块链上创建两个区块中间间隔的大致时间。

比特币的区块间隔时间大约是 10 分钟，Nervos CKB 上的区块间隔时间是变化的，不过通过在 10 秒以下。

#### 同义词
- [区块时间](#区块时间)

#### 参考
- [区块](#区块)
- [区块链](#区块链)

---

### 区块广播
在链上向大多数全节点同步一个新区块的过程。

#### 同义词
- [广播](#广播)

#### 参考
- [区块](#block)
- [广播](#广播)
- [全节点](#全节点)

---

### 区块奖励
以原生代币支付给矿工的款项，奖励矿工新建区块以及保证网络安全所提供的算力资源。

#### 参考
- [区块](#区块)
- [区块补贴](#区块补贴)

---

### 出块时间
区块间隔时间的别称。

#### 同义词
- [区块间隔时间](#区块间隔时间)

---

### 区块链
一种不可篡改的数据结构，其中每个后续数据块都与之前的数据块进行加密链接。这就创造了一个类似于链式的结构，在这个结构中，所有的历史数据都不能被篡改，而不会导致验证错误。

#### 参考
- [区块](#区块)

---

### 广播
发送给区块链网络中所有节点的消息。

#### 参考
- [区块链](#区块链)
- [节点](#节点)

---

### 容量
一个 Cell 在 Nervos CKB 上可以占用的最大空间（单位：字节）。

#### 同义词
- [CKByte](#ckbyte)

#### 参考
- [CKB](#ckb)
- [共同知识库](#共同知识库)
- [共同知识字节](#共同知识字节)
- [Nervos 区块链](#Nervos 区块链)

---

### Cell
一个简单的结构，用于保存 Nervos CKB 上的一段状态或数据。

Cell 类似于比特币的 UTXO 概念。

#### 同义词
- [微状态](#微状态)

#### 参考
- [已销毁 Cell](#已销毁-Cell)
- [可用 Cell](#可用-Cell)
- [Nervos CKB](#nervos-ckb)
- [关键概念中的 Cell 模型定义](/key-concepts/cell-model)
- [UTXO](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Cell 模型
Nervos CKB 上状态管理方式的表示。

#### 参考
- [锁脚本](#锁脚本)
- [Nervos CKB](#nervos-ckb)
- [类型脚本](#类型脚本)
- [关键概念中的 Cell 模型定义](/key-concepts/cell-model)
- [Nervos 博客中的 Cell 模型定义](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-cell-model-7323fca57571)
- [UTXO](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### 链
区块链的简称。.

#### 同义词
- [区块链](#区块链)

---

### CKB
英文缩写，具体含义取决于具体的语境：

- 共同知识库（Common Knowledge Base）：Nervos 网络的 layer1，也称为 Nervos CKB。
- 共同知识字节（Common Knowledge Byte）：Nervos 网络的原生代币。

#### 同义词
- [共同知识库](#共同知识库)
- [共同知识字节](#共同知识字节)

---

### CKByte
共同知识字节（Common Knowledge Byte）的简称。

CKByte 有时候也直接简写为 CKB。交易所通常使用 CKB 作为代币符号。

#### 同义词
- [CKB](#ckb)
- [共同知识字节](#共同知识字节)

#### 易混淆：
- [共同知识库](#共同知识库)

---

### CKB-VM
在 Nervos CKB 用于执行脚本的虚拟机。

CKB-VM 的指令集为 RISC-V。

#### 参考
- [Nervos CKB](#nervos-ckb)
- [RISC-V](#risc-v)
- [脚本](#脚本)
- [百度百科的虚拟机定义](https://baike.baidu.com/item/%E8%99%9A%E6%8B%9F%E6%9C%BA)

---

### 冷存储
将资金存放在冷钱包的一种保障资金安全的方式。这类型的钱包不触网。

#### 参考
- [冷钱包](#冷钱包)
- [硬件钱包](#硬件钱包)
- [钱包](#钱包)

---

### 冷钱包
用于离线保障资产安全的钱包，这类钱包永不触网，不容易受到依赖在线网络连接的攻击。

#### 参考
- [冷存储](#冷存储)
- [钱包](#钱包)

---

### 共同知识库
共同知识库（Common Knowledge Base），一条为 Nervos 网络提供去中心化信任基础的 layer1 的 PoW 链。

#### 同义词
- [CKB](#ckb)
- [Nervos CKB](#nervos-ckb)

#### 易混淆
- [共同知识字节](#共同知识字节)

#### 参考
- [Nervos CKB](https://www.nervos.org/ckb/)

---

### 共同知识字节
共同知识字节（Common Knowledge Byte）是 Nervos layer1 网络的原生代币，通常简写为 CKByte 或者 CKB，拥有 1 CKByte 意味着持有者能够在 Nervos CKB 网络上存储 1 字节的数据。

#### 同义词
- [CKB](#ckb)
- [CKByte](#ckbyte)

#### 易混淆
- [共同知识库](#共同知识库)

#### 参考
- [Capacity](#capacity)
- [Nervos CKB](#nervos-ckb)
- [Shannon](#shannon)

---
### 确认
交易已被网络接受和验证并包含在一个区块中的过程。

#### 参考
- [区块](#区块)
- [交易](#交易)
- [未确认](#未确认)

---

### 共识
共识是某一状态在去中心化网络中的参与者（节点）之间达成一致。

#### 参考
- [全节点](#全节点)
- [节点](#节点)

---

### 加密货币
依靠数学和密码学来保障资金安全、实现点对点转账的数字货币。

#### 参考
- [数字货币](#数字货币)
- [法定货币](#法定货币)

---

### 加密签名
一条简明的证明数据，用于通过“签署”一条独特的数据来证明签名的创建者对某一特定私钥的所有权。这一签字过程证明了对私钥的所有权，但不透露私钥。

#### 同义词
- [私钥](#私钥)
- [签名](#签名)

---

### 密码学
研究和实践如何使用数学来确保通信和信息的安全。

#### 参考
- [维基百科密码学定义](https://zh.wikipedia.org/zh/%E5%AF%86%E7%A0%81%E5%AD%A6)

---

### Cycles
脚本执行所需要执行的 RISC-V 计算循环次数。

类似于以太坊的 Gas 概念。

#### 参考
- [脚本](#脚本)
- [RISC-V](#risc-v)
- [以太坊 Wiki 上的 Gas 定义](https://github.com/ethereum/wiki/wiki/%5BSimplified-Chinese%5D-Ethereum-TOC)

---

### DAO
去中心化自治组织（Decentralized Autonomous Organization）的简称。DAO 是一个按照计算机程序规则运行的组织。有质押参与者控制，可能没有实际的办公地点，因此减少了政府的影响。

#### 参考
- [百度百科上 DAO 的定义](https://bkso.baidu.com/item/%E5%8E%BB%E4%B8%AD%E5%BF%83%E5%8C%96%E8%87%AA%E6%B2%BB%E7%BB%84%E7%BB%87)

---

### 去中心化
在多方之间分散责任和所有权的过程，以减轻与单方控制有关的风险。

#### 参考
- [分布式](#分布式)
- [维基百科上去中心化的定义](https://zh.wikipedia.org/zh-hans/%E5%8E%BB%E4%B8%AD%E5%BF%83%E5%8C%96)

---

### 数字资产
数字资产是指具有价值的单个数据，或代表另一个具有价值的实体。

数字资产最常见的表现形式是代币，它可以作为数字货币使用，也可以代表不动产等实物。

#### 同义词
- [资产](#资产)
- [代币](#代币)

---

### 数字货币
一种主要通过互联网以数字形式存在的货币。货币的实物表现形式，如卡片、钞票或硬币，可能存在，但只是次要媒介。

#### 参考
- [加密货币](#加密货币)

---

### 分布式
一个系统，其中组件分布在多个节点上，以并行处理工作负载，增加冗余，或消除单点故障。

#### 参考
- [去中心化](#去中心化)

---

### 双花
双花是一种欺诈行为，即一个加密货币代币同时在两个地方花费，能够攻击者花费比他们实际拥有的更多的代币。

造成双花的原因主要是由于网络同步延迟。这些问题会随着时间的推移而自动解决，这就是为什么大多数区块链在考虑交易最终确定之前，对应该积累的最低确认数量设定了建议数值。

#### 参考
- [确认](#确认)
- [加密货币](#加密货币)
- [代币](#代币)
- [交易](#交易)

---

### Epoch
一个 epoch 其实是指一定区块范围内的时间段。

在 Nervos 上，一个 epoch 大约是 4 个小时。

#### 参考
- [区块](#区块)

---

### 一等资产
一等资产（first-class asset）是 CKB的一个独特属性，其中 Cell 的所有权以及其中包含的数据不由发行者、开发者或智能合约分配。用户拥有 Cell 的所有权，并负责支付与状态租金相关的费用。

#### 参考
- [Cell](#cell)
- [Cell 模型](#cell-模型)
- [状态租金](#状态租金)
- [Nervos 博客对一等资产的解释](https://medium.com/nervosnetwork/first-class-asset-ff4feaf370c4)

---

### 同质化代币
同种代币中，每个代币都具有相同的特性，并可与其他代币无区别互换。

当前大部分加密货币都属于同质化代币。

#### 参考
- [非同质化代币](#非同质化代币)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)

---

### 全节点
拥有区块链完整历史账本数据的节点。

#### 同义词
- [节点](#节点)

---

### 硬件钱包
一种使用物理硬件的形式存储私钥的加密货币钱包。这些设备永不触网，通常只与计算机接口交互，用于发送资金等特定活动。

硬件钱包是冷钱包的一种形式。

#### 参考
- [冷存储](#冷存储)
- [冷钱包](#冷钱包)
- [私钥](#私钥)
- [钱包](#钱包)

---

### 哈希率/算力
计算机处理加密运算能力的度量单位。这些运算也被称为“哈希”，即每秒钟能做多少次hash碰撞，就是其“算力”的代表，单位写成hash/s。

#### 参考
- [矿工](#矿工)
- [网络哈希率](#网络哈希率)

---

### 高度
区块高度的简称。

### 同义词
- [区块高度](#区块高度)

---

### 轻客户端
相比于全节点，对资源要求更低的节点软件。轻客户端可以实现最常见的基本功能，但不具备高级功能。

轻客户端不包含区块链网络的完整状态。它们通常依靠网络中的完整节点来运行。

#### 参考
- [区块链](#区块链)
- [全节点](#全节点)
- [节点](#节点)

---

### 主网
特指 Nervos CKB。

Nervos CKB 主网的名字为 Lina。

#### 同义词
- [CKB](#ckb)
- [共同知识库](#共同知识库)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### 易混淆
- [Aggron](#aggron)
- [测试网](#测试网)

---

### 内存池
内存池（mempool，memory pool 的简称）。在全节点中已向全网广播但仍未确认的交易，都会暂时记录在内存池中。

#### 参考
- [确认](#确认)
- [交易](#交易)

---

### 微状态
一个孤立的状态片，通常能够在不知道网络完整状态的情况下进行状态变更。

在 Nervos 中，一个 Cell 即为一个微状态。

#### 同义词
- [Cell](#cell)

#### 参考
- [状态](#状态)

---

### 矿工
矿工指为区块链网络提供算力进行交易验证以及出块的计算机节点。

#### 参考
- [区块](#区块)
- [区块链](#区块链)

---

### 矿工费
交易费用的另一种说法。

#### 同义词
- [交易费用](#交易费用)

---

### 挖矿
在区块链网络中提供算力进行交易验证和出块，以获得挖矿奖励的行为。

#### 参考
- [区块](#区块)
- [区块链](#区块链)
- [挖矿奖励](#挖矿奖励)
- [交易](#交易)

---

### 挖矿奖励
支付给矿工作为其提供计算挖矿算力的原生代币报酬。

#### 参考
- [矿工](#矿工)
- [挖矿](#挖矿)
- [原生代币](#原生代币)

---

### 原生代币
公链上用于支付交易费用和矿工/验证者奖励的代币类型。

Nervos 区块链的原生代币是 CKByte。

#### 参考
- [CKByte](#ckbyte)
- [代币](#代币)

---

### NC-MAX
Nervos 区块链上的共识算法。

#### 参考
- [共识](#共识)
- [Nervos 区块链](#nervos-区块链)

---

### 相邻节点
在区块链点对点网络中与节点直接连接的另一个节点。

#### 参考
- [节点](#节点)
- [点对点](#点对点)

---

### Nervos 区块链
Nervos 网络的 layer1，即共同知识库。

#### 同义词
- [共同知识库](#共同知识库)
- [Layer 1](#layer-1)
- [Nervos CKB](#nervos-ckb)

---

### Nervos DAO
可以让用户将 CKB 代币进行锁仓以获得二级发行奖励的系统。类似于其他公链的质押系统。

#### 参考
- [CKByte](#ckbyte)
- [DAO](#dao)
- [二级发行](#二级发行)
- [Nervos 博客对 Nervos DAO 的解释](https://medium.com/nervosnetwork/nervos-dao-explained-95e33898b1c)

---

### 网络哈希率
网络总算力的度量指标，网络哈希率越高，网络安全性越高。

#### 参考
- [哈希率](#哈希率)
- [矿工](#矿工)

---

### 节点
运行区块链节点软件的计算机。

#### 同义词
- [全节点](#全节点)

#### 参考
- [精简节点](#精简节点)

---

### 非同质化代币
即使是同种类型的代币，但每一枚代币都有不同的特性，都是独一无二的，这种代币就是非同质化代币。

非同质化代币通常用于独特的现实世界项目的数字表示，如不动产。

#### 参考
- [同质化代币](#同质化代币)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)

---

### 开源
一个软件，其源代码可供任何第三方自由查看或修改。

#### 参考
- [OpenSource.com 对开源的定义](https://opensource.com/resources/what-open-source)

---

### P2P
点对点的英文简称。

#### 同义词
- [点对点](#点对点)

---

### 纸钱包
将助记词或私钥打印在一张纸上离线储存的一种形式。然后，该文件将以传统方式存储在用户选择的安全地点，如保险柜。

#### 参考
- [私钥](#私钥)
- [钱包](#钱包)

---

### 支付地址
一串数字字母混合的字符串，可用于加密货币和资产的转账和接收。

Nervos 地址以 “ckb” 开头，总长度 46 个字符。

#### 同义词
- [地址](#地址)

---

### 点对点
一种节点之间彼此直接通讯，而不是通过中间第三方服务器路由的网络类型。

#### 同义词
- [P2P](#p2p)

#### 参考
- [节点](#节点)

---

### 工作量证明
一种需要高计算资源的共识算法，以产生密码谜题的答案，来换取以原生代币支付的挖矿奖励。

这些答案用于在公链中出块和处理交易。计算难度本身就是公链安全性的基础，因为它的复制成本极高。

#### 参考
- [区块](#区块)
- [共识](#共识)
- [挖矿奖励](#挖矿奖励)
- [权益证明](#权益证明)
- [交易](#交易)

---

### 权益证明
一种共识算法，网络的参与者通过投票，就出块和交易处理达成一致。每一次投票权重是根据投票者拥有的原生代币数量加权的。

#### 参考
- [共识](#共识)
- [挖矿奖励](#挖矿奖励)
- [工作量证明](#工作量证明)
- [交易](#交易)

---

### 广播
区块广播的简写。

#### 同义词
- [区块广播](#区块广播)

---

### Private Key
一串字母数字混合的字符串，用于证明加密货币或数字资产的所有权，允许将它们发送到其他支付地址。私钥通常存储在钱包中。

私钥在任何时候都必须保密。私钥的工作原理类似于装有你的加密货币的保险箱的钥匙。任何拥有钥匙的人都有能力打开保险箱并拿走里面的东西。

#### 参考
- [数字资产](#数字资产)
- [纸钱包](#纸钱包)
- [支付地址](#支付地址)
- [钱包](#钱包)

---

### 精简节点
值包含部分区块链历史数据的节点。

#### 参考
- [节点](#节点)

---

### Shannon
CKByte 的最小单位，1 CKByte = 100,000,000 Shannons。

香农（Shannon）类似于比特币的聪（Satoshi）。

#### 参考
- [CKByte](#ckbyte)
- [共同知识字节](#共同知识字节)
- [Bitcoin.org 上聪的解释](https://bitcoin.org/en/glossary/denominations)

---

### 签名
加密签名的简写。

#### 同义词
- [加密签名](#加密签名)

---

### 状态
存储在区块链中的数据。在大多数情况下，这意味着当前数据，不包括历史数据。

#### 参考
- [区块链](#区块链)

---

### 测试网
一个用于测试目的的备用公共区块链，运行着与主网相同或类似的软件。测试网上的所有代币和数据都没有价值。

Nervos 的测试网为 Aggron。

#### 同义词
- [Aggron](#aggron)

#### 易混淆
- [Lina](#lina)
- [主网](#主网)

---

### 链头
链头区块（tip block）的简称。

#### 同义词
- [链头区块](#链头区块)

---

### 链头区块
区块链中最近确认的区块。链头区块在区块链中具有最高的区块高度。

#### 同义词
- [链头](#链头)

#### 参考
- [区块](#区块)
- [区块高度](#区块高度)
- [区块链](#区块链)

---

### 交易
区块链中描述任何状态变化的条目。

#### 参考
- [区块链](#区块链)
- [Nervos 区块链](#nervos-区块链)

---

### 交易费用
发起交易时需要支付给矿工的以原生代币计价的费用。

#### 同义词
- [矿工费](#矿工费)

#### 参考
- [矿工](#矿工)
- [原生代币](#原生代币)
- [交易](#交易)

---

### 代币
用于促进区块链上交易的一个信息单位。

#### 参考
- [区块链](#区块链)
- [数字资产](#数字资产)
- [交易](#交易)

---

### UDT
用户自定义代币（User-Defined Token）的缩写。

#### 同义词
- [用户自定义代币](#用户自定义代币)

---

### 未确认
尚未确认的交易状态。未经确认的交易不能保证最终一致性。

#### 同义词
- [未确认交易](#未确认交易)

#### 参考
- [确认](#确认)
- [交易](#交易)

---

### 未确认交易
尚未确认的交易。未经确认的交易不能保证最终一致性。

#### 同义词
- [未确认](#未确认)

#### 参考
- [确认](#确认)
- [交易](#交易)

---

### 用户自定义代币
由用户定义属性创建的自定义代币。在一般情况下，这最常见的是指同质化代币。

用户自定义代币（User-Defined Token）通常使用其英文缩写表示： UDT。

#### 同义词
- [同质化代币](#同质化代币)
- [UDT](#udt)

#### 参考
- [ERC20](https://eips.ethereum.org/EIPS/eip-20)
- [ERC777](https://eips.ethereum.org/EIPS/eip-777)
- [简单 UDT 草案规范（Simple UDT Draft Spec）](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)

---

### 钱包
一个用于管理用户私钥和支付地址的软件。钱包允许用户发送和接收加密货币。一些钱包还包含管理数字资产的功能。

#### 参考
- [纸钱包](#纸钱包)
- [私钥](#私钥)
- [支付地址](#支付地址)
- [数字资产](#数字资产)

---

## 经济类术语

### Base Issuance
The creation of new CKBytes through temporary inflation that is paid to miners through Base Rewards.

Base Issuance is paid for by using a fixed and decreasing inflation schedule. Approximately every four years the amount is halved until eventually stopping when the cap of 33.6 billion CKBytes have been issued.

#### 参考
- [Base Reward](#base-reward)
- [CKByte](#ckbyte)
- [二级发行](#二级发行)
- [矿工](#矿工)
- [Crypto-Economics RFC on Nervos Network GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md)

---

### 基础奖励
向矿工支付的 CKB 代币补贴，奖励矿工提供处理交易和在 Nervos 上持久化保存数据所需的计算和存储需求。

基础奖励来源于基础发行，随着时间线性减少，直至最终结束。

#### 参考
- [基础发行](#基础发行)
- [CKByte](#ckbyte)
- [矿工](#矿工)
- [交易](#交易)

---

### 区块提交奖励
支付给矿工的 CKB 奖励，奖励矿工提交之前提议的交易。交易提交后，交易便已确认。

#### 参考
- [CKByte](#ckbyte)
- [确认](#确认)
- [矿工](#矿工)
- [交易](#交易)

---

### 法定货币
法定货币是一种没有内在价值的货币形式。法币的价值来自于维持法币的管理机构的支持，以及与法币进行交易的各方商定的价值。

#### 参考
- [加密货币](#加密货币)
- [数字货币](#数字货币)

---

### 重资产问题
在多资产公链中发现的一个常见问题，即存储在链上的资产价值获得了巨大的价值，但链上的原生代币却没有。这提高了攻击网络的动机，但并没有提高安全性，因为本机代币的价值是用来保护网络安全的。

#### 参考
- [资产](#资产)
- [Layer 1 流失问题](#layer-1-流失问题)
- [共同安全悲剧](#共同安全悲剧)

---

### 流动性
某项资产在不引起当前市场价格重大变化的情况下，能够轻易地买进或卖出的能力。

#### 参考
- [资产](#资产)

---

### 区块提议奖励
支付给矿工的 CKB 奖励，以奖励他们提出一笔未经确认的交易。在提出交易后，该交易才能被提交。

#### 参考
- [CKByte](#ckbyte)
- [确认](#确认)
- [矿工](#矿工)
- [交易](#交易)

---

### 二级发行
有限递降的 CKB 通胀，用于支付矿工的二级奖励。

二次发行遵循固定的通货膨胀时间表，每年 13.44 亿 CKB。这个数额不会改变。与基础发行不同，二次发行并不影响网络上的所有人。它是来自占用 Nervos 空间或在 Nervos DAO 以外持有 CKB 的用户的小规模定向膨胀。

#### 参考
- [基础发行](#基础发行)
- [CKByte](#ckbyte)
- [Nervos DAO](#nervos-dao)
- [二级奖励](#二级奖励)
- [状态](#状态)
- [经济模型 RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.zh.md)

---

### 二级奖励
向矿工支付的 CKB 补贴，奖励矿工提供处理交易和在 Nervos 上持久化保存数据所需的计算和存储需求。

二次奖励来源于二次发行，持续向矿工支付区块链中包含的状态数据的保存费用。

#### 参考
- [CKByte](#ckbyte)
- [矿工](#矿工)
- [二级发行](#二级发行)
- [交易](#交易)

---

### Layer 1 流失问题
多层区块链平台可能出现的情况是，绝大部分交易流量从 layer1 转移到 layer2，带走了绝大部分的交易费用。如果 layer1 完全依靠交易费用来支持平台的安全，那么最终可能没有足够的激励机制来妥善保障平台的安全。

#### 参考
- [重资产问题](#重资产问题)
- [Layer 1](#layer-1)
- [Layer 2](#layer-2)
- [交易](#交易)
- [交易费用](#交易费用)

---

### 状态租金
为持久化和保护状态数据而支付的经常性费用。

在 Nervos 上，二次发行对占据 Nervos 区块链空间的用户产生的稀释，就是支付状态租金的一种方式。

#### 参考
- [二级发行](#二级发行)
- [Nervos 区块链](#nervos-区块链)
- [经济模型 RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.zh.md)

---

### 资产存储
一个旨在安全保存多种类型资产的平台，每一种资产都可以成为价值储藏。

#### 参考
- [价值存储](#价值存储)

---

### 价值存储
一种用于维持长期购买力的资产。

一个好的价值存储要么与货币的通货膨胀率相匹配，要么超过货币的通货膨胀率，并且具有合理的流动性，使资产可以轻易地出售。

#### 参考
- [资产存储](#资产存储)
- [流动性](#流动性)

---

### Tail Emission
一种通过固定的通货膨胀率支付给矿工的奖励。

#### 参考
- [二级奖励](#二级奖励)

---

### 定向通胀
一种只影响特定用户群的通货膨胀形式。

Nervos 利用二次发行对占用Nervos区块链空间的用户进行定向通胀，以支付状态租金。CKB 的长期持有者可以选择将其锁定在 Nervos DAO 中，Nervos DAO 起到抵消通胀的作用。

#### 参考
- [CKByte](#ckbyte)
- [二级发行](#二级发行)
- [Nervos 区块链](#nervos-区块链)
- [Nervos DAO](#nervos-dao)
- [经济模型 RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.zh.md)

---

### 公地悲剧
在一个系统中，参与者按照自己的利益行事，所有参与者的行为消耗或破坏共享资源的情况。

#### 参考
- [公共安全悲剧](#公共安全悲剧)
- [公共存储悲剧](#公共存储悲剧)

---

### 公共安全悲剧
在多资产区块链平台上可能会出现一种情况，即资产代币依赖区块链平台的存储和安全，但不对平台进行回馈。随着 “免费搭车” 的资产数量的增加，给底层区块链平台带来的负担也会增加。如果资产对底层平台没有贡献，现有的安全性可能无法正常支持网络。

#### 参考
- [重资产问题](#重资产问题)
- [公地悲剧](#公地悲剧)
- [公共存储悲剧](#公共存储悲剧)

---

### 公共存储悲剧
在激励型区块链平台上，可能会出现这样一种情况：将数据纳入区块链会获得挖矿奖励，但对区块链数据的长期持久化不存在奖励。随着区块链的规模扩大，数据持久化的相关成本也会增加。如果没有持久化数据的直接激励，越来越少的节点会这样做。最终，可用来适当支持网络的节点将太少。

#### 参考
- [公地悲剧](#公地悲剧)
- [公共安全悲剧](#公共安全悲剧)

---

## 技术类术语

### Active Cell
A Cell in the current state of CKB. Active cells can be used as inputs to transactions.

#### 同义词
- [Live Cell](#live-cell)

#### 参考
- [Cell](#cell)
- [Input](#input)
- [交易](#交易)

---

### Aggron
The name of the main public testnet for Nervos CKB.

- **ckb version**: >= v0.32.0 (latest stable is recommended)
- **genesis hash**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **launched at**: 2020-05-22 04:00:00 UTC

#### 同义词
- [Testnet](#testnet)

#### Not To Be Confused With
- [Lina](#lina)
- [主网](#主网)

---

### Animagus
A framework layer that runs on top of Nervos CKB which provides an easy way to query for account balances without having to go through the Cell Collection process.

#### 参考
- [Cell Collection](#cell-collection)
- [Nervos CKB](#nervos-ckb)
- [Animagus Introduction on the Nervos Blog](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-animagus-part-1-introduction-66fa8ce27ccd-cfb361a7d883)

---

### Args
Args is short for arguments, and is data provided to a Lock Script or Type Script within a Cell. This is nearly identical to arguments provided to a normal command-line application.

Arguments are stored as part of the Cell when it is created.

#### 参考
- [Cell](#cell)
- [Lock Script](#lock-script)
- [Type Script](#type-script)

---

### Axon
A layer 2 side-chain of the Nervos CKB developed by the Nervos Core Team. Axon provides high-performance smart contract execution while utilizing Nervos CKB as a trust layer.

#### 参考
- [Layer 2](#layer-2)
- [Nervos CKB](#nervos-ckb)
- [Axon on Nervos.org](https://www.nervos.org/network/)

---

### Blake2b
A general-purpose cryptographic hashing algorithm that can create a succinct data fingerprint for any type of data.CKB uses blake2b as the default hash algorithm. 

#### 参考
- [Blake2b paper](https://blake2.net/blake2.pdf)
- [Ckbhash](#ckbhash)
- [Blake Hash Function on Wikipedia](https://en.wikipedia.org/wiki/BLAKE_(hash_function))
- [Hash Function on Wikipedia](https://en.wikipedia.org/wiki/Hash_function)

---

### Block Subsidy
A payment that is made in the native currency of the blockchain that is paid to to miners for providing the computational resources create a block and secure the blockchain.

The subsidy consists is the portion of the total block reward that is issued out of inflation for creating the block, but does not include any additional transaction fees that may be paid on top.

#### 同义词
- [Block Reward](#block-reward)
- [交易费用](#交易费用)

---

### BLS
A cryptographic signature scheme for signing and verification.

BLS is short for Boneh–Lynn–Shacham.

#### 参考
- [Boneh–Lynn–Shacham on Wikipedia](https://en.wikipedia.org/wiki/Boneh%E2%80%93Lynn%E2%80%93Shacham)

---

### Boxer
A lightweight Rust library for verifying the Nervos layer 1 blockchain, the Common Knowledge Base.

#### 参考
- [共同知识库](#共同知识库)
- [Boxer on GitHub](https://github.com/xxuejie/ckb-boxer)

---

### Cell Collection
The process of gathering cells that meet certain criteria.

For example: To find the balance of a particular account, all active cells for the address would need to be collected.

#### 参考
- [Cell](#cell)

---

### Cellbase
The transaction in each block that is responsible for the minting of new CKBytes.

This is the equivalent of a coinbase transaction in Bitcoin.

#### 参考
- [CKByte](#ckbyte)
- [Coinbase on Bitcoin.org](https://bitcoin.org/en/glossary/coinbase)

---

### Ckbhash
CKB uses blake2b as the default hash algorithm with following configurations:

- output digest size: `32`
- personalization: `ckb-default-hash`

`ckbhash` is used to denote the blake2b hash with the configurations above, there are example and test vectors in python 3:

```python
import hashlib
import unittest

def ckbhash():
    return hashlib.blake2b(digest_size=32, person=b'ckb-default-hash')

class TestCKBBlake2b(unittest.TestCase):

    def test_empty_message(self):
        hasher = ckbhash()
        hasher.update(b'')
        self.assertEqual('44f4c69744d5f8c55d642062949dcae49bc4e7ef43d388c5a12f42b5633d163e', hasher.hexdigest())

if __name__ == '__main__':
    unittest.main()
```
#### 参考
- [Blake2b](#blake2b)

---

### CKB Merkle Tree

CKB Merkle Tree is a CBMT( [Complete Binary Merkle Tree](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md#complete-binary-merkle-tree) ) using following merge function:

```
ckbhash(left || right)
```

> [ckbhash](#ckbhash) is the hash function, `||` denotes binary concatenation.

#### 参考
- [Merkle Tree for Static Data](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md)
- [Ckbhash](#ckbhash)
- [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)

---

### Code Hash
A field in a Cell that contains a hash value which could refer to a specific piece of data, or a specific cell referenced by Type ID.

#### 参考
- [Cell](#cell)
- [Data](#data)
- [Type ID](#type-id)

---

### Commit
The process of taking a proposed transaction and adding it to the blockchain. After the transaction has been committed it is confirmed.

Miners are incentivized to commit transactions by being paid a commit reward.

#### 参考
- [Commit Reward](#commit-reward)
- [确认](#确认)
- [Propose](#propose)
- [交易](#交易)

---

### Commitment Zone
Section of the block that contains transaction commitments. The commitment zone can only contain valid transactions which have appeared in the proposal zone of one of the previous 2 to 10 blocks.

#### 参考
- [区块](#区块)
- [Proposal Zone](#proposal-zone)
- [交易](#交易)

---

### Consume
The process of using a Live Cell as an input to a transaction.

The process of consumption marks the Live Cell as a Dead Cell. This is the equivalent of marking a UTXO as spent in Bitcoin.

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Crypto Primitives
Well-established, low-level cryptographic algorithm commonly used to build out a cryptographic protocol.

#### 参考
- [Cryptographic Primitive on Wikipedia](https://en.wikipedia.org/wiki/Cryptographic_primitive)

---

### Data
In Nervos specific contexts, data may refer to the data structure within a Cell. This structure is used to hold any form of information that needs to be stored on the Nervos blockchain.

In more general contexts, data may refer to any form of information.

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)

---

### Dead Cell
A cell that has been used as an input to a previous transaction and is consumed.

A dead cell cannot be used as an input to a new transaction, nor can it be used as a dependency. It is effectively destroyed and removed from the active state of the network.

A dead cell is the equivalent of a "spent UTXO" in Bitcoin.

#### 同义词
- [Historical Cell](#historical-cell)

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)
- [Consume](#consume)
- [交易](#交易)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Dep Group
A method for referencing multiple dependencies which are commonly used together using a single dependency field.

#### 参考
- [Dep Type](#dep-type)
- [Dependencies](#dependencies)
- [CKB Transaction Structure on GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

---

### Dep Type
A field that specifies the type of the dependency.

#### 参考
- [Dep Group](#dep-group)
- [Dependencies](#dependencies)
- [CKB Transaction Structure on GitHub](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)

---

### Deps
A shorthand name for dependencies.

#### 同义词
- [Dependencies](#dependencies)

---

### Dependencies
Cells that are referenced in a transaction. Cells that are referenced as dependencies are read-only and made available to any Scripts executing within the transaction. Dependencies are not consumed.

Dependencies are commonly referred to as deps.

#### 同义词
- [Deps](#deps)

#### 参考
- [Cell](#cell)
- [Consume](#consume)
- [Script](#script)
- [交易](#交易)

---

### Duktape
Duktape is an embeddable Javascript engine, with a focus on portability and compact footprint.

Duktape is used to run Javascript based smart contracts on Nervos.

#### 参考
- [Duktape Official Website](https://duktape.org/)

---

### Difficulty
A measurement of how difficult it is to solve the Proof of Work cryptographic puzzle required to create a block.

Networks automatically adjust the difficulty to control the speed at which blocks are generated as mining participants enter and exit the network.

#### 参考
- [工作量证明](#工作量证明)

---

### Diviner
A deterministic testing framework for Rust.

#### 参考
- [Diviner on GitHub](https://github.com/xxuejie/diviner)

---

### Eaglesong
The proof of work function used for mining on Nervos CKB.

#### 参考
- [Eaglesong RFC on the Nervos Github](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0010-eaglesong/0010-eaglesong.md)

---

### ERC20
An Ethereum token standard for basic fungible tokens.

An SUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 or ERC777.

#### 参考
- [ERC777](#erc777)
- [同质化代币](#同质化代币)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)

---

### ERC721
An Ethereum token standard for non-fungible tokens.

#### 参考
- [Non-Fungible Token](#non-fungible-token)
- [代币](#代币)
- [ERC721 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-721)

---

### ERC777
An updated Ethereum token standard for basic fungible tokens that is backwards compatible with ERC20.

An SUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 or ERC777.

#### 参考
- [ERC20](#erc20)
- [同质化代币](#同质化代币)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)
- [ERC777 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-777)

---

### ERC1155
An Ethereum token standard that supports the creation any number of fungible or non-fungible tokens on a single contract.

#### 参考
- [同质化代币](#同质化代币)
- [Non-Fungible Token](#non-fungible-token)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)
- [ERC1155 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-1155)

---

### Generator
A program that is used to create transactions that can be broadcast to the Nervos CKB network.

#### 参考
- [Nervos CKB](#nervos-ckb)
- [交易](#交易)

---

### Genesis Block
The first block on a blockchain. The genesis block is unique because it does not contain a reference to the previous block because it is the first.

#### 参考
- [区块](#区块)
- [区块链](#区块链)

---

### Godwoken
A tool that provides a programmable layer on Nervos CKB that emulates the account model used by other cryptocurrencies like Ethereum.

#### 参考
- [Godwoken on GitHub](https://github.com/jjyr/godwoken)

---

### Governance Script
A Type Script which defines the monetary policy of a User Defined Token (UDT).

#### 参考
- [Governance Script Hash](#governance-script-hash)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

### Governance Script Hash
A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### 同义词
- [Type Script Hash](#type-script-hash)

#### 参考
- [Governance Script](#governance-script)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [Type Script](#type-script)

---

### Historical Cell
An alternative term for Dead Cell.

#### 同义词
- [Dead Cell](#dead-cell)

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)

---

### Indexer
An application or library that keeps track of live Cells that match criteria specified by the developer or user.

#### 参考
- [Cells](#cells)
- [Live Cell](#live-cell)

---

### Input
A Live Cell that is used in a transaction. If the transaction is accepted by the network, the Live Cell will be consumed, and marked as a Dead Cell.

#### 参考
- [Cell](#cell)
- [Consume](#consume)
- [Dead Cell](#dead-cell)
- [Live Cell](#live-cell)
- [交易](#交易)

---

### Keyper
A specification of how to manage wallet Lock Scripts which apply to a specific user.

#### 参考
- [Lock Script](#lock-script)
- [Keyper on GitHub](https://github.com/ququzone/keyper)

---

### Late Spawning
When a node joins a blockchain network for the first time after the network has already been in operation for a period of time.

A network is said to support late spawning if that participant can download and verify the entire blockchain without having to trust any of the participants in the network to feed them unaltered data.

#### 参考
- [Genesis Block](#genesis-block)

---

### Layer 1
A proof of work blockchain known as the Common Knowledge Base (CKB) that serves as the base layer for the Nervos Network.

#### 同义词
- [CKB](#ckb)
- [共同知识库](#共同知识库)

#### 参考
- [Layer 2](#layer-2)

---

### Layer 2
Any framework or protocol that is built on top of and dependent on a layer 1 blockchain.

Layer 2 systems often address different concerns than layer 1, allowing for a wider range of use cases while directly inheriting many of benefits of layer 1.

#### 参考
- [Layer 1](#layer-1)

---

### Lina
The name of public Mainnet of the Nervos CKB.

#### 同义词
- [主网](#主网)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

#### 参考
- [Nervos CKB](#nervos-ckb)

---

### Live Cell
A Cell that has not been consumed and is available for use.

This is similar to an unspent transaction output (UTXO) in Bitcoin.

#### 同义词
- [Active Cell](#active-cell)

#### 参考
- [Cell](#cell)
- [Cell Model](#cell-model)
- [UTXO on Bitcoin.org](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### Lock Script
A Script that enforces access and ownership of a Cell. This Script controls who has permission to use the Cell as an input. 

#### 参考
- [Cell](#cell)
- [Type Script](#type-script)
- [Script](#script)

---

### Lock Script Hash
A Blake2b hash of a Lock Script which is used as an identifier for the Script when referenced by a Cell.

#### 参考
- [Cell](#cell)
- [Lock Script](#lock-script)

---

### Long Address
An address format used on Nervos that includes the full code hash of the lock script which is associated with it.

#### 参考
- [地址](#地址)
- [Code Hash](#code-hash)
- [Lock Script](#lock-script)
- [Short Address](#short-address)

---

### Mainnet
The Nervos CKB public blockchain.The name of the Nervos CKB Mainnet is Lina.

- **ckb version**: >= v0.25.2 (latest stable is recommended)
- **genesis hash**: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
- **launched at**: 2019-11-15 21:11:00 UTC

#### 同义词
- [CKB](#ckb)
- [共同知识库](#共同知识库)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### Not To Be Confused With
- [Aggron](#aggron)
- [Testnet](#testnet)

---

### Minting
The process of creating of new tokens.

#### 参考
- [代币](#代币)

---

### Molecule
A serialization framework for encoding data which is used extensively on the Nervos blockchain.

#### 参考
- [Molecule Specification](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0008-serialization/0008-serialization.md)
- [Molecule on Github](https://github.com/nervosnetwork/molecule)
- [Molecule Schema used in CKB](https://github.com/nervosnetwork/ckb/tree/develop/util/types/schemas)

---

### Muta
A framework used to create highly customizable layer 2 blockchain implementations on Nervos.

#### 参考
- [Muta on GitHub](https://github.com/nervosnetwork/muta)

---

### Nervos CKB
The layer 1 blockchain of the Nervos Network, the Common Knowledge Base.

Nervos CKB is often referred to as the Nervos Blockchain.

#### 同义词
- [CKB](#ckb)
- [共同知识库](#共同知识库)
- [Nervos 区块链](#nervos-区块链)

#### 参考
- [Layer 1](#layer-1)

---

### Off-Chain Computation
A programming model where all computation is done off-chain to reduce the burden on the nodes in the network and provide higher levels of scalability.

Nervos uses off-chain computation and on-chain verification.

#### 参考
- [On-Chain Computation](#on-chain-computation)
- [On-Chain Verification](#on-chain-verification)

---

### Off-Chain State
A programming model where the data that represents the state of an application is not stored on the blockchain, or is not accessible by on-chain smart contracts.

#### 参考
- [On-Chain State](#on-chain-state)

---

### On-Chain Computation
A programming model where all computation by smart contracts is done on-chain every node on the network simultaneously.

Ethereum uses on-chain computation.

#### 参考
- [Off-Chain Computation](#off-chain-computation)

---

### On-Chain State
A programming model where the data that represents the state of an application is stored on the blockchain and is accessible by on-chain smart contracts.

Nervos provides on-chain state for all smart contracts.

#### 参考
- [Off-Chain State](#off-chain-state)

---

### On-Chain Verification
A programming model where all computation is done off-chain to reduce the burden on the nodes in the network, but verification of the resulting data is done on-chain to enforce the smart contract rules created by the developer.

Nervos uses off-chain computation and on-chain verification.

#### 参考
- [On-Chain Computation](#on-chain-computation)

---

### Open Transaction
A signed piece of a transaction that is incomplete and invalid on its own. When combined with other signed transaction pieces can form a complete transaction which can be processed.

One use of open transactions is to create the functionality required for a trustless decentalized exchange.

#### 参考
- [加密签名](#加密签名)
- [交易](#交易)

---

### Orphan
A shorthand name for Orphan Block.

#### 同义词
- [Orphan Block](#orphan-block)
- [Uncle](#uncle)

---

### Orphan Block
A valid block that was found simultaneously with another valid block by another miner, but was not selected by network because it arrived after the other block.

Orphan blocks are expected to occur under normal operation and do not become a problem unless they occur too frequently.

On Nervos, orphan blocks are better described as Uncles.

#### 同义词
- [Orphan](#orphan)
- [Uncle](#uncle)

#### 参考
- [区块](#区块)
- [Orphan Rate](#orphan-rate)

---

### Orphan Rate
A measure of the speed at which Orphan blocks occur within the blockchain network.

#### 参考
- [Orphan Block](#orphan-block)

---

### Outpoint
A particular output Cell in a transaction.

#### 参考
- [Cell](#cell)
- [Output](#output)
- [交易](#交易)

---

### Output
A Live Cell that is created in a transaction.

#### 参考
- [Cell](#cell)
- [Live Cell](#live-cell)
- [交易](#交易)

---

### Overlord
A byzantine fault tollerant consensus algorithm designed by Nervos for Huobi which can support thousands of transactions per second.

#### 参考
- [Overlord on Medium](https://medium.com/nervosnetwork/overlord-a-new-consensus-algorithm-3cc51690d269)

---

### Polyjuice
An Ethereum compatible layer that provides account model functionality on top of Nervos' Cell Model.

#### 参考
- [Cell Model](#cell-model)
- [Polyjuice on GitHub](https://github.com/nervosnetwork/polyjuice)

---

### Proposal Zone
Section of the block that contains transaction proposals.

#### 参考
- [Commitment Zone](#commitment-zone)
- [Propose](#propose)

---

### Propose
The process of taking an unconfirmed transaction out of the mempool and proposing it for commitment. A transaction is not confirmed until after it has been committed.

Miners are incentivized to propose transactions by being paid a proposal reward.

#### 参考
- [Commit](#commit)
- [确认](#确认)
- [Mempool](#mempool)
- [Proposal Reward](#proposal-reward)
- [Proposal Zone](#proposal-zone)
- [交易](#交易)

---

### RISC-V
An open standard instruction set architecture (ISA) for general computing.

RISC-V is the instruction set used by the CKB-VM.

#### 参考
- [CKB-VM](#risc-v)
- [RISC-V on Wikipedia](https://en.wikipedia.org/wiki/RISC-V)

---

### Schnorr Signature
A cryptographic signature scheme for signing and verification.

#### 参考
- [Schnorr Signature on Wikipedia](https://en.wikipedia.org/wiki/Schnorr_signature)

---

### Script
A program that executes on the CKB-VM. A Script can be one of two types:

- Lock Script - Used to control ownership and access to a Cell.
- Type Script - Used to control how a Cell is used in a transaction.

A Script is a binary executable in the ELF format for the RISC-V architecture.

#### 参考
- [CKB-VM](#risc-v)
- [Lock Script](#lock-script)
- [RISC-V](#risc-v)
- [Type Script](#type-script)
- [ELF on Wikipedia](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

---

### Seed Cell
A design pattern on Nervos from creating unique identifiers used to create unforgeable assets.

#### 参考
- [Cell](#cell)

---

### Shannon
A fractional denomination of CKBytes. One CKByte is equal to 100,000,000 Shannons.

A Shannon is the equivalent of a Bitcoin Satoshi.

#### 参考
- [CKByte](#ckbyte)
- [共同知识字节](#共同知识字节)
- [Satoshi (denomination) on Bitcoin.org](https://bitcoin.org/en/glossary/denominations)

---

### Short Address
An address format on Nervos that does not include the code hash of the associated lock script, and instead uses one of many commonly used lock scripts.

The short address format is the most common address format used, and is often referred to as simply "address".

#### 同义词
- [地址](#地址)

#### 参考
- [Code Hash](#code-hash)
- [Lock Script](#lock-script)
- [Long Address](#long-address)

---

### Simple UDT
A standard that defines a the most basic implementation of a UDT fungible token on Nervos.

A Simple UDT is often referred to by its abbreviation, SUDT.

An SUDT on Nervos is the equivalent of Ethereum tokens standards ERC20 and ERC777.

#### 同义词
- [SUDT](#sudt)

#### 参考
- [代币](#代币)
- [UDT](#udt)
- [用户自定义代币](#用户自定义代币)
- [ERC20 on Ethereum.org](https://eips.ethereum.org/EIPS/eip-20)
- [Simple UDT RFC Draft Spec on Nervos Talk](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333/1)

---

### Since
A field on a Cell which can contain an optional value that prevents consumption before a certain block timestamp or a block number.

#### 参考
- [Cell](#cell)

---

### SPV
An abbreviation for Simplified Payment Verification. A protocol for using a blockchain cryptocurrency without having to operate a full node.

SPV clients require far less data to be stored, but also must requires the trust of the network clients it is connected to directly.

#### 参考
- [SPV Wallet](#spv-wallet)
- [Simplified Payment Verification on BitcoinWiki](https://en.bitcoinwiki.org/wiki/Simplified_Payment_Verification)

---

### SPV Wallet
A light-weight cryptocurrency wallet that uses the SPV protocol.

#### 参考
- [SPV](#spv)

---

### SUDT
An abbreviation for Simple UDT.

#### 同义词
- [Simple UDT](#simple-udt)

---

### Testnet
An alternate public blockchain used for testing purposes that is running the same or similar software as the Mainnet. All tokens and data on testnets have no value.The name of the Nervos CKB Testnet is Aggron.

- **ckb version**: >= v0.32.0 (latest stable is recommended)
- **genesis hash**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **launched at**: 2020-05-22 04:00:00 UTC

#### 同义词
- [Aggron](#aggron)

#### Not To Be Confused With
- [Lina](#lina)
- [主网](#主网)

---

### Transaction Hash

Transaction is serialized via [molecule](#molecule) in CKB. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

Transaction hash is generated by the serialized `raw` structure through [ckbhash](#ckbhash).

#### 参考
- [Transaction Witness Hash](#transaction-witness-hash)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)

---

### Transaction Witness Hash

Transaction is serialized via [molecule](#molecule) in CKB. Its schema is:

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

Transaction witness hash is generated by the serialized transaction through [ckbhash](#ckbhash).

#### 参考
- [Transaction Hash](#transaction-hash)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)

---

### Transaction Root

The field `transactions_root` in header is

```
ckbhash(T || W)
```

> [ckbhash](#ckbhash) is the hash function, `||` denotes binary concatenation.

T is the root of a [CKB Merkle Tree](#ckb-merkle-tree), which items are the [transaction hashes](#transaction-hash)  of all the transactions in the block.

W is also the root of a [CKB Merkle Tree](#ckb-merkle-tree), but the items are the [Transaction Witness Hash](#transaction-witness-hash) of all the transactions in the block.

#### 参考
- [Ckbhash](#ckbhash)
- [CKB Merkle Tree](#ckb-merkle-tree)
- [Transaction Witness Hash](#transaction-witness-hash)

---


### Type Script
A Script that enforces the rules that must be followed in a transaction for a Cell to be consumed as an input or for a Cell to be created as an output.

#### 参考
- [Cell](#cell)
- [Lock Script](#lock-script)
- [Script](#script)
- [Type Script Hash](#type-script-hash)

---

### Type Script Hash
A Blake2b hash of a Type Script which is used as an identifier for the Script when referenced by a Cell.

#### 参考
- [Cell](#cell)
- [Script](#script)
- [Type Script](#type-script)

---

### Type ID
A unique identifier for asset types on Nervos. This idenfier is based on the Type Script and Arguments of a Cell.

#### 参考
- [Args](#args)
- [Cell](#cell)
- [Type Script](#type-script)

---

### Uncle
A valid block that was found simultaneously with another valid block by another miner, but was not selected by network because it arrived after the other block.

Uncles are paid a reduced block reward when they are found and reported.

On Nervos, Uncles are tracked by consensus to adjust the block interval of the network.

#### 同义词
- [Orphan Block](#orphan-block)

#### 参考
- [Block Interval](#block-interval)
- [Orphan Rate](#orphan-rate)
- [Uncle](#uncle)

---

### Uncle Rate

#### 参考
- [Orphan Rate](#orphan-rate)
- [Uncle](#uncle)

---

### Validator
A Script that is used to ensure that a transaction created by a Generator is valid.

Validators are Scripts that run within the CKB-VM, and are either Lock Scripts or Type Scripts.

#### 参考
- [CKB-VM](#risc-v)
- [Lock Script](#lock-script)
- [Type Script](#type-script)
- [交易](#交易)

---

### Witness
A set of cryptographic signatures that contains the data required to prove authorization to the resources used in a transaction.

#### 参考
- [交易](#交易)

---

### Zk-SNARK
A form of cryptographic proof, that when used in cryptocurrencies, allows for privacy features which do not reveal the amounts or participants in transactions.

Zk-SNARKs require a trusted setup, but are otherwise trustless.

#### 参考
- [交易](#交易)
- [Zk-STARK](#zk-stark)
- [Non-interactive zero-knowledge proofs on Wikipedia](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---

### Zk-STARK
A form of cryptographic proof, that when used in cryptocurrencies, allows for privacy features which do not reveal the amounts or participants in transactions.

Unlike Zk-SNARKs, Zk-STARKs do not require a trusted setup.

#### 参考
- [交易](#交易)
- [Zk-SNARK](#zk-snark)
- [Non-interactive zero-knowledge proofs on Wikipedia](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---
