import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from 'react';
import { capacityOf, generateAccountFromPrivateKey, shannonToCKB, transfer, wait } from './lib';
import { Script } from '@ckb-ccc/core';

const container = document.getElementById("root");
const root = createRoot(container)
root.render(<App />);

export function App() {
  // default value: first account privkey from offckb
  const [privKey, setPrivKey] = useState('0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6');
  const [fromAddr, setFromAddr] = useState('');
  const [fromLock, setFromLock] = useState<Script>();
  const [balance, setBalance] = useState('0');

  // default value: second account address from offckb
  const [toAddr, setToAddr] = useState('ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqt435c3epyrupszm7khk6weq5lrlyt52lg48ucew');
  // default value: 62 CKB
  const [amountInCKB, setAmountInCKB] = useState('62');

  const [isTransferring, setIsTransferring] = useState(false);
  const [txHash, setTxHash] = useState<string>();

  useEffect(() => {
    if (privKey) {
      updateFromInfo();
    }
  }, [privKey]);

  const updateFromInfo = async () => {
    const { lockScript, address } = await generateAccountFromPrivateKey(privKey);
    const capacity = await capacityOf(address);
    setFromAddr(address);
    setFromLock(lockScript);
    setBalance(shannonToCKB(capacity).toString());
  };

  const onInputPrivKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Regular expression to match a valid private key with "0x" prefix
    const priv = e.target.value;
    const privateKeyRegex = /^0x[0-9a-fA-F]{64}$/;

    const isValid = privateKeyRegex.test(priv);
    if (isValid) {
      setPrivKey(priv);
    } else {
      alert(
        `Invalid private key: must start with 0x and 32 bytes length. Ensure you're using a valid private key from the offckb accounts list.`,
      );
    }
  };

  const onTransfer = async () => {
    setIsTransferring(true);
    const txHash = await transfer(toAddr, amountInCKB, privKey).catch(alert);

    // We can wait for this txHash to be on-chain so that we can trigger the UI/UX updates including balance.
    if(txHash){
      setTxHash(txHash);
      // wait 10 seconds for tx confirm
      // the right way to do this is to use get_transaction rpc but here we just keep it simple
      await wait(10);
      
      await updateFromInfo();
    }
    
   setIsTransferring(false);
  }

  const enabled = +amountInCKB > 61 && +balance > +amountInCKB && toAddr.length > 0 && !isTransferring;
  const amountTip =
    amountInCKB.length > 0 && +amountInCKB < 61 ? (
      <span>
        amount must larger than 61 CKB, see{' '}
        <a href="https://docs.nervos.org/docs/wallets/#requirements-for-ckb-transfers">why</a>
      </span>
    ) : null;

  return (
    <div>
      <h1>View and Transfer Balance</h1>
      <label htmlFor="private-key">Private Key: </label>&nbsp;
      <input id="private-key" type="text" value={privKey} onChange={onInputPrivKey} />
      <ul>
        <li>CKB Address: {fromAddr}</li>
        <li>
          Current lock script:
          <pre>{JSON.stringify(fromLock, null, 2)}</pre>
        </li>

        <li>Total capacity: {balance} CKB</li>
      </ul>
      <label htmlFor="to-address">Transfer to Address: </label>&nbsp;
      <input id="to-address" type="text" value={toAddr} onChange={(e) => setToAddr(e.target.value)} />
      <br />
      <label htmlFor="amount">Amount</label>
      &nbsp;
      <input id="amount" type="number" value={amountInCKB} onChange={(e) => setAmountInCKB(e.target.value)} />CKB{" "}
      <small>Tx fee: 0.001 CKB</small>
      <br />
      <small style={{ color: 'red' }}>{amountTip}</small>
      <br />
      <br />
      <button
        disabled={!enabled}
        onClick={onTransfer}
      >
        Transfer
      </button>
      {txHash && <div>tx hash: {txHash}</div>}
    </div>
  );
}
