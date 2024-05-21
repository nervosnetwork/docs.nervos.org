#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

use alloc::ffi::CString;
use alloc::vec::Vec;
use ckb_std::ckb_constants::Source;
use ckb_std::ckb_types::core::ScriptHashType;
use ckb_std::ckb_types::prelude::Entity;
#[cfg(not(test))]
use ckb_std::default_alloc;
use ckb_std::{ckb_types::packed::Bytes, error::SysError};
#[cfg(not(test))]
ckb_std::entry!(program_entry);
#[cfg(not(test))]
default_alloc!();

#[repr(i8)]
pub enum Error {
    IndexOutOfBound = 1,
    ItemMissing,
    LengthNotEnough,
    Encoding,
    // Add customized errors here...
    VerifyError,
}

impl From<SysError> for Error {
    fn from(err: SysError) -> Self {
        match err {
            SysError::IndexOutOfBound => Self::IndexOutOfBound,
            SysError::ItemMissing => Self::ItemMissing,
            SysError::LengthNotEnough(_) => Self::LengthNotEnough,
            SysError::Encoding => Self::Encoding,
            SysError::Unknown(err_code) => panic!("unexpected sys error {}", err_code),
        }
    }
}

include!(concat!(env!("OUT_DIR"), "/callee_code_hash.rs"));

pub fn program_entry() -> i8 {
    ckb_std::debug!("This is a sample contract!");
    match verify() {
        Ok(_) => 0,
        Err(err) => err as i8,
    }
}

pub fn verify() -> Result<(), Error> {
    let script = ckb_std::high_level::load_script()?;
    let args = script.args();
    let num_args = args.as_slice();
    let num = u128::from_le_bytes(num_args.try_into().expect("Slice with incorrect length"));

    // read nostr event from witness
    let witness_args = ckb_std::high_level::load_witness_args(0, Source::GroupInput)?;
    let witness: ckb_std::ckb_types::bytes::Bytes = witness_args
        .lock()
        .to_opt()
        .ok_or(Error::VerifyError)?
        .raw_data();

    let (_count, factors) = decode(&witness);

    let args = encode(factors, num);
    let args = CString::new(hex::encode(args.as_slice())).unwrap();
    ckb_std::high_level::exec_cell(&CALLEE_CODE_HASH, ScriptHashType::Data1, &[&args])
        .map_err(|_| Error::VerifyError)?;
    Ok(())
}

pub fn encode(factors: Vec<u32>, num: u128) -> Bytes {
    let mut bytes = Vec::new();

    // Encode the count as a u32 (4 bytes)
    let count = factors.len() as u32;
    bytes.extend_from_slice(&count.to_le_bytes());

    // Encode each factor as a u32 (4 bytes each)
    for factor in factors {
        bytes.extend_from_slice(&factor.to_le_bytes());
    }

    // Encode the num as a u128 (16 bytes)
    bytes.extend_from_slice(&num.to_be_bytes());

    Bytes::from_slice(&bytes).unwrap()
}

pub fn decode(encoded: &[u8]) -> (u32, Vec<u32>) {
    // Decode the count (first 4 bytes)
    let count = u32::from_le_bytes(encoded[0..4].try_into().expect("Failed to decode count"));

    // Decode the factors
    let mut factors = Vec::with_capacity(count as usize);
    for i in 0..count {
        let start = 4 + (i as usize) * 4;
        let end = start + 4;
        let factor = u32::from_le_bytes(
            encoded[start..end]
                .try_into()
                .expect("Failed to decode factor"),
        );
        factors.push(factor);
    }

    (count, factors)
}
