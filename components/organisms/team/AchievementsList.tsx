import { FC } from "react";
import { Paper, Stack, Typography, Chip } from "@mui/material";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import { useTheme } from "@mui/material/styles";

interface Achievement {
  title: string;
  date: string;
  game: string;
  prize: string;
}

interface Props {
  achievements: Achievement[];
  title: string;
  formatDate: (iso: string) => string;
  formatPrize: (prize: string) => string;
}

export const AchievementsList: FC<Props> = ({
  achievements,
  title,
  formatDate,
  formatPrize,
}) => {
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <TrophyIcon
          sx={{ color: theme.palette.warning.main, fontSize: "1.5rem" }}
        />
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
        >
          {title}
        </Typography>
      </Stack>
      <Stack spacing={2}>
        {achievements.map((a, i) => (
          <Paper
            key={i}
            sx={{
              bgcolor: theme.palette.background.default,
              p: 3,
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.warning.main}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TrophyIcon
                sx={{
                  color: theme.palette.warning.main,
                  fontSize: "2rem",
                  mt: 0.5,
                }}
              />
              <div style={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    mb: 0.5,
                  }}
                >
                  {a.title}
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                  <Chip
                    label={a.game}
                    size="small"
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontSize: "0.75rem",
                    }}
                  />
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {formatDate(a.date)}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    color: theme.palette.warning.main,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  {formatPrize(a.prize)}
                </Typography>
              </div>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </>
  );
};

export default AchievementsList;
