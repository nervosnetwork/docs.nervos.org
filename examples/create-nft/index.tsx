import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Script } from '@ckb-lumos/lumos';
import { capacityOf, generateAccountFromPrivateKey, createSporeNFT } from './lib';

const app = document.getElementById('root');
ReactDOM.render(<App />, app);

export function App() {
  // default value: first account privkey from offckb
  const [privKey, setPrivKey] = useState('0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6');
  const [fromAddr, setFromAddr] = useState('');
  const [fromLock, setFromLock] = useState<Script>();
  const [balance, setBalance] = useState('0');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<Uint8Array | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);

      const reader = new FileReader();
      reader.onload = () => {
        // Access the file content here
        const content = reader.result;
        if (content && content instanceof ArrayBuffer) {
          const uint8Array = new Uint8Array(content);
          setFileContent(uint8Array);
          console.log("content: ", uint8Array);
        }
      };

      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(files[0]);
    }
  };


  const enabled = +balance > 0 && !!fileContent;

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

        <li>Total capacity: {(+balance).toLocaleString()}</li>
      </ul>
      <small>Tx fee: 100,000 (0.001 CKB)</small>
      <br />
      <br />
      <div>
      <h4>Upload NFT Image File</h4>
      <input
        type="file"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div>
          <p>File Size: {selectedFile.size} bytes</p>
        </div>
      )}
    </div>
    <br />
    <br />
      <button
        disabled={!enabled}
        onClick={() => createSporeNFT(privKey, fileContent)}
      >
        Create NFT
      </button>
    </div>
  );
}
