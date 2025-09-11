import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

interface SwitchToTestnetProps {
  readmeLink: string;
}

export default function SwitchToTestnet({ readmeLink }: SwitchToTestnetProps) {
  const examplesBaseUrl =
    useDocusaurusContext().siteConfig.customFields?.examplesBaseUrl;
  const url = `${examplesBaseUrl}${readmeLink}`;
  return (
    <>
      <p>
        Now that your dApp works great on the local blockchain, you might want
        to switch it to different environments like Testnet or Mainnet.
      </p>
      <p>
        To do that, simply change the <code>NETWORK</code> environment variable
        to <code>testnet</code>:
      </p>
      <pre>
        <code>export NETWORK=testnet</code>
      </pre>
      <p>
        Then restart the dApp. It should connect to the Testnet automatically.
      </p>
      <p>
        For more details, check out{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          the full source code
        </a>
        .
      </p>
    </>
  );
}
