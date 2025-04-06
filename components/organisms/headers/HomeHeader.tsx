import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";

import styles from "./HomeHeader.module.css";

export const HomeHeader = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const duplicateRef = useRef<HTMLElement>(null);

  const t = useTranslations("Home");

  useEffect(() => {
    const xTo = gsap.quickTo(duplicateRef.current, "--xpercent", {
      duration: 0.4,
      ease: "back",
    });

    const yTo = gsap.quickTo(duplicateRef.current, "--ypercent", {
      duration: 0.4,
      ease: "back",
    });

    const handleMouseMove = (e: MouseEvent) => {
      // X position calculation
      const mRangeX = gsap.utils.mapRange(
        0,
        window.innerWidth,
        0,
        100,
        e.clientX
      );
      xTo(mRangeX);

      // Y position calculation - using the section's bounds
      if (sectionRef.current) {
        const bound = sectionRef.current.getBoundingClientRect();
        const mRangeY = gsap.utils.mapRange(
          bound.top,
          bound.top + bound.height,
          0,
          100,
          e.clientY
        );
        yTo(mRangeY);
      }
    };

    // Use the ref instead of querySelector
    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);

    return () => {
      section?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Box component="section" className={styles['home-header']} ref={sectionRef}>
      <Box className={styles.root}>
        <Box className={styles.containers}>
          <Box className={styles.container}>
            <Box className={styles.line}>
              <Typography className={styles.lineText}>
                {t("headerFirstLine")}
              </Typography>
            </Box>

            <Box className={styles.line}>
              <Typography className={styles.lineText}>
                {t("headerSecondLine")}
              </Typography>
            </Box>

            <Box className={styles.line}>
              <Typography className={styles.lineText}>
                {t("headerThirdLine")}
              </Typography>
            </Box>
          </Box>

          {/* Duplicate container for animation effect */}
          <Box
            className={`${styles.container} ${styles.duplicate}`}
            aria-hidden="true"
            ref={duplicateRef}
          >
            <Box className={styles.line}>
              <Typography className={styles.lineText}>
                {t("headerFirstLine")}
              </Typography>
            </Box>

            <Box className={styles.line}>
              <Typography className={styles.lineText}>
                {t("headerSecondLine")}
              </Typography>
            </Box>
            <Box className={styles.line}>
              <Typography className={styles.lineText}>
                {t("headerThirdLine")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
