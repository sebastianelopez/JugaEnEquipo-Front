import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ExitToApp as LeaveIcon,
  HowToReg as RegisterIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type { Tournament, Team, User } from "../../../interfaces";
import { TournamentRequestsAdmin } from "./TournamentRequestsAdmin";

interface TournamentJoinSectionProps {
  tournament: Tournament | null;
  tournamentId: string;
  canEditTournament: boolean;
  isTournamentCreator: boolean;
  isTournamentCreatorOrResponsible: boolean;
  tournamentTeams: Team[];
  hasTournamentEnded: boolean;
  hasTournamentStarted: boolean;
  hasWinners: boolean;
  registeredCount: number;
  maxCapacity: number;
  user: User | null;
  userTeams: Team[];
  selectedTeamId: string;
  loadingTeams: boolean;
  registering: boolean;
  leaving: boolean;
  hasPendingRequest: boolean;
  onRegisterTeam: () => void;
  onLeaveTournament: () => void;
  onTeamSelected: (teamId: string) => void;
  onSetFinalPositions: () => void;
  onRequestUpdated: () => void;
  isSticky?: boolean;
}

export const TournamentJoinSection = ({
  tournament,
  tournamentId,
  canEditTournament,
  isTournamentCreator,
  isTournamentCreatorOrResponsible,
  tournamentTeams,
  hasTournamentEnded,
  hasTournamentStarted,
  hasWinners,
  registeredCount,
  maxCapacity,
  user,
  userTeams,
  selectedTeamId,
  loadingTeams,
  registering,
  leaving,
  hasPendingRequest,
  onRegisterTeam,
  onLeaveTournament,
  onTeamSelected,
  onSetFinalPositions,
  onRequestUpdated,
  isSticky = false,
}: TournamentJoinSectionProps) => {
  const theme = useTheme();
  const t = useTranslations("Tournaments");

  if (canEditTournament) {
    return (
      <Card
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: { xs: 2, md: 3 },
          border: `1px solid ${theme.palette.secondary.dark}`,
          position: isSticky ? "sticky" : "static",
          top: isSticky ? 20 : undefined,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
            }}
          >
            {t("detail.tournamentManagement")}
          </Typography>

          {isTournamentCreatorOrResponsible &&
            tournamentTeams.length >= 3 && (
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.secondary.dark}`,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {hasWinners
                      ? t("detail.editFinalPositions") ||
                        "Editar Posiciones Finales"
                      : t("detail.setFinalPositions") ||
                        "Establecer Posiciones Finales"}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 3,
                    }}
                  >
                    {t("detail.setPositionsInfo") ||
                      "Selecciona los equipos que ocuparon el primer, segundo y tercer lugar del torneo."}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<TrophyIcon />}
                    onClick={onSetFinalPositions}
                    fullWidth={!isSticky}
                    sx={{
                      bgcolor: theme.palette.warning.main,
                      color: theme.palette.common.black,
                      "&:hover": {
                        bgcolor: theme.palette.warning.dark,
                      },
                    }}
                  >
                    {hasWinners
                      ? t("detail.editFinalPositions") || "Editar Posiciones"
                      : t("detail.setFinalPositions") ||
                        "Establecer Posiciones Finales"}
                  </Button>
                </CardContent>
              </Card>
            )}
          <TournamentRequestsAdmin
            tournamentId={tournamentId}
            onRequestUpdated={onRequestUpdated}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: { xs: 2, md: 3 },
        border: `1px solid ${theme.palette.secondary.dark}`,
        position: isSticky ? "sticky" : "static",
        top: isSticky ? 20 : undefined,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
          }}
        >
          {t("detail.joinTournament")}
        </Typography>

        {!hasTournamentEnded && (
          <Box
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? theme.palette.action.hover
                  : theme.palette.grey[100],
              borderRadius: 2,
              p: 3,
              mb: 3,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.9rem",
                mb: 1,
              }}
            >
              {t("detail.availableSlots")}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.info.main,
                fontWeight: 800,
              }}
            >
              {maxCapacity
                ? Math.max((maxCapacity as number) - registeredCount, 0)
                : "-"}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.85rem",
              }}
            >
              {maxCapacity ?? "-"} {t("detail.teams")}
            </Typography>
          </Box>
        )}

        {isTournamentCreator ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            {t("detail.tournamentCreator")}
          </Alert>
        ) : tournament?.isUserRegistered ? (
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LeaveIcon />}
            onClick={onLeaveTournament}
            disabled={leaving}
            sx={{
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "1rem",
              mb: 2,
              "&:hover": { bgcolor: theme.palette.error.dark },
            }}
          >
            {leaving
              ? t("detail.leaving")
              : t("detail.leaveTournament")}
          </Button>
        ) : hasPendingRequest ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            {t("detail.waitingApproval") || "Esperando aprobación"}
          </Alert>
        ) : hasTournamentStarted ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t("detail.tournamentStartedMessage") ||
              "Este torneo ya ha comenzado. No se pueden enviar más solicitudes."}
          </Alert>
        ) : (
          <>
            {user && userTeams.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t("detail.selectTeam")}</InputLabel>
                <Select
                  value={selectedTeamId}
                  onChange={(e) => onTeamSelected(e.target.value)}
                  label={t("detail.selectTeam")}
                  disabled={
                    loadingTeams ||
                    registering ||
                    hasPendingRequest ||
                    hasTournamentStarted
                  }
                >
                  {userTeams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<RegisterIcon />}
              onClick={onRegisterTeam}
              disabled={
                registering ||
                loadingTeams ||
                !selectedTeamId ||
                userTeams.length === 0 ||
                hasPendingRequest ||
                hasTournamentStarted
              }
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "1rem",
                mb: 2,
                "&:hover": { bgcolor: theme.palette.primary.dark },
              }}
            >
              {registering
                ? t("detail.requesting") || "Solicitando..."
                : t("detail.requestAccess") || "Solicitar Acceso"}
            </Button>
          </>
        )}

        {!tournament?.isUserRegistered && !isTournamentCreator && (
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
              textAlign: "center",
            }}
          >
            {t("detail.acceptRules")}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

