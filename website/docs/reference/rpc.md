---
id: rpc
title: JSON-RPC
---

CKB exposes a set of RPCs in [JSON-RPC](https://www.jsonrpc.org/specification) 2.0 protocols for interactions.

Here are some initial tips:

* The RPCs exposed by CKB are only designed for internal usage. Please limit the access to the CKB RPCs strictly to trusted machines (by using rpc.listen_address configuration option). Exposing CKB RPCs to the public Internet is dangerous and strongly discouraged.
* CKB JSON-RPC only supports HTTP now. If you need SSL support, please setup a reverse proxy via nginx or other HTTPS servers.
* Subscriptions require a full duplex connection. CKB offers such connections in the form of tcp (enable with rpc.tcp_listen_address configuration option) and websockets (enable with rpc.ws_listen_address).

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




