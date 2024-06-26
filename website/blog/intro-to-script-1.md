---
title: "Introduction to CKB Script Programming 1: Validation Model"
date: "2019-07-05"
slug: intro-to-ckb-script-programming-1
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

As of now, the cell validation model in CKB has been more or less stablized, hence I'm starting a series of article introducing CKB script programming here. My goal here is to fill in all the missing implementation details one need to write CKB scripts after reading the whitepaper, so you can start exploring this beautiful wonderland CKB presents.

You might noticed that I call the code running on CKB as `script`, not `smart contract`. This is because smart contract is quite a confusing term to me, and I want to use a different word here to indicate CKB's unique programmability. A script in CKB's sense need not be just a script we see in scripting languages such as Ruby, JS, it actually refers to the RISC-V format binary you run on CKB VM.

This first post here, is dedicated to the brand [new verification model](https://github.com/nervosnetwork/ckb/pull/913) introduced in CKB v0.14.0. It might sound boring but I promise you this is the last post without actual examples to play with :P

Note even though I believe CKB's programming model is quite stable now, development is still happening so there might be changes. I will try my best to make sure this post is updated but if anything confuses you, this post is describing CKB's Lina mainnet version now.

# Overview

Below illustrates a real transaction on CKB:

![Transaction Example](/img/blog/tx.svg)

There are a lot of things going on in this graph, and we will come back to this graph again in later posts. Today, we will just focus on 2 entities in the cell data structure: `lock` and `type`.

```rust
pub struct CellOutput {
    pub capacity: Capacity,
    pub lock: Script,
    #[serde(rename = "type")]
    pub type_: Option<Script>,
}
```

From the data structure we can see that `lock` and `type` shared the same structure, later we can show that they are also executed in the same environment, the differences between them are just in a few tiny bits:

- `lock` is required, while `type` is optional
- Mentally, they are used to capture different use cases.

We will first start with `type` script here.

# Type Script

Note the name here is just a lucky accident, it is not related to the beloved [programming language](https://www.typescriptlang.org/).

If you think about it, a transaction on CKB(or most UTXO-based blockchains) just transforms one set of cells(or UTXOs) to another set of cells. What's interesting, is the actual transformation here. That's where we start to design CKB's verification model: how can we build a model to better validate the cell transformations?

That's where a `type` script comes in play: a type script is used to validate certain rules in the cell transformation phase. Some examples here include:

- Validating UDT(user defined token) balances to ensure no new token is invalidly issued.
- Ensuring a unique name is assigned to a cell that might be mutated. Note this is a fun one, please expect a future article dedicated entirely to this topic.
- Implementing economic constructs. In fact NervosDAO is completely implemented as a [type script](https://github.com/nervosnetwork/ckb-system-scripts/blob/66d7da8ec72dffaa7e9c55904833951eca2422a9/c/dao.c) with minimal support from the consensus layer.
- A bitcoin VM can be compiled to RISC-V binary, which can transform CKB into an alternative bitcoin implementation :)
- Keep in mind that in addition to data, cell can be used to store code as well, hence a type script can also be used to run tests on the code in cell to ensure certain behavior.

In a nutshell, type script can be used to capture any validation logic you need in the cell transformation. Combined with CKB's flexible virtual machine, I believe this will provide endless potentials.

# Lock Script

Type script captures the cell transformation logic, but there's still one thing missing from the picture: how can I guard my own cell from someone else? In other words, how can I ensure my tokens stay mine in an ever-changing world?

This is why we designed the always required lock script. A cell can only be consumed when the lock script can be executed sucessfully. This is different from type script, which might be totally optional. A lock script is always there to guard the security of a cell.

Typically, you would expect that a lock script contains a signature verification phase, like all the other blockchains do, but there are also brand new use cases unlocked by CKB:

- The actual signature algorithm is totally determined by the lock script, and you are free to use any lock script. That means you are free to incorporate any signature algorithms that suit your need. In the official CKB distribution we are including [secp256k1 algorithm](https://github.com/nervosnetwork/ckb-system-scripts/blob/66d7da8ec72dffaa7e9c55904833951eca2422a9/c/secp256k1_blake160_sighash_all.c) as the default lock script. But you don't have to use this, if someone implements a lock script using schnorr signature, you are more than welcome to use that one.
- In addition to signature verification, a lock script can also include other rules to unlock the cell as well. For example, I can configure my lock script to pass if the transaction contains an output cell that uses my lock script, but has more capacity than my consumed cell. This way when someone sends me capacity, they can consume my existing cell and create a new cell for me. They don't have to create a new cell for me like bitcoin requires.

In my personal opinion, the best part of CKB, is that a lock script created by the community is treated exactly the same way as the official default one. No priviledge is granted to the official scripts. Unlike some other blockchains, CKB provides the freedom to develop CKB scripts back to the whole community.

# Execution Model

Now let's see when lock and type scripts are executed.

## Back to the Example

Here's the transaction we see earlier again:

![Transaction Example](/img/blog/tx.svg)

For this example, the execution flow is as follows:

1. `Lock Script 1` is executed once.
2. `Lock Script 2` is executed once.
3. `Type Script 1` is executed once.
4. `Type Script 2` is executed once.

In later posts we can see both lock and type scripts are executed in the same environment, and both have access to the whole transaction. If any of the script fails, the whole transaction fails. Only when all the scripts succeed, the transaction is considered validated.

There're couple of points worth mentioning:

- Even though there are 2 input cells with `Lock Script 1`, it is only executed once, it's up to the actual lock script to locate all the input cells with the same lock script and validate both signature.
- Only lock scripts in input cells are executed in this transaction, for example, `Lock Script 3` is not executed here.
- Even though an input cell and an output cell both contain `Type Script 1`, it is only executed once.
- Type scripts in both input and output cells are executed, which include `Type Script 1` and `Type Script 2`.
- Some cells do not have type scripts, in this case we just omit the execution.

## Rules

Now to summary the rules:

- Lock scripts in input cells are collected and deduped, each unique lock script is executed and only executed once.
- Type scripts in input and output cells(if existed) are collected together and deduped, each unique type script is executed and only executed once.
- If any script fails, the whole transaction validation fails.

# What's Next

Now that cell model is covered, we will look at how to actual write a CKB VM script in the next post. The default secp256k1 lock script will be examined to show the life of a CKB VM script.
