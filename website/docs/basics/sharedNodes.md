---
id: communitynodes
title: Community Nodes
---
import useBaseUrl from "@docusaurus/useBaseUrl";

import Link from "@docusaurus/Link";

Developers on the CKB can test and build their projects by accessing the service through the API nodes granted by Nervos.

:::note
If your RPC is remotely accessible, restrict access to the following interfaces when running CKB nodes:
```
clear_banned_addresses
set_ban
set_network_active
add_node
remove_node
remove_transaction
clear_tx_pool
```
:::

## Ankr

Ankr is a decentralized Web3 infrastructure provider offering a distributed node infrastructure that supports a multi-chain network to help developers interact with multiple blockchains. CKB developers can now access the Ankr API and RPC to test or build their own DApps.

<img src={useBaseUrl("img/ankr.png")}/>

- [Nervos Ankr Endpoints](https://www.ankr.com/rpc/nervos?tab=infrastructure)
- [Ankr Documentation on Nervos](https://www.ankr.com/docs/build/chains/nervos/)

----

## Unifra

Unifra is a Web3 developer platform focused on simplifying blockchain development. They've built a suite of developer tools, enhanced APIs, and a node infrastructure to seamlessly build and run blockchain applications. As a member of Nervos community, Unifra provides public RPC services for CKB mainnet (Mirana).

<img src={useBaseUrl("img/unifra.png")}/>

- [Unifra Nervos CKB API](https://unifra.readme.io/reference/module-chain)
- [Unifra Documentation](https://unifra.readme.io/reference/welcome-to-unifra)
