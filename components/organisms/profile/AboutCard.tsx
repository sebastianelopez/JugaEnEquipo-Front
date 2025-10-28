import { Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";

interface StatItem {
  label: string;
  value: string | number;
  color?: "primary" | "secondary" | "warning" | "success" | "info";
}

interface AboutCardProps {
  aboutText: string;
  stats?: StatItem[];
}

export const AboutCard = ({ aboutText, stats = [] }: AboutCardProps) => {
  const theme = useTheme();
  const t = useTranslations("Profile");

  return (
    <Card
      sx={{ bgcolor: theme.palette.background.paper, borderRadius: 3, mb: 3 }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 3 }}
        >
          {t("about", { default: "Sobre mí" })}
        </Typography>

        <Typography
          sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, mb: 3 }}
        >
          {aboutText}
        </Typography>

        {stats.length > 0 && (
          <Grid container spacing={2}>
            {stats.map((s, idx) => (
              <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                <Paper
                  sx={{
                    bgcolor: theme.palette.background.default,
                    p: 2,
                    textAlign: "center",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: theme.palette[s.color || "primary"].main,
                      fontWeight: 800,
                    }}
                  >
                    {s.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {s.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
