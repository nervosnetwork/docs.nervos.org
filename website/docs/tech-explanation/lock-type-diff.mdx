---
id: lock-type-diff
title: "Lock Script vs. Type Script: The Difference"
---

import Tooltip from "@components/Tooltip";

# Lock Script vs. Type Script: The Difference

Type Script is similar to Lock Script, with two differences:

- Type Script is optional.
- CKB runs Lock Script in only inputs in a transaction.
- CKB runs Type Script in both inputs and outputs in a transaction.

Lock Script and Type Script serve different purposes. Lock Scripts are for asset ownership, while Type Scripts are for application logic.

Lock Scripts are only executed for inputs, primary responsible for verifying the spending of Cells. They ensure that only the rightful owner can use the Cell as input and spend the tokens stored within it.

On the other hand, Type Scripts function as state transition contracts for Cells of the same type. When encountering a Cell output with a specified type, you can be assured that the Cell has met the validation rules coded in its Type Script. Additionally, the code is also executed when the Cell is destroyed (used as an input).

For instance: Alice owns a Cell where the `data` field stores the balance of a specific <Tooltip>UDT</Tooltip> she holds, with the `type script` field defining the rules and logic of that UDT. If Alice wants to send some tokens to Bob, she needs to use this Cell as an input and create an output Cell with the same `type script`, which uses Bob's `lock script`. Then Alice can assemble the transaction and send it to a CKB node. Note that if Alice does not send all the tokens in this Cell, she needs to create an additional output Cell for herself to hold the tokens as change.
