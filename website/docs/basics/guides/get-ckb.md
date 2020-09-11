---
id: get-ckb
title: Get CKB Binary
---

CKB binary is used to run CKB node or CKB dev blockchain for development,testing and so on.You can get CKB binary by two ways: download from releases or build from source. 

We have setup CI to ensure CKB works in following systems, they are also the
recommended system to run CKB.

OS           | Arch
-------------|------
Ubuntu 16.04 | x64
macOS        | x64
Windows\*    | x64

> \* Support for Windows is experimental. CKB is known to have serious performance
> issues when running in Windows.

CKB should also work on any modern Linux distributions. However, we limit our
energy to focus on the support of following systems:

OS             | Arch
---------------|------
Ubuntu 18.04   | x64
Debian Stretch | x64
Arch Linux     | x64
CentOS 7       | x64

You can also [use docker](run-ckb-with-docker.md) if your operating system is
not properly supported by CKB for now.

## Download from Releases

We will publish binaries for each release via [Github Releases](https://github.com/nervosnetwork/ckb/releases). You can download the package directly.

If you are CentOS user, please use the `x86_64-unknown-centos-gnu` package, which also
requires OpenSSL 1.0:

```shell
sudo yum install openssl-libs
```

The Windows packages are for experiments only, they have significant
performance issues, we don't recommend to use them in production environment.
They requires *The Visual C++ Redistributable Packages*, which can be downloaded
under section *Other Tools and Frameworks*
[here](https://visualstudio.microsoft.com/downloads/) or
[here](https://www.microsoft.com/en-us/download/details.aspx?id=48145).

## Build from Source

The details about how to build CKB on Windows can be found [Build CKB on Windows](ckb-on-windows.md).

### Install Build Dependencies

CKB requires Rust to build. We recommend to install [rustup](https://www.rustup.rs/) to manage Rust versions.

The required Rust version is saved in the file `rust-toolchain`. If rustup is
available, it will pick the right version automatically.

You also need to get the following packages：

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

Start a shell enabling clang

```shell
scl enable llvm-toolset-7 bash
```

Remember to run following commands in this console.

### Add Environment Variables

If your OS contains pre-compiled `snappy` library, you may setup
`SNAPPY_LIB_DIR` environment variable to point to a directory with this
library. This will reduce compile time.

```shell
export SNAPPY_LIB_DIR=/usr/local/lib
```

### Build from source

The `master` branch on [Github repo](https://github.com/nervosnetwork/ckb) is regularly built and tested, which is always the latest
released version. The default checked out branch `develop` is the latest
version in active development.

It is recommended to build from the `master`branch,
or a historical version from [GitHub Releases](https://github.com/nervosnetwork/ckb/releases).

Also you can choose to clone the code via git:

```bash
# get ckb source code
git clone https://github.com/nervosnetwork/ckb.git
cd ckb
git checkout master
```

It is easy to switch to a historical version and build, for example, check out
v0.12.2.

```bash
git checkout -b branch-v0.12.2 v0.12.2
```

Run `make prod` inside the source code directory. It will build the executable
`target/release/ckb`. Please add the directory to `PATH` or copy/link the file
into a directory already in the `PATH`.

```bash
export PATH="$(pwd)/target/release:$PATH"
# or
# ln -snf "$(pwd)/target/release/ckb" /usr/local/bin/ckb
```
