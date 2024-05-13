import React from "react";
import styles from "./styles.module.css";

interface CardLayoutProps {
  children: React.ReactNode;
  topMargin?: number;
  colNum?: number[];
  gap?: number;
}

const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  topMargin = 16,
  colNum = [2, 1, 2, 1],
  gap = 24,
}) => {
  return (
    <div
      style={
        {
          marginTop: `${topMargin}px`,
          "--gap": `${gap}px`,
          "--columnL": colNum[0], // Columns for large screens
          "--columnM": colNum[1], // Columns for medium screens
          "--columnS": colNum[2], // Columns for small screens
          "--columnXS": colNum[3], // Columns for extra small screens
        } as React.CSSProperties
      }
      className={styles.layoutContainer}
    >
      {children}
    </div>
  );
};

export default CardLayout;
