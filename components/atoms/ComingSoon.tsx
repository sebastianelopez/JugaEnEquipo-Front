"use client";

import { Box, Typography, Chip, SxProps, Theme } from "@mui/material";
import { AccessTime, Construction } from "@mui/icons-material";
import { useTranslations } from "next-intl";

interface ComingSoonProps {
  variant?: "default" | "minimal" | "large";
  message?: string;
  sx?: SxProps<Theme>;
}

export const ComingSoon = ({
  variant = "default",
  message,
  sx,
}: ComingSoonProps) => {
  const t = useTranslations("ComingSoon");
  const displayMessage = message || t("comingSoon");

  if (variant === "minimal") {
    return (
      <Chip
        icon={<AccessTime />}
        label={displayMessage}
        color="primary"
        sx={{
          ...sx,
          borderRadius: 0.8,
          animation: "pulse 2s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.7 },
          },
        }}
      />
    );
  }

  if (variant === "large") {
    return (
      <Box
        sx={{
          ...sx,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          py: 8,
          px: 4,
          minHeight: "400px",
        }}
      >
        <Construction
          sx={{
            fontSize: 80,
            color: "primary.main",
            animation: "bounce 2s ease-in-out infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        />
        <Typography
          variant="h3"
          sx={{
            ...sx,
            fontWeight: 700,
            background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
          }}
        >
          {displayMessage}
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {t("workingOnFeature")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 6,
        px: 3,
        borderRadius: 2,
        border: "2px dashed",
        borderColor: "primary.main",
        bgcolor: "rgba(108, 92, 231, 0.05)",
        animation: "fadeIn 0.5s ease-in-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
      }}
    >
      <AccessTime
        sx={{
          fontSize: 48,
          color: "primary.main",
          animation: "rotate 3s linear infinite",
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "primary.main",
        }}
      >
        {displayMessage}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {t("availableSoon")}
      </Typography>
    </Box>
  );
};
