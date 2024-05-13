# Write & Read On-chain Message

This is a simple Dapp example to show how to write and read data on the CKB blockchain. Read the step-by-step [tutorial](https://docs.nervos.org/docs/dapp-tutorials/write-message) to understand how it works.

This example is originally modified from [hello, CKB](https://github.com/cryptape/ckb-tutorial) by [@Flouse](https://github.com/Flouse).

## How to run

```sh
git clone https://github.com/nervosnetwork/docs.nervos.org.git
cd docs.nervos.org/examples/write-and-read-message
yarn && yarn start
```

### On Testnet

```sh
export NETWORK=testnet
cd write-and-read-message
yarn start 
```

### On Devnet

Use a CLI tool [`offckb`](https://github.com/RetricSu/offckb) to start a CKB devnet:

```sh
npm install -g offckb

# start the devnet
offckb node 
```

start the app:

```sh
export NETWORK=devnet
cd write-and-read-message
yarn && yarn start
```
