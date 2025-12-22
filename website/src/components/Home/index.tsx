import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";
import CardLayout from "../CardLayout";
import Button from "../Button";
import TutorialFrame from "../TutorialFrame";
import WalletCard, { WalletCardProps } from "../WalletCard";
import EcoCard, { EcoCardProps } from "../EcoCard";

import {
  TutorialProps,
  contactUsContents,
  devToolSectionContents,
  homeCardContents,
  tutorialSectionContents,
  uniqueSectionContents,
} from "../../pages/homeContents";

import { walletCardContents } from "../../../docs/integrate-wallets/CardContents";
import ecoCardContents from "../../../docs/ecosystem/EcoCardContents";

interface EcoSectionProps {
  title: string;
  icon: "wallet" | "project" | "devtool";
  glow?: boolean;
  topMargin?: number;
  children: React.ReactNode;
}

/* ---------------- Top cards ---------------- */
function HomeCardSection() {
  return (
    <CardLayout colNum={[3, 1, 1, 1]} gap={16}>
      {homeCardContents.map((card) => (
        <Link
          key={card.title}
          to={card.to}
          className={clsx(
            styles.section,
            card.links && styles.flexCol,
            card.to && styles.flexCenter,
            card.to && styles.smHomeCard
          )}
        >
          <div
            className={
              card.links ? styles.iconContainer : styles.iconContainerSm
            }
          >
            <img
              src={`/svg/square-${card.icon}.svg`}
              width={card.links ? 56 : 32}
              height={card.links ? 56 : 32}
              alt={card.icon}
            />
          </div>

          <h3 className={styles.cardTitle}>{card.title}</h3>

          {card.links ? (
            <div className={styles.cardLinks}>
              {card.links.map((l) => (
                <Link
                  key={l.link}
                  to={l.link}
                  className={clsx(
                    styles.flexBetween,
                    styles.link,
                    styles.line,
                    styles.borderBtm
                  )}
                >
                  {l.label}
                  <img
                    src="/svg/icon-circle-arrow.svg"
                    width={32}
                    height={32}
                    alt="Navigate to"
                  />
                </Link>
              ))}
            </div>
          ) : null}
        </Link>
      ))}
    </CardLayout>
  );
}

/* ---------------- DApp Tutorials ---------------- */
function DAppSection(): JSX.Element {
  const [selected, setSelected] = useState<TutorialProps>(
    tutorialSectionContents[0]
  );

  return (
    <div
      className={clsx(
        styles.section,
        styles.flexBetween,
        styles.tutorialSection
      )}
    >
      <div className={styles.sectionGlow}>
        <img
          src="/svg/section-glow.svg"
          width={400}
          height={400}
          alt="Glowing effect"
        />
      </div>
      <div className={styles.sectionGlowOpposite}>
        <img
          src="/svg/section-glow.svg"
          width={400}
          height={400}
          alt="Glowing effect"
        />
      </div>

      <div className={styles.tutorialLeft}>
        <h1>DApp Tutorials</h1>

        <div className={styles.tutorialSidebar}>
          {tutorialSectionContents.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => setSelected(t)}
              className={clsx(styles.tutorialItem, {
                [styles.itemActive]: selected.title === t.title,
              })}
            >
              <h4 className={styles.itemTitle}>{t.title}</h4>
              <div>{t.description}</div>
              <div className={styles.itemDecor}>
                <img src={t.illusSrc} width={230} height={82} alt="" />
              </div>
            </button>
          ))}
        </div>

        <Button internal link={selected.link}>
          Full Tutorial →
        </Button>
      </div>

      <div className={styles.tutorialFrame}>
        <TutorialFrame
          tutorialTitle={selected.title}
          iframeSrc={selected.iframeSrc}
        />
      </div>
    </div>
  );
}

/* ---------------- Unique cards ---------------- */
function UniqueCardSection(): JSX.Element {
  return (
    <div className={styles.uniqueWrap}>
      <CardLayout colNum={[3, 1, 1, 1]} gap={40} topMargin={20}>
        {uniqueSectionContents.map((card) => (
          <Link key={card.title} to={card.link} className={styles.uniqueCard}>
            <div className={styles.uniqueCardHeader}>
              <img
                className={styles.uniqueIcon}
                src={`/svg/square-${card.icon}.svg`}
                alt=""
              />
              <h3 className={styles.uniqueCardTitle}>{card.title}</h3>
            </div>

            <p className={styles.uniqueCardDesc}>{card.description}</p>

            <Button internal link={card.link} size="small">
              Learn More →
            </Button>
          </Link>
        ))}
      </CardLayout>
    </div>
  );
}

/* ---------------- Ecosystem wrapper ---------------- */
function EcoSection({
  title,
  icon,
  topMargin = 0,
  glow = false,
  children,
}: EcoSectionProps): JSX.Element {
  return (
    <div
      className={clsx(styles.section, styles.flexCol)}
      style={{ marginTop: topMargin }}
    >
      {glow ? (
        <div className={styles.sectionGlow}>
          <img src="/svg/section-glow.svg" width={400} height={400} alt="" />
        </div>
      ) : null}

      <div className={styles.flexCenter}>
        <div className={styles.iconContainer}>
          <img
            src={`/svg/square-${icon}.svg`}
            width={56}
            height={56}
            alt={icon}
          />
        </div>
        <h2>{title}</h2>
      </div>

      {children}
    </div>
  );
}

/* ---------------- Wallets ---------------- */
function WalletDisplay(): JSX.Element {
  const tags = useMemo(() => {
    const uniq: string[] = [];
    walletCardContents.forEach((card) => {
      card.tags.forEach((tag) => {
        if (!uniq.includes(tag)) uniq.push(tag);
      });
    });
    return uniq;
  }, []);

  const [currentTag, setCurrentTag] = useState("All");

  const filteredCards: WalletCardProps[] = useMemo(() => {
    return currentTag === "All"
      ? walletCardContents
      : walletCardContents.filter((c) => c.tags.includes(currentTag));
  }, [currentTag]);

  return (
    <EcoSection title="Wallets" icon="wallet">
      <div
        style={{ minHeight: 170 }}
        className={clsx(styles.flexCol, styles.noGap)}
      >
        <div className={styles.filters}>
          <button
            className={clsx(styles.tag, {
              [styles.activeTag]: currentTag === "All",
            })}
            onClick={() => setCurrentTag("All")}
            type="button"
          >
            All Wallets
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              className={clsx(styles.tag, {
                [styles.activeTag]: currentTag === tag,
              })}
              onClick={() => setCurrentTag(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>

        <CardLayout topMargin={0} colNum={[3, 2, 2, 2]} gap={20}>
          {filteredCards.map((card, idx) => (
            <WalletCard
              key={idx}
              title={card.title}
              href={card.href}
              tags={card.tags}
              size="small"
            />
          ))}
        </CardLayout>
      </div>

      <Button
        internal
        size="small"
        link="/docs/integrate-wallets/intro-to-wallets"
      >
        View wallets →
      </Button>
    </EcoSection>
  );
}

/* ---------------- Dev tools ---------------- */
function ToolDisplay(): JSX.Element {
  const sdks = devToolSectionContents.filter((t) => t.category === "SDK");
  const others = devToolSectionContents.filter(
    (t) => t.category === "Other DevTools"
  );

  return (
    <EcoSection title="SDKs & Dev Tools" icon="devtool">
      <CardLayout topMargin={0} gap={0} colNum={[2, 1, 1, 1]}>
        <div className={styles.column}>
          <div className={clsx(styles.columnHeader, styles.cell)}>SDKs</div>
          <div className={styles.flexWrap}>
            {sdks.map((tool) => (
              <Link key={tool.href} to={tool.href} className={styles.cell}>
                {tool.title}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <div className={clsx(styles.columnHeader, styles.cell)}>
            Other Dev Tools
          </div>
          <div className={styles.flexWrap}>
            {others.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cell}
              >
                {tool.title}
              </Link>
            ))}
          </div>
        </div>
      </CardLayout>

      <Button internal size="small" link="/docs/sdk-and-devtool/devtool">
        View dev tools →
      </Button>
    </EcoSection>
  );
}

/* ---------------- Projects carousel ---------------- */
function ProjectDisplay(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const filteredContent = useMemo(
    () => ecoCardContents.filter((c) => !c.tags.includes("Wallet")),
    []
  );

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const cardsToShow = windowWidth >= 996 ? 3 : windowWidth >= 769 ? 2 : 1;

  const goToPrevious = () =>
    setCurrentIndex((i) => (i > 0 ? i - 1 : filteredContent.length - 1));

  const goToNext = () =>
    setCurrentIndex((i) => (i + 1 < filteredContent.length ? i + 1 : 0));

  const items: EcoCardProps[] = [];
  for (let i = 0; i < Math.min(cardsToShow, filteredContent.length); i++) {
    items.push(filteredContent[(currentIndex + i) % filteredContent.length]);
  }

  return (
    <EcoSection topMargin={40} title="Projects" icon="project" glow>
      <div className={styles.carouselContainer}>
        <CardLayout topMargin={0} colNum={[3, 3, 2, 1]}>
          {items.map((card, idx) => (
            <EcoCard key={idx} className={styles.ecoCard} {...card} />
          ))}
        </CardLayout>
      </div>

      <div className={clsx(styles.carouselController, styles.flexBetween)}>
        <button
          onClick={goToPrevious}
          className={styles.arrowLeft}
          type="button"
          aria-label="Previous"
        >
          <img
            src="/svg/icon-chevron-right.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>

        <Button link="/docs/ecosystem/projects">Explore All Projects</Button>

        <button
          onClick={goToNext}
          className={styles.arrowRight}
          type="button"
          aria-label="Next"
        >
          <img
            src="/svg/icon-chevron-right.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>
      </div>
    </EcoSection>
  );
}

/* ---------------- Dev log ---------------- */
function DevLogSection(): JSX.Element {
  return (
    <div
      className={clsx(styles.section, styles.flexBetween, styles.devlogSection)}
    >
      <div className={styles.sectionGlow}>
        <img src="/svg/section-glow.svg" width={400} height={400} alt="" />
      </div>

      <div className={clsx(styles.flexCol, styles.leftContainer)}>
        <h1>Discover Dev Log</h1>
        <div className={styles.description}>
          Dive into the continuous evolution of the Nervos CKB through our Dev
          Log, where we document the journey of innovation, feature
          enhancements, and the collaborative efforts that drive the ecosystem
          forward.
        </div>
        <Button
          link="https://github.com/nervosnetwork/ckb/discussions/categories/dev-log"
          internal={false}
        >
          Explore Dev Log
        </Button>
      </div>

      <div className={styles.illusContainer}>
        <img alt="dev log" loading="lazy" src="/svg/illus-dev-log.svg" />
      </div>
    </div>
  );
}

/* ---------------- History ---------------- */
function HistorySection(): JSX.Element {
  return (
    <div
      className={clsx(styles.section, styles.flexBetween, styles.devlogSection)}
    >
      <div className={styles.sectionGlow}>
        <img src="/svg/section-glow.svg" width={400} height={400} alt="" />
      </div>

      <div className={clsx(styles.flexCol, styles.leftContainer)}>
        <h1>Explore CKB History & Hard Forks</h1>
        <div className={styles.description}>
          Delve into the milestones and pivotal updates that have shaped
          CKB&apos;s development. Gain detailed insights into each hard fork and
          understand their impact on the evolution of the network.
        </div>
        <Button link="/docs/history-and-hard-forks/intro-to-hard-fork">
          Explore History & Hard Forks
        </Button>
      </div>

      <div className={styles.illusContainer}>
        <img
          alt="history and hardforks"
          loading="lazy"
          src="/svg/illus-history.svg"
        />
      </div>
    </div>
  );
}

/* ---------------- CTA ---------------- */
function CTASection(): JSX.Element {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText("npm install -g @offckb/cli");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div
      className={clsx(styles.section, styles.flexBetween, styles.ctaSection)}
    >
      <div className={styles.sectionGlow}>
        <img src="/svg/sm-section-glow.svg" width={200} height={200} alt="" />
      </div>

      <div className={styles.ctaSubsection}>
        <h3>Learn Basics</h3>
        <p>
          Begin your journey with our comprehensive guide on &quot;How CKB
          Works&quot; to ensure you have a solid understanding before diving
          deeper.
        </p>
        <Button
          type="primary"
          internal
          link="/docs/getting-started/how-ckb-works"
        >
          Start Learning
        </Button>
      </div>

      <div className={clsx(styles.or, styles.alignMiddle, styles.flexCenter)}>
        <h3>OR</h3>
      </div>

      <div className={styles.ctaSubsection}>
        <h3>Jumpstart Your Development</h3>
        <p>
          Run the command below in your terminal to start developing dApps on
          the CKB Devnet immediately.
        </p>

        <button
          onClick={copy}
          className={clsx(styles.flexBetween, styles.command)}
          type="button"
        >
          {copied ? (
            "Copied to clipboard!"
          ) : (
            <>
              npm install -g @offckb/cli
              <img
                width={18}
                height={18}
                src="/svg/icon-copy-brand.svg"
                alt="Copy icon"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Footer ---------------- */
function FooterSection(): JSX.Element {
  return (
    <div className={clsx(styles.footerSection, styles.flexBetween)}>
      <div className={styles.copyright}>
        {`Copyright © ${new Date().getFullYear()} Nervos Foundation. All Rights Reserved.`}
      </div>

      <div className={clsx(styles.flexCenter, styles.icons)}>
        {contactUsContents.map((media) => (
          <Link
            key={media.label}
            href={media.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconBG}
          >
            <img
              loading="lazy"
              width={24}
              height={24}
              src={`svg/logo-media-${media.label}.svg`}
              alt={media.label}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export {
  HomeCardSection,
  DAppSection,
  UniqueCardSection,
  EcoSection,
  WalletDisplay,
  ToolDisplay,
  ProjectDisplay,
  DevLogSection,
  HistorySection,
  CTASection,
  FooterSection,
};
