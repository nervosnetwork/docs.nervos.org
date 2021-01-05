---
id: qa_zh
title: Q&A | 钱包/交易所/矿池
---

第三方钱包、交易所以及矿池适配 CKB 时，通常会遇见一些疑难杂症。本小节专门提供了相关的 Q&A，未来会出版更详尽的帮助指南。 

以下三个问题与交易处理相关，你可以参考[交易](https://nervosnetwork.github.io/docs-new/docs/reference/transaction)了解更多。 

**Q：**在输出 Cells 中的 `lock script` 中，我们要如何使用 `code_hash` 和 `hash_type` 这两个字段呢？

**A：**当输出 Cells 处于解锁状态时，CKB-VM 会根据 `code_hash` 和 `hash_type` 加载对应的合约。建议参考[脚本](https://nervosnetwork.github.io/docs-new/docs/reference/script#data-structure)了解更多。

* `code_hash`：表示执行交易中的哪个脚本。处于空间占用的考量，实际的脚本代码是存储在 `live cell` 中的数据部分中。当前交易可以通过 [cell dep](https://nervosnetwork.github.io/docs-new/docs/reference/transaction) 引用 `live cell`，便于定位和执行脚本。 
* `hash_type`: 当从 `cell deps` 中寻找准备执行的脚本代码时，对 `code_hash` 的一个解释。
    * 如果 `hash_type` 包含`data`， `code_hash` 应该匹配 `dep cell` 中数据的 blake2b 哈希；
    * 如果 `hash_type` 包含`type`， `code_hash` 应该匹配 `dep cell` 中 `type script`  的 blake2b 哈希；注意，在以下情况 CKB 会抛出一个验证异常：a) 我们使用 `type` 作为 `hash_type` 进行定位脚本代码； b) `cell deps` 所引用的 Cells 超过不止一个包含特定的 `type script` 哈希。

**Q：**Can we hardcode the  `code_hash` , `hash_type` and the corresponding `cell_dep` of two scripts? Are they the same on Testnet as on Mainnet？

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
