---
id: ckb-on-windows_zh
title: 在 Windows 中编译 CKB
---

**请注意，对 Windows 的支持是实验性的。已知在Windows中运行时，CKB存在严重的性能问题。**下面列出的所有命令都应通过 [PowerShell 使用](https://docs.microsoft.com/zh-cn/powershell/scripting/windows-powershell/install/installing-windows-powershell?view=powershell-7)。

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
  scoop install git llvm yasm rustup
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

- 签出 [CKB] 代码

  ```posh
  git clone https://github.com/nervosnetwork/ckb
  cd ckb
  ```

- 编译 [CKB]

  ```posh
  devtools/windows/make prod
  ```

[CKB]: https://github.com/nervosnetwork/ckb
[Scoop]: https://scoop.sh/

