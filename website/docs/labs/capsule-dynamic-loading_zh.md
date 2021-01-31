---
id: capsule-dynamic-loading-tutorial_zh
title: Dynamic loading in Capsule 在 Capsule 中实现动态加载
---

## 介绍

许多合约都有一定的密码学原语需求。用 Rust 编写的合约，我们可以通过添加依赖的方式轻松集成一个密码学库。但这并不高效；第一，这样增加了合约的二进制大小，导致我们需要花费更多的代币来部署合约。第二，每个合约包含的库可能重复，导致对链上空间的浪费。

我们通过引入动态加载机制来解决这个问题：

* 共享库可以在不同的编程语言中加载
* 使用动态加载可以大大较少合约二进制大小
* 使用共享库可以增加链上空间的效用

从  `v0.6`  版本开始， `ckb-std` 引入了[动态加载模块](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/dynamic_loading/index.html)，该模块提供了一个从链上 Cell 中动态加载库的高水平接口。

在本教程中，我们使用 C 语言构建了一个示例的共享库，然后从 Rust 编写的合同中动态加载共享库。

在本教程中如果你遇到任何问题，可以[提交 issue](https://github.com/nervosnetwork/capsule)，或者在 [Nervos 论坛](https://talk.nervos.org/)或[Discord](https://discord.gg/n6tx7uC) 上联系我们。

## 安装开发环境

### 安装 capsule

要使用 capsule，你需要使用 `docker` ，推荐安装最新版：

* [安装 docker](https://docs.docker.com/get-docker/)

注意：当前用户必须有管理 Docker 示例的权限：[非 root 用户如何管理 Docker](https://docs.docker.com/engine/install/linux-postinstall/)。

现在你可以安装 capsule 了，推荐下载 [安装包](https://github.com/nervosnetwork/capsule/releases/tag/v0.2.0)。

你也可以直接用源代码安装：

```
cargo install capsule --git https://github.com/nervosnetwork/capsule.git --tag v0.2.0
```

检查安装是否成功：

```
capsule check
```
<details>
<summary>(点击此处查看响应)</summary>
```bash
------------------------------
docker    installed
ckb-cli    installed
------------------------------
```
</details>


### 新建项目

```
capsule new dynamic-loading-demo
```
<details>
<summary>(点击此处查看响应)</summary>
```bash
New project "dynamic-loading-demo"
Created file "capsule.toml"
Created file "deployment.toml"
Created file "README.md"
Created file "Cargo.toml"
Created file ".gitignore"
Created "/home/jjy/workspace/dynamic-loading-demo"
     Created binary (application) `dynamic-loading-demo` package
Created contract "dynamic-loading-demo"
Created tests
     Created library `tests` package
Done
```
</details>

### 制作共享库

新建目录用于存放 C 代码

```
cd dynamic-loading-demo
mkdir shared-lib
```

在共享库中我们定义了两个方法，`visibility` 属性告诉编译器导出以下符号到共享库。

``` c
// shared-lib/shared-lib.c

typedef unsigned long size_t;

__attribute__((visibility("default"))) int
plus_42(size_t num) {
  return 42 + num;
}

__attribute__((visibility("default"))) char *
foo() {
  return "foo";
}
```

We need the RISC-V gnu toolchain to compile the source. Fortunately, we can set up the compiling environment with Docker:

我们需要 RISC-V gnu toolchain 来编译源代码。好在我们可以用 Docker 设置编译环境。

创建 `share-lib/Makefile`

``` sh
TARGET := riscv64-unknown-linux-gnu
CC := $(TARGET)-gcc
LD := $(TARGET)-gcc
OBJCOPY := $(TARGET)-objcopy
CFLAGS := -fPIC -O3 -nostdinc -nostdlib -nostartfiles -fvisibility=hidden -I deps/ckb-c-stdlib -I deps/ckb-c-stdlib/libc -I deps -I deps/molecule -I c -I build -I deps/secp256k1/src -I deps/secp256k1 -Wall -Werror -Wno-nonnull -Wno-nonnull-compare -Wno-unused-function -g
LDFLAGS := -Wl,-static -fdata-sections -ffunction-sections -Wl,--gc-sections

# docker pull nervos/ckb-riscv-gnu-toolchain:gnu-bionic-20191012
BUILDER_DOCKER := nervos/ckb-riscv-gnu-toolchain@sha256:aae8a3f79705f67d505d1f1d5ddc694a4fd537ed1c7e9622420a470d59ba2ec3

all-via-docker:
	docker run --rm -v `pwd`:/code ${BUILDER_DOCKER} bash -c "cd /code && make shared-lib.so"

shared-lib.so: shared-lib.c
	$(CC) $(CFLAGS) $(LDFLAGS) -shared -o $@ $<
	$(OBJCOPY) --only-keep-debug $@ $@.debug
	$(OBJCOPY) --strip-debug --strip-all $@

```

执行 `make all-via-docker` 命令以编译 `shared-lib.so`。

## 动态加载

我们使用 [CKBDLContext::load](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/dynamic_loading/struct.CKBDLContext.html#method.load) 来加载一个库。要使用这个方法，我们需要知道目标共享库的 `data_hash` 。

创建 `build.rs` 文件:

``` sh
touch contracts/dynamic-loading-demo/build.rs
```

`build.rs` （即编译脚本）在编译阶段执行：[查看详情](https://doc.rust-lang.org/cargo/reference/build-scripts.html) , 在 `build.rs` 文件中我们计算 `shared.so` 的 `data_hash` ，然后将结果赋值到一个常量中。

添加 `blake2b` 包作为编译依赖。

``` toml
[build-dependencies]
blake2b-rs = "0.1.5"
```

将常量 `CODE_HASH_SHARED_LIB` 写到文件 `code_hashes.rs` 中：

``` rust
pub use blake2b_rs::{Blake2b, Blake2bBuilder};

use std::{
    fs::File,
    io::{BufWriter, Read, Write},
    path::Path,
};

const BUF_SIZE: usize = 8 * 1024;
const CKB_HASH_PERSONALIZATION: &[u8] = b"ckb-default-hash";

fn main() {
    let out_path = Path::new("src").join("code_hashes.rs");
    let mut out_file = BufWriter::new(File::create(&out_path).expect("create code_hashes.rs"));

    let name = "shared-lib";
    let path = format!("../../shared-lib/{}.so", name);

    let mut buf = [0u8; BUF_SIZE];

    // build hash
    let mut blake2b = new_blake2b();
    let mut fd = File::open(&path).expect("open file");
    loop {
        let read_bytes = fd.read(&mut buf).expect("read file");
        if read_bytes > 0 {
            blake2b.update(&buf[..read_bytes]);
        } else {
            break;
        }
    }

    let mut hash = [0u8; 32];
    blake2b.finalize(&mut hash);

    write!(
        &mut out_file,
        "pub const {}: [u8; 32] = {:?};\n",
        format!("CODE_HASH_{}", name.to_uppercase().replace("-", "_")),
        hash
    )
        .expect("write to code_hashes.rs");
}

pub fn new_blake2b() -> Blake2b {
    Blake2bBuilder::new(32)
        .personal(CKB_HASH_PERSONALIZATION)
        .build()
}

```

执行 `capsule build`，文件 `src/code_hashes.rs` 便会生成。



我们在 `lib.rs` 文件中定义 `code_hashes` 模块。然后在主函数中添加动态加载代码。

``` rust
mod code_hashes;
use code_hashes::CODE_HASH_SHARED_LIB;
use ckb_std::dynamic_loading::{CKBDLContext, Symbol};

//...

// Create a DL context with 64K buffer.
let mut context = CKBDLContext::<[u8; 64 * 1024]>::new();
// Load library
let lib = context.load(&CODE_HASH_SHARED_LIB).expect("load shared lib");

// get symbols
unsafe {
    type Plus42 = unsafe extern "C" fn(n: usize) -> usize;
    let plus_42: Symbol<Plus42> = lib.get(b"plus_42").expect("find plus_42");
    assert_eq!(plus_42(13), 13 + 42);

    type Foo = unsafe extern "C" fn() -> *const u8;
    let foo: Symbol<Foo> = lib.get(b"foo").expect("find foo");
    let ptr = foo();
    let mut buf = [0u8; 3];
    buf.as_mut_ptr().copy_from(ptr, buf.len());
    assert_eq!(&buf[..], b"foo");
}
```

执行 `capsule build` 合约成功编译。

## 测试

我们需要将 `shared-lib.so` 部署到一个 Cell 中，然后在测试交易中引用这个 Cell。

打开 `tests/src/tests.rs`.

``` rust
use std::fs::File;
use std::io::Read;
// ...
// deploy shared library
let shared_lib_bin = {
    let mut buf = Vec::new();
    File::open("../shared-lib/shared-lib.so")
        .unwrap()
        .read_to_end(&mut buf)
        .expect("read code");
    Bytes::from(buf)
};
let shared_lib_out_point = context.deploy_cell(shared_lib_bin);
let shared_lib_dep = CellDep::new_builder().out_point(shared_lib_out_point).build();

// ...
// build transaction
let tx = TransactionBuilder::default()
    .input(input)
    .outputs(outputs)
    .outputs_data(outputs_data.pack())
    .cell_dep(lock_script_dep)
    // reference to shared library cell
    .cell_dep(shared_lib_dep)
    .build();
```

执行 `capsule test`。

<details>
<summary>(click here to view response)</summary>
```bash
running 1 test
consume cycles: 1808802
test tests::test_basic ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out

   Doc-tests tests

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out

```
</details>

## 其他资源

* [完整代码](https://github.com/jjyr/ckb-dynamic-loading-demo)
* capsule 基本使用： [Write a SUDT script by Capsule](https://docs.nervos.org/docs/labs/sudtbycapsule)
* Secp256k1 动态加载实例： [ckb-dynamic-loading-secp256k1](https://github.com/jjyr/ckb-dynamic-loading-secp256k1)

```