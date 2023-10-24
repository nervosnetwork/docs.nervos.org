---
id: sdk_examples_overview
title: Overview
sidebar_position: 1
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

The current SDK examples, available for Rust, Go, Java, and JavaScript, provide the three most common scenarios for managing your assets:

## Native CKB Transfers
1. Single-sig transfer with secp256k1 and Omnilock
   
   Sign and send CKB from a single-sig address.

2. Single-sig transfer using [`ckb-light-client`](https://github.com/nervosnetwork/ckb-light-client) with secp256k1
   
   Transfer from a single-sig addresses with enhanced efficiency.
   
3. Multi-sig transfer with secp256k1 and Omnilock
   
   Sign and send CKB with multiple private keys.
   
4. Chained transfer with secp256k1
   
   By using the previous transaction's output as the next one's input, chain transfer allows the construction of new transactions with unconfirmed on-chain inputs, reducing waiting time and enhancing efficiency. 

## SUDT Transfers
   SUDT (Simple User Defined Tokens) is a token standard on CKB that enables the creation and transfer of custom tokens. For more information, see [RFC 0025 Simple UDT](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md).

1. SUDT issuance
2. SUDT transfer
    
## Nervos DAO-Related Operations
   Nervos DAO is a CKB smart contract that provides secondary rewards for CKByte deposits, to safeguard holders from dilution. Deposits in NervosDAO are subject to a minimum lockup period, and withdrawals are only possible once the lockup period elapses. For more information, see [RFC 0023 Deposit and Withdraw in Nervos DAO](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md).
1. Deposit
   
   Deposit CKB into Nervos DAO.
   
2. Withdrawal-1 withdraw
   
   Transform a deposit cell into a withdrawl cell.
   
3. Withdrawal-2 claim
   
   Claim the transformed cell after a mandatory lockup period following the deposit transaction.
