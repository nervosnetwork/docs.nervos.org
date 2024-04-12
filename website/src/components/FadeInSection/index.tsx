import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface FadeInSectionProps {
  children: React.ReactNode;
  transformY?: number;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, transformY = 160, className }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (domRef.current) {
      const { top } = domRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (top <= windowHeight * 0.9) {  // Trigger when element comes within 90% of the viewport
        setVisible(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
