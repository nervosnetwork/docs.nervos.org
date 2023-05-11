---
id: monitor-nodes
title: Monitor Nodes With CKBGuardian
---

[CKBGuardian](https://cryptape.github.io/CkbGuardian/index.html) is a RPC status monitor for CKB public nodes. It can also check whether CKB and CKB proxy have been started properly. Its purpose is to verify the connectivity of the RPC, not the validity of the results.

## Local Setting

Step 1: Clone Code

```
git clone https://github.com/cryptape/CkbGuardian.git
```

Step 2: Add Check Node Message

Modify the `rpc` field only.
```
echo "[
  {
    \"name\": \"public\",
    \"url\": \"web url\",
    \"network\": \"MIRANA\",
    \"rpc\": \"http://localhost:8114\",
    \"excludeMethods\": [\"send_alert\",\"clear_banned_addresses\",\"set_ban\",\"set_network_active\",\"add_node\",\"remove_node\",\"remove_transaction\",\"clear_tx_pool\",\"subscribe\",\"unsubscribe\"]
  }
]" > CkbGuardian/ckb/resource/ckb.json
```

Step 3: Run Test

```
cd CkbGuardian/ckb
npm i
npm run test
```

## Daily Monitoring with GitHub Action

To add a new node to CKBGuardian:

Step 1: Edit this [JSON file](https://github.com/cryptape/CkbGuardian/blob/main/ckb/resource/ckb.json) by adding the relevant information for the new node. 

Step 2: Fill in the following fields in the `CkbNodeConfig` class:

```jsx
export class CkbNodeConfig {
    name: string.  // server name
    url: string.   // server url 
    network: string. // now noly support main 
    rpc: string.     // rpc url 
    apiKeyName: string. // if need api-key 
    excludeMethods: string[]. // service not support methods 
}
```

Step 3: Once you have updated the file, send a pull request.

Here is [an example](https://github.com/cryptape/CkbGuardian/pull/2/commits/a2dcefed7a61fbfa40d89564a9e8520dd7bc2cd2).

If an API key is needed to connect to CKB service, follow these steps:

1. Add `apikeyName`: `SERVICE_API_KEY`

2. Add `[.env](https://github.com/gpBlockchain/CkbGuardian/blob/main/ckb/.env)` and fill out the `SERVICE_API_KEY` 

```jsx
GET_BLOCK_API_KEY=""
```

3. Modify the [relevant workflow](https://github.com/cryptape/CkbGuardian/blob/main/.github/workflows/check-node.yml#L45-L46).

4. Contact the project administrator to add the action secret.
