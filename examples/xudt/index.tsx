import React, { useEffect, useState } from 'react';
import { createRoot } from "react-dom/client";
import { capacityOf, generateAccountFromPrivateKey, issueToken, queryIssuedTokenCells, shannonToCKB, transferTokenToAddress } from './lib';
import { ccc, CellOutput, Script } from '@ckb-ccc/core';

const container = document.getElementById("root");
const root = createRoot(container)
root.render(<App />);

function IssuedToken() {
  // default value: first account privkey from offckb
  const [privKey, setPrivKey] = useState('0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6');
  const [lockScript, setLockScript] = useState<Script>();
  const [balance, setBalance] = useState('0');

  // default token amount: 42
  const [amount, setAmount] = useState('42');

  const [issuedTokenCell, setIssuedTokenCell] = useState<CellOutput>();
  const [txHash, setTxHash] = useState<string>();

  useEffect(() => {
    const updateFromInfo = async () => {
      const { lockScript, address } = await generateAccountFromPrivateKey(privKey);
      const capacity = await capacityOf(address);
      setLockScript(lockScript);
      setBalance(shannonToCKB(capacity).toString());
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
  const enabledIssue = +amount > 0 && +balance > 61;

  return (
    <>
      <h2>Step 1: Issue Custom Token</h2>
      <p></p>
      <label htmlFor="private-key">Private Key: </label>&nbsp;
      <input id="private-key" type="text" value={privKey} onChange={onInputPrivKey} />
      <ul>
        <li>Balance(Total Capacity): {balance} CKB</li>
        <li>
          Lock Script:
          <pre>{JSON.stringify(lockScript, null, 2)}</pre>
        </li>
        <li>Lock Script Hash: {lockScript && lockScript.hash()}</li>
      </ul>
      <br />
      <label htmlFor="amount">Token Amount: </label>
      &nbsp;
      <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
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
              Token xUDT args: {issuedTokenCell.type?.args}{' '}
              <strong>
                {
                  '(Noticed that the xUDT args works like the unique id for your issued token, Think of it like an ERC20 contract address)'
                }
              </strong>
            </li>
            <li>
              Token cell: 
                <p>Capacity: {ccc.fixedPointToString(issuedTokenCell.capacity)} CKB</p>
                <p>Lock: {JSON.stringify(issuedTokenCell.lock, null, 2)}</p>
                <p>Type: {JSON.stringify(issuedTokenCell.type, null, 2)}</p>
            </li>
          </>
        )}
      </div>
    </>
  );
}

function ViewIssuedToken() {
  const [xudtArgs, setXudtArgs] = useState<string>();
  const [cells, setCells] = useState<ccc.Cell[]>([]);

  const onQuery = async () => {
    const cells = await queryIssuedTokenCells(xudtArgs as `0x{string}`).catch(alert);
    if(cells && cells.length > 0){
      setCells(cells);
    }else{
      alert("not found, wait for new blocks and try again.");
    }
  }
  return (
    <>
      <h2>Step 2: View Custom Token</h2>
      <div>
        <label htmlFor="xudt-args">xDUT args: </label>&nbsp;
        <input id="xudt-args" type="text" onChange={(e) => setXudtArgs(e.target.value)} />
      </div>

      <button disabled={!xudtArgs} onClick={onQuery}>
        Query Issued Token
      </button>
      {cells.length > 0 && <h3>Result: all the cells which hosted this issued token</h3>}
      {cells.map((cell, index) => (
        <div key={index}>
          <p>Cell #{index}</p>
          <li>Token amount: {ccc.numLeFromBytes(cell.outputData).toString()}</li>
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
  const [tx, setTx] = useState<ccc.Transaction>();

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
      <h2>Step 3: Transfer Custom Token</h2>
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
              Transaction: <pre>{tx.stringify()}</pre>
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
