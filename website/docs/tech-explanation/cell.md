---
id: cell
title: Cell
---

import Tooltip from "@components/Tooltip";

# Cell

## Structure {#cell-structure}

A Cell is the smallest and fundamental unit in Nervos CKB, used for storing states.

```bash
Cell: {
  capacity: HexString;
  lock: Script;
  type: Script;
  data: HexString;
}
```

## Fields & Description{#fields-and-description}

| Name       | Type                                              | Description                                                                                                                                            |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `capacity` | Uint64                                            | Size of the Cell in shannon. 1 CKB = 100,000,000 shannons.                                                                                             |
| `lock`     | [Script](/docs/tech-explanation/script#structure) | A Script that enforces access and ownership of a Cell.                                                                                                 |
| `type`     | [Script](/docs/tech-explanation/script#structure) | A Script that enforces the rules that must be followed in a transaction for a Cell to be consumed as an input or for a Cell to be created as an output |
| `data`     | Bytes                                             | Used for storing states.                                                                                                                               |

## Example

```json
{
  "capacity": "0x19995d0ccf",
  "lock": {
    "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
    "args": "0x0a486fb8f6fe60f76f001d6372da41be91172259",
    "hash_type": "type"
  },
  "type": null
}
```
