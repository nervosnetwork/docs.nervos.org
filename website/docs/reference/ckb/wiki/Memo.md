---
id: Memo
title: Memo
---

We list some questions here which later should be published as RFCs.

## How transaction fees are split between committer and proposer?

The fees are split for each transaction first, and then are summed up to the total fees.

For each transaction fee which is F Shannon, poposer gets

```
floor(F * 4 / 10)
```

And committer gets

```
F - floor(F * 4 / 10)
```

## How the primary and secondary epoch reward is split among blocks?

Suppose the epoch reward is R, and the epoch length is L. The start block number of the epoch is S. Let

```
M = R mod L
```

For block from S (inclusively) to S + M (exclusively), the reward is

```
floor(R / L) + 1
```

And for block from S + M (inclusively) to S + L (exclusively), the reward is

```
floor(R / L)
```

