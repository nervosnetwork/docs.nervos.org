import { useEffect } from "react";
import LogRocket from "logrocket";
import Layout from "@theme/Layout";
import clsx from "clsx";
import { useColorMode } from "@docusaurus/theme-common";

import styles from "./styles.module.css";
import CardLayout from "../components/CardLayout";
import CookieConsent from "../components/CookieConsent";

import {
  HomeCardSection,
  DAppSection,
  UniqueCardSection,
  WalletDisplay,
  ToolDisplay,
  ProjectDisplay,
  DevLogSection,
  HistorySection,
  CTASection,
  FooterSection,
} from "../components/Home";

export default function Home() {
  useEffect(() => {
    LogRocket.init("ghkibu/nervos-doc");
  }, []);

  return (
    <Layout
      wrapperClassName={clsx(styles.homeLayout, styles.relative)}
      title="Home"
      description="Docs for Nervos CKB Blockchain dApp and Script development"
    >
      <img
        className={styles.headerGlow}
        src="/svg/header-glow.svg"
        alt="glowing effect"
      />

      <ForceDarkMode />
      <CookieConsent />

      <Section>
        <h1 className={styles.header1}>Nervos CKB Documentation</h1>
        <p className={clsx(styles.description, styles.titleBtm)}>
          Discover the power of Nervos CKB through tutorials, guides, and
          concepts
        </p>
        <HomeCardSection />
      </Section>

      <Section>
        <DAppSection />
      </Section>

      <Section>
        <UniqueHeader />
        <UniqueCardSection />
      </Section>

      <Section className={clsx(styles.relative, styles.ecoBG)}>
        <h2 className={styles.header2}>
          Explore <span className={styles.textHighlight}>Ecosystem</span>
        </h2>
        <p className={clsx(styles.description, styles.titleBtm)}>
          Explore our curated selection of featured tools and resources designed
          to empower your development on Nervos CKB
        </p>

        <CardLayout gap={40} colNum={[2, 1, 1, 1]}>
          <WalletDisplay />
          <ToolDisplay />
        </CardLayout>

        <ProjectDisplay />
      </Section>

      <Section className={clsx(styles.relative, styles.updateBG)}>
        <h2 className={clsx(styles.header2, styles.titleBtm)}>
          Unveil{" "}
          <span className={styles.textHighlight}>Updates and Evolution</span>
        </h2>
        <DevLogSection />
        <HistorySection />
      </Section>

      <Section>
        <h2 className={styles.header2}>Ready to Dive In?</h2>
        <p className={clsx(styles.description, styles.titleBtm)}>
          Whether you&apos;re curious about how CKB works or eager to jump
          straight into building, we&apos;ve got you covered.
        </p>
        <CTASection />
      </Section>

      <FooterSection />
    </Layout>
  );
}

function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx(styles.sectionContainer, className)}>{children}</div>
  );
}

function UniqueHeader() {
  return (
    <div className={styles.uniqueHeader}>
      <h2
        className={clsx(
          styles.header2,
          styles.textLeftAlign,
          styles.noTop,
          styles.uniqueMaxWidth
        )}
      >
        What Makes CKB
        <span className={styles.textHighlight}> Unique</span>
      </h2>

      <p
        className={clsx(
          styles.description,
          styles.textLeftAlign,
          styles.uniqueMaxWidth
        )}
      >
        CKB combines PoW security, quantum-resistant cryptography, and a RISC-V
        VM—built for long-term, verifiable applications
      </p>
    </div>
  );
}

function ForceDarkMode() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode("dark");
  }, [setColorMode]);

  return null;
}
