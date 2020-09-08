---
id: mint-sudt-via-contract
title: Mint SUDT via Contract
---

*Authored by [Wenchao Hu](https://github.com/huwenchao)*

[Simple User Defined Tokens(Simple UDT or SUDT)](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333) is a simple specification which provides a way for dapp developers to issue custom tokens on Nervos CKB.

It may be familiar for users to use `SECP256K1/blake160` and `SECP256K1/multisig` to guard tokens, just like what we do with CKB. But how can we mint sUDT via contract?

We encountered this problem when we are developing [toCKB](https://github.com/nervosnetwork/toCKB), a trustless way maps assets on other blockchains to CKB. Here we will share a pattern to do this.

## SUDT review

Let's recall the SUDT spec first before we dig into the mint programming pattern.

> A SUDT cell in Simple SUDT specification looks like following:

> ```
> data:
>     amount: uint128
> type:
>     code_hash: simple_udt type script
>     args: owner lock script hash (...)
> lock:
>     <user_defined>
> ```

> The following rules should be met in a SUDT Cell:

> - Simple UDT Rule 1: a SUDT cell must store SUDT amount in the first 16 bytes of cell data segment, the amount should be stored as little endian, 128-bit unsigned integer format. In the case of composable scripts, the SUDT amount must still be located at the initial 16 bytes in the data segment which corresponds to the composed SUDT script
> - Simple UDT Rule 2: the first 32 bytes of the SUDT cell’s type script args must store the lock script hash of owner lock.
> - Simple UDT Rule 3: each SUDT must have unique type script, in other words, 2 SUDT cells using the same type script are considered to be the same SUDT.

> User shall use any lock script as they wish in the SUDT Cell.

You can find more details [here](https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333).

The owner lock script hash in type args specify the owner. As long as the lock script shows in transaction inputs, we should consider it as `owner mode`. In owner mode, the SUDT script will not check the equality of amount between inputs and outputs, which means we can mint or burn token in this mode.

If we use `SECP256K1/blake160` as SUDT type args lockscript, the one who has the associated private key can mint this token.

If we use `SECP256K1/multisig` as SUDT type args lockscript, the majority of the committee can mint this token.

If we want to mint token via contract, we should translate our contract logic into a lockscript.

## lockscript as contract

On CKB, contracts are scripts which will be run during the transaction.

If our business is stateless, we can use a single lockscript to do this.
For example, if you want to crate a new token, any one who provides the answer to life, the universe and everything can be the token owner.
We can use a lockscript like below as our token args:

```
let arg = load_first_witness();
if arg == 42 {
    return 0;
} else {
    return 1;
}
```

If you create and publish this token, anyone can compose a transaction, provide `42` as the first witness to enter the owner mode, mint or burn any amount of token as they wish.

More often our business logics are associated with some states.
E.g. in a uniswap like DEX, when someone deposit some liquidity, the contract mint liquidity token, in a cross chain bridge, when someone relay a legal spv proof to the contract, the contract mint the mirror token. How can we achieve this?

We can delegate the verify logic of the lockscript to a typescript, use the cell data as our state and verify the state transfer in the typescript.

Let's go through a simple example to see how to do this.

## simplified ETH bridge

Let's take a simplified ETH bridge as an example.
When someone relays a spv proof which indicates he locks some token into the bridge contract on ETH, we mint the mirror token(we can name it cETH) on CKB.

We will need 3 scripts here:
- A eth-bridge-typescript to handle the spv proof verification logic.
- A eth-bridge-lockscript to be used as SUDT typescript args and delegate the verify logic to eth-bridge typescript.
- A SUDT typescript which represents cETH.

The transaction structure which mints cETH is like below:

```
Inputs:
    eth-bridge-cell:
        Type:
            code: eth-bridge-typescript
            args: id
        Lock:
            code: eth-bridge-lockscript
            args: eth-bridge-typescript-code-hash
        Data:
            eth_light_client_data
            records: [(block_hash, tx_index)]
    provide-capacity-cell
        Type: None
        Lock: <User Lockscript>
Outputs:
    eth-bridge-cell:
        Type:
            code: eth-bridge-typescript
            args: id
        Lock:
            code: eth-bridge-lockscript
            args: eth-bridge-typescript-code-hash
        Data:
            eth_light_client_data
            records: [(block_hash, tx_index)]
    cETH-token-cell:
        Type:
            code: SUDT-typescript
            args: eth-bridge-lockscript-hash
            data: amount
        Lock:
            <User Lockscript>
Witnesses:
    0: eth-spv-proof
    1: signature to unlock provide-capacity-cell
```

The scripts verify logics below:
- eth-bridge-typescript
    - ensure the spv proof in associated witness is valid
    - ensure the handled spv proof is recorded in the cell data to avoid using a single proof to mint cETH multiple times.
    - ensure the ETH amount locked on Ethereum equals the amount of cETH we mint
- eth-bridge-lockscript
    - ensure the associated eth-bridge-typescript represents in outputs, then we know the typescript script will be run in the transaction, it makes the logic delegation work

But we encountered a new problem.
We need the eth-bridge-typescript hash as the eth-bridge-lockscript args, then the eth-bridge-lockscript hash as SUDT-typescript args, but we need to know the cETH token script to check the token amount in eth-bridge-typescript. It we locate cETH token typescript by it's script hash, there will be a cycle dependency.

We can use `load_lockscript_hash` in eth-bridge-typescript and then check the entire script (which includes code_hash, args and type) part by part instead of cETH token script hash.

The pseudocode is like below:

```
let lockscript_hash = load_lockscript_hash(0, Source::Output);
for script in load_output_typescripts {
    if script.args = lockscript_hash \
        && script.code_hash = SUDT_CODE_HASH \
        && script.type = 0 {
        // This is a cETH token cell
    }
}
```

You can check the complete demo [here](https://github.com/huwenchao/mint-sudt-demo).
The [test file](https://github.com/huwenchao/mint-sudt-demo/blob/master/tests/src/tests.rs#L8) shows how to construct a mint transaction using this pattern.
