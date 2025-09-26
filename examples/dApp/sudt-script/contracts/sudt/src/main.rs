#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

#[cfg(not(test))]
use ckb_std::default_alloc;
#[cfg(not(test))]
ckb_std::entry!(program_entry);
#[cfg(not(test))]
default_alloc!();

// Import from `core` instead of from `std` since we are in no-std mode
use core::result::Result;

// Import heap related library from `alloc`
// https://doc.rust-lang.org/alloc/index.html
use alloc::vec::Vec;

// Import CKB syscalls and structures
// https://docs.rs/ckb-std/
use ckb_std::{
    ckb_constants::Source,
    ckb_types::{bytes::Bytes, prelude::*},
    error::SysError,
    high_level::{load_cell_data, load_cell_lock_hash, load_script, QueryIter},
};

// spec https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md#sudt-cell
const UDT_AMOUNT_LEN: usize = 16;

pub fn program_entry() -> i8 {
    ckb_std::debug!("This is a sample UDT contract!");

    let script = load_script().unwrap();
    let args: Bytes = script.args().unpack();
    ckb_std::debug!("script args is {:?}", args);

    // return success if owner mode is true
    if check_owner_mode(&args) {
        return 0;
    }

    let inputs_amount: u128 = match collect_inputs_amount() {
        Ok(amount) => amount,
        Err(err) => return err as i8,
    };
    let outputs_amount = match collect_outputs_amount() {
        Ok(amount) => amount,
        Err(err) => return err as i8,
    };

    if inputs_amount < outputs_amount {
        return Error::InvalidAmount as i8;
    }

    0
}

fn check_owner_mode(args: &Bytes) -> bool {
    // Check if any input cell uses owner lock of the UDT
    QueryIter::new(load_cell_lock_hash, Source::Input).any(|lock_hash| args[..] == lock_hash[..])
}

fn collect_inputs_amount() -> Result<u128, Error> {
    // Loop through all input cells containing current UDTs,
    // and gather the sum of all input tokens.
    // the `Source::GroupInput` guarantees only the cells with the same script
    // as the current running script are iterating
    // see: https://docs.nervos.org/docs/script/syscalls-for-script#source
    let mut buf = [0u8; UDT_AMOUNT_LEN];

    let udt_list = QueryIter::new(load_cell_data, Source::GroupInput)
        .map(|data| {
            if data.len() >= UDT_AMOUNT_LEN {
                buf.copy_from_slice(&data);
                // u128 is 16 bytes
                Ok(u128::from_le_bytes(buf))
            } else {
                Err(Error::AmountEncoding)
            }
        })
        .collect::<Result<Vec<_>, Error>>()?;
    Ok(udt_list.into_iter().sum::<u128>())
}

fn collect_outputs_amount() -> Result<u128, Error> {
    // Loop through all output cells containing current UDTs,
    // and gather the sum of all output tokens.
    // the `Source::GroupOutput` guarantees only the cells with the same script
    // as the current running script are iterating
    // see: https://docs.nervos.org/docs/script/syscalls-for-script#source
    let mut buf = [0u8; UDT_AMOUNT_LEN];

    let udt_list = QueryIter::new(load_cell_data, Source::GroupOutput)
        .map(|data| {
            if data.len() >= UDT_AMOUNT_LEN {
                buf.copy_from_slice(&data);
                // u128 is 16 bytes
                Ok(u128::from_le_bytes(buf))
            } else {
                Err(Error::AmountEncoding)
            }
        })
        .collect::<Result<Vec<_>, Error>>()?;
    Ok(udt_list.into_iter().sum::<u128>())
}

/// Error code
#[repr(i8)]
pub enum Error {
    IndexOutOfBound = 1,
    ItemMissing,
    LengthNotEnough,
    WaitFailure,
    InvalidFd,
    OtherEndClosed,
    MaxVmsSpawned,
    MaxFdsCreated,
    // write our custom error code below
    AmountEncoding = 12,
    InvalidAmount,
}

impl From<SysError> for Error {
    fn from(err: SysError) -> Self {
        use SysError::*;
        match err {
            IndexOutOfBound => Self::IndexOutOfBound,
            ItemMissing => Self::ItemMissing,
            LengthNotEnough(_) => Self::LengthNotEnough,
            WaitFailure => Self::WaitFailure,
            InvalidFd => Self::InvalidFd,
            OtherEndClosed => Self::OtherEndClosed,
            MaxVmsSpawned => Self::MaxVmsSpawned,
            MaxFdsCreated => Self::MaxFdsCreated,
            Encoding => Self::AmountEncoding,
            Unknown(err_code) => panic!("unexpected sys error {}", err_code),
        }
    }
}
