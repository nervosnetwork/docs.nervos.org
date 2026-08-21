# Simple Lock Frontend

The Next.js frontend derives a hash-lock address from a preimage, checks its live capacity, and builds an unlock transaction.

## Run

The root deploy command automatically copies the selected contract and system-script artifacts into this directory.

```bash
# Devnet is the default
pnpm dev

# Testnet
NEXT_PUBLIC_NETWORK=testnet pnpm dev
```

Only `devnet` and `testnet` are accepted because current OffCKB Mainnet artifacts do not include the required `ckb-js-vm` dependency. Restart the frontend after changing networks or redeploying.

## Deployment Health

Before enabling transfers, the page checks that both dependency OutPoints are live:

- the deployed `hash-lock.bc` cell;
- the network's `ckb-js-vm` cell.

If either is missing, redeploy for the active network and confirm both JSON files here match their counterparts in the root `deployment/` directory.

## Transaction States

The UI reports `submitting`, `pending`, `committed`, or `failed` and keeps the transaction hash. A timeout does not prove failure; check the node with the transaction hash before submitting again.

## Educational Warning

The transaction deliberately sends change back to the revealed hash lock. Once the preimage is public, returned change and other cells using that hash are unsafe. This behavior is retained to teach the limitation; production applications should send change to a signature-protected address.
