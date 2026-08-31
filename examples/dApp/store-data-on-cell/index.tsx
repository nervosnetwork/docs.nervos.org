import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  buildMessageTx,
  capacityOf,
  generateAccountFromPrivateKey,
  readOnChainMessage,
  shannonToCKB,
} from "./lib";
import { Script } from "@ckb-ccc/core";
import { activeNetwork, activeRpcUrl } from "./ccc-client";

function explainError(error: unknown): string {
  const detail = error instanceof Error ? error.message : String(error);
  if (
    activeNetwork === "devnet" &&
    /(failed to fetch|network|econnrefused|connect)/i.test(detail)
  ) {
    return "Cannot connect to the local Devnet at http://127.0.0.1:28114. Run offckb node and try again.";
  }
  return detail;
}

export function App() {
  // default value: first account privkey from offckb
  const [privKey, setPrivKey] = useState(
    "0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6"
  );
  const [fromAddr, setFromAddr] = useState("");
  const [fromLock, setFromLock] = useState<Script>();
  const [balance, setBalance] = useState("0");

  const [message, setMessage] = useState("hello common knowledge base!");
  const [txHash, setTxHash] = useState<string>();
  const [confirmedMessage, setConfirmedMessage] = useState<string>();
  const [displayedMessage, setDisplayedMessage] = useState<string>();
  const [status, setStatus] = useState("Connecting to the selected network...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const updateFromInfo = async () => {
      try {
        const { lockScript, address } = await generateAccountFromPrivateKey(privKey);
        const capacity = await capacityOf(address);
        setFromAddr(address);
        setFromLock(lockScript);
        setBalance(shannonToCKB(capacity).toString());
        setStatus("Ready.");
      } catch (error) {
        setStatus(explainError(error));
      }
    };

    if (privKey) {
      updateFromInfo();
    }
  }, [privKey]);

  const onInputPrivKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Regular expression to match a valid private key with "0x" prefix
    const priv = e.target.value;
    const privateKeyRegex = /^0x[0-9a-fA-F]{64}$/;

    const isValid = privateKeyRegex.test(priv);
    if (isValid) {
      setPrivKey(priv);
    } else {
      alert(
        `Invalid private key: must start with 0x and 32 bytes length. Ensure you're using a valid private key from the offckb accounts list.`
      );
    }
  };

  const enabled = !busy && +balance > 0 && message.length > 0;
  const enabledRead = !busy && confirmedMessage !== undefined;

  const confirmMessage = async (submittedTxHash: string) => {
    setBusy(true);
    setStatus("Waiting for confirmation...");

    try {
      const storedMessage = await readOnChainMessage(submittedTxHash);
      setConfirmedMessage(storedMessage);
      setStatus("Message ready.");
    } catch (error) {
      setStatus(explainError(error));
    } finally {
      setBusy(false);
    }
  };

  const writeMessage = async () => {
    setBusy(true);
    setTxHash(undefined);
    setConfirmedMessage(undefined);
    setDisplayedMessage(undefined);
    setStatus("Submitting transaction...");

    try {
      const submittedTxHash = await buildMessageTx(message, privKey);
      setTxHash(submittedTxHash);
      await confirmMessage(submittedTxHash);
    } catch (error) {
      setStatus(explainError(error));
      setBusy(false);
    }
  };

  return (
    <div>
      <h1>Store Data on Cell</h1>
      <p>
        <strong>Network:</strong> {activeNetwork} · {activeRpcUrl}
      </p>
      <p role="status">{status}</p>
      <label htmlFor="private-key">Private Key: </label>&nbsp;
      <input
        id="private-key"
        type="text"
        value={privKey}
        onChange={onInputPrivKey}
      />
      <ul>
        <li>CKB Address: {fromAddr}</li>
        <li>
          Current Lock Script:
          <pre>{JSON.stringify(fromLock, null, 2)}</pre>
        </li>

        <li>Total capacity: {balance} CKB</li>
      </ul>
      <label htmlFor="message">write message: </label>&nbsp;
      <input
        id="message"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      &nbsp;
      <small>Tx fee: 0.001 CKB</small>
      <br />
      <br />
      <button
        disabled={!enabled}
        onClick={writeMessage}
      >
        Write
      </button>
      <hr />
      {txHash && <p>Transaction hash: {txHash}</p>}
      {txHash && confirmedMessage === undefined && !busy && (
        <button onClick={() => confirmMessage(txHash)}>Check again</button>
      )}
      <button
        disabled={!enabledRead}
        onClick={() => {
          setDisplayedMessage(confirmedMessage);
          setStatus("Message read.");
        }}
      >
        Read
      </button>
      {displayedMessage !== undefined && <p>Message: {displayedMessage}</p>}
    </div>
  );
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Unable to find the application root element.");
}

createRoot(container).render(<App />);
