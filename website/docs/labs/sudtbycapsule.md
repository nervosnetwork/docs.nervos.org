---
id: sudtbycapsule
title: Write a SUDT script by Capsule
---

## Introduction

[Capsule](https://github.com/nervosnetwork/capsule) is a set of tools for Rust developers to develop scripts on CKB which covers the entire lifecycle of script development: writing、debugging、testing and deployment. We aim to improve the development experience of Rust developers.

In this tutorial, you will learn how to write a SUDT script using Capsule. SUDT is the abbreviation of Simple User Defined Token which defines a minimal standard that contains what’s absolutely needed for dapp developers to issue custom tokens on Nervos CKB. You can refer to [RFC: Simple UDT Draft Spec](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) for more details.

We expect that:

* You are Rust developers and generally familiar with software development, writing code, and running your code.
* You are generally familiar with Nervos CKB and have completed the  [How to use a development blockchain](essays/devchain.md)
* You are open to learning about the bleeding edge of blockchain development

If you run into an issue on this tutorial you can [create a new issue](https://github.com/nervosnetwork/capsule) or contact us on [Nervos talk](https://talk.nervos.org/) or [Discord](https://discord.gg/n6tx7uC). 

What you will be doing:

* Prepare to write the SUDT script 
* Write a SUDT script
* Testing
* Deployment 

## Prepare to write the SUDT script

### Run a dev chain and ckb-cli

You should be able to run a dev chain and know about how to use ckb-cli to send transactions.  If you do not, please refer to this tutorial：[How to use a development blockchain](essays/devchain.md).  Please don't forget to add `ckb-cli` to the  PATH environment variable

### Install capsule

To use capsule, you need `cargo` and `docker`. If you don't have these tools, you may install them from here, it is recommended to install the latest version:

* [Install cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) 
* [Install docker](https://www.docker.com/)

Now you can proceed to install capsule with these commands:

```
cargo install capsule --git https://github.com/nervosnetwork/capsule.git --tag v0.0.1-pre.2
```

Then check if it works with:

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

You can open `my-sudt/contracts/my-sudt/src/main.rs` to see some pre-written code:

```
#![no_std]
#![no_main]
#![feature(lang_items)]
#![feature(alloc_error_handler)]
#![feature(panic_info_message)]

use ckb_std::{entry, default_alloc};

entry!(main);
default_alloc!();

#[no_mangle]
fn main() -> i8 {
    // this contract always return true
    0
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
 Downloading crates ...
  Downloaded buddy-alloc v0.2.0
  Downloaded ckb-std v0.1.6
   Compiling buddy-alloc v0.2.0
   Compiling ckb-std v0.1.6
   Compiling my-sudt v0.1.0 (/code)
    Finished release [optimized] target(s) in 9.86s
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

Open `contracts/my-sudt/Cargo.toml`, you will find two dependencies:

```
[dependencies]
ckb-std = "0.2.1"
ckb-types = { package = "ckb-standalone-types", version = "0.0.1-pre.1", default-features = false }
```

* `ckb-std` is a crate used to handling CKB syscalls.
* `ckb-standalone-types` is a crate that provides the definition of CKB structures.

You may refer to [Rust libraries](https://github.com/nervosnetwork/capsule/wiki/Rust-libraries) for more details. We can only use crates which supports `no-std` in scripts.

### Load Script

At the beginning of the script, we need to load the current script(SUDT) and unpack the args field, also we should check the SUDT’s mode, if it is owner mode, we simply skip the verification code and return `0`, then the verification is successful.We also need to load the current script(SUDT) and unpack the args field.

Please note that we can't directly use the `std` crate since we are using `no-std` Rust.Instead, we import the `Vec` struct from the [alloc](https://doc.rust-lang.org/stable/alloc/index.html) crate, which is a rust built-in crate contains heap related structs.

The `buf` should be large enough to cover the `Script` data so we use `1024` bytes buffer.


```
use alloc::vec::Vec;
use ckb_std::{
    ckb_constants::{CellField, Source, SysError},
    default_alloc, entry, syscalls,
};
use ckb_types::{packed::Script, prelude::*};

const BUF_LEN: usize = 1024

fn main() -> i8 {
    // load current script
    // check the script is in owner mode or normal mode
    let script = {
        let mut buf = [0u8; BUF_LEN];
        let len = syscalls::load_script(&mut buf, 0).unwrap();
        Script::new_unchecked(buf[..len].to_vec().into())
    };

    // unpack the Script#args field
    let args: Vec<u8> = script.args().unpack();

    // return success if owner mode is true
    if check_owner_mode(&args).unwrap() {
        return 0;
    }

    // more verifications ...
    return 0;
}
```

### Check inputs

Now we should  check the owner mode status by defining the `check_owner_mode` function：

* Load every input's lock hash and compare it with the script's args. 
    * If  there is  an input's lock hash matching the script's argument, the SUDT script is in owner mode; 
    * Otherwise，iterate all the inputs and finally got an `IndexOutOfBound` error which means the SUDT script is in normal mode.
*  `Source::Input` and `i` means load `input` from `i-th` inputs. 
*  `CellField::LockHash` means load the `LockHash` field to the `buf`.

* Check the `len` returned by syscall,  It's always a good practice to check the loaded length.

```
fn check_owner_mode(args: &[u8]) -> Result<bool, SysError> {
    // With owner lock script extracted, we will look through each input in the
    // current transaction to see if any unlocked cell uses owner lock.
    let mut i = 0;
    let mut buf = [0u8; 32];
    loop {
        // check input's lock_hash with script args
        let len = match syscalls::load_cell_by_field(
            &mut buf,
            0,
            i,
            Source::Input,
            CellField::LockHash,
        ) {
            Ok(len) => len,
            Err(SysError::IndexOutOfBound) => return Ok(false),
            Err(err) => return Err(err)),
        };

        // invalid length of loaded data
        if len != buf.len() {
            return Err(SysError::Unknown(4));
        }

        if args[..] == buf[..] {
            return Ok(true);
        }
        i += 1;
    }
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

```
const UDT_LEN: usize = 16;

fn collect_inputs_amount() -> Result<u128, SysError> {
    // let's loop through all input cells containing current UDTs,
    // and gather the sum of all input tokens.
    let mut inputs_amount: u128 = 0;
    let mut i = 0;

    // u128 is 16 bytes
    let mut buf = [0u8; UDT_LEN];
    loop {
        // check input's lock_hash with script args
        let len = match syscalls::load_cell_data(&mut buf, 0, i, Source::GroupInput) {
            Ok(len) => len,
            Err(SysError::IndexOutOfBound) => break,
            Err(err) => return Err(err.into()),
        };

        if len != UDT_LEN {
            return Err(SysError::Unknown(4));
        }
        inputs_amount += u128::from_le_bytes(buf);
        i += 1;
    }
    Ok(inputs_amount)
}
```

The `collect_outputs_amount` function is the same implementation except load data from outputs: 

```
fn collect_outputs_amount() -> Result<u128, SysError> {
    // With the sum of all input UDT tokens gathered, let's now iterate through
    // output cells to grab the sum of all output UDT tokens.
    let mut outputs_amount: u128 = 0;
    let mut i = 0;

    // u128 is 16 bytes
    let mut buf = [0u8; UDT_LEN];
    loop {
        // check input's lock_hash with script args
        let len = match syscalls::load_cell_data(&mut buf, 0, i, Source::GroupOutput) {
            Ok(len) => len,
            Err(SysError::IndexOutOfBound) => break,
            Err(err) => return Err(err),
        };

        if len != UDT_LEN {
            return Err(SysError::Unknown(4));
        }
        outputs_amount += u128::from_le_bytes(buf);
        i += 1;
    }
    Ok(outputs_amount)
}
```

* Update the `main` function to check inputs / outputs UDT amount:

```
let inputs_amount = collect_inputs_amount()?;
    let outputs_amount = collect_outputs_amount()?;

    // return error if inputs amount < outputs amount
    if inputs_amount < outputs_amount {
        // return error code
        return 5;
    }

    return 0;
```

### Error handling

In the previous codes, we reuse `SysError` to indicate errors for convenience. It is recommended to define our own errors and assign reasonable error codes.

* Add `#[repr(i8)]` on our error, and start error code from `1`. CKB verification engine allows the  `i8` error code, `0` represents the verification is successful, non-zero represents the verification is failure. 

* Define `From` trait on `SysError`

```
// Error codes
#[repr(i8)]
enum Error {
    IndexOutOfBound = 1,
    ItemMissing,
    LengthNotEnough,
    Encoding, // data encoding error
    Amount,   // amount error
}

impl From<SysError> for Error {
    fn from(err: SysError) -> Self {
        use SysError::*;
        match err {
            IndexOutOfBound => Self::IndexOutOfBound,
            ItemMissing => Self::ItemMissing,
            LengthNotEnough(_) => Self::LengthNotEnough,
            Unknown(err_code) => panic!("unexpected sys error {}", err_code),
        }
    }
}
```

* Replace all `SysError` with `Error`.

* Define `check` function to return results so we can use `?` operation, and convert errors to error code in the `main` function:

```
fn check() -> Result<(), Error> {
    // load current script
    // check verification branch is owner mode or normal mode
    let script = {
        let mut buf = [0u8; BUF_LEN];
        let len = syscalls::load_script(&mut buf, 0)?;
        Script::new_unchecked(buf[..len].to_vec().into())
    };

    // unpack the Script#args field
    let args: Vec<u8> = script.args().unpack();

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

#[no_mangle]
fn main() -> i8 {
    match check() {
        Ok(_) => 0,
        Err(err) => err as i8,
    }
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

```
// deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("my-sudt");
    let contract_out_point = context.deploy_contract(contract_bin);
```

* Then `build_script` is called with the script's `out_point` , this function returns the `Script` which uses our script as the code. `create_cell` creates an existing cell in the context, which uses our script as the `lock_script`.

*Please note the default tests assume the script is a lock_script, but in our case, `my-sudt` is a type_script. We'll fix it later.*

```
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

```
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


```
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

```
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

```
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

```
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

You should be running a dev chain and know about how to use ckb-cli to send transactions before deployment. 

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