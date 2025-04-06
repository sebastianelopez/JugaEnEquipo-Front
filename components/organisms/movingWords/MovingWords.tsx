import Lenis from "lenis";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { Box } from "@mui/material";

import styles from "./MovingWords.module.css";

gsap.registerPlugin(ScrollTrigger);

interface MovingWordsProps {
  words: string[];
}

const MovingWords: React.FC<MovingWordsProps> = ({ words }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  const addToLettersRef = (el: HTMLSpanElement | null) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    const lettersAnimation = gsap.to(lettersRef.current, {
      yPercent: 100,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: listRef.current,
        start: "33.33% bottom",
        end: "100% 80%",
        scrub: 1,
        markers: true,
      },
      stagger: {
        each: 0.05,
        from: "random",
      },
    });

    return () => {
      lenis.destroy();
      lettersAnimation.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Box  component="section" className={styles["moving-words"]}>
      <ul ref={listRef}>
        {words.map((word, wordIndex) => (
          <li key={wordIndex}>
            {word.split("").map((char, charIndex) => (
              <span
                className={styles.letter}
                ref={addToLettersRef}
                key={charIndex}
              >
                <span>{char}</span>
                <span>{char}</span>
              </span>
            ))}
            &nbsp;
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default MovingWords;
