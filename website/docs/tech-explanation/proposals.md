---
id: proposals
title: proposals
---

# proposals

`proposals` refer to an array of hex-encoded short transaction IDs that represent proposed transactions within a block or its uncle blocks. A transaction proposal ID is the first 10 bytes of the transaction hash. In CKB, the transaction proposal ID must be proposed before a transaction can be committed to the blockchain.

- A transaction is considered **proposed** if its proposal ID is listed in the `proposals` field of a block or an uncle of that block.
- A transaction is considered **committed** once it appears in a block’s `transactions` field.

<img src={"/img/tech_explanation/proposal-lifecycle.png"} width={688} height={362} alt="Lifecycle of proposals" />

Two protocol parameters, `close` and `far`, specify the closest and farthest on-chain distances between a transaction's proposal and commitment. A non-cellbase transaction commit in block `c` must have been proposed in block `p`, where

```
close <= c - p <= far
```

In CKB's Mainnet, `close` is 2 and `far` is 10. Thus:

```
2 <= c - p <= 10
```

As shown above, when a transaction is committed in Block 23, it should have been proposed in the `tx_proposal_window` between Block 13 and Block 21.
