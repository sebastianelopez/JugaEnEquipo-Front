import { FC } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  totalTournaments: number;
  wins: number;
  winRate: number; // percentage
  tournamentsLabel: string;
  winsLabel: string;
  winRateLabel: string;
}

export const TeamStats: FC<Props> = ({
  totalTournaments,
  wins,
  winRate,
  tournamentsLabel,
  winsLabel,
  winRateLabel,
}) => {
  const theme = useTheme();
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
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
            sx={{ color: theme.palette.info.main, fontWeight: 800 }}
          >
            {totalTournaments}
          </Typography>
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}
          >
            {tournamentsLabel}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
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
            sx={{ color: theme.palette.success.main, fontWeight: 800 }}
          >
            {wins}
          </Typography>
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}
          >
            {winsLabel}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
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
            sx={{ color: theme.palette.warning.main, fontWeight: 800 }}
          >
            {winRate}%
          </Typography>
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}
          >
            {winRateLabel}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TeamStats;
