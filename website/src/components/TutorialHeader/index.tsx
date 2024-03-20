import styles from "./styles.module.css";

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
      <div className={styles.estimateTime}>Estimated time: {estimateTime}</div>
      <div>What you’ll learn:</div>
      <ul>
        {whatYouWillLearn.map((list) => (
          <li key={list}>{list}</li>
        ))}
      </ul>
    </div>
  );
}
