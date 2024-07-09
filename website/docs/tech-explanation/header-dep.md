---
id: header-dep
title: "header_dep"
---

# header_dep

Header Deps allows Scripts to read block headers whose hashes are listed in `header_deps`, with certain limitations to ensure transaction determinacy.

:::note

A transaction is determined when all Scripts yield deterministic results. Another requirement is that the transaction can only be added to the chain if all the blocks listed in `header_deps` are already present in the chain, excluding uncles.

:::
