---
id: cellinput
title: CellInput
---

# CellInput

Input Cells are the output Cells of previous transactions, hence they are noted as `previous_output`.

| Name              | Type       | Description                                                                                                                                                                                                           |
| ----------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `previous_output` | `OutPoint` | A Cell outpoint pointing to the Cells used as inputs. For more, see `previous_output` below.                                                                                                                          |
| `since`           | Uint64     | Since value guarding current referenced inputs. Please refer to [RFC: Transaction Since Precondition](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md) for details. |
