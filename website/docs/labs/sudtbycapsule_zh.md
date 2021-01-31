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

要使用 capsule，你需要使用 `docker`。推荐安装最新版本：

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

* **所有者模式 owner mode**：如果交易中的某个输入中有一个 `锁脚本（lock script）` 与SUDT 脚本参数相匹配，那么 SUDT 脚本将处于所有者模式。我们不需要执行检查，所有者可以执行任何操作，如发行更多的 SUDT 或烧毁 SUDT。
* **普通模式 normal mode：**否则，SUDT 脚本将处于正常模式。我们需要确保所有输入容量之和不小于所有输出容量之和。请注意，每个唯一的 `锁脚本（lock script）` 只能发行出一种类型的SUDT。

该脚本由四部分组成：加载脚本（load script）、检查输入（check inputs）、加载输入/输出UDT量（load inputs / outputs UDT amount）、错误处理（error handling）。我们在编码前要检查已使用的库。

### 检查已使用的库

打开 `contracts/my-sudt/Cargo.toml` 文件，我们已经拥有一个依赖：

```
[dependencies]
ckb-std = "0.4.1"
```

* `ckb-std` 是用于处理 CKB 系统调用（syscalls）的包。
* `ckb-standalone-types` 是一个以 `ckb_std::ckb_types`的形式重新导出的包，它提供了 CKB 结构的定义。

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

### 检查输入 

现在我们应该通过定义 `check_owner_mode`  函数来检查所有者模式的状态：

我们需要加载所有输入的 `lock hash`，然后跟脚本参数进行比较。如果我们有一个输入的 `lock hash` 匹配得上脚本参数，那么就是所有者模式。防止，如果我们遍历了所有输入，最后得到了 `IndexOutOfBound` 错误，则表示为正常模式。 

我们使用 [load_cell_lock_hash](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/high_level/fn.load_cell_lock_hash.html) 来从 CKB 中加载 Cells 的 `lock hash` 。其中 `Source::Input` 和`i` 参数表示我们从`i-th` 输入中加载输入。

错误 `SysError::IndexOutOfBound` 表示我们请求的索引不存在，即我们无法找到匹配的输入 Cell，所以我们返回  `Ok(false)`。

``` rust
use ckb_std::{
    high_level::{load_cell_lock_hash},
    ckb_constants::Source,
};

fn check_owner_mode(args: &Bytes) -> Result<bool, Error> {
    // With owner 锁脚本（lock script） extracted, we will look through each input in the
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

### Load inputs / outputs UDT amount 加载输入/输出的 UDT 数量

如果不是处于所有者模式，我们就应该继续进行验证：检查输入的总 SUDT 数量大于或等于输出的总 SUDT 数量。

* 定义两个方法：
    *  `collect_inputs_amount` ：获取输入的总 SUDT 数量
    *  `collect_outputs_amount` ：获取输出的总SUDT 数量
* 因为我们的目的是读取当前脚本（SUDT）类型的所有 SUDT，所以我们可以使用 `Source::GroupInput` ，此处不使用  `Source::Input`。
* `Source::GroupInput` 和`i`   表示从 “输入组” 中加载 `i-th` 输入。 

小提醒：

*  在系统调用中使用 `Source::GroupInput` ，CKB 验证引擎会自动按 `锁脚本（lock script）` 和 `类型脚本（type script） `  对输入/输出 Cells 进行分组。
*  SUDT 的数据类型是 `u128`，为 16 字节，所以我们使用 16 字节缓存。
*   `Source::Input`（所有输入的索引） 的 `i-th` 输入跟 `Source::GroupInput` （lock 或者 type 脚本是当前脚本的输入的索引）的 `i-th` 输入可能是相同的 Cell，也可能不是。

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

 `collect_outputs_amount` 方法也类似，只不过是从输出中加载数据：

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

* 更新`main` 方法检查输入输出的 UDT 数量：

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

### 使用迭代器查询 Cells

在上文代码中，我们使用 `for` 循环来遍历输入输出，由于对 Cells 进行遍历是 CKB 编程中的常见模式，所以 `ckb-std` 提供了一个高级接口 [QueryIter](https://nervosnetwork.github.io/ckb-std/riscv64imac-unknown-none-elf/doc/ckb_std/high_level/struct.QueryIter.html) 来处理它。

QueryIter 需要两个参数，第一个是一个加载函数，第二个是 `Source`。我们看看一个加载所有已分组输入 Cells 数据的例子： `QueryIter::new(load_cell_data, Source::GroupInput)`。

重写我们的方法:

``` rust
fn check_owner_mode(args: &Bytes) -> Result<bool, Error> {
    // With owner 锁脚本（lock script） extracted, we will look through each input in the
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

现在我们已经完成了 SUDT 脚本，你可以参考[查看完整代码](https://github.com/jjyr/my-sudt/blob/master/contracts/my-sudt/src/main.rs) 。如果你感兴趣的话，也可以查看用[C 语言编写 SUDT 脚本](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/simple_udt.c) 。

### 编译项目

在项目目录中执行 `capsule build` 编译脚本。如果没有报错的话，我们就可以在 `my-usdt/build/debug/my-sudt` 目录下看到脚本二进制文件。


## 测试

我们可以使用 `ckb-testtool` 包来打造方便我们测试的交易和环境。

### 查看默认测试用例

当创建 `my-sudt` 项目时，`capsule` 会生成默认测试用例。默认测试用例会创建模拟的 Cells 并解锁，方便我们测试。

在项目目录中执行 `capsule build` 编译脚本，然后执行 `capsule test`  运行默认测试用例，我们会看到如下错误信息：

```
failures:

---- tests::test_basic stdout ----
thread 'tests::test_basic' panicked at 'pass verification: Error { kind: ValidationFailure(4)Script }', tests/src/tests.rs:52:5
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    tests::test_basic
```

在 `Error { kind: ValidationFailure(4)`  中的数字 `4` 表示  `Error::Encoding`，即 Cells 的数据类型非  `u128`。

我们检查默认测试代码 `tests/src/tests.rs` 了解如何编写测试用例，然后编写适合 `my-sudt` 的测试用例：

* 开头，初始化 `Context` ，用于模拟链上环境。 我们可以使用 `Context` 来部署现存的 Cells 和模拟的区块头。`deploy_contract` 会返回脚本的   `out_point` 。

``` rust
// deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("my-sudt");
    let contract_out_point = context.deploy_contract(contract_bin);
```

* 然后， 带脚本的 `out_point` 参数调用 `build_script` 方法，该方法返回 `Script` ，其将我们的脚本用作为代码。 `create_cell` 创建了一个已存在的 Cell，该 Cell 将我们的脚本用作为 `锁脚本（lock script）`。

*请注意默认测试用例假设脚本是 `锁脚本（lock script）`，但在本例子中，我们的脚本 `my-sudt `是 `类型脚本（type script）` ，后续我们将修复这一点*

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

* 之后，构建两个输出 Cells 和一个交易结构。交易中需要包含 `cell_deps` 字段，该字段包含所有引用的脚本，在我们的例子中，我们只需要引用 `my-sudt`。`complete_tx` 也实现了 `cell_deps`，不过该字段已经手动实现了，所以这一行就没有必要了。

请注意交易的 `outputs_data` 必须跟 `outputs` 具有相同的长度。即使数据为空。

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

* 最后，验证交易：

```
// run
    context
        .verify_tx(&tx, MAX_CYCLES)
        .expect("pass verification");
```

### Write new tests 编写新的测试用例

我们应该创建模拟的 SUDT Cells 然后在测试 SUDT 验证时花费掉它们。因为我们的 `my-sudt` 脚本是一个 `type_script` ，所以我们需要另一个脚本作为 `锁脚本（lock script）` 用于模拟 Cells，我们推荐使用 `always success` 脚本返回 `0`。 `always success`  内置在 `ckb-testtool`中。 


``` rust
use ckb_testtool::{builtin::ALWAYS_SUCCESS, context::Context};

    // deploy always_success script
    let always_success_out_point = context.deploy_contract(ALWAYS_SUCCESS.clone());
```

在开始编写代码前，我们再整理一下测试用例要点：

1. 当输入容量等于输出容量时，返回成功。
2. 当输入容量大于输出容量时，返回成功。
3. 当初入容量小于输出容量时，返回失败。
4. 在所有者模式下，当输入容量小于输出代币时，返回成功。

* 定义`build_test_context` 来构建交易，有三个参数： 
    *  `inputs_token` 和 `outputs_token` 的数据类型是 `u128`。该方法可以根据这两个参数生成 SUDT 输入 Cells 和输出 Cells。
    * `is_owner_mode` 表示当前交易在 SUDT 中是所有者模式还是正常模式。

* 部署 SUDT 和 `always-success` 脚本。

请注意，如果处于所有者模式，我们就需要将 `锁脚本（lock script）` 的 `lock hash` 设置为 `所有者脚本的哈希`; 否则，我们将会设置 `[0u8; 32]` ，表示不能进入所有者模式。

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

    // build 锁脚本（lock script）
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

* 根据 `inputs_token` 和 `outputs_token` 构建输入输出。

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

*  最后构建交易，然后跟上下文一起返回。

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

现在 `build_test_context` 已完成，我们开始编写测试：

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

你可以参考 [my-sudt tests](https://github.com/jjyr/my-sudt/blob/master/tests/src/tests.rs) 了解完整测试。运行 `capsule test`  所有测试都将通过。

## 部署

### 运行开发链和 ckb-cli

在部署之前，你应该运行一条开发链，并且知道如何使用 `ckb-cli` 进行发送交易。

### 部署

1. 更新部署配置文件

   打开  `deployment.toml` :

     *  `cells`  描述哪些 Cells 将会部署
        * `name`：定义部署配置中使用的参考名称。
        * `enable_type_id` : 如果设置为 `true` ，则会为 Cell 创建一个 `type_id` 。
        * `location` :  脚本二进制文件的位置。

     *  `dep_groups`  描述创建哪个 dep_groups。Dep Group  是一个绑定多 Cells 作为它的成员的 Cell。当在 `cell_deps` 中使用 dep group cell 时，跟将其所有成员添加到 `cell_deps` 的效果一样。在本例子汇总，我们不需要 `dep_groups`。
     *  `lock`  描述了新部署的 Cells 的 `lock` 字段。推荐将 `lock` 设置为开发链或者测试链上开发者的地址（或者你能够解锁的地址），这样易于更新。

2. 解注释配置文件，用 `my-sudt`的属性替换 Cell `name` 和 `location `。

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

3. 编译发布版脚本

  * 发布版脚本不包含相关调试符号，所以文件可以更小点

```
capsule build --release
```

4. 部署脚本

```
capsule deploy --address <ckt1....>
```

如果 `ckb-cli` 已经安装并且开发链 RPC 已可连接，你便可以看到 `deployment plan`：

* `new_occupied_capacity` 和`total_occupied_capacity`  指多少 CKB 代币用于存储 Cells 和数据。
* `txs_fee_capacity` 指多少 CKB 代币用于支付费用。

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

5. Type `yes` or `y`  and input the password to unlock the account. 输入 `yes` 或 `y` ，然后输入密码解锁账户。

```
send cell_tx 8b496cb19018c475cdc4605ee9cef83cbfe578dce4f81f3367395906eba52c29
Deployment complete
```

Now the SUDT script has been deployed, you can refer to this script by using `tx_hash: 0xaa3d472025e6afefdf3f65c5f9beefd206b4283b30551baef83cbb4762e6d397 index: 0` as `out_point`(your `tx_hash` should be another value).

现在 SUDT 脚本部署完成，你可以引用通过使用 `tx_hash: 0xaa3d472025e6afefdf3f65c5f9beefd206b4283b30551baef83cbb4762e6d397 index: 0`  作为`out_point` 来引用该脚本（你的 `tx_hash` 应该为其他值，这个为例子的值）。	

### 迁移

如果你想要更新脚本代码然后再次发布，你只需要再次执行这个命令：

```
capsule deploy --address ckt1qyq075y5ctzlgahu8pgsqxrqnglajgwa9zksmqdupd
```

新的脚本会自动迁移，旧脚本 Cells 会被销毁然后创建出新的 Cells。

你会发现 `new_occupied_capacity` 为 `0`，因为容量已经被旧脚本 Cells 覆盖了，请不要忘记你还需要支付交易费用。

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

## 后续

使用 Capsule 编写 SUDT 脚本的教程就到这里了。我们已经启动了 [Nervos Grants Program](https://www.nervos.org/grants/) 和[CKLabs](https://medium.com/nervosnetwork/introducing-cklabs-the-nervos-incubator-3e5a2c443c7c)以促进创新和发展，支持多样化和繁荣的生态系统的增长。欢迎来 Nervos CKB 生态开发构建！

