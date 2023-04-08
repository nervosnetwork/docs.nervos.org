---
id: capsule-exec
title: Exec syscall in Capsule
---

## Introduction

[Exec](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0034-vm-syscalls-2/0034-vm-syscalls-2.md#exec) is a new syscall provided by [ckb2021](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0037-ckb2021/0037-ckb2021.md). To understand what exec syscall does, we recommend reading [this article](https://man7.org/linux/man-pages/man3/exec.3.html) first. In short: Exec runs an executable file from specified cell data in the context of an already existing VM, replacing the previous executable. The used cycles do not change, but the code, registers, and memory of the VM are replaced by those of the new program, meaning **control flow will never return to the main script**.

You can imagine exec as a router. When some conditions are met, the main script will completely hand over control to a certain sub-script.

```text
              ┌--> if State1 --> Exec(Sub-script1)
Main script --+--> if State2 --> Exec(Sub-script2)
              └--> if State3 --> Exec(Sub-script3)
```

Compared with [Dynamic libraries](https://docs.nervos.org/docs/labs/capsule-dynamic-loading-tutorial/), exec has the following significant advantages:

- All sub-scripts are complete scripts. They can be used alone, or they can be called by exec.
- Sub-scripts have a separate 4M memory space.
- Allow passing in arguments.

At the same time Exec has the following limitations:

- Never return.
- Hard to exchange data between scripts.

When dynamic libraries and exec syscall both meet your needs, we recommend that you use exec instead of dynamic libraries.

In this tutorial, we'll write two scripts in Rust, and exec one script into the other.

## Setup the develop environment

### Install capsule

The installation steps can refer to [here](https://docs.nervos.org/docs/labs/capsule-dynamic-loading-tutorial#install-capsule).

## Create a project

```sh
$ capsule new ckb-exec-demo
```

<details><summary>(click here to view response)</summary>

```text
New project "ckb-exec-demo"
Created file "capsule.toml"
Created file "deployment.toml"
Created file "README.md"
Created file "Cargo.toml"
Created file ".gitignore"
Initialized empty Git repository in /tmp/ckb-exec-demo/.git/
Created "/tmp/ckb-exec-demo"
Created tests
     Created library `tests` package
New contract "ckb-exec-demo"
     Created binary (application) `ckb-exec-demo` package
Rewrite Cargo.toml
Rewrite capsule.toml
Done
```

</details>

Let's create the second contract named `echo`.

```sh
$ cd ckb-exec-demo
$ capsule new-contract echo
```

<details><summary>(click here to view response)</summary>

```text
New contract "echo"
     Created binary (application) `echo` package
Rewrite Cargo.toml
Rewrite capsule.toml
Done
```

</details>

## Write echo sub-script

Put the following code into `contracts/echo/src/main.rs`, replacing the existing `program_entry` function. As you can see, the script always returns 0 if argc is 0, which means that if the script is used as a alone lock script, anyone can unlock this cell. If echo used as a sub-script of exec, it will parse the first argument and use that as the exit code.

```rust
fn program_entry() -> i8 {
    let argv = ckb_std::env::argv();
    // This script will always return 0 if used alone.
    if argv.len() == 0 {
        return 0;
    };

    // When calling the script by exec and passing in the arguments.
    let arg1 = argv[0].to_str().unwrap();
    let exit = arg1.parse::<i8>().unwrap();
    return exit;
}
```

## Write exec demo script

Put the following code into `contracts/ckb-exec-demo/src/main.rs`, replacing the existing `program_entry` function:

```rust
use core::ffi::CStr;
use ckb_std::{ckb_constants::Source, syscalls::exec};

fn program_entry() -> i8 {
    let r = exec(
        0,
        Source::CellDep,
        0,
        0,
        &[&CStr::from_bytes_with_nul(b"42\0").unwrap()],
    );
    if r != 0 {
        return 10;
    }
    return 0;
}
```

This script does only one thing: When executing `exec(...)`, CKB-VM will look for the first dep_cell, and execute the code in it.

## Testing

We need to deploy the `echo` to a cell, then reference the cell in the testing transaction. Replace the content of `tests/src/tests.rs`:

```rust
use super::*;
use ckb_testtool::ckb_error::Error;
use ckb_testtool::ckb_types::{bytes::Bytes, core::TransactionBuilder, packed::*, prelude::*};
use ckb_testtool::context::Context;

const MAX_CYCLES: u64 = 10_000_000;

fn assert_script_error(err: Error, err_code: i8) {
    let error_string = err.to_string();
    assert!(
        error_string.contains(format!("error code {} ", err_code).as_str()),
        "error_string: {}, expected_error_code: {}",
        error_string,
        err_code
    );
}

#[test]
fn test_success() {
    // deploy contract
    let mut context = Context::default();
    let contract_bin: Bytes = Loader::default().load_binary("ckb-exec-demo");
    let out_point = context.deploy_cell(contract_bin);

    let echo_bin: Bytes = Loader::default().load_binary("echo");
    let echo_out_point = context.deploy_cell(echo_bin);
    let echo_dep = CellDep::new_builder().out_point(echo_out_point).build();

    // prepare scripts
    let lock_script = context
        .build_script(&out_point, Default::default())
        .expect("script");

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
        .cell_dep(echo_dep)
        .build();
    let tx = context.complete_tx(tx);

    // run
    let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
    assert_script_error(err, 42);
}
```

Run `capsule test`.

<details><summary>(click here to view response)</summary>

```
Finished test [unoptimized + debuginfo] target(s) in 1.71s
     Running unittests src/lib.rs (target/debug/deps/tests-c051885699f8b848)
running 1 test
test tests::test_success ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.52s
```

</details>

## Other resources

- [Full code](https://github.com/mohanson/ckb-exec-demo)
- [Exec syscall](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0034-vm-syscalls-2/0034-vm-syscalls-2.md#exec)

In this article, we use the index to locate sub-scripts. If you want to use the script hash to locate, you can refer to our:

- [C language implementation](https://github.com/nervosnetwork/ckb-c-stdlib/blob/8d56515e726c63b7f9811e10914dbe930d1ea134/ckb_syscalls.h#L368-L378)
- [Rust language implementation](https://github.com/nervosnetwork/ckb-std/tree/c660da768df85fa2b0fe78673278d49425ce6333/contracts/exec-caller-by-code-hash)
