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

use alloc::{format, string::String};
use ckb_script_ipc_common::spawn::run_server;
use ipc_interface::World;

struct WorldServer;

impl WorldServer {
    fn new() -> Self {
        WorldServer
    }
}

impl World for WorldServer {
    // method implementation
    fn hello(&mut self, name: String) -> Result<String, u64> {
        if name == "error" {
            Err(1)
        } else {
            Ok(format!("hello, {}", name))
        }
    }
}

pub fn server_entry() -> Result<(), i8> {
    let world = WorldServer::new();
    run_server(world.server()).map_err(|_| 2)
}

pub fn program_entry() -> i8 {
    match server_entry() {
        Ok(()) => 0,
        Err(code) => code,
    }
}
