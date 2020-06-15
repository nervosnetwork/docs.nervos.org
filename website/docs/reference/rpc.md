---
id: rpc
title: JSON-RPC
---

CKB exposes a set of RPCs in [JSON-RPC](https://www.jsonrpc.org/specification) 2.0 protocols for interactions.

Here are some initial tips:

* The RPCs exposed by CKB are only designed for internal usage. Please limit the access to the CKB RPCs strictly to trusted machines (by using rpc.listen_address configuration option). Exposing CKB RPCs to the public Internet is dangerous and strongly discouraged.
* CKB JSON-RPC only supports HTTP now. If you need SSL support, please setup a reverse proxy via nginx or other HTTPS servers.
* Subscriptions require a full duplex connection. CKB offers such connections in the form of tcp (enable with rpc.tcp_listen_address configuration option) and websockets (enable with rpc.ws_listen_address).

## Usage

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

<details>
<summary>(click here to view response)</summary>
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

<details>
<summary>(click here to view response)</summary>
```bash
{"jsonrpc":"2.0","result":{"transaction":{"cell_deps":[{"dep_type":"dep_group","out_point":{"index":"0x0","tx_hash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37"}},{"dep_type":"code","out_point":{"index":"0x0","tx_hash":"0xc1b2ae129fad7465aaa9acc9785f842ba3e6e8b8051d899defa89f5508a77958"}}],"hash":"0x65b253cdcb6226e7f8cffec5c47c959b3d74af2caf7970a1eb1500e9b92aa200","header_deps":[],"inputs":[{"previous_output":{"index":"0x0","tx_hash":"0x6e64c2a3f248da5115c49ef8100b3a29c4f665517626a513b340821ba8b95f80"},"since":"0x0"}],"outputs":[{"capacity":"0x34e62ce00","lock":{"args":"0x927f3e74dceb87c81ba65a19da4f098b4de75a0d","code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type"},"type":{"args":"0x6e9b17739760ffc617017f157ed40641f7aa51b2af9ee017b35a0b35a1e2297b","code_hash":"0x48dbf59b4c7ee1547238021b4869bceedf4eea6b43772e5d66ef8865b6ae7212","hash_type":"data"}},{"capacity":"0x711befb618","lock":{"args":"0x927f3e74dceb87c81ba65a19da4f098b4de75a0d","code_hash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8","hash_type":"type"},"type":null}],"outputs_data":["0x40420f00000000000000000000000000","0x"],"version":"0x0","witnesses":["0x55000000100000005500000055000000410000007926ec98874bb86143d178826253e18425e50bf85fbb4b7cf9188462e7e87bc810ac602e55b9c73890ab8306368d7d02d96234f250750269e1aa023eb5b71b5100"]},"tx_status":{"block_hash":"0xef3d24667212849545831a7e5a6168455909842e6a2e426d5b80656bca49b372","status":"committed"}},"id":3}
```
</details>

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
