import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/dist/Observer";
import Image from "next/image";
import { Box } from "@mui/material";

import styles from "./InfiniteCarousel.module.css";

interface InfiniteCarouselProps {
  images: string[];
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(Observer);

    let total = 0;
    let xTo: (arg0: number) => void;
    const itemValues: number[] = [];

    const content = containerRef.current;
    const cards = content?.querySelectorAll(`.${styles.card}`);
    const cardsLength = cards ? cards.length / 2 : 0;
    const half = content ? content.clientWidth / 2 : 0;

    if (!content || !cards || cards.length === 0) return;

    const wrap = gsap.utils.wrap(-half, 0);

    xTo = gsap.quickTo(content, "x", {
      duration: 0.5,
      ease: "power3",
      modifiers: {
        x: gsap.utils.unitize(wrap),
      },
    });

    for (let i = 0; i < cardsLength; i++) {
      itemValues.push((Math.random() - 0.5) * 20);
    }

    const tl = gsap.timeline({ paused: true });
    tl.to(cards, {
      rotate: (index) => itemValues[index % cardsLength],
      xPercent: (index) => itemValues[index % cardsLength],
      yPercent: (index) => itemValues[index % cardsLength],
      scale: 0.95,
      duration: 0.5,
      ease: "back.inOut(3)",
    });

    const observer = Observer.create({
      target: content,
      type: "pointer,touch",
      onPress: () => tl.play(),
      onDrag: (self) => {
        total += self.deltaX;
        xTo(total);
      },
      onRelease: () => tl.reverse(),
      onStop: () => tl.reverse(),
    });

    const tick = (time: number, deltaTime: number) => {
      total -= deltaTime / 10;
      xTo(total);
    };

    gsap.ticker.add(tick);

    return () => {
      observer.kill();
      gsap.ticker.remove(tick);
    };
  }, [images]);

  return (
    <Box
      component="section"
      className={styles["infinite-carousel"]}
      aria-label="Image carousel"
      role="region"
    >
      <Box className={styles["container"]} ref={containerRef}>
        {images.map((image, index) => (
          <Box key={`image-${index}`} className={styles.card}>
            <Image
              src={image}
              alt={`Carousel image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={styles["image"]}
            />
          </Box>
        ))}
        {images.map((image, index) => (
          <Box key={`duplicate-image-${index}`} className={styles.card}>
            <Image
              src={image}
              alt={`Duplicated carousel image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={styles["image"]}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InfiniteCarousel;
