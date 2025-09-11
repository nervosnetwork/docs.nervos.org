#![cfg_attr(not(any(feature = "library", test)), no_std)]
#![cfg_attr(not(test), no_main)]

#[cfg(any(feature = "library", test))]
extern crate alloc;

#[cfg(not(any(feature = "library", test)))]
ckb_std::entry!(program_entry);
#[cfg(not(any(feature = "library", test)))]
// By default, the following heap configuration is used:
// * 16KB fixed heap
// * 1.2MB(rounded up to be 16-byte aligned) dynamic heap
// * Minimal memory block in dynamic heap is 64 bytes
// For more details, please refer to ckb-std's default_alloc macro
// and the buddy-alloc alloc implementation.
ckb_std::default_alloc!(16384, 1258306, 64);

use ckb_std::{
    ckb_constants::{CellField, Source},
    debug,
    error::SysError,
};

fn demo_index_out_of_bound() {
    let index: usize = 2;
    let ret = ckb_std::high_level::load_cell_lock_hash(index, Source::Input);
    match ret {
        Err(SysError::IndexOutOfBound) => {}
        _ => {
            panic!("unknow")
        }
    }
}

fn demo_item_missing() {
    let mut buffer = [0u8; 1024];
    let ret = ckb_std::syscalls::load_cell_by_field(
        &mut buffer,
        0,
        0,
        Source::GroupInput,
        CellField::TypeHash,
    );
    match ret {
        Err(SysError::ItemMissing) => {}
        _ => {
            panic!("unknow")
        }
    }
}

fn demo_length_not_enough() {
    let mut buf = [0u8; 10];
    let ret = ckb_std::syscalls::load_tx_hash(&mut buf, 0);

    match ret {
        Err(SysError::LengthNotEnough(_s)) => {
            // _s is 32
        }
        _ => {
            panic!("unknow")
        }
    }
}

fn ckb_main() -> Result<(), SysError> {
    let args = ckb_std::high_level::load_script()?.args();
    if args.is_empty() {
        debug!("args len ({}) error", args.len());
        return Err(SysError::Unknown(0x100000u64));
    }

    let num: u8 = args.get(0).unwrap().into();

    match num {
        1 => demo_index_out_of_bound(),
        2 => demo_item_missing(),
        3 => demo_length_not_enough(),
        _ => {}
    }

    Ok(())
}

pub fn program_entry() -> i8 {
    debug!("This is a sample contract!");

    match ckb_main() {
        Ok(_) => 0,
        Err(err) => {
            debug!("Error: {:?}", err);
            -1
        }
    }
}
