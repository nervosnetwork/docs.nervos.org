#![no_std]
#![cfg_attr(not(test), no_main)]

#[cfg(test)]
extern crate alloc;

mod error;

use ckb_std::{ckb_constants::Source, debug, error::SysError, high_level::load_cell_data};

#[cfg(not(test))]
use ckb_std::default_alloc;
use error::Error;
#[cfg(not(test))]
ckb_std::entry!(program_entry);
#[cfg(not(test))]
default_alloc!();

pub fn program_entry() -> i8 {    
    match carrot_forbidden() {
        Ok(_) => 0,
        Err(err) => err as i8,
    }
}

fn carrot_forbidden() -> Result<(), Error> {
    let mut index = 0;
    loop {
        match load_cell_data(index, Source::GroupOutput) {
            Ok(data) => {
                if data.starts_with("carrot".as_bytes()) {
                    return Err(Error::CarrotAttack);
                }else{
                    debug!("output #{:} has no carrot! Hooray!", index);
                }
            },
            Err(err) => {
                match err {
                    // we loop out all the output cell
                    SysError::IndexOutOfBound => break,
                    _ => return Err(Error::from(err)),
                }
            }
        }
        // Increment index to process next cell
        index += 1;
    }
    Ok(())
}

