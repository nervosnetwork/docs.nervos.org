# View & Transfer Balance

This is a simple Dapp example to show how to issue and transfer custom tokens on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/dapp/create-token) to understand how it works.

## How to run

```sh
git clone https://github.com/nervosnetwork/docs.nervos.org.git
cd docs.nervos.org/examples/xudt
yarn && yarn start
```

### On Testnet

```sh
export NETWORK=testnet
cd xudt
yarn start 
```

### On Devnet

Use a CLI tool [`offckb`](https://github.com/ckb-ecofund/offckb) to start a CKB devnet:

```sh
npm install -g offckb

# start the devnet
offckb node 
```

start the app:

```sh
export NETWORK=devnet
cd xudt
yarn && yarn start
```
