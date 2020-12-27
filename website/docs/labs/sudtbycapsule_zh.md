---
id: sudtbycapsule_zh
title: 使用 Capsule 编写 SUDT 脚本
---

## 介绍

[Capsule](https://github.com/nervosnetwork/capsule) 是一套供 Rust 开发者在 CKB 上开发脚本的工具，它涵盖了脚本开发的整个生命周期：编写、调试、测试和部署。我们的目标是改善 Rust 开发者的开发体验。

在本教程中，你将学习如何使用 Capsule 编写一个 SUDT 脚本。SUDT 是简单用户自定义代币（Simple User Defined Token）的缩写，它定义了一个最小的标准，包含了 dapp 开发者在 Nervos CKB 上发行自定义代币的刚需。你可以参考 [RFC: Simple UDT Draft Spec](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) 了解更多细节。

我们假设你：

* 你是 Rust 开发者，大致熟悉软件开发、编写代码、运行代码。
* 你大致了解 Nervos CKB 并且已经自行[搭建好了 CKB 开发链](basics/guides/devchain_zh.md) 。
* 你愿意学习区块链开发的前沿知识。

如果你在本教程中遇到问题，可以在 [Capsule Github 库](https://github.com/nervosnetwork/capsule)提交对应 issue，或者在 [Nervos 论坛](https://talk.nervos.org/) 或 [Discord](https://discord.gg/n6tx7uC) 联系我们。

教程所涉及的：

* 编写 SUDT 脚本的事前准备
* 正式编写一个 SUDT 脚本
* 测试
* 部署

## 编写 SUDT 脚本的事前准备

### 运行开发链和 ckb-cli

你应该可以自行运行一个开发链，并且知道如何使用 `ckb-cli` 来发送交易。如果你不知道，请参考本教程：[运行 CKB 开发链](basics/guides/devchain_zh.md)。 请不要忘记将 `ckb-cli` 添加到 PATH 环境变量中。 

### 安装 capsule

要使用 capsule，你需要使用`docker`。推荐安装最新版本：

* [安装docker](https://docs.docker.com/get-docker/)

注意：当前用户必须具备管理 Docker 实例的权限：[非 root 用户如何管理 Docker](https://docs.docker.com/engine/install/linux-postinstall/)

现在你可以开始安装 capsule 了，推荐下载 [该二进制包](https://github.com/nervosnetwork/capsule/releases/tag/v0.1.3)；

你也可以根据源码安装：

```
cargo install capsule --git https://github.com/nervosnetwork/capsule.git --tag v0.1.3
```

然后检查是否安装成功：

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
capsule new my-sudt
```
<details>
<summary>(点击此处查看响应)</summary>
```bash
New project "my-sudt"
Created file "capsule.toml"
Created file "deployment.toml"
Created file "README.md"
Created file "Cargo.toml"
Created "/PATH/my-sudt"
     Created binary (application) `my-sudt` package
Created contract "my-sudt"
Created tests
     Created binary (application) `tests` package
Done
```
</details>


你可以查看项目的目录结构：

```
ls my-sudt
```
<details>
<summary>(点击此处查看响应)</summary>
```bash

build  capsule.toml  Cargo.toml  contracts  deployment.toml  migrations  README.md  tests
```
</details>

默认的合约是在`my-sudt/contracts/my-sudt`目录下

```
ls my-sudt/contracts/my-sudt
```
<details>
<summary>(click here to view response)</summary>
​```bash

Cargo.toml  src
```
</details>

你可以打开 `my-sudt/contracts/my-sudt/src/main.rs` 查看一些预生成代码：

``` rust
#![no_std]
#![no_main]
#![feature(lang_items)]
#![feature(alloc_error_handler)]
#![feature(panic_info_message)]

// Import from `core` instead of from `std` since we are in no-std mode
use core::result::Result;

// Import heap related library from `alloc`
// https://doc.rust-lang.org/alloc/index.html
use alloc::{vec, vec::Vec};

// Import CKB syscalls and structures
// https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/index.html
use ckb_std::{
    entry,
    default_alloc,
    debug,
    high_level::{load_script, load_tx_hash},
    error::SysError,
    ckb_types::{bytes::Bytes, prelude::*},
};

entry!(entry);
default_alloc!();

/// Program entry
fn entry() -> i8 {
    // Call main function and return error code
    match main() {
        Ok(_) => 0,
        Err(err) => err as i8,
    }
}

/// Error
#[repr(i8)]
enum Error {
    IndexOutOfBound = 1,
    ItemMissing,
    LengthNotEnough,
    Encoding,
    // Add customized errors here...
}

impl From<SysError> for Error {
    fn from(err: SysError) -> Self {
        use SysError::*;
        match err {
            IndexOutOfBound => Self::IndexOutOfBound,
            ItemMissing => Self::ItemMissing,
            LengthNotEnough(_) => Self::LengthNotEnough,
            Encoding => Self::Encoding,
            Unknown(err_code) => panic!("unexpected sys error {}", err_code),
        }
    }
}

fn main() -> Result<(), Error> {
    // remove below examples and write your code here

    let script = load_script()?;
    let args: Bytes = script.args().unpack();
    debug!("script args is {:?}", args);

    let tx_hash = load_tx_hash()?;
    debug!("tx hash is {:?}", tx_hash);

    let _buf: Vec<_> = vec![0u8; 32];

    Ok(())
}
```

### 项目编译

进入  `my-sudt` 目录并进行编译。

```
cd my-sudt
capsule build
```

<details>
<summary>(点击此处查看响应)</summary>
```bash

Building contract my-sudt
    Updating crates.io index
   Compiling cc v1.0.56
   Compiling cfg-if v0.1.10
   Compiling buddy-alloc v0.3.0
   Compiling molecule v0.6.0
   Compiling ckb-allocator v0.1.1
   Compiling ckb-standalone-types v0.0.1-pre.1
   Compiling ckb-std v0.4.1
   Compiling my-sudt v0.1.0 (/code/contracts/my-sudt)
    Finished dev [unoptimized + debuginfo] target(s) in 8.73s
Done
```
</details>


你会在`build/debug`目录下找到一个新生成的二进制格式的合约。

```
ls build/debug
```
<details>
<summary>(click here to view response)</summary>
​```bash

my-sudt
```
</details>


好，万事具备，开始编码！

## 编写 SUDT 脚本

SUDT 脚本可以有 **`所有者模式 owner mode`** 和**`普通模式 normal mode`，**其中包括不同的验证规则，我们在编码前应该对这两者有所了解。

* **所有者模式 owner mode**：如果交易中的某个输入中有一个 `lock script` 与SUDT 脚本参数相匹配，那么 SUDT 脚本将处于所有者模式。我们不需要执行检查，所有者可以执行任何操作，如发行更多的 SUDT 或烧毁 SUDT。
* **普通模式 normal mode：**否则，SUDT 脚本将处于正常模式。我们需要确保所有输入容量之和不小于所有输出容量之和。请注意，每个唯一的 `lock script` 只能发行出一种类型的SUDT。

该脚本由四部分组成：加载脚本（load script）、检查输入（check inputs）、加载输入/输出UDT量（load inputs / outputs UDT amount）、错误处理（error handling）。我们在编码前要检查已使用的库。

### 检查已使用的库

打开 `contracts/my-sudt/Cargo.toml` 文件，我们已经拥有一个依赖：

```
[dependencies]
ckb-std = "0.4.1"
```

* `ckb-std` 是用于处理 CKB 系统调用（syscalls）的包。
* `ckb-standalone-types` 是一个以 `ckb_std::ckb_types`的形式重新导出的包，它提供了 CKB 结构的定义。

You may refer to [Rust libraries](https://github.com/nervosnetwork/capsule/wiki/Rust-libraries) for more useful crates. We can only use crates which supports `no-std` in scripts.

你可以参考 [Rust 库](https://github.com/nervosnetwork/capsule/wiki/Rust-libraries) 获取更多有用的包，我们只能使用在脚本中支持 `no-std` 的包。

### 加载脚本（Load Script）

在脚本的开头，我们需要检查一下 SUDT 的模式，如果为所有者模式，我们简单跳过验证代码直接返回 `0`表示验证成功；相反，我们则需要检查 UDT 的数量。

为此，我们需要加载当前脚本的 `args` 参数，生成的代码已经完成了这一步，所以我们只需要从 `main ` 函数中删除未使用到的代码行即可。

下面代码，我们加载当前脚本的 `args` 字段，然后调用 `check_owner_mode`方法（该方法我们目前尚未定义）。

注意：因为们是使用的是 Rust no-std 模式，所以不能直接在代码中使用 `std` 。我们需要从 [alloc](https://doc.rust-lang.org/stable/alloc/index.html)  包中导入 `Vec` 结构体，这是 Rust 内置的一个包，包含 `堆 heap` 的相关数据结构。 

``` rust
fn main() -> Result<(), Error> {
    // load current script
    // check verification branch is owner mode or normal mode
    let script = load_script()?;
    let args: Bytes = script.args().unpack();

    // unpack the Script#args field
    let args: Vec<u8> = script.args().unpack();

    // return success if owner mode is true
    if check_owner_mode(&args)? {
        return Ok(());
    }

    // more verifications ...
    return Ok(());
}
```

### Check inputs

Now we should  check the owner mode status by defining the `check_owner_mode` function：

We need to load every input's lock hash and compare it to the script's args. If we find an input's lock hash corresponds to the script's args, we are in owner mode; otherwise, we iterate all the inputs and finally got an `IndexOutOfBound` error, which means we are in normal mode.

We use [load_cell_lock_hash](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/high_level/fn.load_cell_lock_hash.html) to load cell's lock hash from CKB. The `Source::Input` and `i` args denote we load `input` from `i-th` inputs.

The error `SysError::IndexOutOfBound` represents that we request an index that does not exist, which means we cannot find a matched input cell, so we return `Ok(false)`.

``` rust
use ckb_std::{
    high_level::{load_cell_lock_hash},
    ckb_constants::Source,
};

fn check_owner_mode(args: &Bytes) -> Result<bool, Error> {
    // With owner lock script extracted, we will look through each input in the
    // current transaction to see if any unlocked cell uses owner lock.
    for i in 0.. {
        // check input's lock_hash with script args
        let lock_hash = match load_cell_lock_hash(
            i,
            Source::Input,
        ) {
            Ok(lock_hash) => lock_hash,
            Err(SysError::IndexOutOfBound) => return Ok(false),
            Err(err) => return Err(err.into()),
        };
        // invalid length of loaded data
        if args[..] == lock_hash[..] {
           return Ok(true);
        }
    }
    Ok(false)
}
```

### Load inputs / outputs UDT amount

If the owner mode is `false`, we should continue the verification: check the total input SUDT amount is greater than or equals to the total output SUDT amount.

* Define two methods:
    *  `collect_inputs_amount` ：collect total input SUDT amount
    * `collect_outputs_amount` ：collect total output SUDT amount.

* Since we aim to read all SUDT inputs which type is the current script(SUDT), we  can use `Source::GroupInput` instead of  `Source::Input`.

*  `Source::GroupInput` and `i`   means load the `i-th` input from the "input group". 

Tips：

*  By using `Source::GroupInput`  in the syscall, CKB verification engine will automatically group the inputs/outputs by `lock` and `type` script.
* The data type of SUDT is  `u128`, which is 16 bytes so we use the 16 bytes buffer.
*  `i-th` input of `Source::Input`(index of all inputs) may be or may not be the same cell of the `i-th` input of `Source::GroupInput` (index of inputs which lock/type is the current script).

``` rust
const UDT_LEN: usize = 16;

fn collect_inputs_amount() -> Result<u128, Error> {
    // let's loop through all input cells containing current UDTs,
    // and gather the sum of all input tokens.
    let mut inputs_amount: u128 = 0;
    let mut buf = [0u8; UDT_LEN];

    // u128 is 16 bytes
    for i in 0.. {
        let data = match load_cell_data(i, Source::GroupInput) {
            Ok(data) => data,
            Err(SysError::IndexOutOfBound) => break,
            Err(err) => return Err(err.into()),
        };

        if data.len() != UDT_LEN {
            return Err(Error::Encoding);
        }
        buf.copy_from_slice(&data);
        inputs_amount += u128::from_le_bytes(buf);
    }
    Ok(inputs_amount)
}
```

The `collect_outputs_amount` function is similar, except we load data from outputs:

``` rust
fn collect_outputs_amount() -> Result<u128, Error> {
    // With the sum of all input UDT tokens gathered, let's now iterate through
    // output cells to grab the sum of all output UDT tokens.
    let mut outputs_amount: u128 = 0;
    let mut i = 0;

    // u128 is 16 bytes
    let mut buf = [0u8; UDT_LEN];
    for i in 0.. {
        let data = match load_cell_data(i, Source::GroupOutput) {
            Ok(data) => data,
            Err(SysError::IndexOutOfBound) => break,
            Err(err) => return Err(err.into()),
        };

        if data.len() != UDT_LEN {
            return Err(Error::Encoding);
        }
        buf.copy_from_slice(&data);
        outputs_amount += u128::from_le_bytes(buf);
    }
    Ok(outputs_amount)
}
```

* Update the `main` function to check inputs / outputs UDT amount:

``` rust
/// Error
#[repr(i8)]
enum Error {
    IndexOutOfBound = 1,
    ItemMissing,
    LengthNotEnough,
    Encoding,
    Amount
}

fn main() -> Result<(), Error> {
    let script = load_script()?;
    let args: Bytes = script.args().unpack();

    // return success if owner mode is true
    if check_owner_mode(&args)? {
        return Ok(());
    }

    let inputs_amount = collect_inputs_amount()?;
    let outputs_amount = collect_outputs_amount()?;

    if inputs_amount < outputs_amount {
        return Err(Error::Amount);
    }

    Ok(())
}
```

### Use Iterator to query cells

In the previous code, we use `for` loop to iterate inputs and outputs, since iteration over cells is a common pattern in CKB programming, `ckb-std` provides a high-level interface [QueryIter](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/high_level/struct.QueryIter.html) to handle it.

QueryIter needs two args, the first is a loading function, the seconds is `Source`. This is an example to load all grouped inputs cells data `QueryIter::new(load_cell_data, Source::GroupInput)`.

Rewrite our functions:

``` rust
fn check_owner_mode(args: &Bytes) -> Result<bool, Error> {
    // With owner lock script extracted, we will look through each input in the
    // current transaction to see if any unlocked cell uses owner lock.
    let is_owner_mode = QueryIter::new(load_cell_lock_hash, Source::Input)
        .find(|lock_hash| args[..] == lock_hash[..]).is_some();
    Ok(is_owner_mode)
}

fn collect_inputs_amount() -> Result<u128, Error> {
    // let's loop through all input cells containing current UDTs,
    // and gather the sum of all input tokens.
    let mut buf = [0u8; UDT_LEN];

    let udt_list = QueryIter::new(load_cell_data, Source::GroupInput)
        .map(|data|{
            if data.len() == UDT_LEN {
                buf.copy_from_slice(&data);
                // u128 is 16 bytes
                Ok(u128::from_le_bytes(buf))
            } else {
                Err(Error::Encoding)
            }
        }).collect::<Result<Vec<_>, Error>>()?;
    Ok(udt_list.into_iter().sum::<u128>())
}

fn collect_outputs_amount() -> Result<u128, Error> {
    // With the sum of all input UDT tokens gathered, let's now iterate through
    // output cells to grab the sum of all output UDT tokens.
    let mut buf = [0u8; UDT_LEN];

    let udt_list = QueryIter::new(load_cell_data, Source::GroupOutput)
        .map(|data|{
            if data.len() == UDT_LEN {
                buf.copy_from_slice(&data);
                // u128 is 16 bytes
                Ok(u128::from_le_bytes(buf))
            } else {
                Err(Error::Encoding)
            }
        }).collect::<Result<Vec<_>, Error>>()?;
    Ok(udt_list.into_iter().sum::<u128>())
}

```


Now we have finished the SUDT script, you may refer to [Full code of my-sudt](https://github.com/jjyr/my-sudt/blob/master/contracts/my-sudt/src/main.rs) to check the full script code. If you are interested, you may also check [the SUDT script written in C](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/simple_udt.c).


### Build the project

Run `capsule build` under the project directory to build the script.If no error occurred, we can find the script binary at `my-usdt/build/debug/my-sudt`. 


## Testing

We will use the `ckb-testtool` crate to construct transactions and context for our testing.

### Check the default tests

When create the project `my-sudt`,`capsule`  have generated the default tests.The default tests create mock cells and unlock them for testing.

Use  `capsule build` under the project directory to build the script, 
then use `capsule test` to run the default tests.We will find the error message:

```
failures:

---- tests::test_basic stdout ----
thread 'tests::test_basic' panicked at 'pass verification: Error { kind: ValidationFailure(4)Script }', tests/src/tests.rs:52:5
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    tests::test_basic
```

The error number `4` in `Error { kind: ValidationFailure(4)`  refers to `Error::Encoding`, which means the cell’s data type is not `u128`. 

Let’s check the default tests code  `tests/src/tests.rs`  to find out how to write the tests, then we can write new tests adapted `my-sudt`：

* In the beginning part, initialize the  `Context` which is a structure to simulate the chain environment. We can use `Context` to deploy exists cells and mock block headers.`deploy_contract` will return the  `out_point` of the script.

``` rust
// deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("my-sudt");
    let contract_out_point = context.deploy_contract(contract_bin);
```

* Then `build_script` is called with the script's `out_point` , this function returns the `Script` which uses our script as the code. `create_cell` creates an existing cell in the context, which uses our script as the `lock_script`.

*Please note the default tests assume the script is a lock_script, but in our case, `my-sudt` is a type_script. We'll fix it later.*

``` rust
// prepare scripts
    let lock_script = context.build_script(&contract_out_point, Default::default()).expect("script");
    let lock_script_dep = CellDep::new_builder().out_point(contract_out_point).build();

    // prepare cells
    let input_out_point = context.create_cell(
        CellOutput::new_builder()
            .capacity(1000u64.pack())
            .lock(lock_script.clone())
            .build(),
        Bytes::new(),
    );
    let input = CellInput::new_builder()
        .previous_output(input_out_point)
        .build();
```

* After that, build two outputs cells and a transaction structure.It is necessary to include  `cell_deps` field in the transaction which should contain all the referenced scripts, in this case, we can only refer to `my-sudt`.  `complete_tx`  also implement `cell_deps`, while the field is already completed manually, this line is not necessary.

Please note that the  transaction's `outputs_data` must have the same length with the `outputs`, even the data is empty.

``` rust
let outputs = vec![
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script.clone())
            .build(),
        CellOutput::new_builder()
            .capacity(500u64.pack())
            .lock(lock_script)
            .build(),
    ];

    let outputs_data = vec![Bytes::new(); 2];

    // build transaction
    let tx = TransactionBuilder::default()
        .input(input)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .cell_dep(lock_script_dep)
        .build();
    let tx = context.complete_tx(tx);
```

* Finally, verify the transaction:

```
// run
    context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
```

### Write new tests

We should create mock SUDT cells and spend them for testing SUDT verification.
As `my-sudt` script is a `type_script` we need another script as `lock_script` for mock cells, it is recommended to use `always success` script returned `0`. `always success` is built-in in the `ckb-testtool`.


``` rust
use ckb_testtool::{builtin::ALWAYS_SUCCESS, context::Context};

    // deploy always_success script
    let always_success_out_point = context.deploy_contract(ALWAYS_SUCCESS.clone());
```

Before writing the code, let's think about our  test cases:

1. Return success when inputs capacity equals to outputs capacity.
2. Return success when inputs capacity is greater than outputs capacity.
3. Return failure when inputs capacity is less than outputs capacity.
4. Return success when inputs capacity is less than outputs token with `owner mode` activated.

* Define `build_test_context` to build transactions. There are three args: 
    * The data type of  `inputs_token` and `outputs_token`  is  `u128`. The function can generate SUDT inputs cells and outputs cells according to the two args.
    *  `is_owner_mode` refers to the current transaction is in SUDT owner mode or normal mode.

* Deploy the SUDT and `always-success` scripts.

Please note that if `is_owner_mode` is true, we will set `lock_script`'s `lock_hash` as `owner script hash`; otherwise, we will set `[0u8; 32]` which implies can't enter into owner mode.

``` rust
fn build_test_context(
    inputs_token: Vec<u128>,
    outputs_token: Vec<u128>,
    is_owner_mode: bool,
) -> (Context, TransactionView) {
    // deploy my-sudt script
    let mut context = Context::default();
    let sudt_bin: Bytes = Loader::default().load_binary("my-sudt");
    let sudt_out_point = context.deploy_contract(sudt_bin);
    // deploy always_success script
    let always_success_out_point = context.deploy_contract(ALWAYS_SUCCESS.clone());

    // build lock script
    let lock_script = context
        .build_script(&always_success_out_point, Default::default())
        .expect("script");
    let lock_script_dep = CellDep::new_builder()
        .out_point(always_success_out_point)
        .build();

    // build sudt script
    let sudt_script_args: Bytes = if is_owner_mode {
        // use always_success script hash as owner's lock
        let lock_hash: [u8; 32] = lock_script.calc_script_hash().unpack();
        lock_hash.to_vec().into()
    } else {
        // use zero hash as owner's lock which implies we can never enter owner mode
        [0u8; 32].to_vec().into()
    };

    let sudt_script = context
        .build_script(&sudt_out_point, sudt_script_args)
        .expect("script");
    let sudt_script_dep = CellDep::new_builder().out_point(sudt_out_point).build();

    //... more code below
//}
```

* Build inputs and outputs according to the `inputs_token` and `outputs_token` 

``` rust
// ...
    // prepare inputs
    // assign 1000 Bytes to per input
    let input_ckb = Capacity::bytes(1000).unwrap().as_u64();
    let inputs = inputs_token.iter().map(|token| {
        let input_out_point = context.create_cell(
            CellOutput::new_builder()
                .capacity(input_ckb.pack())
                .lock(lock_script.clone())
                .type_(Some(sudt_script.clone()).pack())
                .build(),
            token.to_le_bytes().to_vec().into(),
        );
        let input = CellInput::new_builder()
            .previous_output(input_out_point)
            .build();
        input
    });

    // prepare outputs
    let output_ckb = input_ckb * inputs_token.len() as u64 / outputs_token.len() as u64;
    let outputs = outputs_token.iter().map(|_token| {
        CellOutput::new_builder()
            .capacity(output_ckb.pack())
            .lock(lock_script.clone())
            .type_(Some(sudt_script.clone()).pack())
            .build()
    });
    let outputs_data: Vec<_> = outputs_token
        .iter()
        .map(|token| Bytes::from(token.to_le_bytes().to_vec()))
        .collect();
    // ...
```

*  Finally construct the transaction and return it with context.

```
// build transaction
    let tx = TransactionBuilder::default()
        .inputs(inputs)
        .outputs(outputs)
        .outputs_data(outputs_data.pack())
        .cell_dep(lock_script_dep)
        .cell_dep(sudt_script_dep)
        .build();
    (context, tx)
```

Now the helper function `build_test_context` is finished, we can write our tests: 

``` rust
#[test]
fn test_basic() {
    let (mut context, tx) = build_test_context(vec![1000], vec![400, 600], false);
    let tx = context.complete_tx(tx);

    // run
    context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
}

#[test]
fn test_destroy_udt() {
    let (mut context, tx) = build_test_context(vec![1000], vec![800, 100, 50], false);
    let tx = context.complete_tx(tx);

    // run
    context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
}

#[test]
fn test_create_sudt_without_owner_mode() {
    let (mut context, tx) = build_test_context(vec![1000], vec![1200], false);
    let tx = context.complete_tx(tx);

    // run
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_error_eq!(err, ScriptError::ValidationFailure(ERROR_AMOUNT));
}

#[test]
fn test_create_sudt_with_owner_mode() {
    let (mut context, tx) = build_test_context(vec![1000], vec![1200], true);
    let tx = context.complete_tx(tx);

    // run
    context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
}
```

You may refer to [my-sudt tests](https://github.com/jjyr/my-sudt/blob/master/tests/src/tests.rs) for the full tests. Run `capsule test`  all tests will be passed.

## Deployment

### Run a dev chain and ckb-cli

You should be running a dev chain and know about how to use `ckb-cli` to send transactions before deployment. 

### Deploy

1. Update the deployment configurations

   Open  `deployment.toml` :

     *  `cells`  describes which cells to be deployed.

        * `name`: Define the reference name used in the deployment configuration.
        * `enable_type_id` : If it is set to `true` means create a `type_id` for the cell.
        * `location` :  Define the script binary path.

     *  `dep_groups`  describes which dep_groups to be created. Dep Group is a cell which bundles several cells as its members. When a dep group cell is used in `cell_deps`, it has the same effect as adding all its members into `cell_deps`. In our case, we don’t need `dep_groups`.
     * `lock`  describes the `lock` field of the new deployed cells.It is  recommended to set `lock` to the deployer's address(an address that you can unlock) in the dev chain and in the testnet, which is easier to update the script.

2. Uncomment the configuration file and replace the cell name and location with `my-usdt`.

```
# [[cells]]
# name = "my_cell"
# enable_type_id = false
# location = { file = "build/release/my_cell" }

# # Dep group cells
# [[dep_groups]]
# name = "my_dep_group"
# cells = [
#   "my_cell",
#   "secp256k1_data"
# ]

# # Replace with your own lock if you want to unlock deployed cells.
# # The deployment code_hash is secp256k1 lock
# [lock]
# code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
# args = "0x0000000000000000000000000000000000000000"
# hash_type = "type"
```

3. Build release version of the script
  
  * The release version of script  doesn’t  include debug symbols which makes the size smaller.

```
capsule build --release
```

4. Deploy the script 

```
capsule deploy --address <ckt1....>
```

If the `ckb-cli` has been installed and dev-chain RPC is connectable, you will see the `deployment plan`:

* `new_occupied_capacity` and `total_occupied_capacity`  refer how much CKB to store cells and data.
* `txs_fee_capacity` refers how much CKB to pay the transaction fee.

```
Deployment plan:
---
migrated_capacity: 0.0 (CKB)
new_occupied_capacity: 33629.0 (CKB)
txs_fee_capacity: 0.0001 (CKB)
total_occupied_capacity: 33629.0 (CKB)
recipe:
  cells:
    - name: my-sudt
      index: 0
      tx_hash: 0x8b496cb19018c475cdc4605ee9cef83cbfe578dce4f81f3367395906eba52c29
      occupied_capacity: 33629.0 (CKB)
      data_hash: 0xaa3d472025e6afefdf3f65c5f9beefd206b4283b30551baef83cbb4762e6d397
      type_id: ~
  dep_groups: []
Confirm deployment? (Yes/No)
```

5. Type `yes` or `y`  and input the password to unlock the account.

```
send cell_tx 8b496cb19018c475cdc4605ee9cef83cbfe578dce4f81f3367395906eba52c29
Deployment complete
```

Now the SUDT script has been deployed, you can refer to this script by using `tx_hash: 0xaa3d472025e6afefdf3f65c5f9beefd206b4283b30551baef83cbb4762e6d397 index: 0` as `out_point`(your `tx_hash` should be another value).

### Migration

If you want to update the script code and deploy again, you can simply run this command again:

```
capsule deploy --address ckt1qyq075y5ctzlgahu8pgsqxrqnglajgwa9zksmqdupd
```

The new script will be automatically migrated which means destroy the old script cells and create new cells.
You will find  `new_occupied_capacity` is `0` because `capacity` is already covered by the old script cells.Please don’t forget the transaction fee you still need to pay it.

```
Deployment plan:
---
migrated_capacity: 33629.0 (CKB)
new_occupied_capacity: 0.0 (CKB)
txs_fee_capacity: 0.0001 (CKB)
total_occupied_capacity: 33629.0 (CKB)
recipe:
  cells:
    - name: my-sudt
      index: 0
      tx_hash: 0x10d508a0b44d3c1e02982f85a3e9b5d23d3961fddbf554d20abb4bf54f61950a
      occupied_capacity: 33629.0 (CKB)
      data_hash: 0xaa3d472025e6afefdf3f65c5f9beefd206b4283b30551baef83cbb4762e6d397
      type_id: ~
  dep_groups: []
Confirm deployment? (Yes/No)
```

## Next Steps

This is the end of our journey into writing a SUDT script by Capsule. We have launched the [Nervos Grants Program](https://www.nervos.org/grants/) and [CKLabs](https://medium.com/nervosnetwork/introducing-cklabs-the-nervos-incubator-3e5a2c443c7c) to empower innovation and development and support the growth of a diverse and thriving ecosystem. We can't wait to see what you build next!
