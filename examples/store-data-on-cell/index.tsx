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

const container = document.getElementById("root");
const root = createRoot(container)
root.render(<App />);

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

  useEffect(() => {
    const updateFromInfo = async () => {
      const { lockScript, address } = await generateAccountFromPrivateKey(privKey);
      const capacity = await capacityOf(address);
      setFromAddr(address);
      setFromLock(lockScript);
      setBalance(shannonToCKB(capacity).toString());
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

  const enabled = +balance > 0 && message.length > 0;
  const enabledRead = !!txHash;

  return (
    <div>
      <h1>Store Data on Cell</h1>
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
        onClick={() => {
          buildMessageTx(message, privKey).then(txHash => setTxHash(txHash));
        }}
      >
        Write
      </button>
      <hr />
      {txHash && <li>tx Hash: {txHash}</li>}
      <button
        disabled={!enabledRead}
        onClick={() => {
          readOnChainMessage(txHash);
        }}
      >
        Read
      </button>
     
    </div>
  );
}
