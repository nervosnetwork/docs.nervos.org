# ckb-js-script

This is a simple example to showcase how to write and execute JavaScript-based smart
contracts on CKB, with the help of [CKB-js-vm](https://github.com/nervosnetwork/ckb-js-vm).

CKB-js-vm builds a binary adapted from JavaScript engine [quick-js](quick.js.org) so that it can runs on risc-v
target. We then compile JavaScript code into bytecodes and execute it on top of this js engine
binary on top of the risc-v based CKB-VM. By this "vm on vm" method, we can leverage the
JavaScript language to write smart contracts for CKB blockchain.

In this project, we show different ways to integrate CKB-js-vm into your smart contracts. One is
called spawn, where you can call CKB-js-vm from your script use `ckb_spawn` systcall and one is to
use Script structure to load and execute your JavaScript script in a live cell.

There is also a full tutorial covering all the details for yout to run JavaScript smart contracts
on CKB in the official docs webesite: [docs.nervos.org](https://docs.nervos.org).

*This project was bootstrapped with [ckb-script-templates].*

[ckb-script-templates]: https://github.com/cryptape/ckb-script-templates
