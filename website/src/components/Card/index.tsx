import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import ThemedImage from '@theme/ThemedImage';

interface CardLinks {
    label: string;
    href: string;
}
export interface CardProps {
    title: string;
    description: string;
    href: string;
    type: 'tool' | 'tutorial' | 'concept';
    links?: CardLinks[];
    className?: string;
}

export default function Card({ title, description, href, type, links, className }: CardProps): JSX.Element {
    return (
       <Link href={href} className={clsx(styles.cardContainer, className)}>
            <div className={styles.iconContainer}>
                <ThemedImage 
                    alt={type}
                    sources={{
                        light: `/svg/icon-${type}-light.svg`,
                        dark: `/svg/icon-${type}-dark.svg`
                    }}
                />
            </div>
            <div className={styles.rightContainer}>
                <h4 className={styles.title}>{title}</h4>
                {links && links.length > 0 && (
                    <div className={styles.links}>
                        {links.map((link, index) => (
                            <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
                <p className={styles.description}>{description}</p>
            </div>
       </Link>
    );
}