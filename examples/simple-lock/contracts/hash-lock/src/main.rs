#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

use ckb_hash::blake2b_256;
use ckb_std::ckb_constants::Source;

#[cfg(not(test))]
use ckb_std::default_alloc;
use ckb_std::error::SysError;
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
    CheckError,
    UnMatch,
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

pub fn program_entry() -> i8 {
    ckb_std::debug!("This is a sample contract!");

    match check_hash() {
        Ok(_) => 0,
        Err(err) => err as i8,
    }
}

pub fn check_hash() -> Result<(), Error> {
    let script = ckb_std::high_level::load_script()?;
    let expect_hash = script.args().raw_data().to_vec();

    let witness_args = ckb_std::high_level::load_witness_args(0, Source::GroupInput)?;
    let preimage = witness_args
        .lock()
        .to_opt()
        .ok_or(Error::CheckError)?
        .raw_data();

    let hash = blake2b_256(preimage.as_ref());

    if hash.eq(&expect_hash.as_ref()) {
        Ok(())
    } else {
        Err(Error::UnMatch)
    }
}
