---
id: header-deps
title: "header_deps"
---

# header_deps

`header_deps` lists block headers hashes that Scripts can access during execution, with certain limitations to ensure transaction determinism.

:::note

A transaction is **deterministic** when all Scripts produce the same result across all nodes. To ensure this, all block headers listed in `header_deps` must already exist on the chain. Uncle blocks are not allowed — they are excluded to prevent inconsistent results across nodes.
:::
