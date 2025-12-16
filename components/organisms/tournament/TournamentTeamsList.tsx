import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { RemoveCircle as RemoveCircleIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { Tournament, Team } from "../../../interfaces";

interface TournamentTeamsListProps {
  tournament: Tournament | null;
  teams: Team[];
  canEditTournament: boolean;
  hasTournamentEnded: boolean;
  onRemoveTeam: (team: Team) => void;
}

export const TournamentTeamsList = ({
  tournament,
  teams,
  canEditTournament,
  hasTournamentEnded,
  onRemoveTeam,
}: TournamentTeamsListProps) => {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations("Tournaments");

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: { xs: 2, md: 3 },
        border: `1px solid ${theme.palette.secondary.dark}`,
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
          {`${t("detail.participatingTeams")} (${
            tournament?.registeredTeams ?? 0
          })`}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          {teams.map((team: Team) => (
            <Box key={team.id} sx={{ position: "relative" }}>
              {canEditTournament && (
                <Tooltip
                  title={
                    hasTournamentEnded
                      ? (t(
                          "detail.tournamentEndedCannotRemove"
                        ) as string) ||
                        "El torneo ha finalizado, no se pueden eliminar equipos"
                      : ""
                  }
                  disableHoverListener={!hasTournamentEnded}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasTournamentEnded) {
                          onRemoveTeam(team);
                        }
                      }}
                      disabled={!!hasTournamentEnded}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        bgcolor: theme.palette.error.main,
                        color: theme.palette.error.contrastText,
                        width: 32,
                        height: 32,
                        "&:hover": {
                          bgcolor: hasTournamentEnded
                            ? theme.palette.error.main
                            : theme.palette.error.dark,
                        },
                        "&.Mui-disabled": {
                          bgcolor:
                            theme.palette.action.disabledBackground,
                          color: theme.palette.action.disabled,
                        },
                      }}
                      size="small"
                    >
                      <RemoveCircleIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <Card
                sx={{
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.action.hover
                      : theme.palette.background.paper,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.action.selected
                        : theme.palette.action.hover,
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
                onClick={() => router.push(`/teams/${team.id}`)}
              >
                <CardContent sx={{ p: 2, textAlign: "center" }}>
                  <Avatar
                    src={team.image}
                    alt={team.name}
                    sx={{
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 1.5,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    {team.name}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

