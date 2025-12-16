import { FC, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  MilitaryTech as MedalIcon,
} from "@mui/icons-material";
import { tournamentService } from "../../../services/tournament.service";
import { teamService } from "../../../services/team.service";
import type { Tournament, Team } from "../../../interfaces";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

interface TournamentWinnersProps {
  tournamentId: string;
}

interface WinnerData {
  team: Team | null;
  position: "first" | "second" | "third";
}

export const TournamentWinners: FC<TournamentWinnersProps> = ({
  tournamentId,
}) => {
  const theme = useTheme();
  const t = useTranslations("Tournaments");
  const router = useRouter();
  const [winners, setWinners] = useState<WinnerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWinners = async () => {
      if (!tournamentId) return;

      setLoading(true);
      try {
        const result = await tournamentService.find(tournamentId);

        if (result.ok && result.data) {
          const tournament = result.data as any;
          const winnersData: WinnerData[] = [];

          if (tournament.firstPlaceTeamId) {
            const teamResult = await teamService.find(tournament.firstPlaceTeamId);
            if (teamResult.ok && teamResult.data) {
              winnersData.push({
                team: teamResult.data,
                position: "first",
              });
            }
          }

          if (tournament.secondPlaceTeamId) {
            const teamResult = await teamService.find(tournament.secondPlaceTeamId);
            if (teamResult.ok && teamResult.data) {
              winnersData.push({
                team: teamResult.data,
                position: "second",
              });
            }
          }

          if (tournament.thirdPlaceTeamId) {
            const teamResult = await teamService.find(tournament.thirdPlaceTeamId);
            if (teamResult.ok && teamResult.data) {
              winnersData.push({
                team: teamResult.data,
                position: "third",
              });
            }
          }

          setWinners(winnersData);
        }
      } catch (error) {
        console.error("Error loading winners:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWinners();
  }, [tournamentId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (winners.length === 0) {
    return null;
  }

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "first":
        return t("detail.firstPlace") || "Primer Lugar";
      case "second":
        return t("detail.secondPlace") || "Segundo Lugar";
      case "third":
        return t("detail.thirdPlace") || "Tercer Lugar";
      default:
        return "";
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "first":
        return theme.palette.warning.main;
      case "second":
        return theme.palette.text.secondary;
      case "third":
        return "#CD7F32";
      default:
        return theme.palette.primary.main;
    }
  };

  const getPositionIcon = (position: string) => {
    if (position === "first") {
      return <TrophyIcon sx={{ fontSize: 32 }} />;
    }
    return <MedalIcon sx={{ fontSize: 24 }} />;
  };

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: { xs: 2, md: 3 },
        border: `1px solid ${theme.palette.secondary.dark}`,
        mb: { xs: 2, md: 3 },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 3,
            fontSize: {
              xs: "1.25rem",
              sm: "1.5rem",
              md: "1.75rem",
            },
          }}
        >
          {t("detail.winners") || "Ganadores"}
        </Typography>

        <Stack spacing={2}>
          {winners.map((winner) => {
            if (!winner.team) return null;

            const team = winner.team;
            return (
              <Box
                key={team.id}
                onClick={() => router.push(`/teams/${team.id}`)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === "dark" 
                    ? theme.palette.action.hover 
                    : theme.palette.grey[50],
                  border: `2px solid ${getPositionColor(winner.position)}`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                    bgcolor: theme.palette.mode === "dark" 
                      ? theme.palette.action.selected 
                      : theme.palette.grey[100],
                  },
                }}
              >
                <Box
                  sx={{
                    color: getPositionColor(winner.position),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                  }}
                >
                  {getPositionIcon(winner.position)}
                </Box>
                <Avatar
                  src={team.image}
                  alt={team.name}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${getPositionColor(winner.position)}`,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      fontSize: "1rem",
                      mb: 0.5,
                    }}
                  >
                    {team.name}
                  </Typography>
                  <Chip
                    label={getPositionLabel(winner.position)}
                    size="small"
                    sx={{
                      bgcolor: getPositionColor(winner.position),
                      color: theme.palette.common.white,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

