---
id: mercury
title: Mercury FAQ
---

import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

### Q: How to use Mercury RPC? What are RPC’s access paths?

**A**: First, requesting Mercury RPC requires a running Mercury node. The default RPC URI of a local Mercury node is[http://127.0.0.1:8114](http://127.0.0.1:8114/). If needed, you can modify it in the Mercury configuration file. Mercury pulls data from CKB nodes and provides APIs for CKBytes transfers, UDT transfers, etc.

The community also provide the following public nodes:

- Testnet URL: https://mercury-testnet.ckbapp.dev/
- Mainnet URL: https://mercury-mainnet.ckbapp.dev/

Public nodes are suitable only for quick tests. For better stability and performance, it is recommended to use your own nodes instead of public ones.

If you want to call Mercury RPC via SDK, these are available:[ckb-sdk-java](https://github.com/nervosnetwork/ckb-sdk-go/blob/dd69a20cf1450af205e935eb334549ba18536cfe/mercury/example/use_of_mercury_and_ckb_and_indexer_example.go#L77 ), [ckb-sdk-go](https://github.com/nervosnetwork/ckb-sdk-java/blob/8f9cc1a3ade418fa89f148fde2d30f2ea3bf8903/ckb-api/src/test/java/constant/ApiFactory.java#L6).

---

### Q: What are the hardware requirements for running Mercury?

**A**: Recommended hardware is 4-core CPU, 8G RAM and 50G hard disk.

---

### **Q**: What address types are currently supported by Mercury?

**A**: Mercury supports both full and short address formats. It supports the most common lock scripts as well, including [Secp256](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#secp256k1blake160), [ACP](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md), [Cheque](https://talk.nervos.org/t/sudt-cheque-deposit-design-and-implementation/5209) and [PW-lock](https://talk.nervos.org/t/lay2-pw-sdk-build-dapps-on-ckb-and-run-them-everywhere/4289).

---

### Q: How to get the complete list of transaction info from Mercury, including input and output addresses, time and amount?

**A**: You can use `query_transactions` to get transaction history in Mercury. It allows the user to query transaction history from addresses, asset types etc. For more details on the parameters, return value descriptions and call samples refer to [here](https://github.com/nervosnetwork/mercury/blob/main/core/rpc/README.md#method-query_transactions). 
You can either choose to [run Mercury locally](https://github.com/nervosnetwork/mercury/blob/main/docs/setup.md) or access the public nodes provided by Mercury:

- Mainnet URL: [https://mercury-mainnet.ckbapp.dev](https://mercury-mainnet.ckbapp.dev/)
- Testnet URL:  [https://mercury-testnet.ckbapp.dev](https://mercury-mainnet.ckbapp.dev/)

Also, you can call the `query_transactions` API by using `ckb-sdk-java` or `ckb-sdk-go`. For more information, see the [ckb-sdk-java](https://github.com/nervosnetwork/ckb-sdk-java/blob/develop/ckb-api/src/test/java/org/nervos/api/mercury/QueryTransactionsTest.java) and [ckb-sdk-go](https://github.com/nervosnetwork/ckb-sdk-go/blob/develop/mercury/example/query_transactions_example.go) samples.

---

### 
