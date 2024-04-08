import type { MetaFunction } from "@remix-run/node";
import offckb from "offckb.config";
import { useState, useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "CKB Remix APP" },
    { name: "description", content: "Welcome to CKB Remix!" },
  ];
};

export default function Index() {
  const [ckbIndexerUrl, setCkbIndexerUrl] = useState<string>();

  useEffect(() => {
    // use NETWORK env to switch to different CKB network with different indexer/rpc
    // eg: NETWORK=devnet yarn dev
    setCkbIndexerUrl(offckb.indexer.ckbIndexerUrl);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Minimal Template for CKB Dapp</h1>
      <p>Tech stack: </p>
      <li>
        <a
          target="_blank"
          href="https://github.com/cryptape/ckb-script-templates"
          rel="noreferrer"
        >
          ckb-scripts-template
        </a>{" "}
        for smart contract development
      </li>
      <li>
        <a
          target="_blank"
          href="https://remix.run/tutorials/blog"
          rel="noreferrer"
        >
          remix-vite
        </a>{" "}
        and{"  "}
        <a
          target="_blank"
          href="https://github.com/ckb-js/lumos"
          rel="noreferrer"
        >
          Lumos
        </a>{" "}
        for frontend development
      </li>

      <p>CKB indexer url: {ckbIndexerUrl}</p>
    </div>
  );
}
