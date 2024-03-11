import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

interface CardLinks {
    label: string;
    href: string;
}
export interface EcoCardProps {
    title: string;
    description: string;
    href: string;
    type: 'address' | 'faucet' | 'explorer' | 'neuron';
    links: CardLinks[];
    className?: string;
}

export default function EcoCard({ title, description, href, type, links, className }: EcoCardProps): JSX.Element {
    return (
       <Link href={href} className={clsx(styles.cardContainer, className)}>
           <div className={styles.bannerContainer}>
                <img className={styles.banner} alt={type} src={`/svg/banner-${type}.svg`} />
            </div>
            <div className={styles.bottomContainer}>
                <h4 className={styles.title}>{title}</h4>
                <div className={styles.links}>
                    {links.map((link, index) => (
                        <a key={index} href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                        </a>
                    ))}
                </div>
                <p className={styles.description}>{description}</p>
            </div>
       </Link>
    );
}