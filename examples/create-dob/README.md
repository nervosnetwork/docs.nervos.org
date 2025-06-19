# View & Transfer Balance

This is a simple Dapp example to show how to create and view digital objects on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/dapp/create-dob) to understand how it works.

## How to run

```sh
git clone https://github.com/nervosnetwork/docs.nervos.org.git
cd docs.nervos.org/examples/create-dob
yarn && yarn start
```

### On Testnet

```sh
export NETWORK=testnet
cd create-dob
yarn start 
```

### On Devnet

Use a CLI tool [`offckb`](https://github.com/ckb-devrel/offckb) to start a CKB devnet:

```sh
npm install -g @offckb/cli

# start the devnet
offckb node 
```

start the app:

```sh
export NETWORK=devnet
cd create-dob
yarn && yarn start
```
