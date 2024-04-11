import React from "react";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import CardLayout from "../components/CardLayout";
import clsx from "clsx";
import { HomeCardSection, WalletDisplay, ToolDisplay, DevLogSection, ContactUsSection, ProjectDisplay } from "../components/Home";


export default function Home() {
  return (
    <Layout wrapperClassName={clsx(styles.homeLayout, styles.relative)} title="Home" description="Docs for Nervos CKB Blockchain dApp and smart contract development">
      <div className={styles.sectionContainer}>
        <div className={styles.flexCol}>
          <h1 className={styles.header1}>Nervos CKB Documentation</h1>
          <h4 className={styles.description}>Discover the power of Nervos CKB through tutorials, guides, and concepts</h4>
        </div>
        <HomeCardSection />
      </div>

      <div className={clsx(styles.sectionContainer, styles.relative, styles.ecoBG)}>
        <div className={clsx(styles.flexCol)}>
          <h1 className={styles.header2}>Explore <span className={styles.textHighlight}>Ecosystem</span></h1>
          <div className={styles.titleBtm}>Explore our curated selection of featured tools and resources designed to empower your development on Nervos CKB</div>
        </div>
        <CardLayout gap={40}>
          <WalletDisplay />
          <ToolDisplay />
        </CardLayout>
        <ProjectDisplay />
      </div>

      <div className={clsx(styles.sectionContainer, styles.relative, styles.updateBG, styles.flexCol)}>
        <h1 className={clsx(styles.header2, styles.titleBtm)}>Unveil <span className={styles.textHighlight}>Latest Update</span></h1>
        <DevLogSection />
      </div>

      <div className={styles.sectionContainer}>
        <ContactUsSection />
      </div>
    </Layout>
  );
}



