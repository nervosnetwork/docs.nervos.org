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

Put the following code into `contracts/echo/main.rs`. As you can see, the script always returns 0 if argc is 0, which means that if the script is used as a alone lock script, anyone can unlock this cell. If echo used as a sub-script of exec, it will parse the first argument and use that as the exit code.

```rs
use ckb_std::cstr_core::CStr;

fn program_entry(argc: u64, argv: *const *const u8) -> i8 {
    // This script will always return 0 if used alone.
    if argc == 0 {
        return 0;
    };

    // When calling the script by exec and passing in the arguments.
    let args = unsafe { core::slice::from_raw_parts(argv, argc as usize) };
    let arg1 = unsafe { CStr::from_ptr(args[0]) }.to_str().unwrap();
    let exit = arg1.parse::<i8>().unwrap();
    return exit;
}
```

## Write exec demo script

Put the following code into `contracts/ckb-exec-demo/main.rs`.

```rs
use ckb_std::cstr_core::CStr;
use ckb_std::{ckb_constants::Source, default_alloc, syscalls::exec};

fn program_entry(_argc: u64, _argv: *const *const u8) -> i8 {
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

We need to deploy the `echo` to a cell, then reference the cell in the testing transaction. Open `tests/src/tests.rs`:

```rs
let echo_bin = {
    let mut buf = Vec::new();
    File::open("../build/debug/echo")
        .unwrap()
        .read_to_end(&mut buf)
        .expect("read code");
    Bytes::from(buf)
};
let echo_out_point = context.deploy_cell(echo_bin);
let echo_dep = CellDep::new_builder()
    .out_point(echo_out_point)
    .build();

// build transaction
let tx = TransactionBuilder::default()
    .input(input)
    .outputs(outputs)
    .outputs_data(outputs_data.pack())
    // reference to echo cell
    .cell_dep(echo_dep)
    .build();
}

let err = context.verify_tx(&tx, MAX_CYCLES).unwrap_err();
// check the return code is 42
assert_script_error(err, 42);
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
