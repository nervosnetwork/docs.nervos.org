import { useState } from "react";
import { sendAnalyticsEvent } from "@site/src/components/AnalyticsTracking/utils";
import styles from "./styles.module.css";

type Props = {
  path: string;
  filename: string;
};

export default function LlmFileActions({ path, filename }: Props): JSX.Element {
  const [copied, setCopied] = useState(false);

  async function copyFile() {
    const response = await fetch(path);
    const text = await response.text();
    await navigator.clipboard.writeText(text);
    sendAnalyticsEvent("llms_file_action", {
      llms_action: "copy_file_content",
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <span className={styles.actions}>
      <button
        type="button"
        className={styles.iconButton}
        onClick={copyFile}
        aria-label={`Copy ${filename}`}
        title={copied ? "Copied" : "Copy file content"}
      >
        <img src="/svg/icon-copy-brand.svg" alt="" />
      </button>
      <a
        className={styles.iconButton}
        href={path}
        download={filename}
        data-llms-action-tracked="true"
        onClick={() => {
          sendAnalyticsEvent("llms_file_action", {
            llms_action: "download",
          });
        }}
        aria-label={`Download ${filename}`}
        title="Download file"
      >
        <img src="/svg/icon-download-brand.svg" alt="" />
      </a>
    </span>
  );
}
