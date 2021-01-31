---
id: qa_zh
title: Q&A | 钱包/交易所/矿池
---

第三方钱包、交易所以及矿池适配 CKB 时，通常会遇见一些疑难杂症。本小节专门提供了相关的 Q&A，未来会出版更详尽的帮助指南。 

以下三个问题与交易处理相关，你可以参考[交易](https://nervosnetwork.github.io/docs-new/docs/reference/transaction)了解更多。 

**Q：**在输出 Cells 中的 `锁脚本（lock script）` 中，我们要如何使用 `code_hash` 和 `hash_type` 这两个字段呢？

**A：**当输出 Cells 处于解锁状态时，CKB-VM 会根据 `code_hash` 和 `hash_type` 加载对应的合约。建议参考[脚本](https://nervosnetwork.github.io/docs-new/docs/reference/script#data-structure)了解更多。

* `code_hash`：表示执行交易中的哪个脚本。处于空间占用的考量，实际的脚本代码是存储在 `可用 cell（live cell）` 中的数据部分中。当前交易可以通过 [cell dep](https://nervosnetwork.github.io/docs-new/docs/reference/transaction) 引用 `可用 cell（live cell）`，便于定位和执行脚本。 
* `hash_type`: 当从 `cell deps` 中寻找准备执行的脚本代码时，对 `code_hash` 的一个解释。
    * 如果 `hash_type` 包含`data`， `code_hash` 应该匹配 `dep cell` 中数据的 blake2b 哈希；
    * 如果 `hash_type` 包含`type`， `code_hash` 应该匹配 `dep cell` 中 `类型脚本（type script）`  的 blake2b 哈希；注意，在以下情况 CKB 会抛出一个验证异常：a) 我们使用 `type` 作为 `hash_type` 进行定位脚本代码； b) `cell deps` 所引用的 Cells 超过不止一个包含特定的 `类型脚本（type script）` 哈希。

**Q：**  `code_hash` ，`hash_type` 以及两个脚本对应的 `cell_dep` 能够硬编码？测试网和主网都一样吗？

**A：** `code_hash` 和 `hash_type` 能够硬编码并且在测试网和主网都一样。`cell_dep` 在测试网上和在主网上是不一样的。不过它们都是从创世区块中的固定位置中获取得到的。.单签来自创世区块的第二笔交易，多签来自第二个输出 Cell，只要创世区块一经确认，其值也就固定下来了。

**Q：** 我们在输出中如何使用 `Type`？

**A：** `Type` 可以用于很多方面，例如 UDT（User Defined Token）。 我们已经有了一份 RFC： [Simple UDT 草案规范](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)，你可以参考了解更多，不过当前在以太坊社区还没有类似 ERC20 的标准，所以必须等待社区开发出最佳实践。对于钱包或者交易所，你可以用 `Type = null` 来处理交易。如果未来对应标准出台了，你还需要通过白名单过滤交易留下 `Type = null` 的交易。

**Q：**短地址，长地址以及 锁脚本（lock script） 之间有什么关系？

**A:**  长地址和 锁脚本（lock script） 一一对应。所有长地址都可以转换为 锁脚本（lock script），反之亦然。所有短地址都可以转换为长地址，但反之则不一定。CKB 已经默认提供了单签/多签转账脚本。你也可以参考 RFC：[CKB 地址格式](<https://github.com/nervoscommunity/docs/blob/master/docs/rfcs/0021-ckb-address-format/0021-ckb-address-format.zh.md>)了解更多。

**Q：** 是否有一些其他编程语言版本的地址解析和生成的测试用例？

**A：** 有，你可以参考 ckb-sdk-java 的测试用例：
https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/ckb/src/test/java/utils/AddressParserTest.java
https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/ckb/src/test/java/utils/AddressGeneratorTest.java

**Q：** 为什么最小转账数额不能小于 61 CKB？

**A：** 一个 Cell 有 3 个字段以及自身需要占用容量，你可以参考 [Cell](https://nervosnetwork.github.io/docs-new/docs/reference/cell) 了解更多：

*  `capacity` 字段类型为 u64，占用 8 字节。
*  `锁脚本（lock script）` 为 `Script` 类型，其中包含`code_hash` 32 字节，`hash_type` 1 字节， `args` 20 字节。
* `类型脚本（type script）` 字段可选。

所以最小转账数额不能小于 61 CKB。

**Q：** 如果我的地址中有 100 CKB，然后转出 61 CKB，剩余余额不足交易失败，我该怎么办？

**A：** 推荐提示用户余额不足，可以使用比特币粉尘 UTXO 处理逻辑。另外，CKB 也有一个新的 锁脚本（lock script） 能够接收任意数额的转账，你可以参考 [RFC: anyone-can-pay lock](https://talk.nervos.org/t/rfc-anyone-can-pay-lock/4438) 了解更多。

**Q：** `output_data` 能用作交易所入金凭证吗？

**A：**CKB 编程模型是一个泛化版的 UTXO 模型。我们建议为每个用户生成对应不同的账户地址而不是共享地址然后通过 memo 区分。

**Q：** 有没有类似比特币钱包的 API 来管理 CKB？

**A：** 如果你已经有比特币的 UTXO 管理框架，你可以继续使用并且扫描 CKB 网络上的每一个区块。如果没有，你可以参考 [Cell](https://nervosnetwork.github.io/docs-new/docs/reference/cell#tools) 使用工具进行索引查询。

**Q：** 如果我想要获取交易列表，交易余额以及发送交易，我应该调用哪些 APIs?

**A：**你可以参考我们的 [JSON RPC](https://nervosnetwork.github.io/docs-new/docs/reference/rpc) 文档。