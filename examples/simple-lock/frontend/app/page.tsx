"use client";

import offCKB from "@/offckb.config";
import { capacityOf } from "./transfer";
import { Script } from "@ckb-lumos/lumos";
import React, { useEffect, useState } from "react";
import { generateAccount, unlock } from "./hash-lock";

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
    "823d87112a54264ce2acb3fec0748172a833da3d3c7b65d0cd14aab40f1679ce"
  );
  const [fromAddr, setFromAddr] = useState("");
  const [fromLock, setFromLock] = useState<Script>();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (hash) {
      updateFromInfo();
    }
  }, [hash]);

  const updateFromInfo = async () => {
    const { lockScript, address } = generateAccount(hash);
    const capacity = await capacityOf(address);
    setFromAddr(address);
    setFromLock(lockScript);
    setBalance(capacity.toString());
  };

  // default value: second account address from offckb
  const [toAddr, setToAddr] = useState(
    "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqt435c3epyrupszm7khk6weq5lrlyt52lg48ucew"
  );
  // default value: 62 CKB
  const [amount, setAmount] = useState("9900000000");

  const [isTransferring, setIsTransferring] = useState(false);
  const [txHash, setTxHash] = useState<string>();

  const onTransfer = async () => {
    setIsTransferring(true);
    const txHash = await unlock(fromAddr, toAddr, amount).catch(alert);

    // We can wait for this txHash to be on-chain so that we can trigger the UI/UX updates including balance.
    if (txHash) {
      setTxHash(txHash);
      // Note: indexer.waitForSync has a bug, we use negative number to workaround.
      // the negative number presents the block difference from current tip to wait
      await offCKB.indexer.waitForSync(-1);
      await updateFromInfo();
    }

    setIsTransferring(false);
  };

  const enabled =
    +amount > 6100000000 &&
    +balance > +amount &&
    toAddr.length > 0 &&
    !isTransferring;
  const amountTip =
    amount.length > 0 && +amount < 6100000000 ? (
      <span>
        amount must larger than 6,100,000,000(61 CKB), see{" "}
        <a href="https://docs.nervos.org/docs/wallets/#requirements-for-ckb-transfers">
          why
        </a>
      </span>
    ) : null;

  return (
    <div>
      <div className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Hash Lock Transfer
      </div>
      <p>
        HASH_LOCK Script code_hash:{" "}
        {offCKB.lumosConfig.SCRIPTS["HASH_LOCK"]?.CODE_HASH
          ? offCKB.lumosConfig.SCRIPTS["HASH_LOCK"]?.CODE_HASH
          : "Not Found, deploy script first."}
      </p>
      <label htmlFor="Hash-key">Hash: </label>&nbsp;
      <input
        id="Hash-key"
        type="text"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        className="w-full px-1 py-1"
      />
      <ul>
        <li>CKB Address: {fromAddr}</li>
        <li>
          Current lock script:
          <pre>{JSON.stringify(fromLock, null, 2)}</pre>
        </li>

        <li>Total capacity: {(+balance).toLocaleString()}</li>
      </ul>
      <label htmlFor="to-address">Transfer to Address: </label>&nbsp;
      <input
        id="to-address"
        type="text"
        value={toAddr}
        onChange={(e) => setToAddr(e.target.value)}
        className="w-full px-1 py-1"
      />
      <br />
      <label htmlFor="amount">Amount</label>
      &nbsp;
      <input
        id="amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-1 py-1"
      />
      <small>Tx fee: 100,000 (0.001 CKB)</small>
      <br />
      <small style={{ color: "red" }}>{amountTip}</small>
      <br />
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!enabled}
        onClick={onTransfer}
      >
        Transfer
      </button>
      {txHash && <div>tx hash: {txHash}</div>}
    </div>
  );
}
