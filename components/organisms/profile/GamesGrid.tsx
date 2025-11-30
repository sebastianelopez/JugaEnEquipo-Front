import { Grid, Paper, Avatar, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface GameItem {
  name: string;
  icon?: string;
  rank?: string;
  hoursPlayed?: number;
}

interface GamesGridProps {
  games: GameItem[];
}

export const GamesGrid = ({ games }: GamesGridProps) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      {games.map((game, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
          <Paper
            sx={{
              bgcolor: theme.palette.background.paper,
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              transition: "all 0.3s ease",
              ":hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 20px rgba(0,0,0,0.2)`,
              },
            }}
          >
            <Avatar
              src={game.icon}
              alt={game.name}
              sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}
            />
            <Typography
              sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1 }}
            >
              {game.name}
            </Typography>
            {game.rank && (
              <Chip
                label={game.rank}
                size="small"
                color="primary"
                sx={{ fontWeight: 600, mb: 1 }}
              />
            )}
            {typeof game.hoursPlayed !== "undefined" && (
              <Typography
                sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
              >
                {game.hoursPlayed.toLocaleString()} horas
              </Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
