import React from 'react';
import styles from "./styles.module.css";

interface CardLayoutProps {
  children: React.ReactNode;
}

const CardLayout: React.FC<CardLayoutProps> = ({ children }) => {
  return <div className={styles.layoutContainer}>{children}</div>;
};

export default CardLayout;