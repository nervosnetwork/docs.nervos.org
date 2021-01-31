---
id: get-ckb_zh
title: 获取 ckb 二进制包
---

CKB 二进制包用于运行 CKB 节点或 CKB 开发区块链以进行开发，测试等。你可以通过两种方式获得 CKB 二进制包：从源代码编译或下载发布版。

我们已经设置了持续集成（CI）以确保在以下系统中 CKB 能正常运作，以下系统也是运行 CKB 的推荐系统。

OS           | Arch
-------------|------
Ubuntu 16.04 | x64
macOS        | x64
Windows\*    | x64

> \* 对 Windows 的支持是实验性的。在 Windows 环境下运行 CKB 存在许多严重的性能问题。你可以参考[获取 Windows 版 CKB 包](ckb-on-windows_zh.md)了解更多。

CKB 应该也适用于其他 Linux 版本，不过我们将精力集中在对以下版本的支持上：

OS             | Arch
---------------|------
Ubuntu 18.04   | x64
Debian Stretch | x64
Arch Linux     | x64
CentOS 7       | x64

如果你的操作系统不适合运行 CKB，你也可以使用[使用 docker](run-ckb-with-docker_zh.md) 。



## 由源码编译

小提醒：关于如何在 Windows 上编译 CKB 的更多详情，可以查阅 [获取 Windows 版 CKB 包](ckb-on-windows_zh.md).

### 安装编译依赖

编译 CKB 需要依赖 Rust。我们推荐安装 [rustup](https://www.rustup.rs/) 进行 Rust 的版本管理。

所需的 Rust 版本保存在 `rust-toolchain`文件中。如果 rustup 正常工作的话，它会自动选择正确的版本。

你还需要获取以下包：

* Ubuntu and Debian

```shell
sudo apt-get install -y git gcc libc6-dev pkg-config libssl-dev libclang-dev clang
```

* Arch Linux

```shell
sudo pacman -Sy git gcc pkgconf clang
```
* macOS

```shell
brew install autoconf libtool
```
* CentOS

```shell
sudo yum install -y centos-release-scl
sudo yum install -y git make gcc-c++ openssl-devel llvm-toolset-7
```

启动一个 shell 窗口来启用 clang 编译器

```shell
scl enable llvm-toolset-7 bash
```

请记住在此控制台中运行以下命令。

### 增加环境变量

如果你的操作系统包含预编译的`snappy` 库，你可以设置 `SNAPPY_LIB_DIR` 环境变量指向该库的目录，这样可以减少编译时间。

```shell
export SNAPPY_LIB_DIR=/usr/local/lib
```

### 源码编译

 [Github 代码库](https://github.com/nervosnetwork/ckb) 上的  `master` 分支会定期进行编译测试，并且始终是最新版本。默认的签出分支 `develop` 是开发状态中的最新版本。

建议从`master`分支获取代码进行编译，或者从 [GitHub Releases](https://github.com/nervosnetwork/ckb/releases) 的历史版本中获取源码进行编译。

你也可以通过 git 克隆代码：

```bash
# get ckb source code
git clone https://github.com/nervosnetwork/ckb.git
cd ckb
git checkout master
```

您也可以轻松切换到历史版本并进行编译，例如，签出 v0.12.2。

```bash
git checkout -b branch-v0.12.2 v0.12.2
```

在源代码目录中运行 `make prod`，这将编译生成可执行文件 `target/release/ckb`，并将目录路径添加到`PATH`变量中或者将该可执行文件复制或者链接（link）到`PATH`变量中的某个路径下。

```bash
export PATH="$(pwd)/target/release:$PATH"
# or
# ln -snf "$(pwd)/target/release/ckb" /usr/local/bin/ckb
```

## 下载发布版

每个发布版我们都会在 [Github Releases](https://github.com/nervosnetwork/ckb/releases) 发布二进制包。你可以直接下载。

如果你使用 CentOS，请使用  `x86_64-unknown-centos-gnu` 包，该包需要安装 OpenSSL 1.0：

```shell
sudo yum install openssl-libs
```

Windows 包仅为实验目的，当前存在重大性能问题，我们不推荐在生产中使用。Windows Visual C++ Redistributable 包，可以通过[链接1](https://visualstudio.microsoft.com/downloads/)或者[链接2](https://www.microsoft.com/en-us/download/details.aspx?id=48145)下载。