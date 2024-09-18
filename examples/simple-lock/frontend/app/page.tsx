"use client";

import offCKB from "@/offckb.config";
import React, { useEffect, useState } from "react";
import { capacityOf, generateAccount, shannonToCKB, unlock, wait } from "./hash-lock";
import Link from "next/link";
import { Script } from "@ckb-ccc/core";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="space-y-10">
        <HashLock />
      </div>
    </main>
  );
}

function HashLock() {
  // You can generate ckb blake2b_256 hash from https://codesandbox.io/p/sandbox/calculate-blake2b-256-hash-6h2s8?file=%2Fsrc%2FApp.vue%3A55%2C25
  const [hash, setHash] = useState<string>(
    "3376b3e62282513e03d78fc6c5bd555503d0c697bf394d55cd672cc96e6b0a2c"
  );
  const [fromAddr, setFromAddr] = useState("");
  const [fromLock, setFromLock] = useState<Script>();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (hash && offCKB.myScripts["hash-lock"] != null) {
      
      updateFromInfo();
    }
  }, [hash]);

  const updateFromInfo = async () => {
    const { lockScript, address } = generateAccount(hash);
    const capacity = await capacityOf(address);
    setFromAddr(address);
    setFromLock(lockScript);
    setBalance(shannonToCKB(capacity).toString());
  };

  // default value: second account address from offckb
  const [toAddr, setToAddr] = useState(
    "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqt435c3epyrupszm7khk6weq5lrlyt52lg48ucew"
  );
  // default value: 99 CKB
  const [amountInCKB, setAmountInCKB] = useState("99");

  const [isTransferring, setIsTransferring] = useState(false);
  const [txHash, setTxHash] = useState<string>();

  const onTransfer = async () => {
    setIsTransferring(true);
    const txHash = await unlock(fromAddr, toAddr, amountInCKB).catch(alert);

    // We can wait for this txHash to be on-chain so that we can trigger the UI/UX updates including balance.
    if (txHash) {
      setTxHash(txHash);
      // wait 10 seconds for tx confirm
      // the right way to do this is to use get_transaction rpc but here we just keep it simple
      await wait(10);
      await updateFromInfo();
    }

    setIsTransferring(false);
  };

  const enabled =
    +amountInCKB > 61 &&
    +balance > +amountInCKB &&
    toAddr.length > 0 &&
    !isTransferring;
  const amountTip =
    amountInCKB.length > 0 && +amountInCKB < 61 ? (
      <span>
        amount must larger than 61 CKB, see{" "}
        <a href="https://docs.nervos.org/docs/wallets/#requirements-for-ckb-transfers">
          why
        </a>
      </span>
    ) : null;

  return (
    <div className="w-full">
      <div className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Simple Lock Example
      </div>
      <div className="mb-8">
        <div className="text-xl font-bold">HASH_LOCK Script Info</div>
        <div>
          code_hash:{" "}
          {offCKB.myScripts["hash-lock"]?.codeHash
            ? offCKB.myScripts["hash-lock"]?.codeHash
            : "Not Found, deploy script first."}
        </div>
      </div>

      <div>
        <div className="text-xl font-bold">Build A Lock</div>
        <div className="w-full flex">
          <label htmlFor="Hash-key">Hash: </label>&nbsp;
          <input
            id="Hash-key"
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            className="w-full px-1 py-1"
          />
        </div>
        <p>hints: Generate ckb blake2b_256 hash from <Link style={{color: "blue"}} href="https://codesandbox.io/p/sandbox/calculate-blake2b-256-hash-6h2s8?file=%2Fsrc%2FApp.vue%3A55%2C25">here</Link></p>

        <div className="my-4">
          Hash Lock:
          <ul className="ml-3">
            <li>CKB Address: {fromAddr}</li>
            <li>
              Current lock script:
              <pre>{JSON.stringify(fromLock, null, 2)}</pre>
            </li>

            <li>Total capacity: {balance} CKB</li>
          </ul>
        </div>
      </div>

      <div className="w-full mt-8">
        <div className="text-xl font-bold">Transfer from Hash lock</div>
        <div className="w-full flex mb-2 mt-2">
          <label htmlFor="to-address">Receiver: </label>&nbsp;
          <input
            id="to-address"
            type="text"
            value={toAddr}
            onChange={(e) => setToAddr(e.target.value)}
            className="w-full px-1 py-1"
          />
        </div>

        <div className="w-full flex">
          <label htmlFor="amount">Amount</label>
          &nbsp;
          <input
            id="amount"
            type="number"
            value={amountInCKB}
            onChange={(e) => setAmountInCKB(e.target.value)}
            className="w-full px-1 py-1"
          />
        </div>
        <small>Tx fee: 0.001 CKB</small>

        <div>
          <small style={{ color: "red" }}>{amountTip}</small>
        </div>

        <div className="my-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!enabled}
            onClick={onTransfer}
          >
            Transfer
          </button>
          {txHash && <div>tx hash: {txHash}</div>}
        </div>
      </div>
    </div>
  );
}
