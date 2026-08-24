import React from "react";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { selectTutorialTools } from "./selectTools.mjs";

export interface TutorialHeaderProps {
  time: string;
  tools?: "dapp" | "script" | "debug";
  customTools?: JSX.Element[];
  requiredTools?: JSX.Element[];
  children?: React.ReactNode;
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
  <div key="offckb">
    CKB dev environment:{" "}
    <Link
      to="https://github.com/ckb-devrel/offckb"
      target="_blank"
      rel="noopener noreferrer"
    >
      OffCKB (≥v0.4.0)
    </Link>
  </div>,
  <div key="ccc">
    JavaScript SDK:{" "}
    <Link
      to="https://github.com/ckb-devrel/ccc"
      target="_blank"
      rel="noopener noreferrer"
    >
      CCC (≥v0.0.14-alpha.0)
    </Link>
  </div>,
];

const SCRIPT_HEADER: JSX.Element[] = [
  <div key="make">
    <Link
      to="https://ftp.gnu.org/gnu/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Make (≥v4.3), Sed (≥v4.7), Bash (≥v5.0), sha256sum (≥v9.0)
    </Link>
  </div>,
  <div key="rust">
    <Link
      to="https://www.rust-lang.org/tools/install"
      target="_blank"
      rel="noopener noreferrer"
    >
      Rust (≥v.1.71.1) and <code>riscv64</code> target
    </Link>
  </div>,
  <div key="clang">
    <Link
      to="https://releases.llvm.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Clang (≥v18)
    </Link>
  </div>,
  <div key="cargo-generate">
    <Link
      to="https://crates.io/crates/cargo-generate"
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
      to="https://github.com/nervosnetwork/ckb-standalone-debugger"
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
  requiredTools,
  children,
}: TutorialHeaderProps): JSX.Element {
  const baseTools =
    tools === "dapp"
      ? DAPP_HEADER
      : tools === "script"
      ? SCRIPT_HEADER
      : tools === "debug"
      ? DEBUG_HEADER
      : [];

  const selectedTools = selectTutorialTools(
    baseTools,
    customTools,
    requiredTools
  );

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
      {children ? <div className={styles.details}>{children}</div> : null}
    </div>
  );
}
