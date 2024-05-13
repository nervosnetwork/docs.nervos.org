import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has already given consent
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "given") {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Store the consent in localStorage
    localStorage.setItem("cookieConsent", "given");
    setIsVisible(false);
  };
  if (!isVisible) return null;

  return (
    <div className={styles.cookieBanner}>
      <div className={styles.text}>
        <h4>We use cookies</h4>
        <div className={styles.description}>
          We use cookies and other tracking technologies to improve your
          browsing experience on our doc.
        </div>
      </div>
      <button className={styles.button} onClick={handleAccept}>
        Accept cookies
      </button>
    </div>
  );
};

export default CookieConsent;
