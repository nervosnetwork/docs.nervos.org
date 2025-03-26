import styles from "./styles.module.css";

export interface HardForkTimeProps {
  mainnetDate?: string;
  mainnetEpoch?: string | number;
  testnetDate?: string;
  testnetEpoch?: string | number;
}

export default function HardForkTime({
  mainnetDate = "July 1, 2025",
  mainnetEpoch = "12293",
  testnetDate = "Oct 25, 2024",
  testnetEpoch = "9690",
}: HardForkTimeProps): JSX.Element {
  return (
    <div className={styles.box}>
      <div className={styles.mainnet}>
        <h4 className={styles.subtitle}>Mainnet Launch</h4>
        <div className={styles.value}>
          {"📅 Date: "}
          <strong>{mainnetDate}</strong>
        </div>
        <div className={styles.value}>
          {"⏳ Epoch number: "}
          <strong>{mainnetEpoch}</strong>
        </div>
      </div>
      <div className={styles.testnet}>
        <h4 className={styles.subtitle}>Testnet Launch</h4>
        <div className={styles.value}>
          {"📅 Date: "}
          <strong>{testnetDate}</strong>
        </div>
        <div className={styles.value}>
          {"⏳ Epoch number: "}
          <strong>{testnetEpoch}</strong>
        </div>
      </div>
    </div>
  );
}
