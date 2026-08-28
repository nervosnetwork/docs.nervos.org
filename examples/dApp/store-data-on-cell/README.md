# Store Data on Cell

This dApp writes a UTF-8 message to a CKB Cell and reads it back after the transaction is committed. Read the [step-by-step tutorial](https://docs.nervos.org/docs/dapp/store-data-on-cell) for an explanation of the code.

## Prerequisites

- Node.js 20 or later
- [OffCKB](https://docs.nervos.org/docs/sdk-and-devtool/offckb)

## Run on Devnet

Start the local chain in one terminal:

```bash
offckb node
```

Keep that terminal open. In a second terminal, run:

```bash
npm install
npm start
```

`npm start` refreshes the local system-script references from OffCKB before launching the frontend. Open [http://localhost:1234](http://localhost:1234). The dApp defaults to Devnet and connects to the OffCKB RPC proxy at `http://127.0.0.1:28114`.

After you select **Write**, the dApp waits for the new Cell to become live before enabling **Read**. If confirmation times out, select **Check again** to retry the lookup without submitting another transaction.

## Run on Testnet

Create and fund a separate Testnet account, then run:

```bash
npm run start:testnet
```

Enter the funded Testnet private key in the dApp. Never use a Mainnet private key or Mainnet assets in this example.

## Troubleshooting

- **`offckb: command not found`:** If you use nvm, select the Node.js version where OffCKB was installed, or reinstall OffCKB for the active version.
- **`Failed to fetch`:** Confirm `offckb node` is still running and the dApp reports `devnet · http://127.0.0.1:28114`.
- **Wrong page or port:** Open the dApp at `http://localhost:1234`. Port `28114` is the RPC endpoint and does not serve the dApp UI.
- **Port or database lock error:** Stop duplicate OffCKB processes, then run `offckb node` again.
- **`TransactionFailedToResolve` or an unknown CellDep:** Run `npm start` again after an OffCKB upgrade or Devnet reset so the example synchronizes its system-script references with the initialized Devnet.
- **Confirmation timed out:** Select **Check again** to retry the same transaction. Do not select **Write** again unless you intend to submit another message.
- **Parcel native binary error:** Switch to Node.js 20, remove `node_modules`, and run `npm install` again.

This example is originally modified from [hello, CKB](https://github.com/cryptape/ckb-tutorial) by [@Flouse](https://github.com/Flouse).
