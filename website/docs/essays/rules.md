---
id: rules
title: CKB VM Verification Rules
---

When writing a program, it is important to determine the operating environment and runtime behavior, so that the execution structure of the program is in line with the program’s intended behavior. For example: the impact of GIL (Global Interpreter Lock) in Python, the expected execution time of hardware instructions and pipeline planning, etc.

We all know that CKB VM is a virtual environment based on the RISC-V instruction set. In addition to this, developers should also know the context of the VM during CKB verification, including some syscalls provided, etc. This article will provide more information about the operation of CKB VM.

## Environment

In CKB, each transaction is executed separately, that is, each transaction runs in its own separate VM environment. Though parallel verification of multiple transactions is performed (by the host), there is no multi-threaded execution environment inside of the VM.

### Execution unit

When each individual transaction is verified, the scripts will first be separated into groups and then executed sequentially in units of script groups. Each group is created by grouping together transactions that have the same script hash. 

*Note that the lock scripts of transaction outputs are not executed during transaction verification.*

No matter which script group is being executed, the entirety of transaction data can be accessed by scripts included in that transaction during execution. 

An advantage of this design is the group records the index of the cell(s) which belong to the current group. This is equivalent to combining multiple verifications that may exist into one verification. This reduces verification resource consumption and provides a public environment for the data set of the transaction. But this requires the developer to be aware when writing the script that it needs to consider the case of validating multiple cells.

This is described here:

```
`class ScriptGroup:
    def __init__(self, script):
        self.script = script
        self.input_indices = []
        self.output_indices = []

def split_group(tx):
     lock_groups: Dict[Hash, ScriptGroup] = dict()
     type_groups: Dict[Hash, ScriptGroup] = dict()
    for index, input in enumerate(tx.inputs):
        if lock_groups.get(hash(input.lock)):
            lock_groups.get(hash(input.lock)).input_indices.append(index)
        else:
            script_group = ScriptGroup(input.lock)
            script_group.input_indices.append(index)
            lock_groups[hash(input.lock)] = script_group
        if input.type:
            if type_groups.get(hash(input.type)):
                type_groups.get(hash(input.type)).input_indices.append(index)
            else:
                script_group = ScriptGroup(input.type)
                script_group.input_indices.append(index)
                type_groups[hash(input.type)] = script_group
    for index, output in enumerate(tx.outputs):
        if output.type:
            if type_groups.get(hash(input.type)):
                type_groups.get(hash(input.type)).output_indices.append(index)
            else:
                script_group = ScriptGroup(input.type)
                script_group.output_indices.append(index)
                type_groups[hash(input.type)] = script_group
    return list(lock_groups.values()) + list(type_groups.values())

def run():
    for group in split_group(tx):
        if vm_run(group) != 0:
            return error()
`
```

When each script group is executed, the execution cost of the scripts is recorded and the sum of all resource consumption is compared with the `max_block_cycles` allowed upper limit.

Suppose there is a transaction as follows:

```
`Transaction {
    input: [cell_1 {lock: A, type: B}, cell _2 {lock: A, type: B}, cell_3 {lock: C, type: None}]
    output: [cell_4 {lock: D, type: B}, cell_5 {lock: C, type: B}, cell_6 {lock: G, type: None}, cell_7(lock: A, type: F)]
}`
```

it will be grouped as such:

```
`[
    group(A, input:[0, 1], output:[]), 
    group(C, input:[2], output:[]), 
    group(B, input:[0, 1], output:[0, 1]),
    group(F, input:[], output:[3])
]`
```

The syscall of the VM can load these corresponding cells through `group(input/output index)` to complete one-time verification.

CKB will execute all script groups, which are then verified based on return value. This follows the convention of process exit status in Unix-like systems: a return value of zero is a verification pass, while other return values are verification exceptions. 

Note that when the script is executed, the script itself does not know if it is a type or lock script. The script will need to figure this out itself, by checking args or witness data.

### Special rules

Most of the contracts are verified as above, except for one type of contract, which is the TypeId contract. This contract employs special rules, written directly in the script code, and does not start the VM. For more information, see the code [here](https://github.com/nervosnetwork/ckb/blob/44b0d3595c31a29aef81e74360ba8613cd0dd27f/script/src/type_id.rs) and a tutorial about creation of TypeId contracts [here](https://xuejie.space/2020_02_03_introduction_to_ckb_script_programming_type_id/).

### Syscall Links

[Sycall RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0009-vm-syscalls/0009-vm-syscalls.md)

[Syscall system script (C code)](https://github.com/nervosnetwork/ckb-system-scripts/blob/865f4d7697cc979d62111e49f2fb12a3607a4eb9/c/ckb_syscalls.h)
