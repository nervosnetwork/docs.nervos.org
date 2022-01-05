---
id: capsule-dynamic-loading-tutorial
title: Dynamic loading in Capsule
---

## Introduction

Many contracts have a demand for cryptography primitives. In contracts written in Rust, we can easily integrate a cryptography library by adding it as a dependency. But it is not efficient; first, it increases the binary size of the contract; we need to spend more coins to deploy the contract. Second, each contract may include duplicated libraries; it is a waste of the on-chain space.

We introduce the dynamic loading mechanism to solve this problem:

* A shared library can be loaded in different programming languages
* Using dynamic loading can significantly reduce the contract binary size.
* Using shared libraries increases the utility of the on-chain space.

Starting from the `v0.6` version, `ckb-std` introduces the [dynamic loading module](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/dynamic_loading/index.html), which provides a high-level interface to dynamically loading libraries from on-chain cells.

In this tutorial, we build an example shared library in C, and try to dynamically load the shared library from a contract written in Rust.

If you run into an issue on this tutorial you can [create a new issue](https://github.com/nervosnetwork/capsule) or contact us on [Nervos talk](https://talk.nervos.org/) or [Discord](https://discord.gg/n6tx7uC). 

## Setup the develop environment

### Install capsule

To use capsule, you need `docker`. It is recommended to install the latest version:

* [Install docker](https://docs.docker.com/get-docker/)

Note: The current user must have permission to manage Docker instances. (How to manage Docker as a non-root user)[https://docs.docker.com/engine/install/linux-postinstall/].

Now you can proceed to install capsule, It is recommended to [download the binary](https://github.com/nervosnetwork/capsule/releases/tag/v0.2.0)

Or you can install from source:

```
cargo install capsule --git https://github.com/nervosnetwork/capsule.git --tag v0.2.0
```

Then check if it works with:

```
capsule check
```
<details><summary>(click here to view response)</summary>

```bash
------------------------------
docker    installed
ckb-cli    installed
------------------------------
```

</details>


### Create a project

```
capsule new dynamic-loading-demo
```
<details><summary>(click here to view response)</summary>

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

### Make a shared library

We create a directory to put our C code.

```
cd dynamic-loading-demo
mkdir shared-lib
```

We define two functions in our shared library. The `visibility` attribute tells the compiler to export the following symbol to the shared library.

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

Create the `share-lib/Makefile`

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

Run `make all-via-docker` to compile the `shared-lib.so`.

## Dynamic loading

We use [CKBDLContext::load](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/dynamic_loading/struct.CKBDLContext.html#method.load) to load a library. To use this function, we need to know the `data_hash` of the target shared library.

Create a `build.rs` file:

``` sh
touch contracts/dynamic-loading-demo/build.rs
```

The `build.rs` (aka build scripts) execute on the building stage, [see details](https://doc.rust-lang.org/cargo/reference/build-scripts.html) , in `build.rs` we compute the `data_hash` of `shared.so` and put the result into a constant variable.

Add `blake2b` crate as build dependencies.

``` toml
[build-dependencies]
blake2b-rs = "0.1.5"
```

Write the constant `CODE_HASH_SHARED_LIB` to file `code_hashes.rs`.

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

Run `capsule build`, the file `src/code_hashes.rs` will be generated.

We define the module `code_hashes` in the `lib.rs`. Then add the dynamic loading code to the `main` function.

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

Run `capsule build` to make sure the contract can be built without errors.

## Testing

We need to deploy the `shared-lib.so` to a cell, then reference the cell in the testing transaction.
Open `tests/src/tests.rs`.

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

Run `capsule test`.

<details><summary>(click here to view response)</summary>

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

## Other resources

* [Full code](https://github.com/jjyr/ckb-dynamic-loading-demo)
* Basic usage of capsule: [Write a SUDT script by Capsule](https://docs.nervos.org/docs/labs/sudtbycapsule)
* Secp256k1 dynamic loading example: [ckb-dynamic-loading-secp256k1](https://github.com/jjyr/ckb-dynamic-loading-secp256k1)

