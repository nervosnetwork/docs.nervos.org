import React from 'react';
import styles from "./styles.module.css";

interface CardLayoutProps {
  children: React.ReactNode;
  topMargin?: number;
  colNum?: number;
}

const CardLayout: React.FC<CardLayoutProps> = ({ children, topMargin = 16, colNum = 2 }) => {
  return (
    <div 
      style={{ marginTop: topMargin, gridTemplateColumns: `repeat(${colNum}, 1fr)`}}
      className={styles.layoutContainer}
    >
      {children}
    </div>
  );
};

export default CardLayout;