**RPC `send_transaction` Default Outputs Validator**

Outputs validator prevents improperly formed transactions from entering the tx-pool, in most cases the leading cause of client sending these transactions is simply because of bug code or misusing SDK, which results in a none-unlockable transaction.

**Implementation details**

CKB provides two built-in validators, `default` and `passthrough`.

For `default` validator, these checks should conform to the pseudocode described below

```
transaction.outputs.all{ |output|
    script = output.script
    (script.code_hash == secp256k1_blake160_sighash_all && script.hash_type == "type" && script.args.size == 20) ||
    (script.code_hash == secp256k1_blake160_multisig_all && script.hash_type == "type" && （script.args.size == 20 || (script.args.size == 28 && script.args[20..28].is_valid_since_format))
}
transaction.outputs.all{ |output|
    script = output.type
    script.is_null || script.code_hash == dao && script.hash_type == "type"
}
```

For `passthrough` validator, it will skip validation.