# View & Transfer Balance

This is a simple Dapp example to show how to issue and transfer custom tokens on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/docs/getting-started/create-token) to understand how it works.

## How to run

### On Testnet

By default, this example can be cloned and directly run on the [CKB Testnet](https://pudge.explorer.nervos.org/):

```sh
git clone https://github.com/nervosnetwork/docs.nervos.org.git
cd docs.nervos.org.git/examples/xudt
yarn && yarn start
```

### On Devnet

It can also run on the local Blockchain, aka a CKB Devnet. To do this, you need to update the Lumos config defined in the `ckb.ts` file and related codes. Another way to automatically cover these steps is to install and use a CLI tool [`offckb`](https://github.com/RetricSu/offckb).

```sh
npm install -g offckb

# start the devnet
offckb node 

# init project
offckb init my-xudt
# select the templates for xudt to get initialized
# ...

# start the app
cd my-xudt
yarn && yarn start
```
