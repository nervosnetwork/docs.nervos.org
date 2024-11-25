import React from "react";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

export interface TutorialHeaderProps {
  time: string;
  tools: "dapp" | "script" | "debug";
  customTools?: JSX.Element[];
}

const DAPP_HEADER: JSX.Element[] = [
  <div key="git">
    <Link
      href="https://git-scm.com/downloads"
      target="_blank"
      rel="noopener noreferrer"
    >
      Git (≥2.40.0)
    </Link>
  </div>,
  <div key="yarn">
    <Link href="https://yarnpkg.com/" target="_blank" rel="noopener noreferrer">
      Yarn (≥1.22.0)
    </Link>
  </div>,
  <div key="offckb">
    CKB dev environment:{" "}
    <Link
      to="/docs/getting-started/installation-guide#1-offckb-v030-rc2"
      target="_blank"
      rel="noopener noreferrer"
    >
      OffCKB (≥v0.3.0)
    </Link>
  </div>,
  <div key="ccc">
    JavaScript SDK:{" "}
    <Link
      to="/docs/getting-started/installation-guide#2-ccc-v010-alpha4"
      target="_blank"
      rel="noopener noreferrer"
    >
      CCC (≥v0.1.0-alpha.4)
    </Link>
  </div>,
];

const SCRIPT_HEADER: JSX.Element[] = [
  ...DAPP_HEADER,
  <div key="make">
    <Link
      to="/docs/getting-started/installation-guide#1-make-sed-bash-sha256sum"
      target="_blank"
      rel="noopener noreferrer"
    >
      Make (≥v4.3), Sed (≥v4.7), Bash (≥v5.0), sha256sum (≥v9.0)
    </Link>
  </div>,
  <div key="rust">
    <Link
      to="/docs/getting-started/installation-guide#2-rust-v1711-and-riscv64-target"
      target="_blank"
      rel="noopener noreferrer"
    >
      Rust (≥v.1.71.1) and <code>riscv64</code> target
    </Link>
  </div>,
  <div key="clang">
    <Link
      to="/docs/getting-started/installation-guide#3-clang-18"
      target="_blank"
      rel="noopener noreferrer"
    >
      Clang (≥v18)
    </Link>
  </div>,
  <div key="cargo-generate">
    <Link
      to="/docs/getting-started/installation-guide#4-cargo-generate-0170"
      target="_blank"
      rel="noopener noreferrer"
    >
      cargo-generate (≥0.17.0)
    </Link>
  </div>,
];

const DEBUG_HEADER: JSX.Element[] = [
  ...SCRIPT_HEADER,
  <div key="debugger">
    <Link
      to="/docs/getting-started/installation-guide#5-ckb-debugger-01170"
      target="_blank"
      rel="noopener noreferrer"
    >
      CKB-Debugger (≥0.117.0)
    </Link>
  </div>,
];

export default function TutorialHeader({
  time,
  tools,
  customTools,
}: TutorialHeaderProps): JSX.Element {
  const baseTools =
    tools === "dapp"
      ? DAPP_HEADER
      : tools === "script"
      ? SCRIPT_HEADER
      : tools === "debug"
      ? DEBUG_HEADER
      : [];

  const selectedTools = customTools
    ? [...baseTools, ...customTools]
    : baseTools;

  return (
    <div className={styles.box}>
      <div className={styles.subsection}>
        <strong>⏰ Estimated Time: </strong>
        {time}
      </div>
      <div className={styles.subsection}>
        <strong>🔧 What You Will Need: </strong>
      </div>
      <ul className={styles.toolList}>
        {selectedTools.map((tool, index) => (
          <li key={index}>{tool}</li>
        ))}
      </ul>
      <div className={styles.details}>
        For detailed installation steps, refer to our{" "}
        <Link to={"/docs/getting-started/installation-guide"}>
          Installation Guide
        </Link>
      </div>
    </div>
  );
}
