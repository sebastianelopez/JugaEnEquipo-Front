import { Grid, Card, CardContent, Chip, Typography, Box } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { tournamentService } from "../../../services/tournament.service";
import { BackgroundFallback } from "../../atoms/BackgroundFallback";

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
  const [backgroundImages, setBackgroundImages] = useState<Record<string, string | null>>({});

  // Load background images for all tournaments
  useEffect(() => {
    const loadBackgroundImages = async () => {
      const imagePromises = tournaments.map(async (tournament) => {
        try {
          const result = await tournamentService.getBackgroundImage(String(tournament.id));
          if (result.ok && result.data) {
            return { id: String(tournament.id), image: result.data };
          }
          return { id: String(tournament.id), image: null };
        } catch (error) {
          console.error(`Error loading background image for tournament ${tournament.id}:`, error);
          return { id: String(tournament.id), image: null };
        }
      });

      const results = await Promise.all(imagePromises);
      const imageMap: Record<string, string | null> = {};
      results.forEach(({ id, image }) => {
        imageMap[id] = image;
      });
      setBackgroundImages(imageMap);
    };

    if (tournaments.length > 0) {
      loadBackgroundImages();
    }
  }, [tournaments]);

  return (
    <Grid container spacing={2}>
      {tournaments.map((tournament) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tournament.id}>
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
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                p: 2,
              }}
            >
              {backgroundImages[String(tournament.id)] ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${backgroundImages[String(tournament.id)]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 0,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                  }}
                >
                  <BackgroundFallback seed={tournament.name} variant="tournament" />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))`,
                    }}
                  />
                </Box>
              )}
              {tournament.placement && (
                <Chip
                  label={tournament.placement}
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 700, position: "relative", zIndex: 1 }}
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

