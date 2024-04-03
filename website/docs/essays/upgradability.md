---
id: upgradability
title: Upgradable CKB Contracts—Why And How
---

In the blockchain space, there's a pair of issues that everyone has to pick sides: upgradability vs determinism.

**Upgradability**

Can I upgrade a smart contract after it's deployed on the blockchain? 

Suppose a smart contract gets widely adopted, then all of a sudden, someone notices a bug in the smart contract (sadly this will always happen in our industry). Can we upgrade the smart contract to the fixed state without any user interventions?

Or, a different scenario: as technology advances, there might be new algorithms that make smart contracts run faster. Can we upgrade existing smart contracts with those benefits?

**Determinism**

This one has two aspects:

- Determinism A: if I pick a smart contract to guard my tokens, will my tokens stay safe (could be unlocked by me and only by me) in the future?
- Determinism B: if I sign a transaction now, and send it later, will my transaction still be accepted by the blockchain?

Note that a secure blockchain has more deterministic requirements than those mentioned here. I'm only including properties that relate to the discussed problem here.

**Conflict**

If we think about it, we could find that there're always conflicts between upgradability and determinism:

- New behaviors introduced through the upgradability of a smart contract can potentially lead to unexpected ways to unlock a cell, or preventing the owners from unlocking themselves.
- An already signed transaction might run into different behaviors through the upgradability of a smart contract, resulting it being rejected by the blockchain.

At first, some blockchains opt for determinism. [The "code is law" idea](https://www.harvardmagazine.com/2000/01/code-is-law-html) thus became very famous in the blockchain space. But we all know that software design is all about tradeoffs. Given a certain situation, it makes sense to slightly sacrifice determinism, in exchange for the ease of upgradability. For example, when a vulnerability is discovered, everyone would expect their fund to be safe. Having upgradable contracts would equip developers the ability to deploy fixed contracts without any user intervention. Gradually, more blockchains have started to adopt the side of upgradability.

But the problem remains. Upgradable contracts break the "code is law" principle, meaning that a cell can be unlocked in unexpected ways that were not considered when it was created. So now the question is: can we ask for both in CKB?

It turns out CKB does have support for both via a special contract. It grants the user a choice to choose between upgradability and determinism. One can use an upgradable contract that can be upgraded automatically for new features/fixes, while also locking their most precious tokens in a cell that only they themselves can unlock.

But to understand this very contract in CKB, we have to first take a look at some other ideas that support this behavior.

## **Write A Unique Type Script**

Let's start with a different question: how do we create a cell with a unique [type script](https://docs.nervos.org/docs/basics/glossary#type-script) data structure in CKB? In other words, we want to make sure that once a cell is created, no other cells can be created with the same type script.

Note that this question might seem irrelevant to script upgradability right now, but please bear with me, we will see later how it will contribute to the final solution in CKB.

It turns out that a special smart contract referenced via the type script of a cell, can perfectly validate the above requirement. I strongly recommend that you can give it a try first, to see how you would design such a cell. This can be a very good thought exercise. When you are ready, here's the rough workflow for such a contract:

1. Abort with a failure if more than one input cell in this transaction uses the current type script;
2. Abort with a failure if more than one output cell in this transaction uses the current type script;
3. When no input cells use the current type script, read the following two pieces of information:
  a. The OutPoint data structure from the first input cell in this transaction;
  b. The index of the first output cell using the current type script;
4. Hash the two pieces of information gathered in 3 together, if the resulting hash matches `args` part in current type script structure, return with success. Otherwise, abort with a failure.

A [C implementation](https://github.com/nervosnetwork/ckb-c-stdlib/blob/b51f9b1b6221398c76c6bb78d63a430d93e791bf/ckb_type_id.h) and a [Rust](https://github.com/axonweb3/ckb-type-id/blob/bf59996428c75cb419bba0177de3e091b96fa64d/src/lib.rs) one are both available for this workflow.

Attackers will be prevented from several different directions:

1. If an attacker tries to create a cell with the exactly same type script, there will be two cases:
  a. A valid transaction will have different OutPoint data in the first input, or different output cell index from when we first created this cell;
  b. If the user tries to duplicate type script args as the first transaction input, CKB will signal a double-spent error;
2. When the attacker tries to use a different type script args, it will be a different type script structure by definition.

This way, we can ensure a cell will have unique type script across all live cells in CKB. Considering the fact that each type script structure can also be hashed, a cell in CKB can thus have a unique hash, or unique ID.

## **Resolving Contracts in CKB Transaction**

The above newly designed smart contract will act as the core for building upgradable smart contracts. What's still missing here, is a clever use of CKB's contract resolving process:

- CKB first extracts `code hash`, and `hash type` value from the lock/type script structure to run. To avoid ambiguity, we will denote `code hash` gathered here as `running code hash`, and `hash type` as `running hash type`.
- For each dep cell in the current transaction, a `test hash` value will be calculated. Depending on the value of `running hash type`, there will be different ways to calculate `test hash`:
    - If `running hash type` is `type`, `test hash` will be the hash of type script data structure from the dep cell;
    - Otherwise, `test hash` will be the hash of cell data part from the dep cell;
- CKB then looks for a dep cell whose `test hash` matches `running code hash`. In the absence of such a cell, CKB results in a validation error.
- CKB uses the cell data from the located dep cell as the smart contract to run.

Upgradability of smart contract has to do with ways to reference a changeable cell containing different smart contracts. In the upgrade process, the OutPoint structure for a cell will change (updating a cell is essentially destroying the old cell, then creating a new one), the cell data will also change (since we will need to store the fixed smart contract). Then what property can stay unchanged? In CKB's universe, lock and type script can definitely stay the same when updating a cell. Since lock script is typically used to represent ownership, we can perfectly use type script here to reference an upgradable smart contract.

## **Putting Everything Together**

There's still one problem unsolved, a potential attack remains. Consider this:

- A lock script L1 is stored in a cell C1 with type script T1;
- Alice guards her cells via a lock script L1 using `hash type` as `type`. By definition, she fills her script structure's `code hash` field with the hash of type script T1;
- Bob creates a different cell C2 with the always-success lock script L2, and also use the same type script T1;
- Now Bob can use C2 as a dep cell to unlock Alice's cell. CKB won't be able to distinguish that Alice wants to use C1, while Bob provides C2. Both C1 and C2 use T1 as type script.

That teaches us a very important lesson: if you build a lock/type script and want people to leverage the upgradability property, you have to make sure to use a cell with an unique and unforgeable type script in CKB universe.

Luckily, we just solved this problem! In the above we just developed a smart contract ensuring type script uniqueness in CKB universe. Putting together, upgradable smart contracts in CKB can be archived by combining the very smart contract developed above, with CKB's ability to resolve contracts via type scripts.

## **Trust Issue**

We do want to mention that this design is not without its drawbacks. You should really understand how it works and the tradeoffs involved before using it. This section tries to discuss some known considerations related to this feature.

### **Determinism Property A**

Type ID does provide a solution to challenges with regards to Determinism Property A: when a bug is discovered, it's possible to fix the smart contracts without affecting existing cells using the same smart contracts. But it does require certain considerations.

#### **Ownership**

With a type ID solution, people might be able to steal your coin by hacking the cell containing smart contracts you use. Since typical cells are guarded by one or more signatures, some human errors could cause major problems. Fundamentally, it's a tradeoff situation:

1. For those truly paranoid, they might want to stick to the old way of referencing a script via its own hash, not the type script hash of the containing cell. The "code is law" principle is fully enforced here. You will know exactly what can be used to unlock your cell, and it won't change anytime in the future.
2. For people willing to sacrifice a little bit, they can gain the ability to upgrade existing smart contracts for different benefits. But please do make sure to fully understand the lock script of the cell containing the script you use.

For example, if you look at the deployed system scripts in CKB's mainnet, they all use type ID setup, but have all their lock scripts’ code hash set to zeros, meaning that no one gets to change the lock script easily via a signature. We want to make sure that there's a need to change the default lock script, which will be realized via a fork agreed upon by the whole community. After all, IMHO, it really is the whole Nervos community that *owns* CKB :P

There are some initial ideas that you can use to guard the script contained in a cell. For example, in addition to type ID logic, the type script can also contains other logics to validate the actual script contained in its cell. For example, formal analysis methods might be used, or certain test cases can be provided in which the type script runs the actual script against. Only when the analysis or the test cases pass, will one be able to change script contained in a cell. Though I must say, these are just some preliminary ideas, much research and development work needs to be done to make this a reality.

#### **Availability**

A different issue with type ID, is the availability of the script. When you have a cell using a script with `hash type` set as `data`, you are not worried someone might destroy the used script, you can always redeploy the script on-chain then unlock your cell.

But with a type ID solution, if something bad happens, and the cell with matching type script hash is destroyed, your cell will be locked forever, since you might never be able to build a cell with the same type script hash. There are some methods you can use, such as restricting the ability to destroy a cell with a type ID script, but they all just mitigate the problem, not completely solving it.

### **Determinism Property B**

We do want to mention that type ID does not provide a solution to property B. When you have a signed transaction, the behavior of this transaction won't be changed with the upgrade of one smart contract.

Though there is way that the type ID solution might affect an already signed transaction: If a transaction uses a script from a cell that gets updated, the cell referenced in the original OutPoint is already spent and the transaction will become invalid. But it could be argued that with the old referencing solution, this problem might also occur.

## **Conclusion**

The above design of upgradable smart contracts has already seen wide usage in mainnet CKB now. Feel free to let us know your thoughts on this feature :)
