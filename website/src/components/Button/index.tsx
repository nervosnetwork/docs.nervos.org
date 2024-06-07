import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface ButtonProps {
  link: string;
  type?: "primary" | "secondary";
  size?: "small" | "default";
  internal?: boolean;
  children: React.ReactNode;
  className?: string;
}
export default function Button({
  link,
  type = "secondary",
  size = "default",
  internal = true,
  children,
  className,
}: ButtonProps): JSX.Element {
  if (internal) {
    return (
      <Link
        className={clsx(
          { [styles.secBtn]: type === "secondary" },
          { [styles.priBtn]: type === "primary" },
          { [styles.smallBtn]: size === "small" },
          className
        )}
        to={link}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      className={clsx(
        { [styles.secBtn]: type === "secondary" },
        { [styles.priBtn]: type === "primary" },
        { [styles.smallBtn]: size === "small" },
        className
      )}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}
