import { FC } from "react";
import { Grid, Paper, Avatar, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Game {
  name: string;
  icon: string;
}

interface Props {
  games: Game[];
  title: string;
}

export const TeamGamesGrid: FC<Props> = ({ games, title }) => {
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
        >
          {title}
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        {games.map((game, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper
              sx={{
                bgcolor: theme.palette.background.default,
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={game.icon}
                alt={game.name}
                sx={{ width: 48, height: 48 }}
              />
              <Typography
                sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
              >
                {game.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TeamGamesGrid;
