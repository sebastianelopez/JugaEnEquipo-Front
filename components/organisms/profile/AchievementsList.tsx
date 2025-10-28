import { Stack, Paper, Typography, Box } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTheme } from "@mui/material/styles";

interface AchievementItem {
  title: string;
  date?: string | number | Date;
  game?: string;
  tournament?: string;
  prize?: string;
  team?: string;
}

interface AchievementsListProps {
  achievements: AchievementItem[];
}

export const AchievementsList = ({ achievements }: AchievementsListProps) => {
  const theme = useTheme();

  return (
    <Stack spacing={2}>
      {achievements.map((achievement, idx) => (
        <Paper
          key={idx}
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 3,
            borderRadius: 2,
            borderLeft: `4px solid ${theme.palette.warning.main}`,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <EmojiEventsIcon
              sx={{
                color: theme.palette.warning.main,
                fontSize: "2rem",
                mt: 0.5,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  mb: 0.5,
                }}
              >
                {achievement.title}
              </Typography>
              {achievement.tournament && (
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.9rem",
                    mb: 1,
                  }}
                >
                  {achievement.tournament}
                </Typography>
              )}
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                {achievement.game && (
                  <Typography
                    component="span"
                    sx={{ color: theme.palette.info.main, fontSize: "0.85rem" }}
                  >
                    {achievement.game}
                  </Typography>
                )}
                {achievement.team && (
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {achievement.team}
                  </Typography>
                )}
                {achievement.date && (
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {new Date(achievement.date).toLocaleDateString()}
                  </Typography>
                )}
              </Stack>
              {achievement.prize && (
                <Typography
                  sx={{
                    color: theme.palette.warning.main,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Premio: {achievement.prize}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

