import styles from "./styles.module.css";
import clsx from "clsx";

export interface TutorialHeaderProps {
  estimateTime: string;
  whatYouWillLearn: Array<string>;
}

export default function TutorialHeader({
  estimateTime,
  whatYouWillLearn,
}: TutorialHeaderProps): JSX.Element {
  return (
    <div className={styles.box}>
      <div className={clsx(styles.estimateTime, styles.bold)}>Estimated time: {estimateTime}</div>
      <div className={styles.bold}>What you’ll learn:</div>
      <ul>
        {whatYouWillLearn.map((list) => (
          <li key={list}>{list}</li>
        ))}
      </ul>
    </div>
  );
}
