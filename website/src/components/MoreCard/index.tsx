import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export interface MoreCardProps {
    title: string;
    href: string;
    className?: string;
}

export default function MoreCard({ title, href, className }: MoreCardProps): JSX.Element {
    return (
       <Link href={href} className={clsx(styles.cardContainer, className)}>
         <p className={styles.description}>{title}</p>
       </Link>
    );
}