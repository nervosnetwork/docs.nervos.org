---
id: data-type-diff
title: "Data Hash vs. Type Hash"
---

## Introduction

The `hash_type` field specifies how the `code_hash` should be interpreted when locating the Script binary. There are 4 valid `hash_type` values:

| `hash_type` | Code Location Method                                               | VM Version | Upgradeable | Description                   |
| ----------- | ------------------------------------------------------------------ | ---------- | ----------- | ----------------------------- |
| `data`      | Hash of Script binary                                              | v0         | No          | Immutable Script on CKB-VM v0 |
| `data1`     | Hash of Script binary                                              | v1         | No          | Immutable Script on CKB-VM v1 |
| `data2`     | Hash of Script binary                                              | v2         | No          | Immutable Script on CKB-VM v2 |
| `type`      | Hash of a Cell’s [Type Script](/docs/tech-explanation/type-script) | Latest     | Yes         | Upgradeable Script            |

These fall into 2 categories:

- **Data hash (`data`, `data1`, `data2`)**: Direct reference to a Script binary. Ensures the code is immutable and reproducible.
- **Type hash (`type`)**: References a Script based on the Type Script of a code Cell.

:::note
A [Type ID](#type-id) is one common pattern for managing upgradeable code safely when using type hash.
:::

## Data Hash

When `hash_type` is `"data"` (or `"data1"`, `"data2"`), the Script locates a code Cell by matching the Blake2b hash of the Cell’s data against the Script’s `code_hash`. This means the Script expects the exact binary content of the code to be present in one of the transaction’s `cell_deps`.

Since only `cell_deps` are scanned for matching code when using `data`-type references, the scope is limited to Cells explicitly included in the transaction. This ensures deterministic behavior and strict control over what code is executed.

## Type Hash

Code located by a type hash can be upgraded by replacing the code Cell with a new one that uses the same Type Script. The new Cell contains the updated code. Transactions that include the new code Cell in their `cell_deps` will execute the updated version.

Because this upgrade process requires destroying the original code Cell, the upgrade conditions can be enforced by the Lock Script of that Cell — such as restricting who can trigger an upgrade or under what conditions it is allowed.

The type hash provides a way for Scripts to locate code in any Cell that has a matching Type Script. As long as a Cell’s Type Script matches the expected `code_hash` and it is included in the `cell_deps`, its code will be used for execution.

However, this flexibility comes with trade-offs:

- There can be **multiple Cells** with the same Type Script (and thus the same type hash), each containing different versions of the code.
- A malicious actor could create a flawed or malicious version of the code using the same type hash, potentially leading to exploits if users unknowingly depend on it.

For this reason, developers can implement restrictions in the Type Script itself — such as verifying the creator's identity — to prevent unauthorized code Cells from being accepted. One common and reliable pattern is to use a Type ID, which guarantees uniqueness and helps prevent spoofing.

:::tip
When using `hash_type: type`, be aware that the referenced code can be changed. The Script author may upgrade the code at any time—intentionally or not—so it’s important to review the upgrade policy defined by the code Cell’s Lock Script before relying on it.
:::

### Type ID

A Type ID is a special Script on CKB used to create a singleton Cell type–meaning only one Live Cell can exist with that Type Script hash at any given time.

This makes it particularly useful when working with type hash, as it prevents others from creating competing Cells with the same Type Script. In other words, it ensures that the type hash always refers to a single, unique Cell, eliminating ambiguity and reducing the attack surface.

Type ID is one of CKB’s [system Scripts](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md#type-id), and its behavior is enforced at the protocol level.

## Why This Design Matters

By allowing Scripts to be referenced either via data hash via type hash, CKB provides greater flexibility and control for both developers and users. This dual approach supports a wide range of use cases:

- **Immutable references** (`data`, `data1`, `data2`) ensure that the exact same code is executed every time, promoting auditability and long-term reproducibility.
- **Upgradeable references** (`type`) allow for controlled Script evolution—such as fixing bugs or adding new features—while maintaining a consistent identifier through a Type ID.

This design empowers all participants to balance reliability according to their needs. Developers can publish Scripts with upgrade paths, while users seeking stronger execution guarantees can opt to lock in a specific version using a data hash.

By building this flexibility into the protocol, CKB accommodates diverse needs and supports independent decision-making around code usage.

## Choosing Between Data and Type Hash

CKB allows flexibility in how Scripts are referenced. You can choose between:

- **Data hash** – useful for ensuring immutability and auditability
- **Type hash** – useful when upgradeability is preferred

This choice is not permanent — you can change it later if needed.

For example, if a Script was initially deployed using a Type ID, you can:

1. Find the Cell that contains the current version of the Script binary
2. Compute its `data_hash`
3. Redeploy the Script using `hash_type`: `data`, `data1`, or `data2`, depending on your target VM version

This allows you to switch from an upgradeable type reference to an immutable data reference, locking execution to the current version of the code.
