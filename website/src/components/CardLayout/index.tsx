import React from 'react';
import styles from "./styles.module.css";

interface CardLayoutProps {
  children: React.ReactNode;
  topMargin?: number;
}

const CardLayout: React.FC<CardLayoutProps> = ({ children, topMargin = 16 }) => {
  return <div style={{marginTop: topMargin}}className={styles.layoutContainer}>{children}</div>;
};

export default CardLayout;