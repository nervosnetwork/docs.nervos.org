---
title: "Introduction to CKB Script Programming 6: Type ID"
date: "2020-02-03"
slug: intro-to-ckb-script-programming-6
authors:
  - name: Xuejie Xiao
    title: blockchain engineer at Cryptape
    url: https://xuejie.space/about/
---

You might noticed there's a `hash_type` field in CKB's Script structure. For simplicity, we've been ignoring that till now. This post will provide an introduction to the `hash_type` field, and the unique capability it can bring.

# Problem

In the blockchain space, there's a pair of issues that everyone has to pick sides:

### Upgradability

Can I upgrade a smart contract after it's deployed on the blockchain? Suppose a smart contract gets widely adopted, then all of a sudden, someone notices a bug in the smart contract(sadly this will always happen in our industry), can we upgrade the smart contract to a fixed version without affecting all the users?

A different scenario: as technology advances, there might be new algorithms that could be leveraged to build smart contracts that run faster. Can we upgrade existing smart contracts to benefit more users?

### Determinism

This one has 2 parts:

- Determinism A: if I pick a smart contract to guard my tokens, will my tokens stay safe(could be unlocked by me and only by me) in the future?
- Determinism B: if I sign a transaction now, and send it later, will my transaction still be accepted by the blockchain?

Note that a secure blockchain has more deterministic requirements than those mentioned here. I'm only including properties that relate to the discussed problem here.

### Conflicts

If we think about it, we could find that there're always conflicts between upgradability and determinism:

- If a smart contract could be upgraded, it might have different behaviors, hence enabling an attacker to unlock a cell, or disabling unlocking from the owner himself/herself.
- If a smart contract could be upgraded, an already signed transaction might run into different behaviors, resulting it be rejected by the blockchain.

Historically, there is only one side you can pick, and most existing blockchains have picked the side of determinism. The "code is law" idea thus becomes very famous in the blockchain space. But we all know software design is all about tradeoffs. Given certain situation, it might make sense to sacrifice slight determinism, in exchange for the ease of upgradability. For example, a large organization might have special security team monitoring potential vulnerabilities in smart contracts use by them. By granting them the ability to upgrade smart contracts, they have their own control in fixing vulnerabilities instead of waiting on someone. In the meantime, determinism property A won't be an issue for them since they are in charge of their own cells and smart contracts.

So now the question is: can we enable this new possibility in CKB? It turns out we can and this whole mechanism is already deployed in current mainnet CKB! But to understand the whole mechanism in CKB, we have to first take a look at some other ideas that support this mechanism.

NOTE: I'm sure you will ask: does this mean you will sacrifice determinism in CKB? Let me assure you this feature is totally optional in CKB, you can perfectly practice "code is law" principle in CKB like in other blockchains. We are just hoping this unique feature will provide new possibilities for people who really need it.

# Write A Unique Type Script

Let's first ask a question: how can we create a type script that ensures only one live cell in CKB can have that unique type script? By unique type script, we mean the whole type script structure, including code hash, hash type and args.

Note that this question might seem irrelevant to script upgradability right now, but please bear with me, we will see how it will contribute to the final solution in CKB.

Note if you have seen [my previous UDT article](../2019_09_06_introduction_to_ckb_script_programming_udt/), you might already realize there is a solution. But if you haven't, I do suggest to take a step back and think about how you can implement such a script on your own. It will be a really good learning experience.

If you are ready, here's the basic workflow of the script:

1. Count how many output cells use current type script, if there's more than one cell with current type script, returns a failure return code;
2. Count how many input cells use current type script, if there's one input cell with current type script, returns a success return code;
3. Use CKB syscall to read the first OutPoint in current transaction;
4. If the OutPoint data read match the `args` part of current type script, returns a success return code;
5. Returns a failure return code otherwise.

Putting in simple C code, the script would look like following:

```c
#include "blockchain.h"
#include "ckb_syscalls.h"

#define INPUT_SIZE 128
#define SCRIPT_SIZE 32768

int main() {
  uint64_t len = 0;
  int ret = ckb_load_cell(NULL, &len, 0, 1, CKB_SOURCE_GROUP_OUTPUT);
  if (ret != CKB_INDEX_OUT_OF_BOUND) {
    return -1;  /* 1 */
  }

  len = 0;
  ret = ckb_load_cell(NULL, &len, 0, 0, CKB_SOURCE_GROUP_INPUT);
  if (ret != CKB_INDEX_OUT_OF_BOUND) {
    return 0;  /* 2 */
  }

  /* 3 */
  unsigned char input[INPUT_SIZE];
  uint64_t input_len = INPUT_SIZE;
  ret = ckb_load_input(input, &input_len, 0, 0, CKB_SOURCE_INPUT);
  if (ret != CKB_SUCCESS) {
    return ret;
  }
  if (input_len > INPUT_SIZE) {
    return -100;
  }

  unsigned char script[SCRIPT_SIZE];
  len = SCRIPT_SIZE;
  ret = ckb_load_script(script, &len, 0);
  if (ret != CKB_SUCCESS) {
    return ret;
  }
  if (len > SCRIPT_SIZE) {
    return -101;
  }
  mol_seg_t script_seg;
  script_seg.ptr = (uint8_t *)script;
  script_seg.size = len;

  if (MolReader_Script_verify(&script_seg, false) != MOL_OK) {
    return -102;
  }

  mol_seg_t args_seg = MolReader_Script_get_args(&script_seg);
  mol_seg_t args_bytes_seg = MolReader_Bytes_raw_bytes(&args_seg);

  if ((input_len == args_bytes_seg.size) &&
      (memcmp(args_bytes_seg.ptr, input, input_len) == 0)) {
    /* 4 */
    return 0;
  }
  return -103;
}
```

As explained in the UDT post, attackers will be prevented in several different directions:

1. If an attacker tries to create a cell with the exactly same type script, there will be 2 cases:
   a. A valid transaction will have different OutPoint data in the first input from the type script args;
   b. If the user tries to duplicate type script args as the first transaction input, CKB will signal a double-spent error;
2. If the attacker tries to use a different type script args, it will be a different type script by definition.

This way, we can ensure a cell will have unique type script across all live cells in CKB. Considering each script has an associated hash, we will have a cell in CKB with its unique hash, or unique ID.

# Resolving Scripts in CKB Transaction

Now let's look at how CKB resolves the script to run before the `hash type` change:

- CKB extracts `code hash` value from the script structure to run.
- It loops through all dep cells, computes the hash of each dep cell data. If any dep cell data hash matches the specified `code hash`, CKB uses the data in the found dep cell as the script to run.
- If no dep cell has data hash matching specified `code hash`, CKB results in a validation error.

The upgradability problem, in fact lies in the way we test for dep cells. Right now we are testing against data hash, and when a script is upgraded, a different hash will be generated, the matching would fail. That brings a question: can we test for dep cells using a different solution? Is there something that can stay unchanged when the script is changed? Considering the actual script to run lives in a cell, we can rephrase the question in a different way:

Is there something that can stay unchanged when a cell's data get updated?

We can use a script structure! Since lock script is typically used for signature verification, we can use a type script for this problem. A type script can stay perfectly unchanged when a cell's data get changed. Hence we added `hash type` field to CKB's script structure, and modified the script resolving flow to the following:

- For each dep cell, we extract the `test hash` based on `hash type` value in the script structure:
  - If `hash type` is `data`, the dep cell's data hash is used as `test hash`
  - If `hash type` is `type`, the dep cell's type script hash is used as `test hash`
- CKB extracts `code hash` and `hash type` values from the script structure to run
- If CKB finds a dep cell whose `test hash` matches specified `code hash`, CKB uses the data in the found dep cell as the scrip to run.
- If no dep cell has `test hash` matching specified `code hash`, CKB results in a validation error.

Notice the `hash type` used here, is the value belonging to the script to run, not the values of scripts in a dep cell. You could perfectly have 2 inputs in a transaction, one using `data` as `hash type`, the other using `type` as `hash type`. Either one of them will use its own correct way to locate the correct cell.

This way we have totally conquered determinism property A above, but for property B there will be some subtle affects, we will discuss those in more details below.

# Putting Everything Together

There's still one problem unsolved, there might still be an attack:

- A lock script L1 is stored in a cell C1 with type script T1
- Alice guards her cells via lock script L1 using `hash type` as `type`, by definition, she fills her script structure's `code hash` field with the hash of type script T1
- Bob creates a different cell C2 with a always success lock script L2, and also use the same type script T1
- Now Bob can use C2 as a dep cell to unlock Alice's cell. CKB won't be able to distinguish that Alice wants to use C1, while Bob provides C2. Both C1 and C2 use T1 as type script

That teaches us a very important lesson: if you build a lock/type script and want people to leverage the upgradability property, you have to make sure to use a type script that is unique and unforgeable.

Luckily, we just solved this problem! In the above we just developed a type script that can provide a unique type script hash in CKB. Combined together, this unique type script and `hash type` feature in CKB provide a way to upgrade already deployed smart contracts.

# Chicken Egg Problem

You might have noticed that CKB already implements such a script, named a [type ID](https://github.com/nervosnetwork/ckb/blob/2145e4e3adee46670b3c9411c4ac547fc76e3a23/script/src/type_id.rs) script. But unlike the other system scripts, this one is implemented purely in Rust outside of CKB VM. I'm sure you will have this rant: you said CKB VM is flexible, don't you?

I do have made that claim in many different occasions, and in fact I've shown you above a way to implement the type ID logic in C code that could be compiled and run in CKB VM. But the problem here, is that we are at a chicken-egg situation: if we implement the type ID script, should we make it upgradable? If so, what should we put in as its type script? And if it's not upgradable, how can we make sure it's free from bugs and all the other vulnerabilities?

We thought hard on this question, and it really seems the easiest and safest solution, is to implement the type ID script via pure Rust, so we can deal with any potential situations in a more mature and experienced way.

But unlike some other chains which keep provide discounts for builtin smart contracts, we do set a very large cycle cost on the type ID script to discourage the use of the builtin script. At mainnet, it is now set as 1 million cycles. This is much much larger than the same logic implemented on CKB VM, we are hoping one day there will be fully vetted and secure type ID script that everyone will use instead of using this builtin type ID script.

# Trust Issue

We do want to mention this new feature is not without its drawbacks. You should really understand how it works and the tradeoffs involved before using it. This section tries to discuss all those considerations, but I do want to warn you it might still miss something, and you should use your own judgments.

## Determinism Property A

The type ID solution does provide a way to solve property A: when a bug is discovered, it's possible to fix the smart contracts without affecting existing cells using the same smart contracts. But it does require certain considerations:

### Ownership

With a type ID solution, people might be able to steal your coin by hacking the cell containing smart contracts you use. Since typical cells are guarded by only one or more signatures, some human errors could cause major problems. Fundamentally, it's a tradeoff situation:

1. For the truly paranoid ones, they might want to stick to the old way of referencing a script via its own hash, not the type script hash of the containing cell. The "code is law" principle is fully enforced here. You will know exactly what can be used to unlock your cell, and it won't change anytime in the future.
2. For people willing to sacrifice a little bit, they can gain the ability to upgrade existing smart contracts for different benefits. But please do make sure to fully understand the lock script of the cell containing the script you use.

For example, if you look at the deployed system scripts in CKB's mainnet, they all use type ID setup, but they all have their lock script's code hash set to all zeros, meaning no one gets to change the lock script easily via a signature. We want to make sure there's a need to change the default lock script, it will be via a fork agreed upon by the whole community, after all IMHO it really is the whole Nervos community that _owns_ CKB :P

There is some initial ideas that you can use to guard the script contained in a cell. For example, in addition to type ID logic, the type script can also contains other logics to validate the actual script contained in its cell. For example, formal analysis methods might be used, or certain test cases can be provided in which the type script run the actual script against. Only when the analysis or the test cases pass, will one be able to change script contained in a cell. Though I must say this is just some priliminary ideas, much research and development work needs to be done to make this a reality.

### Availability

A different issue with type ID, is availability of the script. When you have a cell using a script with `hash type` set as `data`, you are not worried someone might destroy the used script, you can always redeploy the script on-chain then unlock your cell.

But with a type ID solution, if something bad happens, and the cell with matching type script hash is destroyed, your cell will be locked forever, since your might never be able to build a cell with the same type script hash. There are some methods you can use, such as restricting the ability to destroy a cell with a type ID script but they all just mitigate the problem, not completely solving the problem.

## Determinism Property B

We do want to mention that type ID does not provide a solution to property B. When you have a signed transaction, the behavior for this transaction won't be changed with the upgrade of one smart contract.

Though there is way that the type ID solution might affect an already signed transaction: if a transaction uses a script from cell, and the cell gets updated, the transaction will be render invalidated, since the cell referenced in the original OutPoint is already spent. But one could argue with the old referencing solution, this problem might also happen.

# Conclusion

So that's all I know about type ID at the moment :) It certainly has its drawbacks, but we do believe it can be proved very useful for certain users. For other users, this will be completely optional, and you are perfectly ignoring this feature at all. It's my hope that this new feature rarely seen in other blockchains, can provide a starting point to boost more possibilities.
