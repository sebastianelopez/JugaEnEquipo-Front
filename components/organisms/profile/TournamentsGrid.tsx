import { Grid, Card, CardContent, Chip, Typography, Box } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useRouter } from "next/router";

interface TournamentItem {
  id: string | number;
  name: string;
  game?: string;
  image?: string;
  date?: string | number | Date;
  placement?: string;
}

interface TournamentsGridProps {
  tournaments: TournamentItem[];
}

export const TournamentsGrid = ({ tournaments }: TournamentsGridProps) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Grid container spacing={2}>
      {tournaments.map((tournament) => (
        <Grid item xs={12} sm={6} md={4} key={tournament.id}>
          <Card
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.3s ease",
              ":hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 20px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
              },
            }}
            onClick={() => router.push(`/tournaments/${tournament.id}`)}
          >
            <Box
              sx={{
                height: 120,
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${
                  tournament.image || "/public/assets/images.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
                p: 2,
              }}
            >
              {tournament.placement && (
                <Chip
                  label={tournament.placement}
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  mb: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {tournament.name}
              </Typography>
              {tournament.game && (
                <Typography
                  sx={{
                    color: theme.palette.info.main,
                    fontSize: "0.8rem",
                    mb: 0.5,
                  }}
                >
                  {tournament.game}
                </Typography>
              )}
              {tournament.date && (
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  {new Date(tournament.date).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

