---
id: ckb-on-windows
title: Get CKB Binary on Windows
---

**Please note that**, All commands listed below should be used through [PowerShell](https://docs.microsoft.com/zh-cn/powershell/scripting/windows-powershell/install/installing-windows-powershell?view=powershell-7).

## Build from Source

### Setup the Build Environment

#### Install Visual Studio 2019

Install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/)
with the workload: "Desktop development with C++".

**minimum requirements:** You can just select two individual components:
"MSVC v142 - VS 2019 C++ x64/x86 build tools (vXX.XX)" and "Windows 10 SDK (10.0.X.0)".

#### Install Tools with [Scoop]

- Install [Scoop].

- Install `git`, `llvm`, `yasm` and `rustup` via [Scoop].

  ```posh
  scoop install git
  scoop install llvm
  scoop install yasm
  scoop install rustup
  ```

- Install dependencies.

  - Add ["extras" bucket](https://github.com/lukesampson/scoop-extras) for [Scoop].

    ```posh
    scoop bucket add extras
    ```

  - `yasm` requires Microsoft Visual C++ 2010 runtime Libraries.

    ```posh
    scoop install vcredist2010
    ```

- Configure `Rust`.

  ```posh
  rustup set default-host x86_64-pc-windows-msvc
  ```

### Build CKB on Windows 10

- Checkout the source code of CKB.

  ```posh
  git clone https://github.com/nervosnetwork/ckb
  cd ckb
  ```

- Build CKB.

  ```posh
  devtools/windows/make prod
  ```

## Download from Releases

We publish binaries for each release via [Github Releases](https://github.com/nervosnetwork/ckb/releases). You can download the package directly. They requires *The Visual C++ Redistributable Packages*, which can be downloaded under section *Other Tools and Frameworks* [here](https://visualstudio.microsoft.com/downloads/) or [here](https://www.microsoft.com/en-us/download/details.aspx?id=48145).

[Scoop]: https://scoop.sh/
