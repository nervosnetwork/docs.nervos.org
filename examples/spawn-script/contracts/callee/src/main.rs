#![cfg_attr(not(any(feature = "native-simulator", test)), no_std)]
#![cfg_attr(not(test), no_main)]

#[cfg(any(feature = "native-simulator", test))]
extern crate alloc;

#[cfg(not(any(feature = "native-simulator", test)))]
ckb_std::entry!(program_entry);
#[cfg(not(any(feature = "native-simulator", test)))]
ckb_std::default_alloc!();

mod error;
use alloc::vec;

pub fn program_entry() -> i8 {
    ckb_std::debug!("Enter callee contract!");

    match callee() {
        Ok(_) => 0,
        Err(err) => err as i8,
    }
}

pub fn callee() -> Result<(), error::Error> {
    let argv = ckb_std::env::argv();
    let mut std_fds: [u64; 2] = [0; 2];
    ckb_std::syscalls::inherited_fds(&mut std_fds);
    let mut out = vec![];
    for arg in argv {
        out.extend_from_slice(arg.to_bytes());
    }
    let len = ckb_std::syscalls::write(std_fds[1], &out)?;
    assert_eq!(len, 10);
    Ok(())
}
