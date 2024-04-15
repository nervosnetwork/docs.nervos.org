import clsx from "clsx";
import styles from "./styles.module.css";
import WalletCard, { WalletCardProps } from "../WalletCard";
import { useEffect, useState } from "react";
import CardLayout from "../CardLayout";
import Link from "@docusaurus/Link";
import { contactUsContents, devToolSectionContents, homeCardContents } from "@site/src/pages/homeContents";
import { walletCardContents } from "@site/docs/wallets/CardContents";
import ecoCardContents from "@site/docs/EcoCardContents";
import EcoCard, { EcoCardProps } from "../EcoCard";
import Button from "../Button";


interface EcoSectionProps {
    title: string;
    icon: 'wallet' | 'project' | 'tool';
    topMargin?: number;
    children: React.ReactNode;
}

// Card componnet at the top of the home page
function HomeCardSection() {
    return (
        <CardLayout colNum={[3, 1, 1, 1]} gap={40}>
          {homeCardContents.map((card, index)=> 
            <div key={index} className={clsx(styles.homeCard, styles.flexCol, styles.section)}>
                <div className={styles.sparkles}>
                    <img src={'/svg/sparkles.svg'} width={128} height={"auto"} alt="sparkles decoration"/>
                </div>
                <div className={styles.iconContainer}>
                    <img src={`/svg/polygon-${card.icon}.svg`} width={160} height={160} alt={card.icon}/>
                </div>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <div className={styles.cardLinks}>
                    {card.links.map((link, index) => (
                        <Link key={index} to={link.link} className={clsx(styles.flexBetween, styles.link, styles.line, styles.borderBtm)}>
                            {link.label}
                            <img src={'/svg/icon-circle-arrow.svg'} width={32} height={32} alt={"Navigate to"} />
                        </Link> 
                    ))}
                </div>
            </div>
          )}
        </CardLayout>
    );
}

// General Component for Ecosytem section
function EcoSection({title, icon, topMargin = 0, children}: EcoSectionProps): JSX.Element {
    return (
        <div className={clsx(styles.section, styles.flexCol)} style={{ marginTop: topMargin }}>
          <div className={styles.flexCenter}>
            <div className={styles.iconContainer}>
              <img src={`/svg/polygon-${icon}.svg`} width={160} height={160} alt={icon} />
            </div>
            <h2>{title}</h2>
          </div>
          {children}
        </div>
    );
}

// Wallet - A subsection under Ecosystem section
function WalletDisplay(): JSX.Element {
  const [currentTag, setCurrentTag] = useState<string>('All');
  const [tags, setTags] = useState<string[]>([]);
  const [filteredCards, setFilteredCards] = useState<WalletCardProps[]>([]);

  // Generate a list of unique tags
  useEffect(() => {
      const tagsArray: string[] = [];
      walletCardContents.forEach(card => {
          card.tags.forEach(tag => {
              if (!tagsArray.includes(tag)) {
                  tagsArray.push(tag); // Add tag if not already included
              }
          });
      });
      setTags(tagsArray);
  }, [walletCardContents]);

  // Filter cards based on the currentTag
  useEffect(() => {
      setFilteredCards(currentTag === 'All' ? walletCardContents : walletCardContents.filter(card => card.tags.includes(currentTag)));
  }, [currentTag, walletCardContents]);

  // Render filters and cards
  return (
      <EcoSection title={'Wallets'} icon={'wallet'}>
        <div style={{minHeight: 170 }} className={clsx(styles.flexCol, styles.noGap)}>
            <div className={styles.filters}>
                <button 
                    className={clsx(styles.tag, { [styles.activeTag]: currentTag === 'All' })}
                    onClick={() => setCurrentTag('All')}
                >
                    All Wallets
                </button>
                {tags.map((tag, index) => (
                    <button 
                        className={clsx(styles.tag, { [styles.activeTag]: currentTag === tag })}
                        key={index}
                        onClick={() => setCurrentTag(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <CardLayout topMargin={0} colNum={[4, 2, 2, 2]} gap={20}>
                {filteredCards.map((card, index) => (
                    <WalletCard
                        key={index}
                        title={card.title}
                        href={card.href}
                        tags={card.tags}
                        size={'small'}
                    />
                ))}
            </CardLayout>
        </div>
        <Link to={"/docs/wallets"}>View wallets →</Link>
    </EcoSection>
  );
}

// Dev Tool - A subsection under Ecosystem section
function ToolDisplay(): JSX.Element {
    // Render filters and cards
    return (
        <EcoSection title={'Dev Tools'} icon={'tool'}>
            <CardLayout topMargin={0} gap={0} colNum={[2, 1, 1, 1]}>
              <div className={styles.column}>
              <div className={clsx(styles.columnHeader, styles.cell)}>Development & Deployment</div>
                <div className={styles.flexWrap}>
                  {devToolSectionContents
                  .filter(tool => tool.category === 'Development & Deployment')
                  .map((tool, index) => (
                      <Link key={index} href={tool.href} target="_blank" rel="noopener noreferrer" className={styles.cell}>{tool.title}</Link>
                  ))}
                </div>
              </div>
              <div className={styles.column}>
                <div className={clsx(styles.columnHeader, styles.cell)}>Utilities & Testing</div>
                    <div className={styles.flexWrap}>
                        {devToolSectionContents
                        .filter(tool => tool.category === 'Utilities & Testing')
                        .map((tool, index) => (
                            <Link key={index} href={tool.href} target="_blank" rel="noopener noreferrer" className={styles.cell}>{tool.title}</Link>
                        ))}
                    </div>
              </div>
            </CardLayout>
            <Link to={"/docs/getting-started/devtool"}>View dev tools →</Link>
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
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const getCardsToShow = (): number => {
      if (windowWidth >= 996) {
        return 3;  // for >=996px
      } else if (windowWidth >= 769) {
        return 2;  // for 768px to 996px
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
            (content) => !content.tags.includes('Wallet')
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
        <EcoSection topMargin={40} title={'Projects'} icon={'project'}>
            <div className={styles.carouselContainer}>
                <CardLayout topMargin={0} colNum={[3, 3, 2, 1]}>
                    {items?.map((card, index) => (
                        <EcoCard key={index} className={styles.ecoCard} {...card} />
                    ))}
                </CardLayout>
            </div>
            <div className={clsx(styles.carouselController, styles.flexBetween)}>
                <button onClick={goToPrevious} className={styles.arrowLeft}>
                    <img src={'/svg/icon-chevron-right.svg'} width={24} height={24} alt="Previous"/>
                </button>
                <Button link={'/docs/ecosystem'}>Explore all projects</Button>
                <button onClick={goToNext} className={styles.arrowRight}>
                    <img src={'/svg/icon-chevron-right.svg'} width={24} height={24} alt="Next"/>
                </button>
            </div>
        </EcoSection>
    );
}

function DevLogSection(): JSX.Element {
    return (
        <div className={styles.section}>
            <div className={clsx(styles.flexBetween, styles.devlogSection)}>
                <div className={clsx(styles.flexCol, styles.leftContainer)}>
                    <h1>Discover Dev Log</h1>
                    <div className={styles.description}>Dive into the continuous evolution of the Nervos CKB through our Dev Log, where we document the journey of innovation, feature enhancements, and the collaborative efforts that drive the ecosystem forward.</div>
                    <Button link={'https://github.com/nervosnetwork/ckb/discussions/categories/dev-log'} internal={false}>
                        Explore Dev Log
                    </Button>
                </div>
                <div className={styles.illusContainer}>
                    <img alt={'dev log'} loading="lazy" src={'/svg/illus-dev-log.svg'} />
                </div>
            </div>
        </div>
    )
}

function ContactUsSection(): JSX.Element {
    return (
        <div className={clsx(styles.section, styles.contactSection, styles.flexBetween)}>
            <h2 className={styles.contactTitle}>Contact us: </h2>
            <div className={clsx(styles.flexCenter, styles.icons)}>
                {contactUsContents.map((media, index) => (
                    <Link key={index} href={media.link} target="_blank" rel="noopener noreferrer" className={styles.iconBG}>
                        <img loading="lazy" width={36} height={36} src={`svg/logo-media-${media.label}.svg`} alt={media.label} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export { HomeCardSection, EcoSection, WalletDisplay, ToolDisplay, ProjectDisplay, DevLogSection, ContactUsSection }