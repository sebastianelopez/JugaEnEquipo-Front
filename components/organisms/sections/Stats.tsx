"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, alpha, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

export function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const theme = useTheme();
  const t = useTranslations("Landing.stats");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: "2M+", label: t("activePlayers") },
    { value: "500K+", label: t("dailyMatches") },
    { value: "10K+", label: t("monthlyTournaments") },
    { value: "150+", label: t("supportedGames") },
  ];

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        py: 10,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 4,
          }}
        >
          {stats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.7s ease-out",
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 700,
                  color: "primary.main",
                  mb: 1,
                }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
