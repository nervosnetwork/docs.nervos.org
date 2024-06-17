---
id: script-group-exe
title: Script Group Execution
---

# Script Group Execution {#script-group-exe}

CKB streamlines Lock Script execution by grouping the inputs based on their Lock Scripts and running the grouped Scripts only once.

The process consists of three steps:

1. Script Grouping
2. Code Locating
3. Execution

The diagram below shows the first two steps.

1. **Script Grouping**: CKB groups inputs by their Lock Scripts. In this example, two Lock Scripts are used in inputs. Although they point to the same code, they have different args. Let's focus on **g1** with inputs indexed 0 and 2. This Script and the input indices will be used in step 3 later.
2. **Code Locating**: CKB identifies the code from cell deps. It resolves to the cell with data hash `Hs` and uses its data as the code.

[image]

Then CKB loads the Script's code and execute it, starting from the entry function.

CKB syscalls help Scripts read transaction data. These syscalls usually have an argument to specify where to read the data from. For example, to read the Script itself:

```
ckb_load_script(addr, len, offset)
```

To load the first witness:

```
ckb_load_witness(addr, len, offset, 0, CKB_SOURCE_INPUT);
```

The first three arguments `addr`, `len`, and `offset` control where to store the read data and how many bytes to read. For simplicity, we’ll focus on the other args in the following paragraphs.

`0` is the index into the inputs array.

`CKB_SOURCE_INPUT` specifies the data source and reads from transaction inputs. It is also used to read `witnesses`.

The input indices previously saved during **Script Grouping** is used to create the virtual witnesses and inputs array for the group. The code can read input or witness using the index in the virtual array via the special source `CKB_SOURCE_GROUP_INPUT`. Reading a witness using `CKB_SOURCE_GROUP_INPUT` only reads the witnesses that has the same position with the specified input.

[image]

All syscalls that read inputs data can use `CKB_SOURCE_GROUP_INPUT` and the index in the virtual inputs array, such as `ckb_load_cell_*` syscall family.

Running Type Script is similar to running Lock Script, except the following:

1. Cells without a Type Script are ignored.
2. Type Scripts in both inputs and outputs are used to form script groups.

[image]

Similar to `CKB_SOURCE_GROUP_INPUT`, there is a special data source `CKB_SOURCE_GROUP_OUTPUT` to use the index into the virtual outputs array in the script group.
