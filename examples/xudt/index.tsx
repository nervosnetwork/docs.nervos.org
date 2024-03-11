import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Cell, Script, Transaction, utils } from '@ckb-lumos/lumos';
import { issueToken, queryIssuedTokenCells, transferTokenToAddress } from './lib';
import { capacityOf, generateAccountFromPrivateKey, readTokenAmount } from './util';

const app = document.getElementById('root');
ReactDOM.render(<App />, app);

function IssuedToken() {
  const [privKey, setPrivKey] = useState('');
  const [lockScript, setLockScript] = useState<Script>();
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');
  const [issuedTokenCell, setIssuedTokenCell] = useState<Cell>();
  const [txHash, setTxHash] = useState<string>();

  useEffect(() => {
    const updateFromInfo = async () => {
      const { lockScript, address } = generateAccountFromPrivateKey(privKey);
      const capacity = await capacityOf(address);
      setLockScript(lockScript);
      setBalance(capacity.toString());
    };

    if (privKey) {
      updateFromInfo();
    }
  }, [privKey]);

  const onInputPrivKey = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const enabledIssue = +amount > 0 && +balance > 6100000000;

  return (
    <>
      <h2>Issue Custom Token</h2>
      <p></p>
      <label htmlFor="private-key">Private Key: </label>&nbsp;
      <input id="private-key" type="text" onChange={onInputPrivKey} />
      <ul>
        <li>Balance(Total Capacity): {(+balance).toLocaleString()}</li>
        <li>
          Lock Script:
          <pre>{JSON.stringify(lockScript, null, 2)}</pre>
        </li>
        <li>Lock Script Hash: {lockScript && utils.computeScriptHash(lockScript)}</li>
      </ul>
      <br />
      <label htmlFor="amount">Token Amount: </label>
      &nbsp;
      <input id="amount" type="number" onChange={(e) => setAmount(e.target.value)} />
      <br />
      <button
        disabled={!enabledIssue}
        onClick={() =>
          issueToken(privKey, amount)
            .then((result) => {
              setIssuedTokenCell(result.targetOutput);
              setTxHash(result.hash);
            })
            .catch(alert)
        }
      >
        Issue Token
      </button>
      <div>
        {txHash && issuedTokenCell && (
          <>
            <h4>Result</h4>
            <li>Transaction hash: {txHash}</li>
            <li>
              Token xUDT args: {issuedTokenCell.cellOutput.type.args}{' '}
              <strong>
                {
                  '(Noticed that the xUDT args works like the unique id for your issued token, Think of it like an ERC20 contract address)'
                }
              </strong>
            </li>
            <li>
              Token cell: <pre>{JSON.stringify(issuedTokenCell, null, 2)}</pre>
            </li>
          </>
        )}
      </div>
    </>
  );
}

function ViewIssuedToken() {
  const [xudtArgs, setXudtArgs] = useState<string>();
  const [cells, setCells] = useState<Cell[]>([]);
  return (
    <>
      <h2>View Custom Token</h2>
      <div>
        <label htmlFor="xudt-args">xDUT args: </label>&nbsp;
        <input id="xudt-args" type="text" onChange={(e) => setXudtArgs(e.target.value)} />
      </div>

      <button disabled={!xudtArgs} onClick={() => queryIssuedTokenCells(xudtArgs).then(setCells).catch(alert)}>
        Query Issued Token
      </button>
      {cells.length > 0 && <h3>Result: all the cells which hosted this issued token</h3>}
      {cells.map((cell, index) => (
        <div key={index}>
          <p>Cell #{index}</p>
          <li>Token amount: {readTokenAmount(cell.data).toNumber()}</li>
          <li>Token xUDT args: {cell.cellOutput.type.args}</li>
          <li>Token holder's lock script args: {cell.cellOutput.lock.args}</li>
          <hr />
        </div>
      ))}
    </>
  );
}

function TransferIssuedToken() {
  const [udtArgs, setUdtArgs] = useState<string>('');
  const [senderPrivkey, setSenderPrivkey] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [tx, setTx] = useState<Transaction>();

  const onInputSenderPrivKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priv = e.target.value;
    const privateKeyRegex = /^0x[0-9a-fA-F]{64}$/;
    const isValid = privateKeyRegex.test(priv);
    if (isValid) {
      setSenderPrivkey(priv);
    } else {
      alert(
        `Invalid private key: must start with 0x and 32 bytes length. Ensure you're using a valid private key from the offckb accounts list.`,
      );
    }
  };

  const enabledCheck =
    senderPrivkey.length > 0 && udtArgs.length > 0 && transferAmount.length > 0 && receiverAddress.length > 0;

  return (
    <>
      <h2>Transfer Custom Token</h2>
      <label htmlFor="sender-private-key">Private Key: </label>&nbsp;
      <input id="sender-private-key" type="text" onChange={onInputSenderPrivKey} />
      <br />
      <label htmlFor="udt">xUDT args: </label>
      &nbsp;
      <input id="udt" type="text" onChange={(e) => setUdtArgs(e.target.value)} />
      <br />
      <label htmlFor="transferAmount">Transfer Token Amount: </label>
      &nbsp;
      <input id="transferAmount" type="number" onChange={(e) => setTransferAmount(e.target.value)} />
      <br />
      <label htmlFor="receiverAddress">Receiver Address: </label>
      &nbsp;
      <input id="receiverAddress" type="text" onChange={(e) => setReceiverAddress(e.target.value)} />
      <br />
      <button
        disabled={!enabledCheck}
        onClick={() =>
          transferTokenToAddress(udtArgs, senderPrivkey, transferAmount, receiverAddress)
            .then((res) => setTx(res.tx))
            .catch(alert)
        }
      >
        Transfer Custom Token
      </button>
      <div>
        {tx && (
          <>
            <h4>Result</h4>
            <li>
              Transaction: <pre>{JSON.stringify(tx, null, 2)}</pre>
            </li>
          </>
        )}
      </div>
    </>
  );
}

export function App() {
  return (
    <div>
      <h1>
        xUDT Scripts Dapp Example &nbsp;
        <small>
          <a href="https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0052-extensible-udt/0052-extensible-udt.md#xudt-witness">
            {'(see xUDT specs)'}
          </a>
        </small>
      </h1>
      <IssuedToken />
      <hr />
      <ViewIssuedToken />
      <hr />
      <TransferIssuedToken />
    </div>
  );
}
