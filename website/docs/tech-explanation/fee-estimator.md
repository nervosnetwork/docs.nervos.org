---
id: fee-estimator
title: "Fee Estimator"
---

As the number of transactions on CKB continues to grow, accurate fee rate estimation becomes increasingly essential. CKB `v0.120.0` introduces a new experimental feature, **Fee Estimator**, to help developers and users determine optimal transaction fee rates.

## Key Features

- **Switchable Algorithms:** Fee Estimator supports multiple backend algorithms, with a built-in fallback mechanism to ensure greater reliability.
- **Priority Modes:** Rather than relying on specific block numbers or time units, the estimator operates with four priority modes:
  - No Priority
  - Low Priority
  - Medium Priority
  - High Priority

## How It Works

The Fee Estimator works through a well-designed system that:

- Analyzes transaction pool data and historical information to provide fee rate estimates.
- Uses a fallback algorithm for newly started nodes that lack sufficient historical data.
- Automatically switches to the fallback algorithm if the primary algorithm encounters errors.

Fee Estimator currently supports two backend algorithms:

- **Confirmation Fraction:** Adapted from Bitcoin’s [estimatesmartfee RPC](https://bitcoincore.org/en/doc/0.16.0/rpc/util/estimatesmartfee/)
- **Weight-Units Flow:** A variant of the [Weight-Units Flow Fee Estimator for Bitcoin](https://bitcoiner.live/?tab=info).

To enable the Fee Estimator, the CKB node operator needs to specify the backend algorithms and activate the "Experiment" JSON-RPC API module in the CKB Node Configuration (`ckb.toml`). As shown below:

Specify the algorithm in `ckb.toml`:

```toml
[fee_estimator]
# Specifies the fee estimate algorithm. Current options: ConfirmationFraction, WeightUnitsFlow.
algorithm = "WeightUnitsFlow"
```

Enable the JSON-RPC API module `Experiment`:

```bash
[rpc]
# List of API modules: ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment", "Debug", "Indexer"]
modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment", "Debug", "Indexer"]
```

Once the CKB node is started, users can estimate the fee rate by making an RPC request:

```bash
echo '{ "id": 1, "jsonrpc": "2.0", "method": "estimate_fee_rate", "params": [] }' \
    | curl -s -H "Content-Type: application/json" -d @- "http://localhost:8114" \
    | jq
```

Example response:

```json
{
  "jsonrpc": "2.0",
  "result": "0x3e8",
  "id": 1
}
```

## Technical Implementation

### 1. **Confirmation Fraction**

Inspired by Bitcoin’s `estimatesmartfee` RPC, the **Confirmation Fraction** algorithm estimates transaction fees based on the probability of transaction confirmation within a specified time frame.

The algorithm works by categorizing transactions into fee-rate buckets. For each bucket, the ‘committed rate’ is calculated. The algorithm then traverse these buckets in ascending order of fee rate. The goal is to identify the best buckets by considering the cumulative committed rate of all transactions in the buckets with a fee rate less than or equal to the current traversing bucket meets or exceeds a target value. When the accumulated transaction backlog in the selected best buckets exceeds half of the total backlog in those buckets, the fee rate is selected.

This estimator requires a substantial amount of transaction history and tracks the rate of transactions moving through the pool, while accounting for transaction backlog to ensure the chosen fee rate is appropriate.

### 2. **Weight-Units Flow**

Based on a non-official Bitcoin algorithm, **Weight-Units Flow** focuses on the overall flow of transactions in and out of the transaction pool, rather than individual transaction commit status.

The algorithm categorizes transactions into fee-rate buckets, calculating the current weight and flow rate of transactions in each bucket. It then predicts how much weight will be added or removed over a specific time period, estimating the final weight of all transactions in the buckets with a fee rate greater than or equal to the current bucket as all buckets are traversed in descending order. If the final weight is less than or equal to zero, it indicates that transactions with that fee rate are flowing out of the pool faster than they are flowing in.

This method heavily relies on historical data, particularly to predict transaction congestion and how it will evolve over time. By analyzing transaction flow and adjusting based on future conditions, the algorithm provides a estimate of the likelihood that a transaction will be included in the next block.

### 3. **Fallback Estimator**

The **Fallback Estimator** provides a basic fee estimate when the primary backend algorithm fails. It operates under two key assumptions:

- All current transactions in the transaction pool will eventually be proposed.
- No new transactions will be added to the transaction pool.

The estimator uses the current state of the transaction pool to quickly generate a fee estimate. Although less precise than the backend algorithms, it ensures that a fee estimate is always returned, even in failure scenarios.

## Current Limitations

Developers should be aware of the following limitations:

- Chain-style transactions, where the previous transaction’s output serves as the input of the next, may affect estimation accuracy.
- Results rely on network conditions and available historical data, so short-term on-chain fee rate fluctuations have minimal impact on estimates.

## Best Practices for Developers

- Always implement error handling for cases where fee estimation might fail.
- Consider using the fallback mechanism to ensure more reliable results.
- Monitor network conditions when integrating fee rate estimation into your applications.

This Fee Estimator marks a significant step forward in improving transaction fee prediction on CKB, helping developers create more efficient and user-friendly applications.

## Resources

For more information on the Fee Estimator, visit the PR:

- [https://github.com/nervosnetwork/ckb/pull/4477](https://github.com/nervosnetwork/ckb/pull/4477)
