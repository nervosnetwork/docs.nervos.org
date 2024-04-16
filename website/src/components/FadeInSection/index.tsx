import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface FadeInSectionProps {
  children: React.ReactNode;
  transformY?: number;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, transformY = 40, className }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      ref={domRef}
      className={clsx(styles.fadeInSection, { [styles.isVisible]: isVisible }, className)}
      style={{ transform: `translateY(${!isVisible ? transformY : 0}px)`}}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
