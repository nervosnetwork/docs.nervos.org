---
id: qa
title: Q&A | For Wallets/Exchanges/Mining Pools
---

External wallets, exchanges and mining pools typically face unique and different challenges when they integrate CKB into their system. This page will provide Q&A for wallets, exchanges and mining pools to integrate CKB. We are woking on detailed guides and helpful tips now, please be patient for a while.

The following three questions are related to transaction processing, you may refer to [Transaction](https://nervosnetwork.github.io/docs-new/docs/reference/transaction) for more details.

**Q:**How do we use the two fields `code_hash` and `hash_type` in the lock script of output cells ?

**A:** When the output cells are unlocked, CKB-VM should load the corresponding contracts by using `code_hash` and `hash_type`.It is recommended to refer to [Script](https://nervosnetwork.github.io/docs-new/docs/reference/script#data-structure) for more details.

* `code_hash`: A hash denoting which script in the transaction to execute. For space consideration, the actual script code is kept in the cell data part of a [live cell](https://nervosnetwork.github.io/docs-new/docs/reference/cell#live-cell) on CKB. The current transaction should reference the live cell using a [cell dep](https://nervosnetwork.github.io/docs-new/docs/reference/transaction) so as to locate and execute the script.
* `hash_type`: The interpretation of `code_hash` when looking for script code to run from cell deps.
    * If `hash_type` contains `data`, `code_hash` should match the blake2b hash of data(which is also the actual script code) in a dep cell;
    * If `hash_type` contains `type`, `code_hash` should instead match the blake2b hash of type script contained by a a dep cell. Note CKB will throw a validation error when a) we are locating a script code using `type` as `hash_type`; and b) more than one cell referenced by cell deps contains the specified hash of type script.


**Q:**Can we hardcode the  `code_hash` , `hash_type` and the corresponding `cell_dep` of two scripts? Are they the same on Testnet as on Mainnet？

**A:** `code_hash` and `hash_type` can be hardcoded and they are the same on Testnet as on Mainnet.  `cell_dep`  is not the same on the Testnet as on Manniet. But they are all get from the fixed position of the genesis block. The single signature is from the second transaction of the genesis block and the multisignature is from the second output cell, once the genesis block is confirmed, the value is fixed

**Q:** How do we use  `Type` in the outputs?

**A:** `Type` can be used in many ways, such as UDT(User Defined Token). We already have an RFC: [Simple UDT Draft Spec](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) you may refer it for more details, but currently there isn’t a standard equivalent of ERC20 in Ethereum community, will have to wait until the community has developed a best practice. For wallets or exchanges, you may handle the transactions with `Type = null` If the standard is generated, you also need filter transactions by whitelist and leave transactions with `Type = null` in the future.

**Q:** What is the relationship between the short address, long address and lock script?

**A:**  The long address and lock Script correspond one to one. All long addresses can be converted into a lock script and vice versa.All short addresses can be converted into long addresses, but the reverse is not necessarily true.CKB have provided single signature transfer and multisignature transfer scripts by default. Also you may refer to RFC:[CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md) for more details.

**Q:** Are there some test cases for address resolution and generation in other programming languages?

**A:** Yes, you may refer to the test cases of ckb-sdk-java：
https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/ckb/src/test/java/utils/AddressParserTest.java
https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/ckb/src/test/java/utils/AddressGeneratorTest.java


**Q:** Why the minimum transfer amount cannot be less than 61 CKB?

**A:** A Cell has three fields and itself should take up capacity, you may refer to [Cell](https://nervosnetwork.github.io/docs-new/docs/reference/cell) for more details：

* The field `capacity` is u64, which takes 8 bits.
* The field `lock script` is `Script` type, includes `code_hash` 32 bits, `hash_type` 1 bit, `args` 20 bits
* The field `type script` is optional.

so the minimum transfer amount need to be 61 CKB.

**Q:** If I have 100 tokens in my address and transfer 61 CKB,  the left balance isn’t enough to create change. How can I deal with it?

**A:** It’s recommended to prompt users for insufficient balance, which use Bitcoin dust UTXO processing logic. Also there is a new lock script for CKB that can accept any amount of payment. You may refer [RFC: anyone-can-pay lock](https://talk.nervos.org/t/rfc-anyone-can-pay-lock/4438) for more details.

**Q:** Can `output_data` be used as exchange entry certificate?

**A:** CKB Programming model is a generalized version of the UTXO model.It is recommended to generate different account addresses for each user instead of sharing one address and distinguish them by memo.


**Q:** Are there APIs similar to Bitcoin Wallet’s APIs to manage CKB?

**A:** If you already have UTXO management framework for Bitcoin, you may continue to use it and scan every block of CKB blockchain.If you don’t, you may refer to [Cell](https://nervosnetwork.github.io/docs-new/docs/reference/cell#tools) and use the tools to index or query.


**Q:** Which APIs need to be invoked if I want to get transaction lists, transaction balance, initiate transactions and etc.

**A:** You may refer to our [JSON RPC](https://nervosnetwork.github.io/docs-new/docs/reference/rpc) document.
