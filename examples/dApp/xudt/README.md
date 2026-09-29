# Issue & Transfer Custom Tokens

This is a simple dApp example to show how to issue and transfer custom tokens on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/dapp/create-token) to understand how it works and how to run it.

Start the local blockchain with `offckb node`. In another terminal, run `npm install` and `npm start` from this directory. Before starting the app, `npm start` exports the local OffCKB Devnet scripts and updates only the `devnet` section of `system-scripts.json`. If the export fails or is missing the secp256k1 signing script or xUDT script, startup stops without replacing the existing configuration. This refresh does not reset the blockchain.

Use `npm run sync:devnet` to refresh the configuration separately, or `npm run start:testnet` to start on Testnet without refreshing Devnet scripts. Run `npm test` to check the synchronization behavior.
