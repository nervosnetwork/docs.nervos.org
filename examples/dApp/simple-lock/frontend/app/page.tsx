"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Script, hashCkb } from "@ckb-ccc/core";
import { activeNetwork, cccClient } from "./ccc-client";
import {
  capacityOf,
  DeploymentStatus,
  generateAccount,
  getDeploymentStatus,
  shannonToCKB,
  unlock,
} from "./hash-lock";
import { stringToBytesHex } from "./preimage";
import { explainTransactionError } from "./transaction-errors";

type TransactionPhase =
  | "idle"
  | "submitting"
  | "pending"
  | "committed"
  | "failed";

const DEVNET_RECEIVER =
  "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqt435c3epyrupszm7khk6weq5lrlyt52lg48ucew";

function outPointLabel(outPoint: { txHash: string; index: bigint }) {
  return `${outPoint.txHash}:${outPoint.index.toString()}`;
}

export default function Home() {
  const [deployment, setDeployment] = useState<DeploymentStatus>();
  const [preimage, setPreimage] = useState("Hello World");
  const hash = useMemo(
    () => hashCkb(stringToBytesHex(preimage)).slice(2),
    [preimage],
  );
  const [fromAddr, setFromAddr] = useState("");
  const [fromLock, setFromLock] = useState<Script>();
  const [balance, setBalance] = useState("0");
  const [toAddr, setToAddr] = useState(
    activeNetwork === "devnet" ? DEVNET_RECEIVER : "",
  );
  const [amountInCKB, setAmountInCKB] = useState("99");
  const [unlockPreimage, setUnlockPreimage] = useState("Hello World");
  const [phase, setPhase] = useState<TransactionPhase>("idle");
  const [txHash, setTxHash] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const lockRequestId = useRef(0);

  const refreshDeployment = useCallback(async () => {
    setDeployment(undefined);
    setDeployment(await getDeploymentStatus());
  }, []);

  useEffect(() => {
    void refreshDeployment();
  }, [refreshDeployment]);

  const updateLockInfo = useCallback(async () => {
    const requestId = ++lockRequestId.current;
    setFromAddr("");
    setFromLock(undefined);
    setBalance("0");
    setErrorMessage(undefined);
    if (deployment?.kind !== "ready") return;

    try {
      const { lockScript, address } = generateAccount(hash);
      const nextBalance = shannonToCKB(await capacityOf(address));
      if (requestId !== lockRequestId.current) return;

      setFromAddr(address);
      setFromLock(lockScript);
      setBalance(nextBalance);
    } catch (error) {
      if (requestId !== lockRequestId.current) return;
      setErrorMessage(explainTransactionError(error));
    }
  }, [deployment, hash]);

  useEffect(() => {
    void updateLockInfo();
  }, [updateLockInfo]);

  const onTransfer = async () => {
    setPhase("submitting");
    setErrorMessage(undefined);
    setTxHash(undefined);

    try {
      const submittedHash = await unlock(
        fromAddr,
        toAddr,
        amountInCKB,
        unlockPreimage,
      );
      setTxHash(submittedHash);
      setPhase("pending");

      const transaction = await cccClient.waitTransaction(
        submittedHash,
        0,
        120_000,
        2_000,
      );
      if (!transaction || transaction.status === "rejected") {
        throw new Error("The node rejected the submitted transaction.");
      }

      setPhase("committed");
      await updateLockInfo();
    } catch (error) {
      setPhase("failed");
      setErrorMessage(explainTransactionError(error));
    }
  };

  const isBusy = phase === "submitting" || phase === "pending";
  const enabled =
    deployment?.kind === "ready" &&
    fromAddr.length > 0 &&
    toAddr.trim().length > 0 &&
    unlockPreimage.length > 0 &&
    Number(amountInCKB) > 0 &&
    Number(balance) >= Number(amountInCKB) &&
    !isBusy;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-slate-800 pb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            CKB learning example
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple Hash Lock
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Build an address from a secret, deposit Devnet or Testnet CKB, and
            observe how a preimage authorizes a cell transition.
          </p>
        </header>

        <section className="grid gap-5 border-b border-slate-800 py-7 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold">Deployment health</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                {activeNetwork}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  deployment?.kind === "ready"
                    ? "bg-emerald-400/15 text-emerald-300"
                    : deployment?.kind === "error"
                      ? "bg-rose-400/15 text-rose-300"
                      : "bg-amber-400/15 text-amber-300"
                }`}
              >
                {deployment?.kind ?? "checking"}
              </span>
            </div>

            {deployment?.kind === "ready" ? (
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-slate-500">Contract code hash</dt>
                  <dd className="mt-1 break-all font-mono text-slate-300">
                    {deployment.codeHash}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">hash-lock.bc OutPoint</dt>
                  <dd className="mt-1 break-all font-mono text-slate-300">
                    {outPointLabel(deployment.contractOutPoint)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">ckb-js-vm OutPoint</dt>
                  <dd className="mt-1 break-all font-mono text-slate-300">
                    {outPointLabel(deployment.ckbJsVmOutPoint)}
                  </dd>
                </div>
              </dl>
            ) : deployment?.kind === "error" ? (
              <p className="mt-4 max-w-3xl text-sm leading-6 text-rose-300">
                {deployment.message}
              </p>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                Checking both dependency cells on the active network…
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => void refreshDeployment()}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Check again
          </button>
        </section>

        <section className="grid gap-10 border-b border-slate-800 py-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              01 · Build the lock
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Choose a preimage</h2>
            <label
              className="mt-6 block text-sm font-medium"
              htmlFor="preimage"
            >
              Preimage
            </label>
            <input
              id="preimage"
              value={preimage}
              disabled={phase === "submitting" || phase === "pending"}
              onChange={(event) => setPreimage(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:text-slate-500"
            />
            <p className="mt-4 break-all font-mono text-xs leading-5 text-slate-500">
              blake2b-256: 0x{hash}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              02 · Deposit
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Fund the generated address
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Use OffCKB on Devnet or a funded wallet on Testnet. Wait until the
              deposit is committed before transferring.
            </p>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-slate-500">Hash-lock address</dt>
                <dd className="mt-1 break-all font-mono text-slate-300">
                  {fromAddr || "Available when deployment health is ready"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Total live capacity</dt>
                <dd className="mt-1 text-xl font-semibold">{balance} CKB</dd>
                <button
                  type="button"
                  disabled={deployment?.kind !== "ready"}
                  onClick={() => void updateLockInfo()}
                  className="mt-3 text-sm font-medium text-cyan-300 transition hover:text-cyan-200 disabled:cursor-not-allowed disabled:text-slate-600"
                >
                  Refresh committed balance
                </button>
              </div>
              <div>
                <dt className="text-slate-500">Lock script</dt>
                <dd className="mt-1 max-h-36 overflow-auto whitespace-pre-wrap break-all rounded-md bg-slate-900 p-3 font-mono text-xs text-slate-400">
                  {fromLock
                    ? JSON.stringify(
                        fromLock,
                        (_, value) =>
                          typeof value === "bigint" ? value.toString() : value,
                        2,
                      )
                    : "Not available"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            03 · Reveal and transfer
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Spend from the hash lock
          </h2>

          <div className="mt-6 border-l-4 border-amber-400 bg-amber-400/10 px-5 py-4 text-sm leading-6 text-amber-100">
            <strong className="font-semibold">Educational behavior:</strong>{" "}
            this example returns change to the same hash lock. Revealing the
            preimage makes that change—and any untouched cells using the same
            hash—unsafe. Production transactions should send change to a
            signature-protected address.
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <label className="text-sm font-medium" htmlFor="to-address">
              Receiver address
              <input
                id="to-address"
                value={toAddr}
                onChange={(event) => setToAddr(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 outline-none transition focus:border-cyan-400"
              />
            </label>
            <label className="text-sm font-medium" htmlFor="amount">
              Amount in CKB
              <input
                id="amount"
                type="number"
                min="0"
                step="0.00000001"
                value={amountInCKB}
                onChange={(event) => setAmountInCKB(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 outline-none transition focus:border-cyan-400"
              />
            </label>
            <label
              className="text-sm font-medium lg:col-span-2"
              htmlFor="unlock-preimage"
            >
              Preimage to reveal
              <input
                id="unlock-preimage"
                value={unlockPreimage}
                onChange={(event) => setUnlockPreimage(event.target.value)}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 outline-none transition focus:border-cyan-400"
              />
              <span className="mt-2 block font-normal leading-5 text-slate-500">
                Try a wrong value to observe error 11. A rejected transaction
                does not consume the original cells.
              </span>
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={!enabled}
              onClick={() => void onTransfer()}
              className="rounded-md bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {phase === "submitting"
                ? "Submitting…"
                : phase === "pending"
                  ? "Waiting for commitment…"
                  : "Transfer CKB"}
            </button>
            <p className="text-sm text-slate-400">
              Transaction status:{" "}
              <strong className="text-slate-200">{phase}</strong>
            </p>
          </div>

          {txHash && (
            <p className="mt-5 break-all font-mono text-xs text-slate-400">
              Transaction hash: {txHash}
            </p>
          )}
          {errorMessage && (
            <p className="mt-5 border-l-4 border-rose-400 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-200">
              {errorMessage}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
