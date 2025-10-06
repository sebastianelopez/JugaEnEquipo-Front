"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Chat,
  FlashOn,
  Shield,
  Star,
  Radio,
  EmojiEvents,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";

export function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const theme = useTheme();
  const t = useTranslations("Landing.features");

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

  const features = [
    {
      icon: Chat,
      title: t("realtimeChat"),
      description: t("realtimeChatDesc"),
      color: theme.palette.primary.main,
    },
    {
      icon: FlashOn,
      title: t("smartMatchmaking"),
      description: t("smartMatchmakingDesc"),
      color: theme.palette.secondary.main,
    },
    {
      icon: Shield,
      title: t("safeCommunity"),
      description: t("safeCommunityDesc"),
      color: theme.palette.info.main,
    },
    {
      icon: Star,
      title: t("achievementSystem"),
      description: t("achievementSystemDesc"),
      color: theme.palette.primary.main,
    },
    {
      icon: Radio,
      title: t("integratedStreaming"),
      description: t("integratedStreamingDesc"),
      color: theme.palette.secondary.main,
    },
    {
      icon: EmojiEvents,
      title: t("globalRankings"),
      description: t("globalRankingsDesc"),
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box ref={sectionRef} component="section" id="features" sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              mb: 2,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease-out",
            }}
          >
            {t("title")}{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {t("titleHighlight")}
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease-out 0.1s",
            }}
          >
            {t("subtitle")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s ease",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${index * 100}ms`,
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "scale(1.05)",
                  boxShadow: `0 8px 24px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <feature.icon
                  sx={{ fontSize: 48, color: feature.color, mb: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
