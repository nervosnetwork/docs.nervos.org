import clsx from "clsx";
import Link from "@docusaurus/Link";
import ThemedImage from "@theme/ThemedImage";
import styles from "./styles.module.css";
import { CardLinks } from "@site/src/pages/homeContents";

export interface EcoCardProps {
  title: string;
  description: string;
  href: string;
  bannerSrc: string;
  tags: string[];
  links: CardLinks[];
  className?: string;
}

export default function EcoCard({
  title,
  description,
  href,
  bannerSrc,
  tags,
  links,
  className,
}: EcoCardProps): JSX.Element {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles.cardContainer, className)}
    >
      <div className={styles.topContainer}>
        <img
          className={styles.banner}
          alt={bannerSrc}
          src={`/svg/banner-${bannerSrc}.svg`}
        />
      </div>
      <div className={styles.bottomContainer}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.tagList}>
          {tags.map((tag) => (
            <div className={styles.tag}>{tag}</div>
          ))}
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.links}>
          {links.map((link, index) => (
            <Link
              className={styles.iconContainer}
              key={index}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ThemedImage
                alt={link.label}
                width={24}
                height={24}
                sources={{
                  light: `/svg/icon-${link.label}-light.svg`,
                  dark: `/svg/icon-${link.label}-dark.svg`,
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </Link>
  );
}
