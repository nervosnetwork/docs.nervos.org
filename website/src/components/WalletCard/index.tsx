import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export interface WalletCardProps {
  title: string;
  href: string;
  tags: string[];
  size?: "default" | "small";
  className?: string;
}

export default function WalletCard({
  title,
  href,
  tags,
  size = "default",
  className,
}: WalletCardProps): JSX.Element {
  const logoSrc = title.toLowerCase().replace(/\s+/g, "");
  const logoSize = size === "default" ? 48 : 32;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        styles.cardContainer,
        { [styles.smallCard]: size === "small" },
        className
      )}
    >
      <div
        style={{ width: logoSize, height: logoSize, minWidth: logoSize }}
        className={styles.iconContainer}
      >
        <img
          alt={`logo of ${title}`}
          src={`/svg/logo-${logoSrc}.svg`}
          width={logoSize}
          height={logoSize}
        />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.title}>{title}</div>
        {size === "default" && (
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <p key={index} className={styles.tag}>
                {tag}
              </p>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
