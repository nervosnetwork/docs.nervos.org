---
id: script-testing-guide
title: "Script Testing Guide"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import Tooltip from "@components/Tooltip";

# Script Testing Guide

CKB is built on the UTXO model—a design less common compared to other blockchains. Due to its unique transaction structure and Script execution rules, smart contract (Script) testing on CKB involves specific considerations around transaction structure, grouping logic, and test case design. This guide aims to clarify those aspects and assist developers in creating robust test cases.

## Transaction Structure

A CKB transaction consists of the following core components:

- **Inputs**: A list of input Cells, representing the resources consumed by the transaction.
- **Outputs**: A list of output Cells, representing the newly created resources.
- **CellDeps**: Referenced verification code or dependent Cells used to execute contract logic.

:::note

This section focuses on fields relevant to contract execution. For a full specification of the transaction structure and all fields, refer to the RFC [Transaction Structure](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)
:::

For example, a transaction transforms input Cells (e.g., a $100 bill) into output Cells (e.g., two $50 bills), with the transfer logic defined by the verification code in the CellDeps.

```
Inputs: [Cell(100)]
Outputs: [Cell(50), Cell(50)]
CellDeps: [Validation Code]
```

### Cell Structure

A <Tooltip>Cell</Tooltip> is the basic data storage unit in CKB and includes:

- **Lock Script**: Defines Cell’s ownership rules (like a "lock").
- **Type Script** (optional): Defines Cell’s validation logic (like a "type constraint").
- **Data**: Stores Cell’s actual content.
- **Script Structure**:
  - `code_hash`: Hash of the validation code.
  - `hash_type`: How to interpret the code hash—`data` or `type`.
  - `args`: Arguments passed to the Script.

## Transaction Verification Rules

CKB validates transactions based on Lock and Type Scripts through the following process:

### Grouping Logic

- Cells are grouped based on `Hash(Script)`.
- Lock and Type Scripts in **Inputs** are grouped and executed.
- Lock Scripts in **Output** are NOT executed, only the Type Scripts may be.

### Execution Flow

- CKB-VM runs grouped Scripts, tracking the Cycle consumption per group to compute the total <Tooltip>Cycles</Tooltip>.
- Grouping only applies to:
  - Lock and Type Scripts in Inputs
  - Type Scripts in Outputs (Lock Scripts in Output is NOT executed.)

```mdx-code-block
<Tabs>
  <TabItem value="execution-flow-example" label="Example">
```

```
Transaction {
    Inputs: [
        Cell_1 {lock: A, type: B},
        Cell_2 {lock: A, type: B},
        Cell_3 {lock: C, type: None}
    ]
    Outputs: [
        Cell_4 {lock: D, type: B},
        Cell_5 {lock: C, type: B},
        Cell_6 {lock: G, type: None},
        Cell_7 {lock: A, type: F}
    ]
}
```

```mdx-code-block
  </TabItem>
  <TabItem value="execution-flow-result" label="Grouping Result">
```

```
[
    Lock A: inputs:[0, 1], outputs:[],
    Lock C: inputs:[2], outputs:[],
    Type B: inputs:[0, 1], outputs:[0, 1],
    Type F: inputs:[], outputs:[3]
]
```

```mdx-code-block
</TabItem>
</Tabs>
```

**Execution Process**

- CKB-VM executes Scripts A, C, B, and F in order and accumulates total Cycle consumption.
- Output Lock Scripts D, C, G, and A are NOT executed.

## Design CKB Contract Test Cases

Testing should cover Lock Script and Type Script.

### Lock Script Testing

Since Lock Scripts in Output are not executed, testing should focus on Lock Scripts in Inputs:

| Input Count | Output Count | Example                     | Note                                                               |
| ----------- | ------------ | --------------------------- | ------------------------------------------------------------------ |
| 1           | 0            | inputs: [N], outputs: []    | Test the validation logic for a single Cell.                       |
| N           | 0            | inputs: [N..N], outputs: [] | Test the behavior where multiple Cells share the same Lock Script. |

### Type Script Testing

Type Scripts may execute in both Inputs and Outputs, test cases should cover the following combinations:
| Input Count | Output Count | Example | Note |
|-------------|--------------|-----------------------------|-----------------------------------------------------------|
| 1 | 0 | inputs: [N], outputs: [] | A single Input Cell only |
| N | 0 | inputs: [N..N], outputs: [] | Multiple Input Cells with the same Type Script. |
| 1 | 1 | inputs: [N], outputs: [N] | Transfer from one Input to one Output. |
| 1 | N | inputs: [N], outputs: [N..N] | A single Input split into multiple Outputs. |
| N | 1 | inputs: [N..N], outputs: [N] | Multiple Inputs combined into a single Output. |
| N | N | inputs: [N..N], outputs: [N..N] | Complex combinations of multiple Inputs and Outputs. |
| 0 | 1 | inputs: [], outputs: [N] | Create a new Cell (e.g., mint). |
| 0 | N | inputs: [], outputs: [N..N] | Create a batch of Cells. |

## Define Contract API and Design Test Cases

Before testing, review the API for building contracts to define the testing scope. Unlike Ethereum’s function calls, CKB’s UTXO model makes transaction APIs more complex. Let’s use the <Tooltip>Simple UDT</Tooltip> contract as an example.

### sUDT Contract Example

Below is the main part of the sUDT contract (in Rust) which ensures that the total token amount in the inputs is not less than the total in the outputs — in other words, it prevents unauthorized token creation.

<details>
  <summary>sUDT Example</summary>

```rust
use ckb_std::{
    entry,
    default_alloc,
    high_level::{load_script, load_cell_lock_hash, load_cell_data, QueryIter},
    ckb_constants::Source,
    error::SysError,
    ckb_types::{bytes::Bytes, prelude::*},
};

entry!(entry);
default_alloc!();

#[repr(i8)]
enum Error {
    IndexOutOfBound = 1,
    ItemMissing,
    LengthNotEnough,
    Encoding,
    Amount,
}

const UDT_LEN: usize = 16;

fn check_owner_mode(args: &Bytes) -> Result<bool, Error> {
    let is_owner_mode = QueryIter::new(load_cell_lock_hash, Source::Input)
        .find(|lock_hash| args[..] == lock_hash[..]).is_some();
    Ok(is_owner_mode)
}

fn collect_inputs_amount() -> Result<u128, Error> {
    let mut buf = [0u8; UDT_LEN];
    let udt_list = QueryIter::new(load_cell_data, Source::GroupInput)
        .map(|data| {
            if data.len() == UDT_LEN {
                buf.copy_from_slice(&data);
                Ok(u128::from_le_bytes(buf))
            } else {
                Err(Error::Encoding)
            }
        }).collect::<Result<Vec<_>, Error>>()?;
    Ok(udt_list.into_iter().sum::<u128>())
}

fn collect_outputs_amount() -> Result<u128, Error> {
    let mut buf = [0u8; UDT_LEN];
    let udt_list = QueryIter::new(load_cell_data, Source::GroupOutput)
        .map(|data| {
            if data.len() == UDT_LEN {
                buf.copy_from_slice(&data);
                Ok(u128::from_le_bytes(buf))
            } else {
                Err(Error::Encoding)
            }
        }).collect::<Result<Vec<_>, Error>>()?;
    Ok(udt_list.into_iter().sum::<u128>())
}

fn main() -> Result<(), Error> {
    let script = load_script()?;
    let args: Bytes = script.args().unpack();

    if check_owner_mode(&args)? {
        return Ok(());
    }

    let inputs_amount = collect_inputs_amount()?;
    let outputs_amount = collect_outputs_amount()?;

    if inputs_amount < outputs_amount {
        return Err(Error::Amount);
    }

    Ok(())
}
```

</details>

### Analyze Contract API

```rust
// args
let script = load_script()?;
let args: Bytes = script.args().unpack();

// data
QueryIter::new(load_cell_data, Source::GroupInput)
QueryIter::new(load_cell_data, Source::GroupOutput)
```

Key fields:

- **args**: Loaded via `load_script`, used to verify ownership (`owner`).
- **data**: Loaded via `load_cell_data`, representing the balance (`balance`).

We can abstract the sUDT Cell as:

```rust
type SudtCell {
    args: { owner: bytes32 }
    data: { balance: u128 }
}
```

### Design Test Cases

Based on Type Scripts’ behavior, the following test cases should be created:

| Input Count | Output Count | Example                                       | Note                                                                                                                                                                                                        |
| ----------- | ------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0           | 1            | inputs: [], outputs: [SudtCell]               | - Admin creates one sUDT Cell.<br />- Non-admin tries to create a sUDT, expected to fail.<br />- Admin can create a Cell whose data length ≠ 16 bytes.                                                      |
| 0           | N            | inputs: [], outputs: [SudtCell..N]            | - Admin batch creates multiple sUDT Cells.<br />- Admin can create multiple Cells whose total balance exceeds `u128::max`.                                                                                  |
| 1           | 0            | inputs: [SudtCell], outputs: []               | - Burn one sUDT Cell.                                                                                                                                                                                       |
| 1           | 1            | inputs: [SudtCell], outputs: [SudtCell]       | - Non-admin transfers one sUDT, Input ≥ Output balance.<br />- Non-admin transfers one sUDT, Input < Output balance, expected to fail.<br />- Non-admin cannot transfer a Cell with data length ≠ 16 bytes. |
| 1           | N            | inputs: [SudtCell], outputs: [SudtCell..N]    | - Non-admin transfers one sUDT, Input ≥ Output balance.                                                                                                                                                     |
| N           | 0            | inputs: [SudtCell..N], outputs: []            | - Batch burn sUDT Cells.<br />- Cannot batch burn if total Input balance > `u128::max`.                                                                                                                     |
| N           | 1            | inputs: [SudtCell..N], outputs: [SudtCell]    | - Non-admin transfers multiple sUDT Cells, total Input > Output balance.<br />- Total Input < Output balance, expected to fail.                                                                             |
| N           | N            | inputs: [SudtCell..N], outputs: [SudtCell..N] | - Non-admin transfers multiple sUDT Cells, total Input > Output balance.<br />- Total Input < Output balance, expected to fail.                                                                             |

Code reference [here](https://github.com/sunchengzhu/ckb-contract-minitest/blob/main/tests/sudt.rs).

Based on the above API, we can improve contract test cases just like interface testing.

## Testing Considerations

To ensure comprehensive and reliable tests, consider the following:

### Grouping Logic

- Cover all possible grouping combinations, especially the more complicated multi-Input/Output scenarios.

### Failure Cases

- Construct invalid transactions (e.g., Scripts return non-zero) to test robustness.
- Test edge cases, e.g., exceeding the Cycle limit (1000M) or Script execution errors.

### Data Size Checks

CKB-VM has a memory size limit. If the contract uses any of the following fields, consider testing their upper size boundaries:

- **script.args**
- **witness**
- **data**

## Final Remarks

Testing CKB smart contracts requires a solid understanding of its UTXO model and validation logic. By analyzing transaction structure, grouping behavior, and contract APIs, developers can create comprehensive test suites that cover both Lock and Type Scripts. Special attention should be paid to grouping logic, Cycle consumption, and data boundaries to ensure stability under all conditions.
