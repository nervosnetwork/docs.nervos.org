---
id: rpc_zh
title: JSON-RPC
---

CKB 提供了一组 [JSON-RPC](https://www.jsonrpc.org/specification) 2.0 协议的 RPCs 以供调用。

开头温馨提示：

* CKB 提供的 RPCs 仅为内部使用，请将 CKB RPCs 的受限访问严格设定为可信任的计算机（通过 `rpc.listen_address` 配置项）。将 CKB RPCs 暴露给公共网络是十分危险的，强烈建议不要这样做。
* CKB JSON-RPC 目前只支持 HTTP。如果你需要支持 SLL 加密，请通过 nginx 或者其他 HTTPS 服务器设置反向代理。
* 订阅需要全双工连接。CKB 以 tcp（启用 `rpc.tcp_listen_address` 配置项）和 websocket（启用`rpc.ws_listen_address` 配置项）的形式提供此类连接，纯 HTTP 连接不支持订阅。具体参见以下示例。

## 基本使用

本章节我们只是简单介绍如何与 CKB 的 RPCs 进行交互。请参阅 [CKB JSON RPC协议文档](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md)。

要使用 CKB JSON-RPC，首先你得运行一个节点，请参考教程指南： [如何运行 CKB 主网节点](basics/guides/mainnet_zh.md) ， [如何运行 CKB 测试节点](basics/guides/testnet_zh.md)，或者 [如何运行 CKB 开发链](basics/guides/devchain.md)。以下命令默认你已经将 CKB JSON-RPC 暴露在 8114 端口，如果你在别的端口启动了 CKB JSON-RPC，请相应地进行更改。

以下命令使用 [get_tip_block_number](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md#get_tip_block_number) RPC来获取最长链中的最新区块的高度：

```
echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_tip_block_number",
    "params": []
}' \
| tr -d '\n' \
| curl -H 'content-type: application/json' -d @- \
http://localhost:8114
```

<details>
<summary>(点击此处查看响应)</summary>
```bash
{"jsonrpc":"2.0","result":"0x2cb4","id":2}
```
</details>

我们还可以使用以下命令来获取整个交易：

```
echo '{
    "id": 3,
    "jsonrpc": "2.0",
    "method": "get_transaction",
    "params": ["0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200"]
}' \
| tr -d '\n' \
| curl -H 'content-type: application/json' -d @- \
http://localhost:8114
```

<details>
<summary>(点击此处查看响应)</summary>
```bash
{"jsonrpc":"2.0","result":{"transaction":{"cell_deps":[{"dep_type":"dep_group","out_point":{"index":"0x0","tx_hash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37"}},{"dep_type":"code","out_point":{"index":"0x0","tx_hash":"0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958"}}],"hash":"0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200","header_deps":[],"inputs":[{"previous_output":{"index":"0x0","tx_hash":"0x6e64c2a3f248da5115c49ef8100b3a29c4f665517626a513b340821ba8b95f80"},"since":"0x0"}],"outputs":[{"capacity":"0x34e62ce00","lock":{"args":"0x927f3e74dceb87c81ba65a19da4f098b4de75a0d","code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type"},"type":{"args":"0x6e9b17739760ffc617017f157ed40641f7aa51b2af9ee017b35a0b35a1e2297b","code_hash":"0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212","hash_type":"data"}},{"capacity":"0x711befb618","lock":{"args":"0x927f3e74dceb87c81ba65a19da4f098b4de75a0d","code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type"},"type":null}],"outputs_data":["0x40420f00000000000000000000000000","0x"],"version":"0x0","witnesses":["0x55000000100000005500000055000000410000007926ec98874bb86143d178826253e18425e50bf85fbb4b7cf9188462e7e87bc810ac602e55b9c73890ab8306368d7d02d96234f250750269e1aa023eb5b71b5100"]},"tx_status":{"block_hash":"0xef3d24667212849545831a7e5a6168455909842e6a2e426d5b80656bca49b372","status":"committed"}},"id":3}
```
</details>

## 订阅

要使用订阅功能，你需要配置 CKB 启用该功能。在本节中，我们假设你在本节中使用以下配置`ckb.toml`：

```toml
[rpc]
listen_address = "127.0.0.1:8114"
tcp_listen_address = "127.0.0.1:18114"
ws_listen_address = "127.0.0.1:18115"

# ... more configs
```

上面的配置可确保 CKB 侦听 8114 端口以进行常规 HTTP 连接，侦听 18114 端口以进行 TCP 双工连接，以及侦听 18115 端口以侦听 WebSocket 双工连接。

### 基于 TCP 的 RPC 

以下命令使用 [netcat](https://en.wikipedia.org/wiki/Netcat) 通过 TCP 连接到 CKB，然后触发与上述相同的 `get_tip_block_number` RPC 获取最长链中最新区块的高度：

```
echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_tip_block_number",
    "params": []
}' \
| tr -d '\n' \
| sed -e "s/$/\n/"
| nc localhost 18114 -q 1
{"jsonrpc":"2.0","result":"0xdc90","id":2}
```

以下命令使用 netcat 连接到 CKB，然后发送订阅请求监控最新提交区块：

```
cat <(echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_tip_block_number",
    "params": []
}' \
| tr -d '\n' \
| sed -e "s/$/\n/") -
| nc localhost 18114
{"jsonrpc":"2.0","result":"0xa","id":2}
{"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a2810cf\",\"timestamp\":\"0x16ee81d0d5f\",\"number\":\"0x30673\",\"epoch\":\"0x5f102b400007a\",\"parent_hash\":\"0xc9020c79d4f19797022af3631eb9e76c57933bd608fe81a137b834975616c991\",\"transactions_root\":\"0x7d8e3c102a5c52598cdbe7d208deb986eb2f0af189bc4655e6dd1a71564c2b25\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"dao\":\"0x15b9ae7648400f2fb61d57e0379b2300fc641b7e8db5160000060394d5580007\",\"nonce\":\"0x1f86f056000002460000000053170600\",\"hash\":\"0xa3c8feda83d7e184f09cb4f05e535bccd4c159e2cc0ac7a06ea7d457e0051a08\"}","subscription":"0xa"}}
{"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a2810cf\",\"timestamp\":\"0x16ee81d1dfd\",\"number\":\"0x30674\",\"epoch\":\"0x5f102b500007a\",\"parent_hash\":\"0xa3c8feda83d7e184f09cb4f05e535bccd4c159e2cc0ac7a06ea7d457e0051a08\",\"transactions_root\":\"0x6d2dfc88bd8dda743b5bae14453f5f405a2a29a3cf6fff00c60f0f5c60a84fbe\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"dao\":\"0xb4e019376f400f2f34c172e7379b230031d1417d95b5160000a399ffd6580007\",\"nonce\":\"0xded8ffa1000000000000040a90000000\",\"hash\":\"0x7d10fd1fb459630aa2f87ee4de699b7466a5da6efc0aee6ff459ff17b6cc5904\"}","subscription":"0xa"}}
// ... more data
```

使用  `Ctrl-C` 退出 netcat。 

### 基于 WebSocket 的 RPC 

要使用基于 WebSocket 的RPC，请确保首先安装 [wscat](https://github.com/websockets/wscat)：

```
npm install -g wscat
```

你可以使用以下命令来启动 wscat 并连接到 CKB：

```
wscat -c ws://localhost:18115
Connected (press CTRL+C to quit)
>
```

现在我们同样运行 `get_tip_block_number` 请求：

```
> {"id": 2, "jsonrpc": "2.0", "method": "get_tip_block_number", "params": []}
< {"jsonrpc":"2.0","result":"0x76887","id":2}
```

你还可以为新区块创建订阅：

```
> {"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}                                                                                                        < {"jsonrpc":"2.0","result":"0x2","id":2}                                                                                                                                                 < {"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a216e17\",\"timestamp\":\"0x16f886b2223\",\"number\":\"0x77e2a\",\"epoch\":\"0x6c$01a9000135\",\"parent_hash\":\"0x2662c8056c638408d8f018a53785d68f633bd1edfa06b82d7c29ddcac1d98927\",\"transactions_root\":\"0xa6488b15373521ec0b1bc9dff1f117cc1cad7d3579e8a6c38cc6e35166dad9bd\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"dao\":\"0x1a1aab41ad3eb72fa260f4eedeb9230092c4510af45b390000547d684fc40007\",\"nonce\":\"0xce1aaca681000089001d0003cb2d0500\",\"hash\":\"0x993e593921024167c1779146348fe2d82864ecd3f657b3bd2b14fbdfa87c4f06\"}","subscription":"0x2"}}
< {"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a216e17\",\"timestamp\":\"0x16f886b29e3\",\"number\":\"0x77e2b\",\"epoch\":\"0x6c601aa000135\",\"parent_hash\":\"0x993e593921024167c1779146348fe2d82864ecd3f657b3bd2b14fbdfa87c4f06\",\"transactions_root\":\"0xe64cb6afb57e92a2af1da34d8a1d547fcd8b833e187697ae28a9dfadaaeba247\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0xa807c9cbb16a5af7cf36fd5c20b29535f6db4de52062138ad21ea6790ba9529c\",\"dao\":\"0xba227d3fcf3eb72fc8d61ff5deb92300402b3f12fb5b390000f113d450c40007\",\"nonce\":\"0xfb68521601000000000000503c9e2338\",\"hash\":\"0xf55d0f7ae1d9b106eee96139d86313e46b109ec8fa0d92f9eb6eb8bc81c294ec\"}","subscription":"0x2"}}
< {"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a216e17\",\"timestamp\":\"0x16f886b40a3\",\"number\":\"0x77e2c\",\"epoch\":\"0x6c601ab000135\",\"parent_hash\":\"0xf55d0f7ae1d9b106eee96139d86313e46b109ec8fa0d92f9eb6eb8bc81c294ec\",\"transactions_root\":\"0xad2c9e1eabc586c8e38cc1eaca61eba5e320bbf4655c510c5be5de9eaafea96f\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"dao\":\"0x5a2b4f3df13eb72feb4c4bfbdeb923008c922c1a025c3900008eaa3f52c40007\",\"nonce\":\"0x7b5ad85601000000000000005b340000\",\"hash\":\"0x2077e0c022514fe07844411436cfbf50e413694858a3d4775e0c836e787ce7ab\"}","subscription":"0x2"}}
<< // ... more data.
```

## 序列化

CKB 的 RPCs 以 JSON 的格式返回数据，虽然很多字段的数据都易于理解，不过 CKB 对数字和二进制数据进行了特殊处理。

### 数字

CKB 的 RPCs 中的所有数字（包括请求参数和返回值），都使用十六进制编码，数字先以最紧凑的格式以十六进制编码（这意味着数字开头无用的 0 会被移除），然后添加  `0x` 前缀。例子如下：

- `0` 编码为 `0x0`，我们无法删除仅剩的`0`，否则它就不是一个正确的数字了
- `4` 编码为 `0x4`
- `15` 编码为 `0xf`
- `42` 编码为 `0x2a`
- `291` 编码为 `0x123`
- `3984` 编码为 `0xf90`

### 二进制数据

所有的二进制数据，包括所有哈希值，脚本中的 `args` 参数， `outputs_data` 数据项，都带  `0x` 前缀。 例子如下：

* `0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200`
* `0x927f3e74dceb87c81ba65a19da4f098b4de75a0d`
* `0x40420f00000000000000000000000000`
* `0x` （空数据）

与数字不同，二进制数据应始终具有偶数长度。

