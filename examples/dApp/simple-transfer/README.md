# View & Transfer Balance

This is a simple dApp example to show how to view and transfer balance on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/dapp/transfer-ckb) to understand how it works and how to run it.

Run `npm install` and `npm start` from this example directory with `offckb node` running in another terminal. The app defaults to Devnet when `NETWORK` is unset. To switch to Testnet, stop the app and run `npm run start:testnet`. Use a separate Testnet-only account funded with test CKB.

`npm start` refreshes the Devnet section of `system-scripts.json` from your local OffCKB setup before launching the app. Startup stops if the export fails or required scripts are missing. Testnet startup skips this refresh. You can also run `npm run sync:devnet` separately, and `npm test` to check synchronization behavior.
