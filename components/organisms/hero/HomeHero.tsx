"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { SportsEsports, People, EmojiEvents } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import { useTranslations } from "next-intl";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

export function HomeHero() {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const t = useTranslations("Landing.hero");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: SportsEsports,
      title: t("multipleGames"),
      desc: t("multipleGamesDesc"),
      color: theme.palette.primary.main,
    },
    {
      icon: People,
      title: t("activeCommunity"),
      desc: t("activeCommunityDesc"),
      color: theme.palette.secondary.main,
    },
    {
      icon: EmojiEvents,
      title: t("dailyTournaments"),
      desc: t("dailyTournamentsDesc"),
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        pt: { xs: 16, md: 20 },
        pb: { xs: 10, md: 15 },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 50%, ${alpha(
            theme.palette.info.main,
            0.1
          )} 100%)`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 900, mx: "auto", textAlign: "center" }}>
          <Chip
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: theme.palette.info.main,
                    borderRadius: "50%",
                    animation: `${pulseGlow} 2s ease-in-out infinite`,
                  }}
                />
                <Typography variant="body2">{t("newFeature")}</Typography>
              </Box>
            }
            sx={{
              mb: 4,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease-out",
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 700,
              mb: 3,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease-out 0.1s",
            }}
          >
            {t("title")}{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {t("titleHighlight")}
            </Box>{" "}
            {t("titleEnd")}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 5,
              maxWidth: 700,
              mx: "auto",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease-out 0.2s",
            }}
          >
            {t("subtitle")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              mb: 8,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease-out 0.3s",
            }}
          >
            <Button variant="contained" size="large" color="primary">
              {t("startNow")}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: alpha(theme.palette.primary.main, 0.3) }}
            >
              {t("viewDemo")}
            </Button>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
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
                  animation: `${float} 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                  "&:hover": {
                    borderColor: feature.color,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <feature.icon
                    sx={{ fontSize: 48, color: feature.color, mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
