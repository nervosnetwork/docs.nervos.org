#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

#[cfg(not(test))]
use ckb_std::default_alloc;
use ckb_std::syscalls::{self};
#[cfg(not(test))]
ckb_std::entry!(program_entry);
#[cfg(not(test))]
default_alloc!();

pub fn program_entry() -> i8 {
    ckb_std::debug!("This is a sample run js code contract!");

    let mut spgs_exit_code: i8 = -1;

    let mut spgs_content = [0u8; 80];
    let mut spgs_content_length: u64 = 80;
    let spgs = syscalls::SpawnArgs {
        memory_limit: 8,
        exit_code: &mut spgs_exit_code as *mut i8,
        content: &mut spgs_content as *mut u8,
        content_length: &mut spgs_content_length as *mut u64,
    };

    // we supposed the first cell in cellDeps is the ckb-js-vm cell
    // we then call ckb-js-vm script using spawn syscall to execute the js code in the script args
    let result =
        ckb_std::syscalls::spawn(0, ckb_std::ckb_constants::Source::CellDep, 0, &[], &spgs);
    ckb_std::debug!("spawn result: {:?}", result);

    if result != 0 {
        return 1;
    }

    if spgs_exit_code != 0 {
        return 1;
    }

    0
}
