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

use alloc::ffi::CString;
use alloc::vec::Vec;
use ckb_script_ipc_common::spawn::spawn_cell_server;
use ckb_std::ckb_types::prelude::Unpack;
use ckb_std::log::info;
use ipc_interface::WorldClient;

pub fn client_entry() -> Result<(), i8> {
    info!("client started");

    let args: Vec<u8> = ckb_std::high_level::load_script()
        .map_err(|_| 1)?
        .args()
        .unpack();

    // server can be spawned by any process which wants to start it.
    // here it is invoked by client
    let (read_pipe, write_pipe) = spawn_cell_server(
        &args,
        ckb_std::ckb_types::core::ScriptHashType::Type,
        &[CString::new("demo").unwrap().as_ref()],
    )
    .map_err(|_| 1)?;

    // new client
    let mut client = WorldClient::new(read_pipe, write_pipe);
    // invoke
    let ret = client.hello("world".into()).unwrap();
    info!("IPC response: {:?}", ret);
    // invoke again, should return error
    let ret = client.hello("error".into());
    info!("IPC response: {:?}", ret);
    Ok(())
}

pub fn program_entry() -> i8 {
    drop(ckb_std::logger::init());
    match client_entry() {
        Ok(()) => 0,
        Err(code) => code,
    }
}
