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

use alloc::string::String;
use alloc::vec::Vec;
use ckb_std::{
    ckb_constants::Source,
    ckb_types::{packed::BytesOpt, prelude::*},
    debug,
    error::SysError,
    high_level::{
        load_cell_lock_hash, load_cell_type_hash, load_script, load_script_hash, load_witness_args,
        QueryIter,
    },
};

fn get_lock_index(source: Source) -> Result<Vec<usize>, SysError> {
    let cur_script_hash = load_script_hash()?;
    let groups: alloc::vec::Vec<usize> = QueryIter::new(load_cell_lock_hash, source)
        .enumerate()
        .filter_map(|(i, h)| if h == cur_script_hash { Some(i) } else { None })
        .collect();

    Ok(groups)
}
fn get_type_index(source: Source) -> Result<Vec<usize>, SysError> {
    let cur_script_hash = load_script_hash()?;
    let groups: alloc::vec::Vec<usize> = QueryIter::new(load_cell_type_hash, source)
        .enumerate()
        .filter_map(|(i, h)| {
            if h.unwrap_or_default() == cur_script_hash {
                Some(i)
            } else {
                None
            }
        })
        .collect();

    Ok(groups)
}

fn output_witness(index: usize, data: BytesOpt, des: &str) {
    if data.is_none() {
        debug!("Index: {}, {} None", index, des);
    } else {
        let data: Vec<u8> = data.to_opt().unwrap().unpack();
        debug!(
            "Index: {}, {} {}",
            index,
            des,
            String::from_utf8(data)
                .map_err(|_| SysError::Unknown(1))
                .unwrap()
        );
    }
}

fn ckb_main() -> Result<(), SysError> {
    let args: Vec<u8> = load_script()?.args().unpack();
    let script_des = String::from_utf8(args).map_err(|_| SysError::Unknown(1))?;
    debug!("{}", script_des);

    let groups = get_lock_index(Source::Input)?;
    if groups.is_empty() {
        debug!("Inputs Lock:  None");
    } else {
        debug!("Inputs Lock:  {:02?}", groups);
    }
    let is_lock = !groups.is_empty();

    let groups = get_type_index(Source::Input)?;
    if groups.is_empty() {
        debug!("Inputs Type:  None");
    } else {
        debug!("Inputs Type:  {:02?}", groups);
    }

    let groups = get_type_index(Source::Output)?;
    if groups.is_empty() {
        debug!("Outputs Type: None");
    } else {
        debug!("Outputs Type: {:02?}", groups);
    }

    QueryIter::new(load_witness_args, Source::GroupInput)
        .enumerate()
        .all(|(index, witness)| {
            if is_lock {
                output_witness(index, witness.lock(), "Lock Witnes: ");
            } else {
                output_witness(index, witness.input_type(), "InputType Witnes: ");
                output_witness(index, witness.output_type(), "OutputType Witnes: ");
            }

            true
        });
    QueryIter::new(load_witness_args, Source::GroupOutput)
        .enumerate()
        .all(|(index, witness)| {
            if is_lock {
                output_witness(index, witness.lock(), "Lock Witnes: ");
            } else {
                output_witness(index, witness.input_type(), "InputType Witnes: ");
                output_witness(index, witness.output_type(), "OutputType Witnes: ");
            }

            true
        });

    Ok(())
}

pub fn program_entry() -> i8 {
    match ckb_main() {
        Ok(_) => 0,
        Err(_err) => 1,
    }
}
