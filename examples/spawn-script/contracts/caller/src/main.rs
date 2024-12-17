#![cfg_attr(not(any(feature = "native-simulator", test)), no_std)]
#![cfg_attr(not(test), no_main)]

#[cfg(any(feature = "native-simulator", test))]
extern crate alloc;

#[cfg(not(any(feature = "native-simulator", test)))]
ckb_std::entry!(program_entry);
#[cfg(not(any(feature = "native-simulator", test)))]
ckb_std::default_alloc!();

mod error;
use ckb_std::syscalls::SpawnArgs;
use core::ffi::CStr;

pub fn program_entry() -> i8 {
    ckb_std::debug!("Enter caller contract!");

    match caller() {
        Ok(_) => 0,
        Err(err) => err as i8,
    }
}

fn caller() -> Result<(), error::Error> {
    let (r1, w1) = ckb_std::syscalls::pipe()?;
    let (r2, w2) = ckb_std::syscalls::pipe()?;
    let to_parent_fds: [u64; 2] = [r1, w2]; 
    let to_child_fds: [u64; 3] = [r2, w1, 0]; // must ends with 0

    let mut pid: u64 = 0;
    let place = 0; // 0 means read from cell data
    let bounds = 0; // 0 means read to end
    let argc: u64 = 2;
    let argv = [
        CStr::from_bytes_with_nul(b"hello\0").unwrap().as_ptr(),
        CStr::from_bytes_with_nul(b"world\0").unwrap().as_ptr(),
    ];
    let mut spgs: SpawnArgs = SpawnArgs {
        argc,
        argv: argv.as_ptr(),
        process_id: &mut pid as *mut u64,
        inherited_fds: to_child_fds.as_ptr(),
    };
    ckb_std::syscalls::spawn(
        0,
        ckb_std::ckb_constants::Source::CellDep,
        place,
        bounds,
        &mut spgs,
    )?;

    let mut buf = [0; 256];
    let len = ckb_std::syscalls::read(to_parent_fds[0], &mut buf)?;
    assert_eq!(len, 10);
    buf[len] = 0;
    assert_eq!(
        CStr::from_bytes_until_nul(&buf).unwrap().to_str().unwrap(),
        "helloworld"
    );
    Ok(())
}
