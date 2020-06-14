---
id: rpc
title: JSON-RPC
---

To interact with CKB, get data on the blockchain,you are welcome to use CKB JSON-RPC Protocols.

Notes: 

* Please strictly limit the access to only trusted machines.Allowing arbitrary machines to access the JSON-RPC port (using the rpc.listen_address configuration option) is dangerous and strongly discouraged.
* CKB JSON-RPC only supports HTTP now. If you need SSL, please setup a proxy via Nginx or other HTTP servers.
* Subscriptions require a full duplex connection. CKB offers such connections in the form of tcp (enable with rpc.tcp_listen_address configuration option) and websockets (enable with rpc.ws_listen_address).

Please refer to the [CKB JSON RPC Protocols](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md) document for more details. This file is auto-generated,don't update this file directly.

You may use JSON-RPC following the `get_tip_block_number` example below.

* Run a CKB [Mainnet](basics/guides/mainnet.md) Node, [Testnet](basics/guides/testnet.md) Node or [development CKB blockchain](basics/guides/devchain.md)

* Returns the number of blocks in the longest blockchain by using [get_tip_block_number](https://github.com/nervosnetwork/ckb/blob/master/rpc/README.md#get_tip_block_number)

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




