import styles from "./styles.module.css";

interface ImgContainerProps {
    alt?: string;
    src: string;
}

export default function ImgContaienr({ alt, src }: ImgContainerProps): JSX.Element {
    return (
       <div className={styles.imgContainer}>
            <img alt={alt} src={src} />
       </div>
    );
}