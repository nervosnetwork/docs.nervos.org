---
id: Special-Live-Cells
title: Special Live Cells
---

# Testnet

genesis hash: `0x10639e0895502b5688a6be8cf69460d76541bfa4821629d86d62ba0aae3f9606`

## duktape VM (JavaScript)
The VM cell is deployed in transaction [`0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036`](https://explorer.nervos.org/aggron/transaction/0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036) output index `0`.
We should put the `out_point` in `cell_deps`, looks like below:
``` javascript
{
  "out_point": {
    "tx_hash": "0xff4893d8054a365e505074c1d0ee2cc13e72dd9be4c0487fe7a48478f075b036",
    "index": "0x0"
  },
  "dep_type": "code"
}
```
And your type script may use this VM like below:
``` javascript
{
  "code_hash": "0xfb8e791d70c4622ae0bd0127ee9597aea612e42929e725f7f3f25475bb954ce9",
  "hash_type": "data",
  "args": "0x<your javascript code in hex>",
}
```
[Example transaction use duktape VM](https://explorer.nervos.org/aggron/transaction/0xbbe58d19e6177ea16336e566c6cdbb91cb6ad74e0f76ccb17d980e5702e4615a). If your logger(in `ckb.toml`) filter set to `filter = "info,ckb-script=debug"` you will see a log like this:

```
DEBUG ckb-script  script group: Byte32(0xafe527276275a4a25defee32ed59ecebf4813256866a7577431e5293acd2048b) DEBUG OUTPUT: I'm running in JS!
```

If you want deploy by yourself, please see [this article](https://xuejie.space/2019_07_13_introduction_to_ckb_script_programming_script_basics/#introducing-duktape).

## mruby VM (Ruby)
The VM cell is deployed in transaction [`0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a`](https://explorer.nervos.org/aggron/transaction/0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a) output index `0`.
We should put the `out_point` in `cell_deps`, looks like below:
``` javascript
{
  "out_point": {
    "tx_hash": "0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a",
    "index": "0x0"
  },
  "dep_type": "code"
}
```
And your type script may use this VM like below:
``` javascript
{
  "code_hash": "0xc3815b09286d825574f672bf4e04566ae6daaf1b45f3f1bcfd20c720198652ec",
  "hash_type": "data",
  "args": "0x<your ruby code in hex>",
}
```

Below is the steps to deploy by yourself.

Step 1, build the mruby binary:
```
$ git clone --recursive https://github.com/nervosnetwork/ckb-mruby
$ cd ckb-mruby
$ sudo docker run --rm -it -v `pwd`:/code nervos/ckb-riscv-gnu-toolchain:bionic-20191012 bash
root@982d1e906b76:/# apt-get update
root@982d1e906b76:/# apt-get install -y ruby
root@982d1e906b76:/# cd /code
root@982d1e906b76:/code# make
root@982d1e906b76:/code# exit
```

Step 2, deploy the binary via create a cell with the binary data:
```
$ ckb-cli wallet transfer --from-account <from-account> --to-address <to-address> --capacity 462000 --to-data-path build/entry --tx-fee 0.01
0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a
```

Step 3, query the data hash of the binary:
```
$ ckb-cli rpc get_live_cell --tx-hash 0x1850f997f867b6d3f1154444498a15e9fc4ce080215e34d0c41b33349bcc119a --index 0 --with-data
```
