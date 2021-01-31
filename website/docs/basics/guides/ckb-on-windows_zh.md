---
id: ckb-on-windows_zh
title: 获取 Windows 版 CKB 二进制文件（实验性）
---

**请注意，对 Windows 的支持是实验性的。已知在 Windows 中运行时，CKB 存在严重的性能问题。**下面列出的所有命令都应通过 [PowerShell 使用](https://docs.microsoft.com/zh-cn/powershell/scripting/windows-powershell/install/installing-windows-powershell?view=powershell-7)。

## 从源代码编译

### 安装编译环境

#### 安装 Visual Studio 2019

安装 [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/)
选择安装选项："使用 C++ 进行桌面开发"。

**最低要求:** 你可以只选择两个独立组件:
"MSVC v142 - VS 2019 C++ x64/x86 build tools (vXX.XX)" 和 "Windows 10 SDK (10.0.X.0)"。

#### 使用 [Scoop] 进行工具安装

- 安装 [Scoop]

- 使用 [Scoop] 安装`git`, `llvm`, `yasm` 和`rustup` 

  ```posh
  scoop install git
  scoop install llvm
  scoop install yasm
  scoop install rustup
  ```

- 安装依赖

  - 为 [Scoop] 添加 ["extras" bucket](https://github.com/lukesampson/scoop-extras) 

    ```posh
    scoop bucket add extras
    ```

  - `yasm` 需要 Microsoft Visual C++ 2010 运行时库.

    ```posh
    scoop install vcredist2010
    ```

- 配置 `Rust`.

  ```posh
  rustup set default-host x86_64-pc-windows-msvc
  ```

### 在 Windows 10 上编译

- 克隆 CKB 源代码

  ```posh
  git clone https://github.com/nervosnetwork/ckb
  cd ckb
  ```

- 编译 CKB

  ```posh
  devtools/windows/make prod
  ```

## 直接下载发布版

我们通过 Github Releases 发布每个版本的二进制文件。Windows 包仅用于实验，有明显的性能问题，我们不建议在生产环境中使用，它们需要 Visual C++ Redistributable Packages，可以通过[链接1](https://visualstudio.microsoft.com/downloads/)或[链接2](https://www.microsoft.com/en-us/download/details.aspx?id=48145)下载。

[Scoop]: https://scoop.sh/

