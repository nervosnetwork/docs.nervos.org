---
id: pw-lock
title: Introduction of PW-lock
---

## Overview

[PW-lock](https://github.com/lay2dev/pw-lock), developed by the [lay2](https://github.com/lay2dev/pw-lock) Team, is a lock script which can make use of other blockchain wallets as CKB wallets. PW-lock is based on the concept of implementing the signature verification algorithms of other chains (e.g. ETH/TRON/EOS/BTC) so as to reuse others' facilities. Also, PW-lock is a lock with [ACP](https://github.com/nervosnetwork/ckb-production-scripts/blob/master/c/anyone_can_pay.c) logic.

Current PW-lock supports the Ethereum [EIP-191](https://eips.ethereum.org/EIPS/eip-191) signature verification standard. It is possible to communicate with MetaMask, an Ethereum wallet, through the RPC [personal_sign](https://docs.metamask.io/guide/signing-data.html#signing-data-with-metamask), and sign the [hash_all](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction#p2pkh) message, then verify the transaction in the PW-lock script before unlocking.


## Quick Start

```
https://github.com/lay2dev/pw-lock.git
cd pw-lock
git submodule init
git submodule update
make install-tools
make all-via-docker
cargo test --all
```


## PW-lock Basic Structure

```
- pw-lock-script:
  - code_hash: 32 bytes - pw-lock script code hash
  - hash_type: 1 byte - pw-lock script hash_type
  - args: 20 bytes - public key hash. e.g. ETH address
  - witness(current version):
    - lock: 65 bytes - secp256k1 signature_data
```

## Offchain

The lay2 team has developed the [PW-core](https://github.com/lay2dev/pw-core), a front-end JS SDK based on Typescript, to interwork with PW-lock. Some additional supports may be required if working in a non-JavaScript environment. 

In addition to the ACP unlock method, PW-lock also supports the similar unlock of the CKB secp256k1 lock [P2PKH](https://github.com/nervosnetwork/ckb-system-scripts/wiki/How-to-sign-transaction#p2pkh) signature verification. The difference is that the current version of pw-lock uses a slightly different hash algorithm to that of secp256k1_blake160.

```
// pw-lock
Keccak(Blake2b(Tx) | witness)

// secp256k1-lock
Blake2b(Blake2b(Tx) | witness)
```


## Features In Development

Add support for chains other than ETH, such as [EOS, TRON, BITCOIN, DOGECOIN](https://github.com/XuJiandong/pw-lock/blob/develop/c/pw_lock.h#L197-L230), etc. in the upcoming pw-lock.

## Reference

- [PW-lock](https://github.com/lay2dev/pw-lock)
- [Repository Reviewed & Enhanced Contract](https://github.com/XuJiandong/pw-lock)
- [Deployment Information On Lina, the mainnet](https://github.com/lay2dev/pw-core/blob/master/src/constants.ts#L71-L84)
- [Deployment Information On Aggron, the testnet](https://github.com/lay2dev/pw-core/blob/master/src/constants.ts#L157-L169)
- [Available Codes for Signature](https://github.com/lay2dev/pw-core/blob/master/src/signers/signer.ts)
