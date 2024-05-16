import React, { useState, useEffect } from "react";
import clsx from "clsx";
import EcoCard, { EcoCardProps } from "../EcoCard";
import CardLayout from "../CardLayout";
import styles from "./styles.module.css";

interface TagFilterProps {
  cardData: EcoCardProps[];
}

const TagFilter: React.FC<TagFilterProps> = ({ cardData }) => {
  const [currentTag, setCurrentTag] = useState("All");
  const [tags, setTags] = useState<Record<string, number>>({});
  const [filteredCards, setFilteredCards] = useState<EcoCardProps[]>([]);

  // Compute unique tags and their counts
  useEffect(() => {
    const tagCounts = cardData.reduce(
      (acc: Record<string, number>, card: EcoCardProps) => {
        card.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      },
      {}
    );

    setTags(tagCounts);
  }, [cardData]);

  // Filter cards based on the currentTag
  useEffect(() => {
    if (currentTag === "All") {
      setFilteredCards(cardData);
    } else {
      const filtered = cardData.filter((card) =>
        card.tags.includes(currentTag)
      );
      setFilteredCards(filtered);
    }
  }, [currentTag, cardData]);

  // Render filters and cards
  return (
    <div>
      <div className={styles.filters}>
        <button
          className={clsx(styles.tag, {
            [styles.activeTag]: currentTag === "All",
          })}
          onClick={() => setCurrentTag("All")}
        >
          {`All Projects (${cardData.length})`}
        </button>
        {Object.entries(tags).map(([tag, count]) => (
          <button
            className={clsx(styles.tag, {
              [styles.activeTag]: currentTag === tag,
            })}
            key={tag}
            onClick={() => setCurrentTag(tag)}
          >
            {`${tag} (${count})`}
          </button>
        ))}
      </div>
      <CardLayout>
        {filteredCards.map((card, index) => (
          <EcoCard
            key={index}
            title={card.title}
            description={card.description}
            href={card.href}
            bannerSrc={card.bannerSrc}
            tags={card.tags}
            links={card.links}
          />
        ))}
      </CardLayout>
    </div>
  );
};

export default TagFilter;
