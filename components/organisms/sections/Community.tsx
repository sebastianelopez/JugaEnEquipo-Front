"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";

export function Community() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const theme = useTheme();
  const t = useTranslations("Landing.community");

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

  const testimonials = [
    {
      name: "Alex Thunder",
      username: "@alexthunder",
      avatar: "/images/user-placeholder.png",
      game: "Valorant",
      text: t("testimonial1"),
    },
    {
      name: "Luna Storm",
      username: "@lunastorm",
      avatar: "/images/user-placeholder.png",
      game: "League of Legends",
      text: t("testimonial2"),
    },
    {
      name: "Max Velocity",
      username: "@maxvelocity",
      avatar: "/images/user-placeholder.png",
      game: "Fortnite",
      text: t("testimonial3"),
    },
  ];

  return (
    <Box
      ref={sectionRef}
      component="section"
      id="community"
      sx={{
        py: 10,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
      }}
    >
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
            <Box component="span" sx={{ color: "secondary.main" }}>
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
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              sx={{
                bgcolor: theme.palette.background.default,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: "all 0.3s ease",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${index * 100}ms`,
                "&:hover": {
                  borderColor: "secondary.main",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Avatar src={testimonial.avatar} alt={testimonial.name} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {testimonial.username}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {testimonial.text}
                </Typography>
                <Chip label={testimonial.game} size="small" color="secondary" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
