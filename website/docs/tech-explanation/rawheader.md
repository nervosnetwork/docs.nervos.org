---
id: rawheader
title: RawHeader
---

# RawHeader

`RawHeader` is the payload of the block header.

<img src={"/img/tech_explanation/rawheader-structure.png"} width={688} height={568} alt="Structure of RawHeader" />

## Fields & Description

| Name                | Type        | Description                                                                                                                                                                                                                                                                                                                      |
| ------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`           | Uint32      | Version of the block, used to address potential compatibility issues that might arise after a fork                                                                                                                                                                                                                               |
| `compact_target`    | Uint32      | PoW difficulty represented in compact target format                                                                                                                                                                                                                                                                              |
| `timestamp`         | Uint64      | A [Unix time](https://en.wikipedia.org/wiki/Unix_time) timestamp in milliseconds                                                                                                                                                                                                                                                 |
| `number`            | Uint64      | Indicates block height                                                                                                                                                                                                                                                                                                           |
| `epoch`             | Uint64      | Information of the current epoch. Assuming `number` represents the current epoch number, `index` represents the index of the block in the current epoch (starting at 0), and length represents the length of the current epoch, the value must be `(number & 0xFFFFFF) \| ((index & 0xFFFF) << 24) \| ((length & 0xFFFF) << 40)` |
| `parent_hash`       | H256 (hash) | Hash of the parent block                                                                                                                                                                                                                                                                                                         |
| `transactions_root` | H256 (hash) | A hash obtained by concatenating the CBMT (Complete Binary Merkle Tree) root of the transaction hashes and the CBMT root of the transaction witness hashes                                                                                                                                                                       |
| `proposals_hash`    | H256 (hash) | Hash of the concatenated proposal IDs. Defaults to all zeros if no proposals exist.                                                                                                                                                                                                                                              |
| `uncles_hash`       | H256 (hash) | Hash of the concatenated hashes of uncle block headers. Defaults to all zeros if no proposals exist.                                                                                                                                                                                                                             |
| `dao`               | Bytes       | Contains DAO-related data. Refer to [RFC0023: Deposit and Withdraw in Nervos DAO](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md) for details.                                                                                                                    |
| `nonce`             | Uint128     | The solution of the PoW puzzle. Similar to [Bitcoin nonce](https://en.bitcoin.it/wiki/Nonce).                                                                                                                                                                                                                                    |

Refer to the [RawHeader in RFC-0027](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0027-block-structure/0027-block-structure.md#rawheader) for an in-depth explanation.
