import React, { useCallback, useState, useRef, useEffect } from "react";
import clsx from "clsx";
import copy from "copy-text-to-clipboard";
import { translate } from "@docusaurus/Translate";
import type { Props } from "@theme/CodeBlock/CopyButton";
import IconCopy from "@theme/Icon/Copy";
import IconSuccess from "@theme/Icon/Success";
import {
  getLlmsFileNameFromText,
  sendAnalyticsEvent,
} from "@site/src/components/AnalyticsTracking/utils";

import styles from "./styles.module.css";

function getCodeBlockMetadata(button: HTMLButtonElement | null): {
  code_block_index?: number;
  code_block_label?: string;
} {
  const codeBlock = button?.closest<HTMLElement>(".theme-code-block");
  const title = codeBlock
    ?.querySelector<HTMLElement>("[class*='codeBlockTitle']")
    ?.textContent?.trim();
  const codeBlocks = Array.from(
    document.querySelectorAll<HTMLElement>(".theme-code-block")
  );
  const codeBlockIndex = codeBlock ? codeBlocks.indexOf(codeBlock) + 1 : 0;
  const fallbackLabel =
    codeBlockIndex > 0 ? `snippet_${codeBlockIndex}` : "snippet";

  return {
    code_block_index: codeBlockIndex || undefined,
    code_block_label: title || fallbackLabel,
  };
}

export default function CopyButton({ code, className }: Props): JSX.Element {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef<number | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const handleCopyCode = useCallback(() => {
    copy(code);
    setIsCopied(true);
    const codeBlockMetadata = getCodeBlockMetadata(buttonRef.current);

    sendAnalyticsEvent("copy_code", {
      ...codeBlockMetadata,
    });

    const llmsFile = getLlmsFileNameFromText(code);

    if (llmsFile) {
      sendAnalyticsEvent("llms_file_action", {
        llms_action: "copy_reference",
      });
    }

    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [code]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={
        isCopied
          ? translate({
              id: "theme.CodeBlock.copied",
              message: "Copied",
              description: "The copied button label on code blocks",
            })
          : translate({
              id: "theme.CodeBlock.copyButtonAriaLabel",
              message: "Copy code to clipboard",
              description: "The ARIA label for copy code blocks button",
            })
      }
      title={translate({
        id: "theme.CodeBlock.copy",
        message: "Copy",
        description: "The copy button label on code blocks",
      })}
      className={clsx(
        "clean-btn",
        className,
        styles.copyButton,
        isCopied && styles.copyButtonCopied
      )}
      onClick={handleCopyCode}
    >
      <span className={styles.copyButtonIcons} aria-hidden="true">
        <IconCopy className={styles.copyButtonIcon} />
        <IconSuccess className={styles.copyButtonSuccessIcon} />
      </span>
    </button>
  );
}
