# Tutorial Dapp Templates

The Dapp templates often involve interaction with some most useful smart contracts on CKB like xUDT/Spore/Omnilock. Not only can these templates run on CKB Testnet, but also can be initialized as development projects targeting local Blockchain with the help of our CLI tool [offckb](https://github.com/RetricSu/offckb). And the best thing is they come with full detailed tutorial documents!

## Add Dapp templates

Assuming you are trying to add a new template named `my-awesome-template`:

1. add your typescript project to the docs site's example folder: `https://github.com/nervosnetwork/docs.nervos.org/tree/develop-v2/examples/my-awesome-template`
2. copy `templates/ckb.ts` and `templates/config.json` from `offckb` Github repo into your project
   - `cp offckb/templates/ckb.ts docs.nervos.org/examples/my-awesome-template`
   - `cp offckb/templates/config.json docs.nervos.org/examples/my-awesome-template`
3. finish your `my-awesome-template` with `ckb.ts`, use `offckb` to start a devnet
4. once your project is ready on the local Blockchain, rewrite the `ckb.ts` file to support CKB Testnet
5. update the `options.json` file: `https://github.com/nervosnetwork/docs.nervos.org/tree/develop-v2/examples/options.json`
6. done

## Template Pattern

All Dapp templates must meet the requirements:

- Dapp must be able to run on the CKB Testnet by default
- Dapp must be able to be initialized with `offckb` to run on devnet
  - place a `ckb.ts` file in your root folder to manage CKB chain config like RPC URLs.
  - use `ckb.ts` to export the `lumosConfig`
