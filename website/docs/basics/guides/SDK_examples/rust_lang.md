
---
id: sdk_examples_rust
title: Rust
sidebar_position: 2
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

## Single-sig transfer

* With [Secp256k1](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/send_ckb_example.rs)

* With [Omnilock](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/transfer_from_omnilock.rs)


## Multi-sig transfer

* [1-of-2 multisig](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/send_ckb_multisig_example.rs) with Secp256k1 (one of two private keys required)

* [2-of-2 multisig](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/transfer_from_multisig.rs
) with Secp256k1 (both private keys required)

* With [Omnilock](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/transfer_from_omnilock_multisig.rs)

## Chained transfer

* [Chained transfer](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/chain_transfer_sighash.rs)

## Issue SUDT

* [Issue](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/sudt_issue.rs)

## Send SUDT

* [Send](https://github.com/nervosnetwork/ckb-sdk-rust/blob/master/examples/sudt_send.rs)

## DAO Deposit

* [Deposit](https://github.com/nervosnetwork/ckb-sdk-rust/pull/70/commits/25a470f7219a6ed0fab55e055a145559813c1628)

### DAO Withdrawal

* [Withdraw](https://github.com/nervosnetwork/ckb-sdk-rust/pull/70/commits/4c24fca4cae40fc57d2258449b69f2fd189ed623#diff-edd624119e43a07b0e85b9517a1d3544ebe002215b31ec91700d603843bb434e)
  
* [Claim](https://github.com/nervosnetwork/ckb-sdk-rust/pull/70/commits/dae479a751fd2c3a4991da11abd5c2076e45b735#diff-d461964487b262c57f8bdf4a2845d3e6c4dc449c2573165f1f03618e173f63c1)
