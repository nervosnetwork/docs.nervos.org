import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export interface WalletCardProps {
    title: string;
    href: string;
    description: string;
    className?: string;
}

export default function WalletCard({ title, href, description, className }: WalletCardProps): JSX.Element {
    const logoSrc = title.toLowerCase().replace(/\s+/g, '');
    return (
       <Link href={href} className={clsx(styles.cardContainer, className)}>
            <div className={styles.iconContainer}>
                <img 
                    alt={`logo of ${title}`}
                    src={`/svg/logo-${logoSrc}.svg`}
                />
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.title}>{title}</div>
                <p className={styles.description}>{description}</p>
            </div>
       </Link>
    );
}