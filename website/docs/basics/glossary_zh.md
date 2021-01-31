---
id: glossary_zh
title: 术语表
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

### 活跃  Cell

处于 CKB 当前状态的 Cell。活跃 Cells 可以作为交易的输入。

#### 同义词
- [可用 Cell](#可用-cell)

#### 参考
- [Cell](#cell)
- [输入](#输入)
- [交易](#交易)

---

### Aggron
Nervos CKB 的测试网。

- **ckb 版本**: >= v0.32.0 （推荐使用最新稳定版）
- **创世哈希**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **启动于**: 2020-05-22 04:00:00 UTC

#### 同义词
- [测试网](#测试网)

#### 易混淆
- [Lina](#lina)
- [主网](#主网)

---

### Animagus
A framework layer that runs on top of Nervos CKB which provides an easy way to query for account balances without having to go through the Cell Collection process.
一个运行在 Nervos CKB 之上的框架，它提供了一种简单的方式来查询账户余额，而无需经过 Cells 收集过程。

#### 参考
- [Cell 收集](#cell-收集)
- [Nervos CKB](#nervos-ckb)
- [Nervos 博客上的 Animagus 介绍](https://medium.com/nervosnetwork/https-medium-com-nervosnetwork-animagus-part-1-introduction-66fa8ce27ccd-cfb361a7d883)

---

### Args
`Args`  是参数（arguments）的英文简写，是 Cell 中提供给锁脚本（Lock Script）或者类型脚本（Type Script）的数据。这与提供给普通命令行应用程序的参数几乎相同。

当创建 Cell 时，参数作为 Cell 的一部分被存储。

#### 参考
- [Cell](#cell)
- [锁脚本](#锁脚本)
- [类型脚本](#类型脚本)

---

### Axon
Nervos 核心团队开发的 Nervos CKB 的第 layer 2 侧链。Axon 提供高性能的智能合约执行，同时利用 Nervos CKB 作为信任层。

#### 参考
- [Layer 2](#layer-2)
- [Nervos CKB](#nervos-ckb)
- [Axon 官网介绍](https://www.nervos.org/network/)

---

### Blake2b
一个通用的加密哈希算法，可以为任何类型的数据创建一个简洁的数据指纹。CKB使用 blake2b 作为默认的哈希算法。

#### 参考
- [Blake2b 文档](https://blake2.net/blake2.pdf)
- [Ckbhash](#ckbhash)
- [维基百科上 Blake 哈希函数介绍](https://en.wikipedia.org/wiki/BLAKE_(hash_function))
- [维基百科上哈希函数的介绍](https://en.wikipedia.org/wiki/Hash_function)

---

### 区块补贴
支付给矿工的 CKB 代币，奖励矿工提供创建区块的计算资源并保障网络的安全。

补贴来源于出块产生的通胀，是总区块奖励的一部分，区块奖励还包括对应区块中的额外交易费用。

#### 同义词
- [区块奖励](#区块奖励)
- [交易费用](#交易费用)

---

### BLS
一种用于签名和验证的加密签名方案。

BLS 的全称为 Boneh–Lynn–Shacham。

#### 参考
- [维基百科上 Boneh–Lynn–Shacham 的介绍](https://en.wikipedia.org/wiki/Boneh%E2%80%93Lynn%E2%80%93Shacham)

---

### Boxer
一个轻量级的 Rust 库，用于验证 Nervos layer 1 区块链，即共同知识库。

#### 参考
- [共同知识库](#共同知识库)
- [Boxer GitHub](https://github.com/xxuejie/ckb-boxer)

---

### Cell 收集
收集符合一定条件的 Cell 的过程。

例如： 要知道某个账户的余额，需要收集该地址的所有活跃 Cells。

#### 参考
- [Cell](#cell)

---

### Cellbase
每个区块中负责铸造新 CKB 代币的交易。

相当于比特币中的 Coinbase 交易。

#### 参考
- [CKByte](#ckbyte)
- [Bitcoin.org 的 Coinbase 解释](https://bitcoin.org/en/glossary/coinbase)

---

### Ckbhash
CKB 使用 blake2b 作为默认的哈希算法，配置如下：

- 输出摘要大小：`32`
- 个性化：`ckb-default-hash`

`ckbhash` 用来表示配置如上的 blake2b 哈希，python 3中有实例和测试用例：

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

### CKB  默尔克树

CKB 默尔克树是一种完全二叉树( [CBMT, Complete Binary Merkle Tree](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md#complete-binary-merkle-tree) ) ，使用以下合并函数。

```
ckbhash(left || right)
```

> [ckbhash](#ckbhash) 是哈希函数, `||` 表示二进制连接。

#### 参考
- [静态默尔克树](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0006-merkle-tree/0006-merkle-tree.md)
- [Ckbhash](#ckbhash)
- [默尔克树](https://en.wikipedia.org/wiki/Merkle_tree)

---

### 代码哈希（Code Hash）
Cell 中的一个字段，包含一个哈希值，它可能指的是一个特定的数据，或一个由类型 ID （Type ID）引用的特定 Cell。

#### 参考
- [Cell](#cell)
- [数据](#数据)
- [类型 ID](#类型-id)

---

### 提交（Commit）
将提议（propose）的交易加入区块链网络的过程。在交易被提交（commit）后，即被确认。

网络通过给予矿工提交奖励，以激励矿工提交交易。

#### 参考
- [提交奖励](#提交奖励)
- [确认](#确认)
- [提议](#提议)
- [交易](#交易)

---

### 提交区
包含已提交交易的一段区块。提交区只能包含出现在前 2 至 10 个区块之一的提议区的有效交易。

#### 参考
- [区块](#区块)
- [提议区](#提议区)
- [交易](#交易)

---

### 消耗
使用一个可用 Cell（Live Cell）作为交易输入的过程。

消耗的过程将可用 Cell 标记为被销毁 Cell（Dead Cell），相当于将比特币的 UTXO 标记为已花费。

#### 参考
- [Cell](#cell)
- [Cell 模型](#cell-模型)
- [已销毁 Cell](#已销毁-cell)
- [可用 Cell](#可用-cell)
- [Bitcoin.org 上 UTXO 的定义](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### 密码学原语
完善的、底层的加密算法，常用来构建一个加密协议。

#### 参考
- [维基百科的密码学原语解释](https://en.wikipedia.org/wiki/Cryptographic_primitive)

---

### 数据
在 Nervos 特定的语境中，数据可以指 Cell 内的数据结构。该结构用于保存需要存储在 Nervos 区块链上的任何形式的信息。

#### 参考
- [Cell](#cell)
- [Cell 模型](#cell-模型)

---

### 已销毁 Cell
已被用作此前交易的输入并被消耗的 Cell。

已销毁 Cell（Dead Cell）不能作为新交易的输入，也不能作为依赖关系使用。它实际上已被销毁，并从网络的活跃状态中删除。

已销毁 Cell（Dead Cell）相当于比特币中已花费的 UTXO。

#### 同义词
- [历史 Cell](#历史-cell)

#### 参考
- [Cell](#cell)
- [Cell 模型](#cell-模型)
- [消耗](#消耗)
- [交易](#交易)
- [Bitcoin.org 上 UTXO 的介绍](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### 依赖组
依赖组（Dep Group）是一种用于引用多个依赖的方法，这些依赖通常使用单个依赖字段一起使用。

#### 参考
- [依赖类型](#依赖类型)
- [Deps](#Deps)
- [CKB 交易结构 RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md)

---

### 依赖类型
依赖类型（Dep Type）是指定具体依赖的类型的字段。

#### 参考
- [依赖组](#依赖组)
- [Dependencies](#Dependencies )
- [CKB 交易结构 RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0022-transaction-structure/0022-transaction-structure.zh.md)

---

### Deps
依赖（Deps），dependencies 的简写。

#### 同义词
- [Dependencies ](#Dependencies )

---

### Dependencies 
依赖（Dependencies ）是指交易中引用的 Cells。被引用为依赖的 Cell 是只读的，可以让交易中任何执行中的脚本访问读取。依赖不会被消耗。

依赖（Dependencies）通常用 deps 表示。

#### 同义词
- [Deps](#deps)

#### 参考
- [Cell](#cell)
- [消耗](#消耗)
- [Script](#script)
- [交易](#交易)

---

### Duktape
Duktape是一个可嵌入的 Javascript 引擎，专注于可移植性和紧凑的内存使用.

Duktape 用于在 Nervos 上运行基于 Javascript 的智能合约。

#### 参考
- [Duktape 官网](https://duktape.org/)

---

### 难度
衡量解决创建一个区块所需的工作量证明密码难题的难度。

网络自动调整难度，以控制挖矿参与者进入和退出网络时出块的速度。

#### 参考
- [工作量证明](#工作量证明)

---

### Diviner
Rust 的确定性测试框架。

#### 参考
- [Diviner GitHub](https://github.com/xxuejie/diviner)

---

### Eaglesong
Nervos CKB 上挖矿的工作量证明函数。

#### 参考
- [Eaglesong RFC](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0010-eaglesong/0010-eaglesong.zh.md)

---

### ERC20
用于创建基础的同质化代币的一个以太坊代币标准，

Nervos 上的 SUDT 相当于以太坊代币协议的 ERC20 或者 ERC777。

#### 参考
- [ERC777](#erc777)
- [同质化代币](#同质化代币)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)
- [Ethereum.org 上 ERC20 的介绍](https://eips.ethereum.org/EIPS/eip-20)

---

### ERC721
用于创建非同质化代币的以太坊代币标准。

#### 参考
- [非同质化代币](#非同质化代币)
- [代币](#代币)
- [Ethereum.org 上 ERC721 的介绍](https://eips.ethereum.org/EIPS/eip-721)

---

### ERC777
用于创建基础的同质化代币的一个已升级的以太坊代币标准，向后兼容 ERC20。

Nervos 上的 SUDT 相当于以太坊代币协议的 ERC20 或者 ERC777。

#### 参考
- [ERC20](#erc20)
- [同质化代币](#同质化代币)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)
- [Ethereum.org 上 ERC777 的介绍](https://eips.ethereum.org/EIPS/eip-777)

---

### ERC1155
支持在一个合约上创建任意数量的同质化或非同质化代币的以太坊代币标准。

#### 参考
- [同质化代币](#同质化代币)
- [非同质化代币](#非同质化代币)
- [代币](#代币)
- [用户自定义代币](#用户自定义代币)
- [Ethereum.org 上 ERC1155 的介绍](https://eips.ethereum.org/EIPS/eip-1155)

---

### 生成器
用于创建可向 Nervos CKB 网络广播的交易的程序。

#### 参考
- [Nervos CKB](#nervos-ckb)
- [交易](#交易)

---

### 创世区块
区块链上的第一个区块。创世区块是独一无二的，因为它不包含对前一个区块的引用，因为它是第一个区块。

#### 参考
- [区块](#区块)
- [区块链](#区块链)

---

### Godwoken
一个在 Nervos CKB 上提供一个可编程层的工具，它可以模拟其他加密货币（如以太坊）使用的账户模型。

#### 参考
- [Godwoken GitHub](https://github.com/jjyr/godwoken)

---

### 治理脚本
治理脚本（Governance Script）是一个定义了用户自定义代币（UDT）的货币政策的类型脚本（Type Script）。

#### 参考
- [治理脚本哈希](#治理脚本哈希)
- [UDT](#udt)
- [User Defined Token](#user-defined-token)
- [类型脚本](#类型脚本)

---

### 治理脚本哈希
治理脚本哈希（Governance Script Hash）是一个类型脚本（Type Script）的Blake2b 哈希，当该治理脚本被 Cell 引用时，其哈希可作为脚本的唯一标识。

#### 同义词
- [类型脚本哈希](#类型脚本哈希)

#### 参考
- [治理脚本](#治理脚本)
- [UDT](#udt)
- [用户自定义代币](#用户自定义代币)
- [类型脚本](#类型脚本)

---

### 历史 Cell
已销毁 Cell（Dead Cell）的另一种说法。

#### 同义词
- [已销毁 Cell](#已销毁-cell)

#### 参考
- [Cell](#cell)
- [Cell 模型](#cell-模型)

---

### 索引器
查找符合开发者或用户指定标准的可用 Cells（Live Cells）的应用程序或库。

#### 参考
- [Cells](#cells)
- [可用 Cell](#可用-cell)

---

### 输入
在交易中被使用的可用 Cell（Live Cell）。如果交易被网络接受，则可用 Cell 被消耗，标记为已销毁 Cell。

#### 参考
- [Cell](#cell)
- [消耗](#消耗)
- [已销毁 Cell](#已销毁-cell)
- [可用 Cell](#可用-cell)
- [交易](#交易)

---

### Keyper
一个关于如何管理应用于特定用户的钱包锁脚本（Lock Scripts）的规范。

#### 参考
- [锁脚本](#锁脚本)
- [Keyper  GitHub](https://github.com/ququzone/keyper)

---

### 后期追块
当网络已经运行一段时间后，节点才刚刚首次加入区块链网络的行为。

如果一个网络可以下载并验证整个区块链，而不必信任网络中的任何一个参与者向他们提供未经修改的数据，那么这个网络就被称为支持后期追块。


#### 参考
- [创世区块](#创世区块)

---

### Layer 1
在 Nervos 的特定语境中，特指 Nervos Network 的基础网络层，即运行 PoW 证明机制的共同知识库（CKB）。

#### 同义词
- [CKB](#ckb)
- [共同知识库](#共同知识库)

#### 参考
- [Layer 2](#layer-2)

---

### Layer 2
在 Nervos 的特定语境下，任何基于 Nervos CKB 之上进行构建的任何框架或者协议，都属于 Layer 2。

Layer 2 系统往往解决了与 Layer 1 不同的问题，在直接继承 Layer 1 的许多优点的同时，还可以实现更广泛的用例。

#### 参考
- [Layer 1](#layer-1)

---

### Lina
Nervos CKB 主网名称。

#### 同义词
- [主网](#主网)

#### 易混淆
- [Aggron](#aggron)
- [测试网](#测试网)

#### 参考
- [Nervos CKB](#nervos-ckb)

---

### 可用 Cell
尚未被消耗仍然可用的 Cell。

类似于比特币的未花费支出（UTXO）。

#### 同义词
- [活跃 Cell](#活跃-cell)

#### 参考
- [Cell](#cell)
- [Cell 模型](#cell-模型)
- [Bitcoin.org 上 UTXO 的介绍](https://bitcoin.org/en/glossary/unspent-transaction-output)

---

### 锁脚本
锁脚本（Lock Script）是一种强制执行 Cell 的访问和所有权的脚本。该脚本控制谁有权限使用 Cell 作为输入。

#### 参考
- [Cell](#cell)
- [类型脚本](#类型脚本)
- [脚本](#脚本)

---

### 锁脚本哈希
锁脚本哈希（Lock Script Hash）是一个锁脚本（Lock Script）的 Blake2b 哈希，当该锁脚本被 Cell 引用时，其哈希可作为脚本的唯一标识。

#### 参考
- [Cell](#cell)
- [锁脚本](#锁脚本)

---

### 长地址
Nervos 上使用的一种地址格式，包括与之相关联的锁脚本的完整代码哈希。

#### 参考
- [地址](#地址)
- [代码哈希](#代码哈希)
- [锁脚本](#锁脚本)
- [短地址](#短地址)

---

### 主网
特指 Nervos CKB 主网，Nervos CKB 主网的名字为 Lina。

- **ckb 版本**: >= v0.25.2 （推荐使用最新稳定币）
- **创世哈希**: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
- **启动于**: 2019-11-15 21:11:00 UTC

#### 同义词
- [CKB](#ckb)
- [共同知识库](#共同知识库)
- [Lina](#lina)
- [Nervos CKB](#nervos-ckb)

#### 易混淆
- [Aggron](#aggron)
- [测试网](#测试网)

---

### 铸造
发行更多代币的过程。

#### 参考
- [代币](#代币)

---

### Molecule
一个用于编码数据的序列化框架，在 Nervos 区块链上被广泛使用。

#### 参考
- [Molecule 规范](https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0008-serialization/0008-serialization.zh.md)
- [Molecule Github](https://github.com/nervosnetwork/molecule)
- [Molecule 在 CKB 上的使用模式](https://github.com/nervosnetwork/ckb/tree/develop/util/types/schemas)

---

### Muta
一个用于在 Nervos 上创建高度可定制的 Layer 2 区块链的框架实现。

#### 参考
- [Muta GitHub](https://github.com/nervosnetwork/muta)

---

### Nervos CKB
 Nervos Network 的 Layer 1，即共同知识库 CKB。

Nervos CKB 通常被称为 Nervos 区块链。

#### 同义词
- [CKB](#ckb)
- [共同知识库](#共同知识库)
- [Nervos 区块链](#nervos-区块链)

#### 参考
- [Layer 1](#layer-1)

---

### 链下计算
一种编程模型，所有的计算都在链下完成，以减轻网络中节点的负担，并提供更高的可扩展性。

Nervos 使用链下计算和链上验证。

#### 参考
- [链上计算](#链上计算)
- [链上验证](#链上验证)

---

### 链下状态
一种编程模型，代表应用状态的数据不存储在区块链上，或者说链上智能合约无法访问。

#### 参考
- [链上状态](#链上状态)

---

### 链上计算
一种编程模型，智能合约的所有计算都是在链上每一个网络节点同时完成。

以太坊就是使用链上计算。

#### 参考
- [链下计算](#链下计算)

---

### 链上状态
一种编程模型，其中代表应用程序状态的数据存储在区块链上，并可通过链上智能合约访问。

Nervos 为所有智能合约提供链上状态。

#### 参考
- [链下状态](#链下状态)

---

### 链上验证
一种编程模式，所有的计算都是在链下完成的，以减轻网络中节点的负担，但对所得数据的验证是在链上完成的，以执行开发者创建的智能合约规则。

Nervos 使用链下计算和链上验证。

#### 参考
- [链上计算](#链上计算)

---

### 开放式交易
已签署的交易片段，其本身是不完整和无效的。当与其他已签署的交易片段结合在一起时，才可以形成一个完整的交易并进行处理。

开放式交易的一个用途是创建免信任的去中心化交易所所需的功能。

#### 参考
- [加密签名](#加密签名)
- [交易](#交易)

---

### 孤块
一个有效区块与另一个矿工的另一个有效区块同时被发现，但由于该区块在另一个区块之后到达而未被网络选择。

孤块在正常操作下会出现，除非出现的频率太高，否则不会成为问题。

在 Nervos 上，将孤块描述为叔块更为合适。

#### 同义词
- [叔块](#叔块)

#### 参考
- [区块](#区块)
- [孤块率](#孤块率)

---

### 孤块率
衡量孤块在区块链网络中出现的频率。

#### 参考
- [孤块](#孤块)

---

### 输出点
输出点（Outpoint）指的是交易中一个特定的输出 Cell。

#### 参考
- [Cell](#cell)
- [输出](#输出)
- [交易](#交易)

---

### 输出
交易中所创建的可用 Cell（Live Cell）。

#### 参考
- [Cell](#cell)
- [可用 Cell](#可用-cell)
- [交易](#交易)

---

### Overlord
由 Nervos 为火币设计的一种拜占庭容错共识算法，可以支持每秒数千次的交易。

#### 参考
- [Overlord  介绍](https://medium.com/nervosnetwork/overlord-a-new-consensus-algorithm-3cc51690d269)

---

### Polyjuice
一个以太坊兼容层，在 Nervos 的 Cell 模型之上提供账户模型功能。

#### 参考
- [Cell 模型](#cell-模型)
- [Polyjuice GitHub](https://github.com/nervosnetwork/polyjuice)

---

### 提议区
包含交易提议的一段区块。

#### 参考
- [提交区](#提交区)
- [提议](#提议)

---

### 提议
将未确认的交易从内存池中取出并提议的过程。在交易被提交之前，交易仍处于未确认状态。

网络会支付矿工提议奖励，以激励矿工进行提议交易。

#### 参考
- [提交](#提交)
- [确认](#确认)
- [内存池](#内存池)
- [提议奖励](#提议奖励)
- [提议区](#提议区)
- [交易](#交易)

---

### RISC-V
一种用于通用计算的开放标准指令集架构（ISA）。

RISC-V 是 CKB-VM 使用的指令集。

#### 参考
- [CKB-VM](#risc-v)
- [维基百科上 RISC-V 的介绍](https://zh.wikipedia.org/wiki/RISC-V)

---

### Schnorr 签名
一种用于签名和验证的加密签名方案。

#### 参考
- [维基百科上的 Schnorr 签名的介绍](https://en.wikipedia.org/wiki/Schnorr_signature)

---

### 脚本
在 CKB-VM 中执行的程序。在 CKB 中有两类脚本：

- 锁脚本（Lock Script）：用于控制 Cell 的访问权以及所有权。
- 类型脚本（Type Script）：用于控制 Cell 在交易中的使用方式。

脚本是 RISC-V 架构下 ELF 格式的二进制可执行文件。

#### 参考
- [CKB-VM](#risc-v)
- [锁脚本](#锁脚本)
- [RISC-V](#risc-v)
- [类型脚本](#类型脚本)
- [维基百科上 ELF 的介绍](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

---

### 种子 Cell
Nervos 上的一种设计模式，通过创建独特的标识符来创建不易遗忘的资产。

#### 参考
- [Cell](#cell)

---

### Shannon
Shannon（香农），CKB 代币的最小单位，1 CKB =100,000,000 Shannons。

Shannon 相当于比特币的 Satoshi。

#### 参考
- [CKByte](#ckbyte)
- [共同知识字节](#共同知识字节)
- [Bitcoin.org 上 Satoshi 的介绍](https://bitcoin.org/en/glossary/denominations)

---

### 短地址
Nervos 上的一种地址格式，它不包括相关锁脚本的代码哈希，而是使用许多常用的锁脚本之一。

短地址格式是最常用的地址格式，通常被简单地称为“地址”。

#### 同义词
- [地址](#地址)

#### 参考
- [代码哈希](#代码哈希)
- [锁脚本](#锁脚本)
- [长地址](#长地址)

---

### 简单 UDT
一个定义了在 Nervos 上最基本的 UDT 同质化代币实现的标准。

简单 UDT 通常用其缩写 SUDT 来表示。

Nervos 上的 SUDT 相当于以太坊代币标准 ERC20 和 ERC777。

#### 同义词
- [SUDT](#sudt)

#### 参考
- [代币](#代币)
- [UDT](#udt)
- [用户自定义代币](#用户自定义代币)
- [Ethereum.org 上 ERC20 的介绍](https://eips.ethereum.org/EIPS/eip-20)
- [Simple UDT RFC](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333/1)

---

### Since
Cell 中的一个字段，它可以包含一个可选的值，以防止在某个区块时间戳或区块号之前消耗。

#### 参考
- [Cell](#cell)

---

### SPV
An abbreviation for Simplified Payment Verification. A protocol for using a blockchain cryptocurrency without having to operate a full node.

SPV clients require far less data to be stored, but also must requires the trust of the network clients it is connected to directly.

简化支付验证（Simplified Payment Verification）的缩写。一种无需操作完整的节点的协议。

SPV 客户端需要存储的数据要少得多，但也必须要求它直接连接到的可信的网络客户端。

#### 参考
- [SPV 钱包](#spv-前阿伯)
- [BitcoinWiki 上 SPV 的介绍](https://en.bitcoinwiki.org/wiki/Simplified_Payment_Verification)

---

### SPV 钱包
使用 SPV 协议的轻量级加密货币钱包。

#### 参考
- [SPV](#spv)

---

### SUDT
简单用户自定义代币（Simple UDT）的缩写。

#### 同义词
- [简单 UDT](#简单-udt)

---

### 测试网
一个用于测试目的的备用公共区块链，运行着与Mainnet相同或类似的软件。testnet上的所有代币和数据都没有价值.Nervos CKB Testnet的名字是Aggron。

- **ckb version**: >= v0.32.0 (latest stable is recommended)
- **genesis hash**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **launched at**: 2020-05-22 04:00:00 UTC

#### 同义词
- [Aggron](#aggron)

#### 易混淆
- [Lina](#lina)
- [主网](#主网)

---

### 交易哈希

CKB 中的交易是通过 [molecule](#molecule) 进行序列化。它的结构如下：

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

交易哈希是通过 [ckbhash](#ckbhash) 由序列化的 raw 结构生成的。

#### 参考
- [交易见证哈希](#交易见证哈希)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)

---

### 交易见证哈希

CKB 中的交易是通过 [molecule](#molecule) 进行序列化。它的结构如下：

```
table Transaction {
    raw:            RawTransaction,
    witnesses:      BytesVec,
}
```

交易见证（witness）哈希是通过 [ckbhash](#ckbhash) 由序列化的 witness 结构生成的。

#### 参考
- [交易哈希](#交易哈希)
- [Molecule](#molecule)
- [Ckbhash](#ckbhash)

---

### 交易根

头中的交易根 `transactions_root` 如下：

```
ckbhash(T || W)
```

> [ckbhash](#ckbhash) 是哈希函数, `||` 表示二进制连接。

T 表示 [CKB 默克尔树](#ckb-默克尔树) 的根，默克尔树的子项是区块中所有交易的交易哈希值。

W 也表示 [CKB 默克尔树](#ckb-默克尔树) 的根，但其子项是区块中所有交易的交易见证哈希值。

#### 参考
- [Ckbhash](#ckbhash)
- [CKB 默尔克树](#ckb-默尔克树)
- [交易见证哈希](#交易见证哈希)

---


### 类型脚本
类型脚本（Type Script）是一种不管 Cell 是作为输入被消耗或作为输出被创建，都强制执行交易中必须遵循的规则的脚本。

#### 参考
- [Cell](#cell)
- [锁脚本](#锁脚本)
- [脚本](#脚本)
- [类型脚本哈希](#类型脚本哈希)

---

### 类型脚本哈希
类型脚本哈希（Type Script Hash）是一个类型脚本（Type Script）的 Blake2b 哈希，当该类型脚本被 Cell 引用时，其哈希可作为脚本的唯一标识。

#### 参考
- [Cell](#cell)
- [脚本](#脚本)
- [类型脚本](#类型脚本)

---

### 类型 ID
类型 ID（Type ID）是 Nervos上资产类型的唯一标识符。这个标识符基于 Cell 的类型脚本和参数。

#### 参考
- #### [Args](#args)
- [Cell](#cell)
- [类型脚本](#类型脚本)

---

### 叔块
一个有效区块与另一个有效区块同时被另一个矿工发现，但由于该区块在另一个区块之后到达而未被网络选中。

当叔块被发现并上报时，会给予少量的区块奖励。

在 Nervos上，叔块是通过共识追踪来调整网络的区块间隔时间的。

#### 同义词
- [孤块](#孤块)

#### 参考
- [区块间隔时间](#区块间隔时间)
- [孤块率](#孤块率)
- [叔块](#叔块)

---

### 叔块率

#### 参考
- [孤块率](#孤块率)
- [叔块](#叔块)

---

### 验证者
验证者（Validator）是用于确保生成器创建的交易是有效的脚本。

验证器是在 CKB-VM 中运行的脚本，是锁脚本或类型脚本。

#### 参考
- [CKB-VM](#risc-v)
- [锁脚本](#锁脚本)
- [类型脚本](#类型脚本)
- [交易](#交易)

---

### 见证
见证（Witness），一组加密签名，其中包含证明对交易中使用的资源授权所需的数据。

#### 参考
- [交易](#交易)

---

### Zk-SNARK
一种加密证明的形式，在加密货币中使用时，允许不透露交易金额或参与者的隐私功能。

Zk-SNARKs 需要一个可信的设置，但在其他方面是免信任的。

#### 参考
- [交易](#交易)
- [Zk-STARK](#zk-stark)
- [维基百科上零知识证明的介绍](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---

### Zk-STARK
一种加密证明的形式，在加密货币中使用时，允许不透露交易金额或参与者的隐私功能。

与 Zk-SNARKs 不同，Zk-STARKs 不需要可信的设置。

#### 参考
- [交易](#交易)
- [Zk-SNARK](#zk-snark)
- [维基百科上零知识证明的介绍](https://en.wikipedia.org/wiki/Non-interactive_zero-knowledge_proof)

---
