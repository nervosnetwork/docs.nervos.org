import clsx from "clsx";
import styles from "./styles.module.css";
import WalletCard, { WalletCardProps } from "../WalletCard";
import { useEffect, useState } from "react";
import CardLayout from "../CardLayout";
import Link from "@docusaurus/Link";
import EcoCard, { EcoCardProps } from "../EcoCard";
import Button from "../Button";
import {
  TutorialProps,
  contactUsContents,
  devToolSectionContents,
  homeCardContents,
  tutorialSectionContents,
} from "../../pages/homeContents";
import { walletCardContents } from "../../../docs/integrate-wallets/CardContents";
import ecoCardContents from "../../../docs/ecosystem/EcoCardContents";
import TutorialFrame from "../TutorialFrame";

interface EcoSectionProps {
  title: string;
  icon: "wallet" | "project" | "devtool";
  glow?: boolean;
  topMargin?: number;
  children: React.ReactNode;
}

// Card component at the top of the home page
function HomeCardSection() {
  return (
    <CardLayout colNum={[3, 1, 1, 1]} gap={16}>
      {homeCardContents.map((card, index) => (
        <Link
          key={index}
          to={card.to}
          className={clsx(
            styles.section,
            { [styles.flexCol]: card.links },
            { [styles.flexCenter]: card.to },
            { [styles.smHomeCard]: card.to }
          )}
        >
          {card.links ? (
            <div className={styles.iconContainer}>
              <img
                src={`/svg/square-${card.icon}.svg`}
                width={56}
                height={56}
                alt={card.icon}
              />
            </div>
          ) : (
            <div className={styles.iconContainerSm}>
              <img
                src={`/svg/square-${card.icon}.svg`}
                width={32}
                height={32}
                alt={card.icon}
              />
            </div>
          )}
          <h3 className={styles.cardTitle}>{card.title}</h3>
          {card.links && (
            <div className={styles.cardLinks}>
              {card.links.map((link, index) => (
                <Link
                  key={index}
                  to={link.link}
                  className={clsx(
                    styles.flexBetween,
                    styles.link,
                    styles.line,
                    styles.borderBtm
                  )}
                >
                  {link.label}
                  <img
                    src={"/svg/icon-circle-arrow.svg"}
                    width={32}
                    height={32}
                    alt={"Navigate to"}
                  />
                </Link>
              ))}
            </div>
          )}
        </Link>
      ))}
    </CardLayout>
  );
}

function DAppSection(): JSX.Element {
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialProps>(
    tutorialSectionContents[0]
  );

  const handleTutorialClick = (tutorial: TutorialProps) => {
    setSelectedTutorial(tutorial);
  };

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
          src={`/svg/section-glow.svg`}
          width={400}
          height={400}
          alt={"Glowing effect"}
        />
      </div>
      <div className={styles.sectionGlowOpposite}>
        <img
          src={`/svg/section-glow.svg`}
          width={400}
          height={400}
          alt={"Glowing effect"}
        />
      </div>
      <div className={styles.tutorialLeft}>
        <h1>DApp Tutorials</h1>
        <div className={styles.tutorialSidebar}>
          {tutorialSectionContents.map((tutorial, index) => (
            <div
              key={index}
              onClick={() => handleTutorialClick(tutorial)}
              className={clsx(styles.tutorialItem, {
                [styles.itemActive]: selectedTutorial.title === tutorial.title,
              })}
            >
              <h4 className={styles.itemTitle}>{tutorial.title}</h4>
              <div>{tutorial.description}</div>
              <div className={styles.itemDecor}>
                <img src={tutorial.illusSrc} width={230} height={82} />
              </div>
            </div>
          ))}
        </div>
        <Button internal link={selectedTutorial.link}>
          Full Tutorial →
        </Button>
      </div>
      <div className={styles.tutorialFrame}>
        <TutorialFrame
          tutorialTitle={selectedTutorial.title}
          iframeSrc={selectedTutorial.iframeSrc}
        />
      </div>
    </div>
  );
}

// General Component for Ecosytem section
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
      {glow && (
        <div className={styles.sectionGlow}>
          <img src={`/svg/section-glow.svg`} width={400} height={400} />
        </div>
      )}
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

// Wallet - A subsection under Ecosystem section
function WalletDisplay(): JSX.Element {
  const [currentTag, setCurrentTag] = useState<string>("All");
  const [tags, setTags] = useState<string[]>([]);
  const [filteredCards, setFilteredCards] = useState<WalletCardProps[]>([]);

  // Generate a list of unique tags
  useEffect(() => {
    const tagsArray: string[] = [];
    walletCardContents.forEach((card) => {
      card.tags.forEach((tag) => {
        if (!tagsArray.includes(tag)) {
          tagsArray.push(tag); // Add tag if not already included
        }
      });
    });
    setTags(tagsArray);
  }, [walletCardContents]);

  // Filter cards based on the currentTag
  useEffect(() => {
    setFilteredCards(
      currentTag === "All"
        ? walletCardContents
        : walletCardContents.filter((card) => card.tags.includes(currentTag))
    );
  }, [currentTag, walletCardContents]);

  // Render filters and cards
  return (
    <EcoSection title={"Wallets"} icon={"wallet"}>
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
          >
            All Wallets
          </button>
          {tags.map((tag, index) => (
            <button
              className={clsx(styles.tag, {
                [styles.activeTag]: currentTag === tag,
              })}
              key={index}
              onClick={() => setCurrentTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <CardLayout topMargin={0} colNum={[3, 2, 2, 2]} gap={20}>
          {filteredCards.map((card, index) => (
            <WalletCard
              key={index}
              title={card.title}
              href={card.href}
              tags={card.tags}
              size={"small"}
            />
          ))}
        </CardLayout>
      </div>
      <Button
        internal
        size={"small"}
        link={"/docs/integrate-wallets/intro-to-wallets"}
      >
        View wallets →
      </Button>
    </EcoSection>
  );
}

// Dev Tool - A subsection under Ecosystem section
function ToolDisplay(): JSX.Element {
  // Render filters and cards
  return (
    <EcoSection title={"SDKs & Dev Tools"} icon={"devtool"}>
      <CardLayout topMargin={0} gap={0} colNum={[2, 1, 1, 1]}>
        <div className={styles.column}>
          <div className={clsx(styles.columnHeader, styles.cell)}>SDKs</div>
          <div className={styles.flexWrap}>
            {devToolSectionContents
              .filter((tool) => tool.category === "SDK")
              .map((tool, index) => (
                <Link key={index} to={tool.href} className={styles.cell}>
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
            {devToolSectionContents
              .filter((tool) => tool.category === "Other DevTools")
              .map((tool, index) => (
                <Link
                  key={index}
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
      <Button internal size={"small"} link={"/docs/sdk-and-devtool/devtool"}>
        View dev tools →
      </Button>
    </EcoSection>
  );
}

function ProjectDisplay(): JSX.Element {
  const [filteredContent, setFilteredContent] = useState<EcoCardProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function updateDimensions() {
      setWindowWidth(window.innerWidth);
    }
    updateDimensions(); // Set initial size at client-side
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const getCardsToShow = (): number => {
    if (windowWidth >= 996) {
      return 3; // for >=996px
    } else if (windowWidth >= 769) {
      return 2; // for 768px to 996px
    }
    return 1;
  };

  const cardsToShow = getCardsToShow();

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : filteredContent.length - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 < filteredContent.length ? prevIndex + 1 : 0
    );
  };

  useEffect(() => {
    const filtered = ecoCardContents.filter(
      (content) => !content.tags.includes("Wallet")
    );
    setFilteredContent(filtered);
  }, []);

  // Creating a looped set of cards
  const items = [];
  if (filteredContent && filteredContent.length > 0) {
    for (let i = 0; i < cardsToShow; i++) {
      items.push(filteredContent[(currentIndex + i) % filteredContent.length]);
    }
  }

  return (
    <EcoSection topMargin={40} title={"Projects"} icon={"project"} glow>
      <div className={styles.carouselContainer}>
        <CardLayout topMargin={0} colNum={[3, 3, 2, 1]}>
          {items?.map((card, index) => (
            <EcoCard key={index} className={styles.ecoCard} {...card} />
          ))}
        </CardLayout>
      </div>
      <div className={clsx(styles.carouselController, styles.flexBetween)}>
        <button onClick={goToPrevious} className={styles.arrowLeft}>
          <img
            src={"/svg/icon-chevron-right.svg"}
            width={24}
            height={24}
            alt="Previous"
          />
        </button>
        <Button link={"/docs/ecosystem/projects"}>Explore All Projects</Button>
        <button onClick={goToNext} className={styles.arrowRight}>
          <img
            src={"/svg/icon-chevron-right.svg"}
            width={24}
            height={24}
            alt="Next"
          />
        </button>
      </div>
    </EcoSection>
  );
}

function DevLogSection(): JSX.Element {
  return (
    <div
      className={clsx(styles.section, styles.flexBetween, styles.devlogSection)}
    >
      <div className={styles.sectionGlow}>
        <img src={`/svg/section-glow.svg`} width={400} height={400} />
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
          link={
            "https://github.com/nervosnetwork/ckb/discussions/categories/dev-log"
          }
          internal={false}
        >
          Explore Dev Log
        </Button>
      </div>
      <div className={styles.illusContainer}>
        <img alt={"dev log"} loading="lazy" src={"/svg/illus-dev-log.svg"} />
      </div>
    </div>
  );
}

function HistorySection(): JSX.Element {
  return (
    <div
      className={clsx(styles.section, styles.flexBetween, styles.devlogSection)}
    >
      <div className={styles.sectionGlow}>
        <img src={`/svg/section-glow.svg`} width={400} height={400} />
      </div>
      <div className={clsx(styles.flexCol, styles.leftContainer)}>
        <h1>Explore CKB History & Hard Forks</h1>
        <div className={styles.description}>
          Delve into the milestones and pivotal updates that have shaped CKB's
          development. Gain detailed insights into each hard fork and understand
          their impact on the evolution of the network.
        </div>
        <Button link={"/docs/history-and-hard-forks/intro-to-hard-fork"}>
          Explore History & Hard Forks
        </Button>
      </div>
      <div className={styles.illusContainer}>
        <img
          alt={"history and hardforks"}
          loading="lazy"
          src={"/svg/illus-history.svg"}
        />
      </div>
    </div>
  );
}

function CTASection(): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    const textToCopy = "npm install -g @offckb/cli";

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Change text back after 3 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div
      className={clsx(styles.section, styles.flexBetween, styles.ctaSection)}
    >
      <div className={styles.sectionGlow}>
        <img src={`/svg/sm-section-glow.svg`} width={200} height={200} />
      </div>
      <div className={styles.ctaSubsection}>
        <h3>Learn Basics</h3>
        <p>
          Begin your journey with our comprehensive guide on "How CKB Works” to
          ensure you have a solid understanding before diving deeper.
        </p>
        <Button
          type={"primary"}
          internal
          link={"/docs/getting-started/how-ckb-works"}
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
        <div
          onClick={handleCopyToClipboard}
          className={clsx(styles.flexBetween, styles.command)}
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
        </div>
      </div>
    </div>
  );
}

function FooterSection(): JSX.Element {
  return (
    <div className={clsx(styles.footerSection, styles.flexBetween)}>
      <div className={styles.copyright}>
        {`Copyright © ${new Date().getFullYear()} Nervos Foundation. All Rights Reserved.`}
      </div>
      <div className={clsx(styles.flexCenter, styles.icons)}>
        {contactUsContents.map((media, index) => (
          <Link
            key={index}
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
  EcoSection,
  WalletDisplay,
  ToolDisplay,
  ProjectDisplay,
  DevLogSection,
  HistorySection,
  CTASection,
  FooterSection,
};
