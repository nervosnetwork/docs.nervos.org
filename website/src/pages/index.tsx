import { useEffect } from "react";
import LogRocket from "logrocket";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import CardLayout from "../components/CardLayout";
import clsx from "clsx";
import {
  HomeCardSection,
  WalletDisplay,
  ToolDisplay,
  DevLogSection,
  ContactUsSection,
  ProjectDisplay,
} from "../components/Home";
import { useColorMode } from "@docusaurus/theme-common";
import CookieConsent from "../components/CookieConsent";

export default function Home() {
  useEffect(() => {
    // Initialize LogRocket
    LogRocket.init("ghkibu/nervos-doc");
  }, []);
  return (
    <Layout
      wrapperClassName={clsx(styles.homeLayout, styles.relative)}
      title="Home"
      description="Docs for Nervos CKB Blockchain dApp and smart contract development"
    >
      <SwitchToDark />
      <CookieConsent />
      <div className={clsx(styles.sectionContainer)}>
        <div className={styles.header1}>Nervos CKB Documentation</div>
        <h4 className={clsx(styles.description, styles.titleBtm)}>
          Discover the power of Nervos CKB through tutorials, guides, and
          concepts
        </h4>
        <HomeCardSection />
      </div>

      <div
        className={clsx(styles.sectionContainer, styles.relative, styles.ecoBG)}
      >
        <div className={styles.header2}>
          Explore <span className={styles.textHighlight}>Ecosystem</span>
        </div>
        <div className={clsx(styles.description, styles.titleBtm)}>
          Explore our curated selection of featured tools and resources designed
          to empower your development on Nervos CKB
        </div>
        <CardLayout gap={40} colNum={[2, 1, 1, 1]}>
          <WalletDisplay />
          <ToolDisplay />
        </CardLayout>
        <ProjectDisplay />
      </div>

      <div
        className={clsx(
          styles.sectionContainer,
          styles.relative,
          styles.updateBG
        )}
      >
        <div className={clsx(styles.header2, styles.titleBtm)}>
          Unveil <span className={styles.textHighlight}>Latest Update</span>
        </div>
        <DevLogSection />
      </div>

      <div className={styles.sectionContainer}>
        <ContactUsSection />
      </div>
    </Layout>
  );
}

function SwitchToDark() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode("dark");
  }, []);
  return null;
}
