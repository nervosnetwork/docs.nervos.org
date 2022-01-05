---
id: rpc
title: JSON-RPC
---

CKB exposes a set of RPCs in [JSON-RPC](https://www.jsonrpc.org/specification) 2.0 protocols for interactions.

Here are some initial tips:

* The RPCs exposed by CKB are only designed for internal usage. Please limit the access to the CKB RPCs strictly to trusted machines (by using rpc.listen_address configuration option). Exposing CKB RPCs to the public Internet is dangerous and strongly discouraged.
* CKB JSON-RPC only supports HTTP now. If you need SSL support, please setup a reverse proxy via nginx or other HTTPS servers.
* Subscriptions require a full duplex connection. CKB offers such connections in the form of tcp (enable with rpc.tcp_listen_address configuration option) and websockets (enable with rpc.ws_listen_address), plain HTTP connection does not support subscriptions. See below for examples on this.

## Basic Usage

Here we try to provide a starting point for interacting with CKB's RPCs. For more details, please refer to [CKB JSON RPC Protocols Documentation](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md).

To use CKB JSON-RPC, you must first have a node running, please refer to existing guides on how to run a CKB [Mainnet](basics/guides/mainnet.md) node, a CKB [Testnet](basics/guides/testnet.md) node, or a [development-only CKB blockchain](basics/guides/devchain.md). The commands below also assumes you are exposing CKB JSON-RPC on the default `8114` port. If you are starting CKB JSON-RPC on a different port, please make changes accordingly.

The following commands uses [get_tip_block_number](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md#get_tip_block_number) RPC to fetch the `tip` block number, of the latest block number in the longest blockchain:

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

<details><summary>(click here to view response)</summary>

```bash
{"jsonrpc":"2.0","result":"0x2cb4","id":2}
```
</details>

We can also use the following command to fetch an entire transaction:

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

<details><summary>(click here to view response)</summary>

```bash
{"jsonrpc":"2.0","result":{"transaction":{"cell_deps":[{"dep_type":"dep_group","out_point":{"index":"0x0","tx_hash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37"}},{"dep_type":"code","out_point":{"index":"0x0","tx_hash":"0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958"}}],"hash":"0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200","header_deps":[],"inputs":[{"previous_output":{"index":"0x0","tx_hash":"0x6e64c2a3f248da5115c49ef8100b3a29c4f665517626a513b340821ba8b95f80"},"since":"0x0"}],"outputs":[{"capacity":"0x34e62ce00","lock":{"args":"0x927f3e74dceb87c81ba65a19da4f098b4de75a0d","code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type"},"type":{"args":"0x6e9b17739760ffc617017f157ed40641f7aa51b2af9ee017b35a0b35a1e2297b","code_hash":"0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212","hash_type":"data"}},{"capacity":"0x711befb618","lock":{"args":"0x927f3e74dceb87c81ba65a19da4f098b4de75a0d","code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type"},"type":null}],"outputs_data":["0x40420f00000000000000000000000000","0x"],"version":"0x0","witnesses":["0x55000000100000005500000055000000410000007926ec98874bb86143d178826253e18425e50bf85fbb4b7cf9188462e7e87bc810ac602e55b9c73890ab8306368d7d02d96234f250750269e1aa023eb5b71b5100"]},"tx_status":{"block_hash":"0xef3d24667212849545831a7e5a6168455909842e6a2e426d5b80656bca49b372","status":"committed"}},"id":3}
```
</details>

## Subscription

To use subscription feature, you need to configure CKB to enable such features. In this section, we assume you use the following configuration in `ckb.toml` section:

```toml
[rpc]
listen_address = "127.0.0.1:8114"
tcp_listen_address = "127.0.0.1:18114"
ws_listen_address = "127.0.0.1:18115"

# ... more configs
```

This above config ensures CKB listens at 8114 port for normal HTTP connections, 18114 port for TCP duplex connections, and 18115 port for WebSocket duplex connections.

### TCP Based RPC

The following command uses [netcat](https://en.wikipedia.org/wiki/Netcat) to connect via TCP to CKB, then fire the same `get_tip_block_number` RPC as shown above to fetch the block number in the longest chain:

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

The following command uses netcat to connect to CKB, make a subscription request to monitor the latest committed block:

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

Use `Ctrl-C` to exit netcat here.

### WebSocket Based RPC

To play with WebSocket based RPC, please make sure to install [wscat](https://github.com/websockets/wscat) first:

```
npm install -g wscat
```

You can use the following command to start wscat and connect to CKB:

```
wscat -c ws://localhost:18115
Connected (press CTRL+C to quit)
>
```

Now we can run the same `get_tip_block_number` request as above:

```
> {"id": 2, "jsonrpc": "2.0", "method": "get_tip_block_number", "params": []}
< {"jsonrpc":"2.0","result":"0x76887","id":2}
```

You can also create subscriptions for new blocks:

```
> {"id": 2, "jsonrpc": "2.0", "method": "subscribe", "params": ["new_tip_header"]}                                                                                                        < {"jsonrpc":"2.0","result":"0x2","id":2}                                                                                                                                                 < {"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a216e17\",\"timestamp\":\"0x16f886b2223\",\"number\":\"0x77e2a\",\"epoch\":\"0x6c$01a9000135\",\"parent_hash\":\"0x2662c8056c638408d8f018a53785d68f633bd1edfa06b82d7c29ddcac1d98927\",\"transactions_root\":\"0xa6488b15373521ec0b1bc9dff1f117cc1cad7d3579e8a6c38cc6e35166dad9bd\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"dao\":\"0x1a1aab41ad3eb72fa260f4eedeb9230092c4510af45b390000547d684fc40007\",\"nonce\":\"0xce1aaca681000089001d0003cb2d0500\",\"hash\":\"0x993e593921024167c1779146348fe2d82864ecd3f657b3bd2b14fbdfa87c4f06\"}","subscription":"0x2"}}
< {"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a216e17\",\"timestamp\":\"0x16f886b29e3\",\"number\":\"0x77e2b\",\"epoch\":\"0x6c601aa000135\",\"parent_hash\":\"0x993e593921024167c1779146348fe2d82864ecd3f657b3bd2b14fbdfa87c4f06\",\"transactions_root\":\"0xe64cb6afb57e92a2af1da34d8a1d547fcd8b833e187697ae28a9dfadaaeba247\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0xa807c9cbb16a5af7cf36fd5c20b29535f6db4de52062138ad21ea6790ba9529c\",\"dao\":\"0xba227d3fcf3eb72fc8d61ff5deb92300402b3f12fb5b390000f113d450c40007\",\"nonce\":\"0xfb68521601000000000000503c9e2338\",\"hash\":\"0xf55d0f7ae1d9b106eee96139d86313e46b109ec8fa0d92f9eb6eb8bc81c294ec\"}","subscription":"0x2"}}
< {"jsonrpc":"2.0","method":"subscribe","params":{"result":"{\"version\":\"0x0\",\"compact_target\":\"0x1a216e17\",\"timestamp\":\"0x16f886b40a3\",\"number\":\"0x77e2c\",\"epoch\":\"0x6c601ab000135\",\"parent_hash\":\"0xf55d0f7ae1d9b106eee96139d86313e46b109ec8fa0d92f9eb6eb8bc81c294ec\",\"transactions_root\":\"0xad2c9e1eabc586c8e38cc1eaca61eba5e320bbf4655c510c5be5de9eaafea96f\",\"proposals_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"uncles_hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"dao\":\"0x5a2b4f3df13eb72feb4c4bfbdeb923008c922c1a025c3900008eaa3f52c40007\",\"nonce\":\"0x7b5ad85601000000000000005b340000\",\"hash\":\"0x2077e0c022514fe07844411436cfbf50e413694858a3d4775e0c836e787ce7ab\"}","subscription":"0x2"}}
<< // ... more data.
```

## Serialization

CKB's RPCs returns data in JSON format. While most fields are self-explanatory, CKB has special handling for numbers and binary data:

### Numbers

All numbers used in CKB's RPCs, including request parameters and return values, use hex encoding, the number is encoded first in hexadecimal in the most compact format(meaning useless leading zeros should be striped), and then prefixed with `0x`. Here are some examples:

* `0` is encoded as `0x0`, we cannot remove the remaining `0` since otherwise it won't be a proper number
* `4` is encoded as `0x4`
* `15` is encoded as `0xf`
* `42` is encoded as `0x2a`
* `291` is encoded as `0x123`
* `3984` is encoded as `0xf90`

### Binary data

All binary data, including all the hashes, `args` in script, `outputs_data` items, are represented as hex string with `0x` prefix. Some examples include:

* `0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200`
* `0x927f3e74dceb87c81ba65a19da4f098b4de75a0d`
* `0x40420f00000000000000000000000000`
* `0x` (empty data)

Unlike numbers, binary data should always have a even numbered length.
