#![no_std]
extern crate alloc;
use alloc::string::String;

// IPC definition, it can be shared between client and server
#[ckb_script_ipc::service]
pub trait World {
    fn hello(name: String) -> Result<String, u64>;
}
