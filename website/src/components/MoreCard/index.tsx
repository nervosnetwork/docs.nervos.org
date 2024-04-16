import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export interface MoreCardProps {
    title: string;
    to: string;
    className?: string;
}

export default function MoreCard({ title, to, className }: MoreCardProps): JSX.Element {
    return (
       <Link to={to} className={clsx(styles.cardContainer, className)}>
         <p className={styles.description}>{title}</p>
       </Link>
    );
}