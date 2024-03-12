import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Script } from '@ckb-lumos/lumos';
import { capacityOf, generateAccountFromPrivateKey, transfer } from './lib';

const app = document.getElementById('root');
ReactDOM.render(<App />, app);

export function App() {
  const [privKey, setPrivKey] = useState('');
  const [fromAddr, setFromAddr] = useState('');
  const [fromLock, setFromLock] = useState<Script>();
  const [balance, setBalance] = useState('0');

  const [toAddr, setToAddr] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const updateFromInfo = async () => {
      const { lockScript, address } = generateAccountFromPrivateKey(privKey);
      const capacity = await capacityOf(address);
      setFromAddr(address);
      setFromLock(lockScript);
      setBalance(capacity.toString());
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
        `Invalid private key: must start with 0x and 32 bytes length. Ensure you're using a valid private key from the offckb accounts list.`,
      );
    }
  };

  const enabled = +amount > 6100000000 && +balance > +amount && toAddr.length > 0;
  const amountTip =
    amount.length > 0 && +amount < 6100000000 ? (
      <span>
        amount must larger than 6,100,000,000(61 CKB), see{' '}
        <a href="https://medium.com/nervosnetwork/understanding-the-nervos-dao-and-cell-model-d68f38272c24">why</a>
      </span>
    ) : null;

  return (
    <div>
      <h1>View and Transfer Balance</h1>
      <label htmlFor="private-key">Private Key: </label>&nbsp;
      <input id="private-key" type="text" onChange={onInputPrivKey} />
      <ul>
        <li>CKB Address: {fromAddr}</li>
        <li>
          Current lock script:
          <pre>{JSON.stringify(fromLock, null, 2)}</pre>
        </li>

        <li>Total capacity: {(+balance).toLocaleString()}</li>
      </ul>
      <label htmlFor="to-address">Transfer to Address: </label>&nbsp;
      <input id="to-address" type="text" onChange={(e) => setToAddr(e.target.value)} />
      <br />
      <label htmlFor="amount">Amount</label>
      &nbsp;
      <input id="amount" type="number" onChange={(e) => setAmount(e.target.value)} />
      <small>Tx fee: 100,000 (0.001 CKB)</small>
      <br />
      <small style={{ color: 'red' }}>{amountTip}</small>
      <br />
      <br />
      <button
        disabled={!enabled}
        onClick={() => transfer({ amount, from: fromAddr, to: toAddr, privKey }).catch(alert)}
      >
        Transfer
      </button>
    </div>
  );
}
