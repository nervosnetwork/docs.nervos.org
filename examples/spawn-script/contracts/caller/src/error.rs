use ckb_std::error::SysError;

#[cfg(test)]
extern crate alloc;

#[repr(i8)]
pub enum Error {
    IndexOutOfBound = 1,
    ItemMissing,
    LengthNotEnough,
    Encoding,
    WaitFailure,
    InvalidFD,
    OtherEndClose,
    MaxVmSpawned,
    MaxFdCreated,
    // Add customized errors here...
}

impl From<SysError> for Error {
    fn from(err: SysError) -> Self {
        match err {
            SysError::IndexOutOfBound => Self::IndexOutOfBound,
            SysError::ItemMissing => Self::ItemMissing,
            SysError::LengthNotEnough(_) => Self::LengthNotEnough,
            SysError::Encoding => Self::Encoding,
            SysError::WaitFailure => Self::WaitFailure,
            SysError::InvalidFd => Self::InvalidFD,
            SysError::OtherEndClosed => Self::OtherEndClose,
            SysError::MaxVmsSpawned => Self::MaxVmSpawned,
            SysError::MaxFdsCreated => Self::MaxFdCreated,
            SysError::Unknown(err_code) => panic!("unexpected sys error {}", err_code),
        }
    }
}
