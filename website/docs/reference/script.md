---
id: script
title: Script
---

CKB is dedicated to a brand new verification model：CKB VM is used to perform a series of validation rules to determine if transaction is valid given transaction's inputs and outputs. Every transaction represents a change of state transition, resulting in **cells transition**, the validation rules are included in cells' `lock script` and `type script` in the transaction.

Notes: we will distinguish between **script code** and **script**：

* **script code** refers to the program you write and compile to use on CKB which is the implementation of validation rules. 
* **script** refers to the script data structure used in `lock script` and `type script`.

## Data Structure

Both `lock script` and `type script` have the same type：**Script**

**Example：**

```
     "lock": {
        "hashType": "type",
        "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "args": "0xc285e812f6a35c2479d6f5b9bbaa357dd4e60da1"
      },
      "type": {
        "hashType": "data",
        "codeHash": "0xe7f93d7120de3ca8548b34d2ab9c40fe662eec35023f07e143797789895b4869",
        "args": "0x42b5561f13c2a8f7c710843bea7d179656dc6133a98b7d763cebc6e74c8ba72a"
      }
```

 
 A script has three fields：

*  `codeHash`: The hash of ELF formatted RISC-V binary that contains a CKB script. 
*  `hashType`: The interpretation of `codeHash` when looking for matched dep cells. 
    * If this is `data`, `code_hash` should match the blake2b hash of data in a dep cell; 
    * if this is `type`, `code_hash` should instead match the type script hash of a dep cell.
        * For space efficiency consideration, the actual script is attached to current transaction as a dep cell. Depending on the value of `hash_type`, the hash specified here should either match the hash of cell data part in the dep cell, or the hash of type script in the dep cell. The actual binary is loaded into an CKB-VM instance when they are specified upon the transaction verification.
* `args`: The argument as the script input. The argument here is imported into the CKB-VM instance as the input argument for the scripts. For example, when people use the same default lock script code, each of them may hold their own pubkey hash, `args` is to hold pubkey hash.In this way，every user of CKB can have different lock script, while sharing the same lock script code.


If you want to implement the validation rules，please follow: 

* Develop the script code and compile your code into RISC-V binary. You can find some examples in the [ckb-system-scripts](https://github.com/nervosnetwork/ckb-system-scripts) and [ckb-miscellaneous-scripts](https://github.com/nervosnetwork/ckb-miscellaneous-scripts)
* Create a cell which stores the binary as `outputs_data` in a transaction, and send the transaction to the chain. The cell is called “code cell”.
* Construct a script which `hashType` is `data`, and `codeHash` is the hash of the built binary.
* Use the script as the type script or lock script in a cell.
* If the script has to run in a transaction, include the code cell's `OutPoint` in the `cell_deps`. 


 As mentioned in [Cell](cell.md),  `lock script` stores the ownership of the cell and `type script` stores the validation logic you need in the cells transition.

## Lock Script

There are several use rules：

* Every cell has a lock script.
* The lock script must run when the cell is used as an transaction input. 
* A transaction is valid only when all the lock scripts in the transaction inputs exit normally (without exceptions). 

Since this script runs on inputs, it acts as the lock to control who can unlock and destroy the cell, as well as spend the capacity stored in the cell.

The following is an example lock script code which always exits normally. Anyone can destroy the cell if it uses this code as the lock script.

```
int main(int argc, char *argv[]) {
return 0;
}
```

The most popular way to lock a digital asset is the digital signature created by asymmetric cryptography.
The signature algorithm has two requirements:

* The cell must contain the information for the public key, so only the real private key can create a valid signature.
* The transaction must contain the signatures, which usually signs the whole transaction as the message.

When you use the default [secp256k1 lock script](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c),It’s recommended to store the public key hash in the lock script’s `args`
field, and store the signature in the `transaction witness`.

## Type Script

Type script is very similar to lock script, with two differences:

* Type script is optional.
* In a transaction, CKB must run the type scripts in both inputs and outputs.

Although we can only keep one type of script in the cell, we don’t want to mess the different responsibilities in a single script. The lock script is only executed for inputs, so its primary responsibility is protecting the cells. Only the owner is allowed to use the cell as input and spend any assets stored in it.

The type script is intended to store the validation logic you need in transactions. A typical use case of type script is to implement a UDT (user-defined token): the token issuance must be authorized through transaction outputs. 


