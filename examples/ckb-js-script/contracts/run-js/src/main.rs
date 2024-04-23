#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

use alloc::ffi::CString;
#[cfg(not(test))]
use ckb_std::default_alloc;
use ckb_std::syscalls::SpawnArgs;
#[cfg(not(test))]
ckb_std::entry!(program_entry);
#[cfg(not(test))]
default_alloc!();

include!(concat!(env!("OUT_DIR"), "/ckb_js_vm_code_hash.rs"));

pub fn program_entry() -> i8 {
    ckb_std::debug!("This is a sample run js code contract!");

    let args: CString = CString::new("-f").unwrap();

    let mut spawn_exit_code_value: i8 = -1;
    let spawn_exit_code: *mut i8 = &mut spawn_exit_code_value as *mut i8;

    let mut value: u8 = 0;
    let content: *mut u8 = &mut value as *mut u8;

    let mut content_length_value: u64 = 0;
    let content_length: *mut u64 = &mut content_length_value as *mut u64;

    let spawn_args = SpawnArgs {
        memory_limit: 8,
        exit_code: spawn_exit_code,
        content,
        // Before calling spawn, content_length should be the length of content;
        // After calling spawn, content_length will be the real size of the returned data.
        content_length,
    };

    // we supposed the first cell in cellDeps is the ckb-js-vm cell
    // we then call ckb-js-vm script using spawn syscall to execute the js code in the script args
    let result = ckb_std::syscalls::spawn(
        0,
        ckb_std::ckb_constants::Source::CellDep,
        0,
        &[&args],
        &spawn_args,
    );
    ckb_std::debug!("spawn result: {:?}", result);

    if result != 0 {
        return 1;
    }

    unsafe {
        if *spawn_exit_code != 0 {
            return 1;
        }
    }

    0
}
