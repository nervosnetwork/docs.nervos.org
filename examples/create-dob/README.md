# View & Transfer Balance

This is a simple Dapp example to show how to create and view digital objects on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/getting-started/create-dob) to understand how it works.

## How to run

### On Testnet

By default, this example can be cloned and directly run on the [CKB Testnet](https://pudge.explorer.nervos.org/):

```sh
git clone https://github.com/nervosnetwork/docs.nervos.org.git
cd docs.nervos.org.git/examples/create-dob
yarn && yarn start
```

### On Devnet

It can also run on the local Blockchain, aka a CKB Devnet. To do this, you need to update the Lumos config defined in the `ckb.ts` file and related codes. Another way to automatically cover these steps is to install and use a CLI tool [`offckb`](https://github.com/RetricSu/offckb).

```sh
npm install -g offckb

# start the devnet
offckb node 

# init project
offckb init my-dob
# select the templates for create-on-chain-digital-objects to get initialized
# ...

# start the app
cd my-dob
yarn && yarn start
```
