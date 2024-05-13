import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import ThemedImage from "@theme/ThemedImage";
import { CardLinks } from "@site/src/pages/homeContents";

export interface CardProps {
  title: string;
  description: string;
  link: string;
  type: "tool" | "tutorial" | "concept";
  links?: CardLinks[];
  internal?: boolean;
  className?: string;
}

export default function Card({
  title,
  description,
  link,
  type,
  links,
  internal = true,
  className,
}: CardProps): JSX.Element {
  const props = { title, description, link, type, links, className };
  if (internal) {
    return (
      <Link to={link} className={clsx(styles.cardContainer, className)}>
        <CardContent {...props} />
      </Link>
    );
  }
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles.cardContainer, className)}
    >
      <CardContent {...props} />
    </Link>
  );
}

function CardContent({ title, description, type, links }: CardProps) {
  return (
    <>
      <div className={styles.iconContainer}>
        <ThemedImage
          alt={type}
          sources={{
            light: `/svg/icon-${type}-light.svg`,
            dark: `/svg/icon-${type}-dark.svg`,
          }}
        />
      </div>
      <div className={styles.rightContainer}>
        <h4 className={styles.title}>{title}</h4>
        {links && links.length > 0 && (
          <div className={styles.links}>
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
        <p className={styles.description}>{description}</p>
      </div>
    </>
  );
}
