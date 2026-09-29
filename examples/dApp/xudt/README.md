# Issue & Transfer Custom Tokens

This is a simple dApp example to show how to issue and transfer custom tokens on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/dapp/create-token) to understand how it works and how to run it.

Run `npm install` and `npm start` from this example directory with `offckb node` running in another terminal. The app defaults to Devnet when `NETWORK` is unset. To switch to Testnet, stop the app and run `npm run start:testnet`. Use a separate Testnet-only account funded with test CKB.

`npm start` refreshes the Devnet section of `system-scripts.json` from your local OffCKB setup before launching the app. If the export fails or the result is missing required scripts, startup stops without replacing the existing configuration. This refresh does not reset the blockchain. Testnet startup skips this refresh. You can also run `npm run sync:devnet` separately, and `npm test` to check synchronization behavior.
