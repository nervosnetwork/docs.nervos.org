---
id: Chains
title: Chains
---

## Lina Mainnet

- **ckb version**: >= v0.25.2 (latest stable is recommended)
- **genesis hash**: 0x92b197aa1fba0f63633922c61c92375c9c074a93e85963554f5499fe1450d0e5
- **init command**: `ckb init --chain mainnet`
- **launched at**: 2019-11-15 21:11:00 UTC

## Aggron Testnet v4

- **ckb version**: >= v0.32.0 (latest stable is recommended)
- **genesis hash**: 0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606
- **init command**: `ckb init --chain testnet`
- **launched at**: 2020-05-22 04:00:00 UTC

The Testnet will use a different PoW function. It requires version v0.32.0 or above.

If you want to test Eaglesong, please start a dev chain and change the PoW function to Eaglesong.

First initialize a dev chain with a test miner account:

```
// Replace 0x5406f5abe8e3a7eba641f79556688c226d...... with your own pubkey hash
ckb init -c dev --ba-arg 0x5406f5abe8e3a7eba641f79556688c226d......
```

Edit `specs/dev.toml` and change to last line to

```
func = "Eaglesong"
```

Edit `ckb-miner.toml` and change the whole `[[miner.workers]]` section to

```
[[miner.workers]]
worker_type = "EaglesongSimple"
threads     = 1
```
