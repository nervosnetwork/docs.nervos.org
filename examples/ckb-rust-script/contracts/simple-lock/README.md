# simple-lock (Rust)

This is the Rust implementation of the `hash-lock` contract, demonstrating the same 
logic as the [dApp/simple-lock JavaScript tutorial](https://github.com/nervosnetwork/docs.nervos.org/tree/develop/examples/dApp/simple-lock).

## Overview

The `hash-lock` contract is a simple toy lock for learning purposes:
- **Args**: Stores a hash (32 bytes)
- **Witness**: Provides the preimage
- **Validation**: Unlocks if `blake2b_256(preimage) == hash`

> **Note**: This is for educational purposes only. Do not use for production assets.

## Build

```bash
make build
```

## Test

```bash
make test
```
