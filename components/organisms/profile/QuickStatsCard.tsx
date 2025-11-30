import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";

interface QuickStatsProps {
  currentTeams: number;
  activeGames: number;
  totalAchievements: number;
}

export const QuickStatsCard = ({
  currentTeams,
  activeGames,
  totalAchievements,
}: QuickStatsProps) => {
  const theme = useTheme();
  const t = useTranslations("Profile");

  return (
    <Card sx={{ bgcolor: theme.palette.background.paper, borderRadius: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
          }}
        >
          {t("quickStats", { default: "Estadísticas Rápidas" })}
        </Typography>
        <Stack spacing={2}>
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}
            >
              {t("currentTeams", { default: "Equipos Actuales" })}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.info.main,
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              {currentTeams}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}
            >
              {t("activeGames", { default: "Juegos Activos" })}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              {activeGames}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}
            >
              {t("totalAchievements", { default: "Total Logros" })}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.warning.main,
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              {totalAchievements}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

