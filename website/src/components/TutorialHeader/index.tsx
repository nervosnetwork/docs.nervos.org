import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

interface topicProps {
  label: string;
  href: string;
}

export interface TutorialHeaderProps {
  time: string;
  topics?: topicProps[];
  tools: JSX.Element[];
}

export default function TutorialHeader({
  time,
  topics,
  tools,
}: TutorialHeaderProps): JSX.Element {
  return (
    <div className={styles.box}>
      <h4>Tutorial Overview</h4>
      <div className={styles.subsection}><strong>⏰ Estimated Time: </strong>{time}</div>
      {topics &&
        <div className={styles.subsection}>
          <strong>💡 Topics: </strong> 
          {topics.map((topic, index) => (
            <React.Fragment key={index}>
              {index > 0 && ", "}
              <a href={topic.href}>{topic.label}</a>
            </React.Fragment>
          ))}
        </div>
      }
      <div className={styles.subsection}><strong>🔧 Tools You Need: </strong></div>
      <ul className={styles.toolList}>
        {tools.map((list, index) => (
          <li key={index}>{list}</li>
        ))}
      </ul>
    </div>
  );
}
