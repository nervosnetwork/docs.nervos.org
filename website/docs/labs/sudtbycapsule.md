---
id: sudtbycapsule
title: Write an SUDT Script by Capsule
---

## Introduction

[Capsule](https://github.com/nervosnetwork/capsule) is a set of tools for Rust developers to develop scripts on CKB which covers the entire lifecycle of script development: writing,debugging,testing and deployment. We aim to improve the development experience of Rust developers.

In this tutorial, you will learn how to write a SUDT script using Capsule. SUDT is the abbreviation of Simple User Defined Token which defines a minimal standard that contains what’s absolutely needed for dapp developers to issue custom tokens on Nervos CKB. You can refer to [RFC: Simple UDT Draft Spec](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) for more details.

We expect that:

* You are Rust developers and generally familiar with software development, writing code, and running your code.
* You are generally familiar with Nervos CKB and have completed the [How to use a development blockchain](basics/guides/devchain.md)
* You are open to learning about the bleeding edge of blockchain development

If you run into an issue on this tutorial you can [create a new issue](https://github.com/nervosnetwork/capsule) or contact us on [Nervos talk](https://talk.nervos.org/) or [Discord](https://discord.gg/n6tx7uC). 

What you will be doing:

* Prepare to write the SUDT script 
* Write a SUDT script
* Testing
* Deployment 

## Prepare to write the SUDT script

### Run a dev chain and ckb-cli

You should be able to run a dev chain and know about how to use `ckb-cli` to send transactions.  If you do not, please refer to this tutorial：[How to use a development blockchain](basics/guides/devchain.md).  Please don't forget to add `ckb-cli` to the  PATH environment variable

### Install Capsule

To use capsule, you need to install Docker. It is recommended to install the latest version of Docker:

* [Install Docker](https://docs.docker.com/get-docker/)

Note: The current user must have permission to manage Docker instances. For more information, see [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).

Now you can proceed to install Capsule. It is recommended to download the binary [here](https://github.com/nervosnetwork/capsule/releases).

Or you can install Capsule from it's source:

```
cargo install capsule --git https://github.com/nervosnetwork/capsule.git --tag v0.1.3
```

Then check if it works with the following command:

```
capsule check
```
<details>
<summary>(click here to view response)</summary>
```bash
------------------------------
docker    installed
ckb-cli    installed
------------------------------
```
</details>


### Create a project

```
capsule new my-sudt
```
<details>
<summary>(click here to view response)</summary>
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


You can check the project’s layout：

```
ls my-sudt
```
<details>
<summary>(click here to view response)</summary>
```bash

build  capsule.toml  Cargo.toml  contracts  deployment.toml  migrations  README.md  tests
```
</details>

The default contract is under `my-sudt/contracts/my-sudt` directory which is a normal cargo project:

```
ls my-sudt/contracts/my-sudt
```
<details>
<summary>(click here to view response)</summary>
```bash

Cargo.toml  src
```
</details>

You can open `my-sudt/contracts/my-sudt/src/main.rs` to see some pre-generated code:

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

### Build the project

Enter into the project  `my-sudt` and build it.

```
cd my-sudt
capsule build
```

<details>
<summary>(click here to view response)</summary>
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


You will find a new generated contract binary in the `build/debug` directory:

```
ls build/debug
```
<details>
<summary>(click here to view response)</summary>
```bash

my-sudt
```
</details>


You're all done? Great, let's get coding.

## Write a SUDT script

SUDT scripts can be in **owner mode** and **normal mode** which include different verification rules, we should deal with that when we're coding.

* **owner mode**：If one of the transaction input has a lock script matching the SUDT script argument, the SUDT script will be in owner mode. We don’t need to perform checks, the owner can perform any operations such as issuing more SUDTs or burning SUDTs. 
* **normal mode：**Otherwise, the SUDT script will be in normal mode. We need to ensure the sum of all inputs’ capacity is not smaller than the sum of all outputs capacity. Please note that only one type of SUDT can be issued for each unique lock script. 

The script is consisted of four parts：load script、check inputs、load inputs / outputs UDT amount、error handling. We should check the used libraries before coding.

### Check the used libraries

Open `contracts/my-sudt/Cargo.toml`, we already have a dependency:

```
[dependencies]
ckb-std = "0.4.1"
```

* `ckb-std` is a crate used to handling CKB syscalls.
* `ckb-standalone-types` is a crate which re-exported as the `ckb_std::ckb_types` provides the definition of CKB structures.

You may refer to [Rust libraries](https://github.com/nervosnetwork/capsule/wiki/Rust-libraries) for more useful crates. We can only use crates which supports `no-std` in scripts.

### Load Script

At the beginning of the script, we need to check the SUDT’s mode, if it is owner mode, we simply skip the verification code and return `0`, which represents the verification is successful, otherwise we check the amount of UDT.

To achieve this, we need to load `args` of the current script, which the generated code already did for us. So we just remove the unused lines from the `main` function.

In the code below, we load the current script(SUDT)'s args field, and invoke `check_owner_mode` which we have not defined yet.

Notice since we are using no-std Rust, we can't directly use the `std` in the code. Instead, we need to import the `Vec` struct from the [alloc](https://doc.rust-lang.org/stable/alloc/index.html) crate, which is a rust builtin crate contains heap related structs.

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

1. Return success when input tokens equals to output tokens.
2. Return success when input tokens is greater than output tokens.
3. Return failure when input tokens is less than output tokens.
4. Return success when input tokens is less than output tokens with `owner mode` activated.

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
