import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  capacityOf,
  generateAccountFromPrivateKey,
  createSporeDOB,
  showSporeContent,
  shannonToCKB,
} from "./lib";
import { hexStringToUint8Array } from "./helper";
import { RawSporeData } from "@spore-sdk/core";
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<Uint8Array | null>(null);

  const [txHash, setTxHash] = useState<string>();
  const [outputIndex, setOutputIndex] = useState<number>();
  const [rawSporeData, setRawSporeData] = useState<RawSporeData>();
  const [imageURL, setImageURL] = useState<string>();

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
        }
      };

      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(files[0]);
    }
  };

  const createSpore = async () => {
    const { txHash, outputIndex } = await createSporeDOB(privKey, fileContent);
    setTxHash(txHash);
    setOutputIndex(outputIndex);
  };

  const renderSpore = async () => {
    const res = await showSporeContent(txHash, outputIndex);
    if (!res) return;
    setRawSporeData(res);

    // Create Blob from binary data
    const buffer = hexStringToUint8Array(res.content.toString().slice(2));
    const blob = new Blob([buffer], { type: res.contentType });
    const url = URL.createObjectURL(blob);
    setImageURL(url);
  };

  const enabled = +balance > 0 && !!fileContent;
  const enabledRead = !!txHash && outputIndex != null;

  return (
    <div>
      <h1>Create on-chain digital objects</h1>
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
          Current lock script:
          <pre>{JSON.stringify(fromLock, null, 2)}</pre>
        </li>

        <li>Total capacity: {balance} CKB</li>
      </ul>
      <small>Tx fee: 0.001 CKB</small>
      <br />
      <br />
      <div>
        <h4>Upload DOB Image File</h4>
        <input type="file" onChange={handleFileChange} />
        {selectedFile && (
          <div>
            <p>File Size: {selectedFile.size} bytes</p>
          </div>
        )}
      </div>
      <br />
      <br />
      <button disabled={!enabled} onClick={createSpore}>
        Create DOB
      </button>
      <hr />
      {txHash && <li>tx Hash: {txHash}</li>}
      <button disabled={!enabledRead} onClick={renderSpore}>
        Check Spore Content
      </button>
      {rawSporeData && (
        <div>
          <p>contentType: {rawSporeData.contentType}</p>
        </div>
      )}
      {imageURL && <img src={imageURL} />}
    </div>
  );
}
