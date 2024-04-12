import React from "react";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import CardLayout from "../components/CardLayout";
import clsx from "clsx";
import { HomeCardSection, WalletDisplay, ToolDisplay, DevLogSection, ContactUsSection, ProjectDisplay } from "../components/Home";
import FadeInSection from "../components/FadeInSection";


export default function Home() {
  return (
    <Layout wrapperClassName={clsx(styles.homeLayout, styles.relative)} title="Home" description="Docs for Nervos CKB Blockchain dApp and smart contract development">
      <FadeInSection transformY={40} className={clsx(styles.sectionContainer)}>
          <div className={styles.header1}>Nervos CKB Documentation</div>
          <h4 className={clsx(styles.description, styles.titleBtm)}>Discover the power of Nervos CKB through tutorials, guides, and concepts</h4>
        <HomeCardSection />
      </FadeInSection>

      <FadeInSection className={clsx(styles.sectionContainer, styles.relative, styles.ecoBG)}>
          <div className={styles.header2}>Explore <span className={styles.textHighlight}>Ecosystem</span></div>
          <div className={styles.description}>Explore our curated selection of featured tools and resources designed to empower your development on Nervos CKB</div>
        <CardLayout gap={40} colNum={[2, 1, 1, 1]}>
          <WalletDisplay />
          <ToolDisplay />
        </CardLayout>
        <ProjectDisplay />
      </FadeInSection>

      <FadeInSection className={clsx(styles.sectionContainer, styles.relative, styles.updateBG)}>
        <div className={clsx(styles.header2, styles.titleBtm)}>Unveil <span className={styles.textHighlight}>Latest Update</span></div>
        <DevLogSection />
      </FadeInSection>

      <FadeInSection className={styles.sectionContainer}>
        <ContactUsSection />
      </FadeInSection>
    </Layout>
  );
}



