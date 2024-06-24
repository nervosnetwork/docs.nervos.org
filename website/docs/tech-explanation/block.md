---
id: block
title: Block
---

# Block

A block is a container of transactions, carrying the information required by consensus so the participants can verify and recognize the canonical chain.

<img src={"/img/tech_explanation/block-structure.png"} width={688} height={400} alt="Structure of Block" />

## Fields & Description

| Name           | Type          | Description                                                                                                                               |
| -------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `header`       | Header        | Header contains the block’s metadata. For more, see [`header`](/docs/tech-explanation/header)                                             |
| `transactions` | [Transaction] | An array of committed transactions contained in the block. For more, see [`transactions`](/docs/tech-explanation/transactions)            |
| `uncles`       | [UncleBlock]  | An array of the block’s uncle blocks. For more, see [`uncles`](/docs/tech-explanation/uncles)                                             |
| `proposals`    | [H80]         | An array of hex-encoded short transaction IDs of the proposed transactions. For more, see [`proposals`](/docs/tech-explanation/proposals) |

## Example

```json
{
  "uncles": [
    {
      "proposals": [],
      "header": {
        "compact_target": "0x1a9c7b1a",
        "hash": "0x87764caf4a0e99302f1382421da1fe2f18382a49eac2d611220056b0854868e3",
        "number": "0x129d3",
        "parent_hash": "0x815ecf2140169b9d283332c7550ce8b6405a120d5c21a7aa99d8a75eb9e77ead",
        "nonce": "0x78b105de64fc38a200000004139b0200",
        "timestamp": "0x16e62df76ed",
        "transactions_root": "0x66ab0046436f97aefefe0549772bf36d96502d14ad736f7f4b1be8274420ca0f",
        "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "uncles_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "version": "0x0",
        "epoch": "0x7080291000049",
        "dao": "0x7088b3ee3e738900a9c257048aa129002cd43cd745100e000066ac8bd8850d00"
      }
    }
  ],
  "proposals": ["0x5b2c8121455362cf70ff"],
  "transactions": [
    {
      "version": "0x0",
      "cell_deps": [],
      "header_deps": [],
      "inputs": [
        {
          "previous_output": {
            "tx_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "index": "0xffffffff"
          },
          "since": "0x129d5"
        }
      ],
      "outputs": [
        {
          "capacity": "0x1996822511",
          "lock": {
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "args": "0x2ec3a5fb4098b14f4887555fe58d966cab2c6a63",
            "hash_type": "type"
          },
          "type": null
        }
      ],
      "outputs_data": ["0x"],
      "witnesses": [
        "0x590000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce801140000002ec3a5fb4098b14f4887555fe58d966cab2c6a6300000000"
      ],
      "hash": "0x84395bf085f48de9f8813df8181e33d5a43ab9d92df5c0e77d711e1d47e4746d"
    }
  ],
  "header": {
    "compact_target": "0x1a9c7b1a",
    "hash": "0xf355b7bbb50627aa26839b9f4d65e83648b80c0a65354d78a782744ee7b0d12d",
    "number": "0x129d5",
    "parent_hash": "0x4dd7ae439977f1b01a8c9af7cd4be2d7bccce19fcc65b47559fe34b8f32917bf",
    "nonce": "0x91c4b4746ffb69fe000000809a170200",
    "timestamp": "0x16e62dfdb19",
    "transactions_root": "0x03c72b4c2138309eb46342d4ab7b882271ac4a9a12d2dcd7238095c2d131caa6",
    "proposals_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "uncles_hash": "0x90eb89b87b4af4c391f3f25d0d9f59b8ef946d9627b7e86283c68476fee7328b",
    "version": "0x0",
    "epoch": "0x7080293000049",
    "dao": "0xae6c356c8073890051f05bd38ea12900939dbc2754100e0000a0d962db850d00"
  }
}
```
