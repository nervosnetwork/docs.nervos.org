import React, { useState } from "react";
import styles from "./styles.module.css";

interface CopyLinkProps {
  url: string;
  children: React.ReactNode;
}

const CopyLink: React.FC<CopyLinkProps> = ({ url, children }) => {
  const [linkText, setLinkText] = useState<React.ReactNode>(children);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault(); // Prevent the default download behavior
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setLinkText("Link copied to clipboard!");
      setTimeout(() => {
        setIsCopied(false);
        setLinkText(children);
      }, 3000);
    });
  };

  return (
    <div onClick={copyToClipboard} className={styles.link}>
      {linkText}
      {!isCopied && (
        <img
          width={18}
          height={18}
          src="/svg/icon-copy-brand.svg"
          alt="Copy link"
          className={styles.icon}
        />
      )}
    </div>
  );
};

export default CopyLink;
