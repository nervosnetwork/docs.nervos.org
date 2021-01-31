---
id: introduction-to-ckb-studio_zh
title: CKB Studio 介绍
---

*作者： [Phil Li @ Obsidian Labs](https://github.com/qftgtr)*

# CKB Studio 介绍

![](../assets/essay/ckb-studio/main.png)

CKB Studio 是一个用于开发 CKB 脚本的 IDE，它包含：

- [CKB 脚本编辑器](#CKB-脚本编辑器) - 编写 CKB 脚本，内置 [编译器](#编译器) 和 [调试器](#调试器)
- [CKB 密钥对管理器](#ckb-密钥对管理器) - 创建并管理 CKB 密钥对
- [CKB 节点管理器](#ckb-节点管理器) - 运行 CKB 节点和矿工，可在本地节点、Aggron 测试网以及主网之间切换
- [CKB 浏览器](#ckb-浏览器) - 查看账户信息以及历史交易记录
- [CKB 交易构建器](#ckb-交易构建器) - 轻松生成 CKB 交易

## 安装

### 下载

安装包可从 [Github](https://github.com/ObsidianLabs/CKB-Studio/releases) 获取，根据你的操作系统选择合适的格式。（`.dmg` 或者 `.zip`  适用于 Mac OS, `.AppImage` 适用于 Linux）

### 安装

- **MacOS**：双击打开 `CBSKtudio-x.x.x.dmg`，并将 CKB Studio 拖入应用程序文件夹。 
- **Linux**：右击`CBStudio-x.x.x.AppImage`，选择属性=> 权限 => 执行，勾选允许可执行文件作为程序 选项。关闭属性窗口，双击应用程序打开它（不同的Linux系统的安装程序可能略有不同）。 

## 功能演示

### 为 CKB 开发安装依赖

当 CKB Studio 第一次启动时，会显示一个欢迎页面，帮助你安装 CKB 开发的依赖：Docker、CKB 节点 和CKB 编译器。

<p align="center">
  <img src="../assets/essay/ckb-studio/welcome.png" width="800px">
</p>

- CKB Studio 使用 [Docker](https://www.docker.com/) 来运行 CKB 节点和编译器。如果你此前尚未安装过 Docker，请点击安装 Docker 按钮，将会打开 Docker 官方网站，请按指示下载安装。
- [CKB 节点](#ckb-node-manager) 是一个 docker 镜像（[`nervos/ckb`](https://hub.docker.com/r/nervos/ckb)），包含启动一个 CKB 节点所需的所有依赖和软件。你可以在下拉框中选择具体安装哪个节点版本。
- [CKB 编译器](#compiler) 是一个 docker 镜像 （[`nervos/ckb-riscv-gnu-toolchain`](https://hub.docker.com/r/nervos/ckb-riscv-gnu-toolchain)），包含编译一个 CKB 项目所需的所有依赖和软件。你可以在下拉框中选择具体安装哪个编译器版本。

### CKB 脚本编辑器

#### 项目列表

主界面会显示一个 CKB 项目的列表。如果你第一次打开 CKB Studio，这个列表将是空的。你可以点击新建按钮来创建一个新的 CKB 项目。CKB Studio 提供了一个模板列表来帮助你入门：

- [JavaScript] moleculec-es
- [JavaScript] molecule-javascript
- [JavaScript] minimal
- [JavaScript] HTLC
- [C] carrot
- [C] Simple UDT
- Duktape

<p align="center">
  <img src="../assets/essay/ckb-studio/create_project.png" width="800px">
</p>

创建项目后，CKB Studio 会自动导航到项目编辑器。

#### 编译器

点击项目工具栏（文件树上方）中的编译按钮（带锤子图标），编译当前 CKB 项目。CKB Studio 会根据项目语言（JavaScript 或 C）选择正确的编译器。

<p align="center">
  <img src="../assets/essay/ckb-studio/build_button.png" width="200px">
</p>
在构建一个 JavaScript 项目之前，还有一个额外的步骤，你需要在终端中手动输入 `npm install` 或 `yarn` 命令来安装项目的依赖。

<p align="center">
  <img src="../assets/essay/ckb-studio/yarn.png" width="800px">
</p>

不同语言的项目其编译文件会放置在不同的目录下：
- JavaScript 项目：`build/*` 
- C 项目：`{script_name}.o` 

#### 调试器

CKB Studio 已集成[CKB 调试器](https://github.com/xxuejie/ckb-standalone-debugger)。点击工程工具栏中的调试按钮（昆虫图标），可以对当前 CKB 工程进行调试。

<p align="center">
  <img src="../assets/essay/ckb-studio/debug_button.png" width="200px">
</p>

调试器将运行在 mock/tx.json（或项目设置中定义的文件）中定义的模拟交易。它将帮助你运行 CKB 脚本，并非常容易地检查执行结果。

<p align="center">
  <img src="../assets/essay/ckb-studio/debug_failed.png" width="800px">
</p>

### CKB 密钥对管理器

点击左下角的绿色按钮（带有密钥图标），打开密钥对管理器。在密钥对管理器中，你可以创建、导入和管理 CKB 密钥。在创建 CKB 节点之前，请确保你已经创建了一些密钥对。要初始化一个 CKB 节点，你需要一个矿工地址来接收挖矿奖励。

<p align="center">
  <img src="../assets/essay/ckb-studio/keypair_manager.png" width="800px">
</p>
请注意，密钥对管理器中的所有密钥仅用于开发目的。私钥是未加密保存的，所以不要在主网上使用。

### CKB 节点管理器

#### 新建节点实例

点击顶部的网络标签，打开 CKB 网络管理器，在这里可以管理 CKB 节点的实例，并开始运行 CKB 网络。如果你第一次打开CKB Studio，实例列表将是空的。

<p align="center">
  <img src="../assets/essay/ckb-studio/node_list_empty.png" width="800px">
</p>
要创建一个新的 CKB 节点实例，请单击 “新建实例” 按钮。你需要选择一个 *block assembler* 作为矿工，所以要确保你已经在密钥对管理器中创建了[密钥对](#ckb-密钥对管理器)。

<p align="center">
  <img src="../assets/essay/ckb-studio/create_node_instance.png" width="800px">
</p>

#### 启动 CKB 节点

点击启动按钮，启动 CKB 节点。节点启动后，可以在下面的终端中看到节点日志和矿工日志。

<p align="center">
  <img src="../assets/essay/ckb-studio/start_node_instance.png" width="800px">
</p>

#### 切换网络

在网络下拉菜单中，你可以切换为其他网络，如 Aggron 测试网和主网。切换网络会暂停你当前运行的实例。

<p align="center">
  <img src="../assets/essay/ckb-studio/switch_network.png" width="300px">
</p>

### CKB 浏览器

在浏览器标签页，你可以查看基本的账户信息以及历史交易记录。

<p align="center">
  <img src="../assets/essay/ckb-studio/explorer.png" width="800px">
</p>

### CKB 交易构建起

CKB 的交易有一个特殊的基于 Cell 的结构。交易构造器是方便 CKB 交易构造的专用客户端。

<p align="center">
  <img src="../assets/essay/ckb-studio/tx_constructor.png" width="800px">
</p>

#### Cell 浏览器

Cells 是形成 CKB 交易的基本元素。界面的下半部分是 Cell 浏览器，你可以在这里查看每个地址的可用 Cell（live cells）。要了解更多关于 CKB Cell 的信息，请参考 [cell model](cell-model)。

在 Cell 浏览器中，你可以

- 检查可用 Cells 数量和总容量。

- 双击一个 Cell，查看其详细信息。

- 使用显示空 Cell 显示开关来显示/隐藏空 Cell（没有数据和类型脚本（type script）的 Cell）。

- 将 Cell 拖动到输入或 Deps 来构建交易。

- 生成特定类型的 CKB 交易（见 [下文](#生成特定类型的交易)）。


#### 手动组装常规交易

如果你想要制作一笔常规交易，你需要使用交易构建起说动组装输入，输出和 dep cells。你可能需要使用一些空 Cells，所以记得打开空 Cells 显示开关，将空 Cells 显示在浏览器中。拖动你需要输入和引用的 Cell，然后点击输出旁边的`新建`按钮，生成输出 Cells。

<p align="center">
  <img src="../assets/essay/ckb-studio/tx_constructor.png" width="800px">
</p>
只要输入，引用和输出设置正确，点击`推送交易`，选择你想用于签名的密钥然后点击签署交易。CKB Studio 会加载对应的私钥完成签名，并且用见证数据更新交易对象。然后你可以点击`推送交易`按钮提交交易，等待 CKB 网络完成确认。

<p align="center">
  <img src="../assets/essay/ckb-studio/sign_transaction.png" width="800px">
</p>

#### 生成特殊类型的交易

对于特殊类型的交易，CKB Studio 可以帮助你决定使用组合哪些 Cells 到交易中。目前支持以下类型的交易： 

- 常规转账
- 使用自定义数据构建新的 Cell
- 创建 [用户自定义代币 (UDT)](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)
- UDT 转账

例如，点击`转账`按钮，输入数量以及接收地址，然后 CKB Studio 会扫描所有可用的空 Cells 然后生成满足你设定值的交易。你也可以使用相同的方式进行 UDT 转账，然后按照上述的签名步骤完成签名，并将交易推送到 CKB 网络。

<p align="center">
  <img src="../assets/essay/ckb-studio/transfer_transaction.png" width="800px">
</p>
