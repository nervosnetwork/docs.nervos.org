# Simple Lock

An educational CKB dApp that deploys a JavaScript hash-lock contract, creates a hash-lock address, and spends cells by revealing a preimage.

> This contract proves knowledge of a secret, not ownership. The preimage becomes public when used, so do not use it with valuable funds. The runnable flow supports Devnet and Testnet.

## Prerequisites

- Git
- Node.js 18.18 or later
- pnpm
- OffCKB
- Rust and `ckb-debugger`
- protobuf if installing `ckb-debugger` reports `Could not find protoc`

Install `ckb-debugger` with `cargo install ckb-debugger`. On macOS, install protobuf with `brew install protobuf`. On Windows, ensure the npm global bin directory and Cargo bin directory are in `PATH`, approve required pnpm build scripts if prompted, and keep the project in a path without `#`.

First-time setup can take 30–45 minutes because `ckb-debugger` compiles locally. Once tools are installed, the tutorial usually takes 10–15 minutes.

## Devnet Quick Start

In one terminal:

```bash
pnpm install
offckb node
```

Keep the Devnet running. In a second terminal, return to this directory and run:

```bash
pnpm run deploy -- --network devnet
cd frontend
pnpm dev
```

The deploy command builds the contract, deploys `dist/hash-lock.bc`, refreshes the selected network's system-script information, and validates and synchronizes both deployment files with the frontend. Synchronization failure makes deployment fail.

The frontend defaults to Devnet when `NEXT_PUBLIC_NETWORK` is unset. It verifies that both the deployed `hash-lock.bc` and `ckb-js-vm` OutPoints are live before enabling transfers.

## Testnet

Fund the deployer key with Testnet CKB, then run:

```bash
pnpm run deploy -- --network testnet --privkey 0x...
cd frontend
NEXT_PUBLIC_NETWORK=testnet pnpm dev
```

Current OffCKB supports direct deployment only to Devnet and Testnet, and its Mainnet system-script export does not provide the `ckb-js-vm` dependency this example needs. The deploy command reports that limitation directly instead of starting a deployment that cannot complete.

For Mainnet-state testing, use an isolated [OffCKB Mainnet fork](https://github.com/ckb-devrel/offckb) and follow its replay-risk guidance. This tutorial's frontend remains configured for Devnet and Testnet.

## Stale OutPoints

An OutPoint identifies one specific cell by transaction hash and output index. Redeploying, switching networks, or resetting Devnet invalidates old OutPoints. If the frontend reports a stale dependency:

1. Confirm `NEXT_PUBLIC_NETWORK` matches the network you deployed to.
2. Redeploy the contract for that network.
3. Confirm the contract and system-script files under `deployment/` match the copies under `frontend/deployment/`.
4. Restart the frontend and select **Check again**.

## Commands

```bash
pnpm build
pnpm test -- hash-lock.mock.test.ts --runInBand
pnpm test:deploy
pnpm --dir frontend build
```

Contract output is written to `dist/`. Deployment history is written under `deployment/<network>/hash-lock.bc/`.

## Security Model

The example intentionally returns change to the same hash lock. After the preimage is revealed, that change and any untouched cells using the same hash can be spent by anyone who knows it. A production transaction should use a signature-protected change address and stronger authorization.
