#![cfg_attr(not(feature = "native-simulator"), no_std)]
#![allow(special_module_name)]
#![allow(unused_attributes)]
#[cfg(feature = "native-simulator")]
mod main;
#[cfg(feature = "native-simulator")]
pub use main::program_entry;
