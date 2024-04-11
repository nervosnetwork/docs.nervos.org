import React from 'react';
import styles from "./styles.module.css";

interface CardLayoutProps {
  children: React.ReactNode;
  topMargin?: number;
  colNum?: number;
  gap?: number;
}

const CardLayout: React.FC<CardLayoutProps> = ({ children, topMargin = 16, colNum = 2, gap = 24 }) => {
  return (
    <div 
      style={{ marginTop: topMargin, gridTemplateColumns: `repeat(${colNum}, 1fr)`, columnGap: `${gap}px`, rowGap: `${gap}px`}}
      className={styles.layoutContainer}
    >
      {children}
    </div>
  );
};

export default CardLayout;