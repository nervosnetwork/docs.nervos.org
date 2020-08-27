---
id: Occupied-Capacity
title: Occupied Capacity
---

The transaction output is a cell in CKB. The cell has a field `capacity`, which must be larger than or equal to its occupied capacity.

occupied(cell: Cell) = sum of
- capacity: 8 bytes
- data: len(data) bytes
- lock: occupied(lock: Script)
- type:
	- when present: occupied(type: Script)
	- when absent: 0 bytes

occupied(script: Script) = sum of:
- args: len(args) bytes
- code\_hash: 32 bytes
- hash\_type: 1 byte

Javascript Code Demo:

```js
function hex_data_occupied_bytes(hex_string) {
  // Exclude 0x prefix, and every 2 hex digits are one byte
  return (hex_string.length - 2) / 2;
}

function script_occupied_bytes(script) {
  if (script !== undefined && script !== null) {
    return (
      1 + hex_data_occupied_bytes(script.code_hash) +
      hex_data_occupied_bytes(script.args)
    );
  }
  return 0;
}

function cell_occupied_bytes(cell) {
  return (
    8 +
    hex_data_occupied_bytes(cell.data) +
    script_occupied_bytes(cell.lock) +
    script_occupied_bytes(cell.type)
  );
}
```


Test case:

```js
console.log(
  cell_occupied_bytes({
    capacity: "4500000000",
    data: "0x72796c6169",
    lock: {
      args: "0x",
      hash_type: "data",
      code_hash:
        "0xb35557e7e9854206f7bc13e3c3a7fa4cf8892c84a09237fb0aab40aab3771eee"
    },
    type: null
  })
);
// => 46
```

The minimal occupied capacity of a secp256k1 cell is 61 bytes.
