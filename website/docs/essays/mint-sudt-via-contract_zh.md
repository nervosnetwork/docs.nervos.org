---
id: mint-sudt-via-contract_zh
title: 通过合约铸造 SUDT
---

*作者：[Wenchao Hu](https://github.com/huwenchao)*

[简单用户自定义代币（Simple User Defined Tokens/Simple UDT/ SUDT)](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) 是一个简单的规范，它为dApp 开发者提供了一种在 Nervos CKB 上铸造自定义代币的方法。

对于用户来说，使用 `SECP256K1/blake160` 和 `SECP256K1/multisig` 来保障代币可能很熟悉，但是我们如何通过合约来铸造 sUDT 呢？

我们在开发 [toCKB](https://github.com/nervosnetwork/toCKB) 的时候遇到了这个问题，toCKB 是一种将其他区块链上的资产映射到 CKB 的免信任方式。在这里，我们将分享一个模式来完成这个任务。

## 重温 SUDT

在研究铸造（mint）编程模式之前，我们先回顾一下 SUDT 规范。

> 简单 SUDT 规范中的 SUDT Cell 如下：

> ```
> data:
>     amount: uint128
> type:
>     code_hash: simple_udt type script
>     args: owner lock script hash (...)
> lock:
>     <user_defined>
> ```

> SUDT Cell 需要满足以下规则：

> - 规则 1：一个 SUDT Cell 必须在 Cell 数据段的前 16 个字节中存储 SUDT 数量，该数量应该以小端格式，128位无符号整数格式存储。如果是可组成的脚本，SUDT量仍然必须位于与组成的 SUDT 脚本相对应的数据段的初始 16 个字节中。
> - 规则 2：SUDT Cell 的 args 的前 32 个字节必须存储所有者锁的锁脚本（lock script）哈希。
> - 规则 3：每个 SUDT 必须要有唯一的类型脚本（type script），也就是说，两个使用相同类型脚本（type script）的 SUDT Cell 将被视为是相同的 SUDT。

> 用户可以在 SUDT Cell 中使用任意他们想要的锁脚本（lock script）。

可以在 [此处](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333)了解更多细节。

在类型参数（type args）中的所有者锁脚本（lock script） 哈希指定了具体的所有者。只有在交易输入中存在锁脚本（ lock script），我们就可以将其视为 `所有者模式`。在 `所有者模式` 中，SUDT 脚本不会检查输入与输出的数量是否相等，即意味着在这种模式下我们可以铸造或者销毁代币。

如果我们使用 `SECP256K1/blake160` 作为 SUDT 类型参数（type args）的锁脚本（lockscript），拥有对应私钥的所有者就能铸造代币。

如果我们使用 `SECP256K1/multisig` 作为 SUDT 类型参数（type args）的锁脚本（lockscript），满足一定多签参与方门槛后就能发行代币。

如果我们想要通过合约发行代币，我们可以将我们的合约逻辑转化为锁脚本（lockscript）。

## 合约作为锁脚本（lockscript）

在 CKB 上，合约其实就是在交易过程中执行的脚本。

如果我们的业务是无状态的，我们可以使用单个锁脚本。

例如，如果你想要创建一个新的代币，任何能够提供私钥的对象，都可以是代币的发行者。

我们可以将锁脚本（lockscript）作为我们的代币参数（token args），如下：

```
let arg = load_first_witness();
if arg == 42 {
    return 0;
} else {
    return 1;
}
```

如果你创建并发布了这个代币，任何人都可以撰写交易，提供 `42 `作为第一 见证（witness）进入所有者模式，按照自己的意愿发行或销毁任意数量的代币。

不过通常我们的业务逻辑还是会与一些状态相关的。

如 uniswap，当用户添加流动性时，合约铸造流动性凭证代币；在一个跨链网桥中，当有人转发一个合法的 spv 证明给合约时，合约铸造镜像代币。我们如何实现这些呢？

我们可以将锁脚本（lockscript）的验证逻辑委托给一个类型脚本（lockscript），使用 Cell 数据作为我们的状态，然后在类型脚本（typescript）中验证状态的转移。

我们通过一个简单的例子来看看如何做到这一点。

## 简化的 ETH 网桥

我们以简化的 ETH 网桥为例。

当有人转发一个 spv 证明，该证明表明其锁定了一些代币到 ETH 网桥合约上，我们在 CKB 上铸造对应的镜像代币（可称之为 cETH）。

这里我们需要 3 个脚本：

- 一个 “以太坊网桥类型脚本”，负责处理 spv 证明的验证逻辑。
- 一个 “以太坊网桥锁脚本”，用作 SUDT 类型脚本的参数（args），并将验证逻辑委托给网桥的类型脚本。
- 一个代表 cETH 的 SUDT 类型脚本。

铸造 cETH 的交易结构如下：

```
Inputs:
    eth-bridge-cell:
        Type:
            code: eth-bridge-typescript
            args: id
        Lock:
            code: eth-bridge-lockscript
            args: eth-bridge-typescript-code-hash
        Data:
            eth_light_client_data
            records: [(block_hash, tx_index)]
    provide-capacity-cell
        Type: None
        Lock: <User Lockscript>
Outputs:
    eth-bridge-cell:
        Type:
            code: eth-bridge-typescript
            args: id
        Lock:
            code: eth-bridge-lockscript
            args: eth-bridge-typescript-code-hash
        Data:
            eth_light_client_data
            records: [(block_hash, tx_index)]
    cETH-token-cell:
        Type:
            code: SUDT-typescript
            args: eth-bridge-lockscript-hash
            data: amount
        Lock:
            <User Lockscript>
Witnesses:
    0: eth-spv-proof
    1: signature to unlock provide-capacity-cell
```

脚本的验证逻辑如下：

- 以太坊网桥类型合约
  - 确保对应的见证（witness）中的 spv 证明有效
  - 确保已处理的 spv 证明有记录在 Cell 数据中，以避免同个证明被多次用于铸造 cETH。
  - 确保锁定在以太坊中的 ETH 数量等于我们铸造的 cETH  数量。
- 以太坊网桥锁定合约
  - 确保对应的以太坊网桥类型脚本出现在输出中，这样我们就知道类型脚本将会在交易中执行，也会完成逻辑委托任务。

但我们遇到了新问题。

我们需要以太坊网桥类型脚本作为以太坊网桥锁脚本的参数，以及以太坊网桥锁脚本的哈希作为 SUDT 类型脚本的参数，但我们需要知道 cETH 代币脚本在以太坊网桥类型脚本中检查代币数量。如果我们通过 cETH代币的脚本哈希定位到其类型脚本，便会造成依赖循环。

我们可以在以太坊网桥类型脚本中使用  `load_lockscript_hash` ，然后检查逐部分整个脚本（包括 code_hash，args 以及 type），而不是 cETH 代币的脚本哈希。

相关伪代码如下：

```
let lockscript_hash = load_lockscript_hash(0, Source::Output);
for script in load_output_typescripts {
    if script.args = lockscript_hash \
        && script.code_hash = SUDT_CODE_HASH \
        && script.type = 0 {
        // This is a cETH token cell
    }
}
```



你可以在[此处](https://github.com/huwenchao/mint-sudt-demo)查看完整 demo。

该[测试文件](https://github.com/huwenchao/mint-sudt-demo/blob/master/tests/src/tests.rs#L8)展示了如何使用这种模式构建一笔铸造交易。