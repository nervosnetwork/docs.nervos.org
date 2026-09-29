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
        To try the example on Testnet, stop the app with <code>Ctrl+C</code>,
        then run:
      </p>
      <pre>
        <code>npm run start:testnet</code>
      </pre>
      <p>
        Use a separate Testnet-only account funded with test CKB. Devnet
        balances and assets do not exist on Testnet. To return to Devnet, stop
        the app and run <code>npm start</code> with <code>NETWORK</code> unset.
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
