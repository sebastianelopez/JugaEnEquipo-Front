import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useMemo, useState, useContext } from "react";
import { MainLayout } from "../../layouts";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  Divider,
  Modal,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  EmojiEvents as TrophyIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Public as PublicIcon,
  Close as CloseIcon,
  HowToReg as RegisterIcon,
  ExitToApp as LeaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type { Game, Tournament, Team, User } from "../../interfaces";
import { tournamentService } from "../../services/tournament.service";
import { formatDate } from "../../utils/formatDate";
import { gameService } from "../../services/game.service";
import { getGameImage } from "../../utils/gameImageUtils";
import { teamService } from "../../services/team.service";
import { userService } from "../../services/user.service";
import { UserContext } from "../../context/user";
import { formatFullName } from "../../utils/textFormatting";
import { BackgroundFallback } from "../../components/atoms/BackgroundFallback";
import { EditTournamentModal } from "../../components/organisms/modals/EditTournamentModal";
import { SetFinalPositionsModal } from "../../components/organisms/modals/SetFinalPositionsModal";
import { TournamentRequestsAdmin } from "../../components/organisms/tournament/TournamentRequestsAdmin";
import { TournamentTabs } from "../../components/organisms/tournament/TournamentTabs";
import { TournamentWinners } from "../../components/organisms/tournament/TournamentWinners";
import { SuccessSnackbar } from "../../components/atoms/SuccessSnackbar";
import { useTournamentStatus } from "../../hooks/useTournamentStatus";

interface Props {
  id: string;
}

const TournamentDetailPage: NextPage<Props> = ({ id }) => {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations("Tournaments");
  const { user } = useContext(UserContext);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [tournamentTeams, setTournamentTeams] = useState<Team[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loadingBackground, setLoadingBackground] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [pendingRequestTeamId, setPendingRequestTeamId] = useState<
    string | null
  >(null);
  const [responsibleUser, setResponsibleUser] = useState<User | null>(null);
  const [loadingResponsible, setLoadingResponsible] = useState(false);
  const [deleteTournamentDialogOpen, setDeleteTournamentDialogOpen] =
    useState(false);
  const [deletingTournament, setDeletingTournament] = useState(false);
  const [removeTeamDialogOpen, setRemoveTeamDialogOpen] = useState(false);
  const [teamToRemove, setTeamToRemove] = useState<Team | null>(null);
  const [removingTeam, setRemovingTeam] = useState(false);
  const [leaveTeamDialogOpen, setLeaveTeamDialogOpen] = useState(false);
  const [userRegisteredTeams, setUserRegisteredTeams] = useState<Team[]>([]);
  const [selectedLeaveTeamId, setSelectedLeaveTeamId] = useState<string>("");
  const [setFinalPositionsModalOpen, setSetFinalPositionsModalOpen] =
    useState(false);
  const [finalizedStatusId, setFinalizedStatusId] = useState<string | null>(null);
  const { getStatusName, loading: loadingStatus } = useTournamentStatus();

  // Get tournament status name
  const tournamentStatusName = useMemo(() => {
    if (loadingStatus || !tournament) return null;
    return getStatusName(tournament.tournamentStatusId);
  }, [getStatusName, tournament?.tournamentStatusId, loadingStatus]);

  // Load finalized status ID
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await tournamentService.searchStatus();
      if (!mounted) return;
      if (result.ok && result.data?.data) {
        const finalizedStatus = result.data.data.find(
          (status: any) => status.name === "Finalized"
        );
        if (finalizedStatus) {
          setFinalizedStatusId(finalizedStatus.id);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await tournamentService.find(id);
      if (!mounted) return;
      if (res.ok && res.data) {
        setTournament(res.data as any);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Fetch background image
  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (!id) {
        setLoadingBackground(false);
        return;
      }
      try {
        setLoadingBackground(true);
        const result = await tournamentService.getBackgroundImage(id);
        if (result.ok) {
          setBackgroundImage(result.data);
        }
      } catch (error) {
        console.error("Error loading background image:", error);
      } finally {
        setLoadingBackground(false);
      }
    };

    loadBackgroundImage();
  }, [id]);

  useEffect(() => {
    if (tournament && tournament.gameId) {
      setLoadingGame(true);
      gameService
        .getGameById(tournament.gameId)
        .then((result) => {
          if (result.ok && result.data) {
            setGame(result.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching game:", error);
        })
        .finally(() => {
          setLoadingGame(false);
        });
    }
  }, [tournament?.gameId]);

  useEffect(() => {
    const loadUserTeams = async () => {
      if (
        user &&
        !tournament?.isUserRegistered &&
        tournament?.responsibleId !== user.id
      ) {
        setLoadingTeams(true);
        const result = await teamService.search({ mine: true });
        if (result.ok && result.data) {
          setUserTeams(result.data);
          if (result.data.length > 0) {
            setSelectedTeamId(result.data[0].id);
          }
        }
        setLoadingTeams(false);
      }
    };
    loadUserTeams();
  }, [user, tournament?.isUserRegistered, tournament?.responsibleId]);

  useEffect(() => {
    const loadTournamentTeams = async () => {
      if (tournament?.id) {
        const result = await tournamentService.getTournamentTeams(
          tournament.id
        );
        if (result.ok && result.data) {
          setTournamentTeams(result.data);
        }
      }
    };
    loadTournamentTeams();
  }, [tournament?.id]);

  // Calcular los equipos registrados del usuario donde es líder o creador
  useEffect(() => {
    if (!user || !tournamentTeams.length) {
      setUserRegisteredTeams([]);
      setSelectedLeaveTeamId("");
      return;
    }

    // Obtener los equipos del usuario donde es líder o creador
    const getUserTeamsAsLeader = async () => {
      const teamsResult = await teamService.search({ mine: true });
      if (teamsResult.ok && teamsResult.data) {
        // Filtrar equipos donde el usuario es líder o creador
        const userLeaderTeams = teamsResult.data.filter(
          (team) => team.leaderId === user.id || team.creatorId === user.id
        );

        // Encontrar cuáles de esos equipos están registrados en el torneo
        const tournamentTeamIds = tournamentTeams.map((team) => team.id);
        const registered = userLeaderTeams.filter((team) =>
          tournamentTeamIds.includes(team.id)
        );

        setUserRegisteredTeams(registered);
        // Si hay solo un equipo, establecerlo como seleccionado
        if (registered.length === 1) {
          setSelectedLeaveTeamId(registered[0].id);
        } else if (registered.length > 1) {
          // Si hay múltiples, establecer el primero como predeterminado
          setSelectedLeaveTeamId(registered[0].id);
        } else {
          setSelectedLeaveTeamId("");
        }
      }
    };

    getUserTeamsAsLeader();
  }, [user?.id, tournamentTeams]);

  // Check for pending requests
  useEffect(() => {
    const checkPendingRequests = async () => {
      const isCreator =
        user && tournament && tournament.responsibleId === user.id;
      if (
        !tournament?.id ||
        !user ||
        isCreator ||
        tournament?.isUserRegistered
      ) {
        return;
      }

      try {
        const result = await tournamentService.findAllRequests(tournament.id);
        if (result.ok && result.data) {
          const pendingRequests = result.data.filter(
            (req) => !req.status || req.status === "pending"
          );

          // Check if user's teams have pending requests
          const userTeamIds = userTeams.map((team) => team.id);
          const hasUserPendingRequest = pendingRequests.some((req) =>
            userTeamIds.includes(req.teamId)
          );

          if (hasUserPendingRequest) {
            const userPendingRequest = pendingRequests.find((req) =>
              userTeamIds.includes(req.teamId)
            );
            setHasPendingRequest(true);
            setPendingRequestTeamId(userPendingRequest?.teamId || null);
          }
        }
      } catch (error) {
        console.error("Error checking pending requests:", error);
      }
    };

    if (user && userTeams.length > 0 && tournament?.id) {
      checkPendingRequests();
    }
  }, [
    tournament?.id,
    user,
    userTeams,
    tournament?.responsibleId,
    tournament?.isUserRegistered,
  ]);

  // Load responsible user information
  useEffect(() => {
    const loadResponsibleUser = async () => {
      if (!tournament?.responsibleId) {
        setResponsibleUser(null);
        return;
      }

      setLoadingResponsible(true);
      try {
        const userData = await userService.getUserById(
          tournament.responsibleId
        );
        if (userData) {
          setResponsibleUser(userData);
        }
      } catch (error) {
        console.error("Error loading responsible user:", error);
      } finally {
        setLoadingResponsible(false);
      }
    };

    loadResponsibleUser();
  }, [tournament?.responsibleId]);

  const handleRegisterTeam = async () => {
    if (!selectedTeamId || !tournament) {
      setSnackbarMessage(
        t("detail.selectTeamError") || "Por favor selecciona un equipo"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Check if tournament has started (no new registrations allowed after start)
    if (hasTournamentStarted) {
      setSnackbarMessage(
        t("detail.tournamentStarted") || "Este torneo ya ha comenzado"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await tournamentService.requestAccess(
        tournament.id,
        selectedTeamId
      );
      if (result.ok) {
        setSnackbarMessage(
          t("detail.requestSentSuccess") || "Solicitud enviada exitosamente"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setHasPendingRequest(true);
        setPendingRequestTeamId(selectedTeamId);
      } else {
        setSnackbarMessage(
          result.errorMessage ||
            t("detail.requestError") ||
            "Error al enviar la solicitud"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err: any) {
      setSnackbarMessage(
        err.message ||
          t("detail.requestError") ||
          "Error al enviar la solicitud"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setRegistering(false);
    }
  };

  const handleLeaveTournament = () => {
    if (!tournament) return;

    // Si no hay equipos registrados, mostrar error
    if (userRegisteredTeams.length === 0) {
      setSnackbarMessage(
        t("detail.noTeamFound") ||
          "No se encontró un equipo registrado en este torneo"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Si hay más de un equipo, abrir diálogo de selección
    if (userRegisteredTeams.length > 1) {
      // Establecer el primer equipo como seleccionado si no hay ninguno
      if (!selectedLeaveTeamId && userRegisteredTeams.length > 0) {
        setSelectedLeaveTeamId(userRegisteredTeams[0].id);
      }
      setLeaveTeamDialogOpen(true);
      return;
    }

    // Si hay solo un equipo, proceder directamente
    executeLeaveTournament(userRegisteredTeams[0].id);
  };

  const executeLeaveTournament = async (teamId: string) => {
    if (!tournament) return;

    setLeaving(true);
    setError(null);
    setSuccess(null);
    setLeaveTeamDialogOpen(false);

    try {
      const result = await tournamentService.leaveTournament(
        tournament.id,
        teamId
      );

      if (result.ok) {
        setSnackbarMessage(
          t("detail.leaveSuccess") || "Has dejado el torneo exitosamente"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        const res = await tournamentService.find(id);
        if (res.ok && res.data) {
          setTournament(res.data as any);
        }

        const teamsResult = await tournamentService.getTournamentTeams(id);
        if (teamsResult.ok && teamsResult.data) {
          setTournamentTeams(teamsResult.data);
        }
      } else {
        setSnackbarMessage(
          result.errorMessage ||
            t("detail.leaveError") ||
            "Error al dejar el torneo"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err: any) {
      setSnackbarMessage(
        err.message || t("detail.leaveError") || "Error al dejar el torneo"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLeaving(false);
    }
  };

  const handleCancelLeaveTeam = () => {
    setLeaveTeamDialogOpen(false);
    setSelectedLeaveTeamId(
      userRegisteredTeams.length === 1 ? userRegisteredTeams[0].id : ""
    );
  };

  const handleConfirmLeaveTeam = () => {
    if (selectedLeaveTeamId) {
      executeLeaveTournament(selectedLeaveTeamId);
    }
  };

  const handleOpenModal = (team: any) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  };

  const handleDeleteTournamentClick = () => {
    setDeleteTournamentDialogOpen(true);
  };

  const handleCancelDeleteTournament = () => {
    setDeleteTournamentDialogOpen(false);
  };

  const handleConfirmDeleteTournament = async () => {
    if (!tournament) return;

    setDeletingTournament(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await tournamentService.delete(tournament.id);
      if (result.ok) {
        setDeleteTournamentDialogOpen(false);
        router.push("/tournaments");
      } else {
        setSnackbarMessage(
          result.errorMessage ||
            t("detail.deleteTournamentError") ||
            "Error al eliminar el torneo"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setDeleteTournamentDialogOpen(false);
      }
    } catch (err: any) {
      setSnackbarMessage(
        err.message ||
          t("detail.deleteTournamentError") ||
          "Error al eliminar el torneo"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setDeleteTournamentDialogOpen(false);
    } finally {
      setDeletingTournament(false);
    }
  };

  const handleRemoveTeamClick = (team: Team) => {
    setTeamToRemove(team);
    setRemoveTeamDialogOpen(true);
  };

  const handleCancelRemoveTeam = () => {
    setRemoveTeamDialogOpen(false);
    setTeamToRemove(null);
  };

  const handleConfirmRemoveTeam = async () => {
    if (!tournament || !teamToRemove) return;

    setRemovingTeam(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await tournamentService.deleteTeam(
        tournament.id,
        teamToRemove.id
      );
      if (result.ok) {
        setSnackbarMessage(
          t("detail.removeTeamSuccess") ||
            `El equipo ${teamToRemove.name} ha sido removido del torneo`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setRemoveTeamDialogOpen(false);
        setTeamToRemove(null);

        // Reload tournament teams
        const teamsResult = await tournamentService.getTournamentTeams(
          tournament.id
        );
        if (teamsResult.ok && teamsResult.data) {
          setTournamentTeams(teamsResult.data);
        }

        // Reload tournament data
        const res = await tournamentService.find(tournament.id);
        if (res.ok && res.data) {
          setTournament(res.data as any);
        }
      } else {
        setSnackbarMessage(
          result.errorMessage ||
            t("detail.removeTeamError") ||
            "Error al remover el equipo"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setRemoveTeamDialogOpen(false);
        setTeamToRemove(null);
      }
    } catch (err: any) {
      setSnackbarMessage(
        err.message ||
          t("detail.removeTeamError") ||
          "Error al remover el equipo"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setRemoveTeamDialogOpen(false);
      setTeamToRemove(null);
    } finally {
      setRemovingTeam(false);
    }
  };

  const registeredCount = tournament?.registeredTeams ?? 0;
  const maxCapacity = tournament?.maxTeams ?? 0;
  const isTournamentCreator = useMemo(() => {
    return user && tournament && tournament.responsibleId === user.id;
  }, [user, tournament]);

  const isTournamentCreatorOrResponsible = useMemo(() => {
    if (!user || !tournament) return false;
    const isResponsible = tournament.responsibleId === user.id;
    const isCreator = (tournament as any)?.creatorId === user.id;
    return isResponsible || isCreator;
  }, [user, tournament]);

  const canEditTournament = useMemo(() => {
    return isTournamentCreator;
  }, [isTournamentCreator]);

  // Check if tournament has started (no new registrations allowed after start)
  const hasTournamentStarted = useMemo(() => {
    if (!tournament?.startAt) return false;
    try {
      const startDate = new Date(tournament.startAt);
      const now = new Date();
      return startDate < now;
    } catch {
      return false;
    }
  }, [tournament?.startAt]);

  // Check if tournament has ended
  const hasTournamentEnded = useMemo(() => {
    if (!tournament) return false;
    
    // Check if tournament status is "Finalized"
    if (finalizedStatusId && tournament.tournamentStatusId === finalizedStatusId) {
      return true;
    }
    
    // Fallback: Check if end date has passed or if winners are set
    if (tournament.endAt) {
      try {
        const endDate = new Date(tournament.endAt);
        const now = new Date();
        if (endDate.getTime() < now.getTime()) {
          return true;
        }
      } catch {
        // Invalid date, continue to check winners
      }
    }
    
    // Check if winners are set
    if (
      tournament.firstPlaceTeamId ||
      tournament.secondPlaceTeamId ||
      tournament.thirdPlaceTeamId
    ) {
      return true;
    }
    
    return false;
  }, [
    tournament,
    tournament?.tournamentStatusId,
    tournament?.endAt,
    tournament?.firstPlaceTeamId,
    tournament?.secondPlaceTeamId,
    tournament?.thirdPlaceTeamId,
    finalizedStatusId,
  ]);

  // Check if tournament has winners
  const hasWinners = useMemo(() => {
    if (!tournament) return false;
    const t = tournament as any;
    return !!(t.firstPlaceTeamId || t.secondPlaceTeamId || t.thirdPlaceTeamId);
  }, [tournament]);
  const startDateLabel = useMemo(() => {
    if (!tournament?.startAt) return "-";
    try {
      const locale: "es" | "en" | "pt" =
        router.locale === "es" ||
        router.locale === "en" ||
        router.locale === "pt"
          ? (router.locale as "es" | "en" | "pt")
          : "es";
      return formatDate(tournament.startAt, { locale });
    } catch {
      return String(tournament.startAt);
    }
  }, [tournament, router.locale]);

  const endDateLabel = useMemo(() => {
    if (!tournament?.endAt) return "-";
    try {
      const locale: "es" | "en" | "pt" =
        router.locale === "es" ||
        router.locale === "en" ||
        router.locale === "pt"
          ? (router.locale as "es" | "en" | "pt")
          : "es";
      return formatDate(tournament.endAt, { locale });
    } catch {
      return String(tournament.endAt);
    }
  }, [tournament, router.locale]);

  return (
    <MainLayout
      pageDescription={t("detail.pageDescription")}
      title={tournament?.name || t("detail.title")}
    >
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          pb: 6,
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            height: { xs: "300px", md: "400px" },
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
          }}
        >
          {/* Background Image or Fallback */}
          {backgroundImage ? (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(to bottom, ${
                  theme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)"
                    : "rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)"
                }), url(${backgroundImage})`,
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
              <BackgroundFallback
                seed={tournament?.name || id}
                variant="tournament"
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(to bottom, ${
                    theme.palette.mode === "dark"
                      ? "rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)"
                      : "rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)"
                  })`,
                }}
              />
            </Box>
          )}
          <Container
            maxWidth="xl"
            sx={{ pb: 4, position: "relative", zIndex: 1 }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/tournaments")}
              sx={{
                color: theme.palette.common.white,
                mb: 2,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              {t("detail.back")}
            </Button>
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.common.white,
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {tournament?.name}
              </Typography>
              {canEditTournament && (
                <IconButton
                  onClick={() => setEditModalOpen(true)}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: theme.palette.common.white,
                    width: { xs: 32, md: 40 },
                    height: { xs: 32, md: 40 },
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                    "& svg": {
                      fontSize: { xs: "1.1rem", md: "1.5rem" },
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
              {canEditTournament && (
                <IconButton
                  onClick={handleDeleteTournamentClick}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: theme.palette.error.light,
                    width: { xs: 32, md: 40 },
                    height: { xs: 32, md: 40 },
                    flexShrink: 0,
                    "&:hover": {
                      bgcolor: "rgba(211, 47, 47, 0.2)",
                    },
                    "& svg": {
                      fontSize: { xs: "1.1rem", md: "1.5rem" },
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              {game && (
                <Avatar
                  src={getGameImage(game.name)}
                  alt={game.name}
                  sx={{ width: 48, height: 48 }}
                />
              )}
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.info.main,
                  fontWeight: 600,
                }}
              >
                {game?.name}
              </Typography>
              {tournamentStatusName && (
                <Chip
                  label={tournamentStatusName}
                  size="small"
                  sx={{
                    bgcolor: (() => {
                      const status = tournamentStatusName.toLowerCase();
                      if (status === "active" || status === "ongoing") {
                        return theme.palette.success.main;
                      } else if (status === "finalized" || status === "finished" || status === "archived") {
                        return theme.palette.grey[600];
                      } else if (status === "suspended") {
                        return theme.palette.error.main;
                      } else if (status === "created") {
                        return theme.palette.info.main;
                      }
                      return theme.palette.primary.main;
                    })(),
                    color: (() => {
                      const status = tournamentStatusName.toLowerCase();
                      if (status === "active" || status === "ongoing") {
                        return theme.palette.getContrastText(theme.palette.success.main);
                      } else if (status === "finalized" || status === "finished" || status === "archived") {
                        return theme.palette.getContrastText(theme.palette.grey[600]);
                      } else if (status === "suspended") {
                        return theme.palette.getContrastText(theme.palette.error.main);
                      } else if (status === "created") {
                        return theme.palette.getContrastText(theme.palette.info.main);
                      }
                      return theme.palette.getContrastText(theme.palette.primary.main);
                    })(),
                    fontWeight: 700,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                    height: { xs: 28, md: 32 },
                  }}
                />
              )}
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Mobile Tabs View */}
          <TournamentTabs
            informationContent={
              <>
                {/* Tournament Info Card */}
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
                      {t("detail.tournamentInfo")}
                    </Typography>

                    <Stack spacing={3}>
                      {/* Type and Mode */}
                      <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                        <Chip
                          icon={<TrophyIcon />}
                          label={
                            tournament?.isOfficial
                              ? t("detail.official")
                              : t("detail.amateur")
                          }
                          sx={{
                            bgcolor: tournament?.isOfficial
                              ? theme.palette.warning.main
                              : theme.palette.info.main,
                            color: theme.palette.common.black,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            py: 2.5,
                          }}
                        />
                        {tournamentStatusName && (
                          <Chip
                            label={tournamentStatusName}
                            sx={{
                              bgcolor: (() => {
                                const status = tournamentStatusName.toLowerCase();
                                if (status === "active" || status === "ongoing") {
                                  return theme.palette.success.main;
                                } else if (status === "finalized" || status === "finished" || status === "archived") {
                                  return theme.palette.grey[600];
                                } else if (status === "suspended") {
                                  return theme.palette.error.main;
                                } else if (status === "created") {
                                  return theme.palette.info.main;
                                }
                                return theme.palette.primary.main;
                              })(),
                              color: (() => {
                                const status = tournamentStatusName.toLowerCase();
                                if (status === "active" || status === "ongoing") {
                                  return theme.palette.getContrastText(theme.palette.success.main);
                                } else if (status === "finalized" || status === "finished" || status === "archived") {
                                  return theme.palette.getContrastText(theme.palette.grey[600]);
                                } else if (status === "suspended") {
                                  return theme.palette.getContrastText(theme.palette.error.main);
                                } else if (status === "created") {
                                  return theme.palette.getContrastText(theme.palette.info.main);
                                }
                                return theme.palette.getContrastText(theme.palette.primary.main);
                              })(),
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              py: 2.5,
                            }}
                          />
                        )}
                      </Stack>

                      <Divider sx={{ bgcolor: theme.palette.secondary.dark }} />

                      {/* Details Grid */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                          gap: 3,
                        }}
                      >
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CalendarIcon
                              sx={{ color: theme.palette.info.main }}
                            />
                            <Box>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {t("detail.startDate")}
                              </Typography>
                              <Typography
                                sx={{
                                  color: theme.palette.text.primary,
                                  fontWeight: 600,
                                }}
                              >
                                {startDateLabel}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CalendarIcon
                              sx={{ color: theme.palette.info.main }}
                            />
                            <Box>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {t("detail.endDate")}
                              </Typography>
                              <Typography
                                sx={{
                                  color: theme.palette.text.primary,
                                  fontWeight: 600,
                                }}
                              >
                                {endDateLabel}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <PublicIcon
                              sx={{ color: theme.palette.info.main }}
                            />
                            <Box>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {t("detail.region")}
                              </Typography>
                              <Typography
                                sx={{
                                  color: theme.palette.text.primary,
                                  fontWeight: 600,
                                }}
                              >
                                {tournament?.region}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <GroupsIcon
                              sx={{ color: theme.palette.info.main }}
                            />
                            <Box>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {t("detail.registeredTeams")}
                              </Typography>
                              <Typography
                                sx={{
                                  color: theme.palette.text.primary,
                                  fontWeight: 600,
                                }}
                              >
                                {registeredCount}
                                {maxCapacity ? ` / ${maxCapacity}` : ""}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <TrophyIcon
                              sx={{ color: theme.palette.warning.main }}
                            />
                            <Box>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {t("detail.prize")}
                              </Typography>
                              <Typography
                                sx={{
                                  color: theme.palette.warning.main,
                                  fontWeight: 700,
                                  fontSize: "1.1rem",
                                }}
                              >
                                {(tournament as any)?.prize ?? "-"}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        {tournament?.responsibleId && (
                          <Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <PersonIcon
                                sx={{ color: theme.palette.info.main }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "0.85rem",
                                    mb: 0.5,
                                  }}
                                >
                                  {t("detail.responsible") || "Responsable"}
                                </Typography>
                                {loadingResponsible ? (
                                  <Typography
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {t("detail.loading")}
                                  </Typography>
                                ) : responsibleUser ? (
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                      cursor: "pointer",
                                      "&:hover": {
                                        opacity: 0.8,
                                      },
                                    }}
                                    onClick={() => {
                                      router.push(
                                        `/profile/${responsibleUser.username}`
                                      );
                                    }}
                                  >
                                    <Avatar
                                      src={
                                        responsibleUser.profileImage ||
                                        "/images/user-placeholder.png"
                                      }
                                      sx={{
                                        width: 32,
                                        height: 32,
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        sx={{
                                          color: theme.palette.text.primary,
                                          fontWeight: 600,
                                          fontSize: "0.9rem",
                                        }}
                                      >
                                        {responsibleUser.username}
                                      </Typography>
                                      {(responsibleUser.firstname ||
                                        responsibleUser.lastname) && (
                                        <Typography
                                          sx={{
                                            color: theme.palette.text.secondary,
                                            fontSize: "0.75rem",
                                          }}
                                        >
                                          {formatFullName(
                                            responsibleUser.firstname,
                                            responsibleUser.lastname
                                          )}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Stack>
                                ) : (
                                  <Typography
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    -
                                  </Typography>
                                )}
                              </Box>
                            </Stack>
                          </Box>
                        )}
                      </Box>

                      <Divider sx={{ bgcolor: theme.palette.secondary.dark }} />

                      {/* Description */}
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {t("detail.description")}
                        </Typography>
                        {tournament?.description && (
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              lineHeight: 1.8,
                            }}
                          >
                            {tournament.description}
                          </Typography>
                        )}
                      </Box>

                      {/* Rules */}
                      {tournament?.rules && (
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.text.primary,
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            {t("detail.rules")}
                          </Typography>
                          {Array.isArray((tournament as any)?.rules) ? (
                            <Stack spacing={1}>
                              {(tournament as any).rules.map(
                                (rule: string, index: number) => (
                                  <Stack
                                    key={index}
                                    direction="row"
                                    spacing={1}
                                  >
                                    <Typography
                                      sx={{ color: theme.palette.info.main }}
                                    >
                                      •
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: theme.palette.text.secondary,
                                      }}
                                    >
                                      {rule}
                                    </Typography>
                                  </Stack>
                                )
                              )}
                            </Stack>
                          ) : (tournament as any)?.rules ? (
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {String((tournament as any).rules)}
                            </Typography>
                          ) : null}
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                {/* Tournament Winners */}
                <TournamentWinners tournamentId={id} />

                {/* Teams List */}
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
                      {tournamentTeams.map((team: Team) => (
                        <Box key={team.id} sx={{ position: "relative" }}>
                          {canEditTournament && (
                            <Tooltip
                              title={
                                hasTournamentEnded
                                  ? (t("detail.tournamentEndedCannotRemove") as string) ||
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
                                      handleRemoveTeamClick(team);
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
                                      bgcolor: theme.palette.action.disabledBackground,
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
              </>
            }
            secondTabContent={
              canEditTournament ? (
                <>
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
                            onClick={() => setSetFinalPositionsModalOpen(true)}
                            sx={{
                              bgcolor: theme.palette.warning.main,
                              color: theme.palette.common.black,
                              "&:hover": {
                                bgcolor: theme.palette.warning.dark,
                              },
                            }}
                          >
                            {hasWinners
                              ? t("detail.editFinalPositions") ||
                                "Editar Posiciones"
                              : t("detail.setFinalPositions") ||
                                "Establecer Posiciones Finales"}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  <TournamentRequestsAdmin
                    tournamentId={id}
                    onRequestUpdated={() => {
                      tournamentService.find(id).then((res) => {
                        if (res.ok && res.data) {
                          setTournament(res.data as any);
                        }
                      });
                      tournamentService
                        .getTournamentTeams(id)
                        .then((teamsResult) => {
                          if (teamsResult.ok && teamsResult.data) {
                            setTournamentTeams(teamsResult.data);
                          }
                        });
                    }}
                  />
                </>
              ) : (
                <Card
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: { xs: 2, md: 3 },
                    border: `1px solid ${theme.palette.secondary.dark}`,
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
                            ? Math.max(
                                (maxCapacity as number) - registeredCount,
                                0
                              )
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
                        onClick={handleLeaveTournament}
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
                              onChange={(e) =>
                                setSelectedTeamId(e.target.value)
                              }
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
                          onClick={handleRegisterTeam}
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
              )
            }
            secondTabLabel={
              canEditTournament
                ? t("detail.administration") || "Administración"
                : t("detail.joinTournament") || "Unirse al Torneo"
            }
          />

          {/* Desktop Grid View */}
          <Box
            sx={{
              display: { xs: "none", lg: "grid" },
              gridTemplateColumns: "2fr 1fr",
              gap: 4,
            }}
          >
            {/* Main Content */}
            <Box>
              {/* Tournament Info Card */}
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.secondary.dark}`,
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    {t("detail.tournamentInfo")}
                  </Typography>

                  <Stack spacing={3}>
                    {/* Type and Mode */}
                    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                      <Chip
                        icon={<TrophyIcon />}
                        label={
                          tournament?.isOfficial
                            ? t("detail.official")
                            : t("detail.amateur")
                        }
                        sx={{
                          bgcolor: tournament?.isOfficial
                            ? theme.palette.warning.main
                            : theme.palette.info.main,
                          color: theme.palette.common.black,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          py: 2.5,
                        }}
                      />
                      {tournamentStatusName && (
                        <Chip
                          label={tournamentStatusName}
                          sx={{
                            bgcolor: (() => {
                              const status = tournamentStatusName.toLowerCase();
                              if (status === "active" || status === "ongoing") {
                                return theme.palette.success.main;
                              } else if (status === "finalized" || status === "finished" || status === "archived") {
                                return theme.palette.grey[600];
                              } else if (status === "suspended") {
                                return theme.palette.error.main;
                              } else if (status === "created") {
                                return theme.palette.info.main;
                              }
                              return theme.palette.primary.main;
                            })(),
                            color: (() => {
                              const status = tournamentStatusName.toLowerCase();
                              if (status === "active" || status === "ongoing") {
                                return theme.palette.getContrastText(theme.palette.success.main);
                              } else if (status === "finalized" || status === "finished" || status === "archived") {
                                return theme.palette.getContrastText(theme.palette.grey[600]);
                              } else if (status === "suspended") {
                                return theme.palette.getContrastText(theme.palette.error.main);
                              } else if (status === "created") {
                                return theme.palette.getContrastText(theme.palette.info.main);
                              }
                              return theme.palette.getContrastText(theme.palette.primary.main);
                            })(),
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            py: 2.5,
                          }}
                        />
                      )}
                    </Stack>

                    <Divider sx={{ bgcolor: theme.palette.secondary.dark }} />

                    {/* Details Grid */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 3,
                      }}
                    >
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon
                            sx={{ color: theme.palette.info.main }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              {t("detail.startDate")}
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                              }}
                            >
                              {startDateLabel}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon
                            sx={{ color: theme.palette.info.main }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              {t("detail.endDate")}
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                              }}
                            >
                              {endDateLabel}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PublicIcon sx={{ color: theme.palette.info.main }} />
                          <Box>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              {t("detail.region")}
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                              }}
                            >
                              {tournament?.region}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <GroupsIcon sx={{ color: theme.palette.info.main }} />
                          <Box>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              {t("detail.registeredTeams")}
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                              }}
                            >
                              {registeredCount}
                              {maxCapacity ? ` / ${maxCapacity}` : ""}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TrophyIcon
                            sx={{ color: theme.palette.warning.main }}
                          />
                          <Box>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.85rem",
                              }}
                            >
                              {t("detail.prize")}
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.warning.main,
                                fontWeight: 700,
                                fontSize: "1.1rem",
                              }}
                            >
                              {(tournament as any)?.prize ?? "-"}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {tournament?.responsibleId && (
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <PersonIcon
                              sx={{ color: theme.palette.info.main }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "0.85rem",
                                  mb: 0.5,
                                }}
                              >
                                {t("detail.responsible") || "Responsable"}
                              </Typography>
                              {loadingResponsible ? (
                                <Typography
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  Cargando...
                                </Typography>
                              ) : responsibleUser ? (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                      opacity: 0.8,
                                    },
                                  }}
                                  onClick={() => {
                                    router.push(
                                      `/profile/${responsibleUser.username}`
                                    );
                                  }}
                                >
                                  <Avatar
                                    src={
                                      responsibleUser.profileImage ||
                                      "/images/user-placeholder.png"
                                    }
                                    sx={{
                                      width: 32,
                                      height: 32,
                                    }}
                                  />
                                  <Box>
                                    <Typography
                                      sx={{
                                        color: theme.palette.text.primary,
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {responsibleUser.username}
                                    </Typography>
                                    {(responsibleUser.firstname ||
                                      responsibleUser.lastname) && (
                                      <Typography
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        {formatFullName(
                                          responsibleUser.firstname,
                                          responsibleUser.lastname
                                        )}
                                      </Typography>
                                    )}
                                  </Box>
                                </Stack>
                              ) : (
                                <Typography
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  -
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ bgcolor: theme.palette.secondary.dark }} />

                    {/* Description */}
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          mb: 2,
                        }}
                      >
                        {t("detail.description")}
                      </Typography>
                      {tournament?.description && (
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.8,
                          }}
                        >
                          {tournament.description}
                        </Typography>
                      )}
                    </Box>

                    {/* Rules */}
                    {tournament?.rules && (
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {t("detail.rules")}
                        </Typography>
                        {Array.isArray((tournament as any)?.rules) ? (
                          <Stack spacing={1}>
                            {(tournament as any).rules.map(
                              (rule: string, index: number) => (
                                <Stack key={index} direction="row" spacing={1}>
                                  <Typography
                                    sx={{ color: theme.palette.info.main }}
                                  >
                                    •
                                  </Typography>
                                  <Typography
                                    sx={{ color: theme.palette.text.secondary }}
                                  >
                                    {rule}
                                  </Typography>
                                </Stack>
                              )
                            )}
                          </Stack>
                        ) : (tournament as any)?.rules ? (
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {String((tournament as any).rules)}
                          </Typography>
                        ) : null}
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Tournament Winners */}
              <TournamentWinners tournamentId={id} />

              {/* Teams List */}
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.secondary.dark}`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      mb: 3,
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
                    {tournamentTeams.map((team: Team) => (
                      <Box key={team.id} sx={{ position: "relative" }}>
                        {canEditTournament && (
                          <Tooltip
                            title={
                              hasTournamentEnded
                                ? (t("detail.tournamentEndedCannotRemove") as string) ||
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
                                    handleRemoveTeamClick(team);
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
                                    bgcolor: theme.palette.action.disabledBackground,
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
                            {/*  <Typography
                              sx={{
                                color: theme.palette.info.main,
                                fontSize: "0.85rem",
                              }}
                            >
                              {team.users?.length || team.members?.length || 0}{" "}
                              miembros
                            </Typography> */}
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Sidebar */}
            <Box>
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.secondary.dark}`,
                  position: "sticky",
                  top: 20,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      mb: 3,
                      textAlign: "center",
                    }}
                  >
                    {isTournamentCreator
                      ? t("detail.tournamentManagement")
                      : t("detail.joinTournament")}
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
                        sx={{ color: theme.palette.info.main, fontWeight: 800 }}
                      >
                        {maxCapacity
                          ? Math.max(
                              (maxCapacity as number) - registeredCount,
                              0
                            )
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

                  {canEditTournament && (
                    <>
                      {isTournamentCreatorOrResponsible &&
                        tournamentTeams.length >= 3 && (
                          <Card
                            sx={{
                              bgcolor: theme.palette.background.paper,
                              borderRadius: 3,
                              border: `1px solid ${theme.palette.secondary.dark}`,
                              mb: 3,
                            }}
                          >
                            <CardContent sx={{ p: 4 }}>
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
                                onClick={() =>
                                  setSetFinalPositionsModalOpen(true)
                                }
                                fullWidth
                                sx={{
                                  bgcolor: theme.palette.warning.main,
                                  color: theme.palette.common.black,
                                  "&:hover": {
                                    bgcolor: theme.palette.warning.dark,
                                  },
                                }}
                              >
                                {hasWinners
                                  ? t("detail.editFinalPositions") ||
                                    "Editar Posiciones"
                                  : t("detail.setFinalPositions") ||
                                    "Establecer Posiciones Finales"}
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      <TournamentRequestsAdmin
                        tournamentId={id}
                        onRequestUpdated={() => {
                          // Reload tournament data
                          tournamentService.find(id).then((res) => {
                            if (res.ok && res.data) {
                              setTournament(res.data as any);
                            }
                          });
                          // Reload teams
                          tournamentService
                            .getTournamentTeams(id)
                            .then((teamsResult) => {
                              if (teamsResult.ok && teamsResult.data) {
                                setTournamentTeams(teamsResult.data);
                              }
                            });
                        }}
                      />
                    </>
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
                      onClick={handleLeaveTournament}
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
                            onChange={(e) => setSelectedTeamId(e.target.value)}
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
                        onClick={handleRegisterTeam}
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
            </Box>
          </Box>
        </Container>

        {/* Modal for Team Members */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              border: `2px solid ${theme.palette.primary.main}`,
              width: { xs: "90%", sm: "500px" },
              maxHeight: "80vh",
              overflow: "auto",
              p: 4,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                {selectedTeam && (
                  <>
                    <Avatar
                      src={selectedTeam.profileImage || selectedTeam.logo}
                      alt={selectedTeam.name}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                      }}
                    >
                      {selectedTeam.name}
                    </Typography>
                  </>
                )}
              </Stack>
              <IconButton
                onClick={handleCloseModal}
                sx={{ color: theme.palette.text.primary }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            <Divider sx={{ bgcolor: theme.palette.secondary.dark, mb: 3 }} />

            <Typography
              variant="h6"
              sx={{ color: theme.palette.info.main, fontWeight: 600, mb: 2 }}
            >
              {t("detail.teamMembers")}
            </Typography>

            <List>
              {(selectedTeam?.users || selectedTeam?.members || []).map(
                (member: any, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: theme.palette.secondary.dark,
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={member.profileImage || member.avatar}
                        alt={member.username || member.name}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                          }}
                        >
                          {member.username || member.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: theme.palette.info.main,
                            fontSize: "0.85rem",
                          }}
                        >
                          {member.role || t("detail.member")}
                        </Typography>
                      }
                    />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Modal>
      </Box>

      <EditTournamentModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tournament={tournament}
        onUpdated={() => {
          // Reload tournament data
          tournamentService.find(id).then((res) => {
            if (res.ok && res.data) {
              setTournament(res.data as any);
            }
          });
          // Reload background image
          tournamentService.getBackgroundImage(id).then((result) => {
            if (result.ok && result.data) {
              setBackgroundImage(result.data);
            }
          });
          // Reload teams
          tournamentService.getTournamentTeams(id).then((teamsResult) => {
            if (teamsResult.ok && teamsResult.data) {
              setTournamentTeams(teamsResult.data);
            }
          });
        }}
      />

      {/* Delete Tournament Confirmation Dialog */}
      <Dialog
        open={deleteTournamentDialogOpen}
        onClose={() =>
          !deletingTournament && setDeleteTournamentDialogOpen(false)
        }
        aria-labelledby="delete-tournament-dialog-title"
        aria-describedby="delete-tournament-dialog-description"
      >
        <DialogTitle id="delete-tournament-dialog-title">
          {t("detail.deleteTournamentTitle") || "Eliminar Torneo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-tournament-dialog-description">
            {t("detail.deleteTournamentConfirmation", {
              tournamentName: tournament?.name || "",
            }) ||
              `¿Estás seguro de que deseas eliminar el torneo "${
                tournament?.name || ""
              }"? Esta acción no se puede deshacer.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteTournamentDialogOpen(false)}
            variant="outlined"
            disabled={deletingTournament}
          >
            {t("detail.cancel")}
          </Button>
          <Button
            onClick={handleConfirmDeleteTournament}
            color="error"
            variant="contained"
            disabled={deletingTournament}
            autoFocus
          >
            {deletingTournament
              ? t("detail.deletingTournament") || "Eliminando..."
              : t("detail.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Team Confirmation Dialog */}
      <Dialog
        open={removeTeamDialogOpen}
        onClose={() => !removingTeam && setRemoveTeamDialogOpen(false)}
        aria-labelledby="remove-team-dialog-title"
        aria-describedby="remove-team-dialog-description"
      >
        <DialogTitle id="remove-team-dialog-title">
          {t("detail.removeTeamTitle") || "Remover Equipo del Torneo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-team-dialog-description">
            {t("detail.removeTeamConfirmation", {
              teamName: teamToRemove?.name ?? "",
            }) ||
              `¿Estás seguro de que deseas remover el equipo "${
                teamToRemove?.name ?? ""
              }" del torneo?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelRemoveTeam}
            variant="outlined"
            disabled={removingTeam}
          >
            {t("detail.cancel")}
          </Button>
          <Button
            onClick={handleConfirmRemoveTeam}
            color="error"
            variant="contained"
            disabled={removingTeam}
            autoFocus
          >
            {removingTeam
              ? t("detail.removingTeam") || "Removiendo..."
              : t("detail.removeTeam") || "Remover"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Select Team to Leave Tournament Dialog */}
      <Dialog
        open={leaveTeamDialogOpen}
        onClose={handleCancelLeaveTeam}
        aria-labelledby="leave-team-dialog-title"
        aria-describedby="leave-team-dialog-description"
      >
        <DialogTitle id="leave-team-dialog-title">
          {t("detail.selectTeamToLeave") ||
            "Seleccionar Equipo para Dejar el Torneo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="leave-team-dialog-description" sx={{ mb: 2 }}>
            {t("detail.selectTeamToLeaveDescription") ||
              "Tienes múltiples equipos registrados en este torneo. Selecciona cuál equipo deseas que deje el torneo:"}
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>{t("detail.selectTeam") || "Equipo"}</InputLabel>
            <Select
              value={selectedLeaveTeamId}
              onChange={(e) => setSelectedLeaveTeamId(e.target.value)}
              label={t("detail.selectTeam") || "Equipo"}
              disabled={leaving}
            >
              {userRegisteredTeams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelLeaveTeam}
            variant="outlined"
            disabled={leaving}
          >
            {t("detail.cancel")}
          </Button>
          <Button
            onClick={handleConfirmLeaveTeam}
            color="error"
            variant="contained"
            disabled={leaving || !selectedLeaveTeamId}
            autoFocus
          >
            {leaving
              ? t("detail.leaving") || "Dejando..."
              : t("detail.leaveTournament") || "Dejar Torneo"}
          </Button>
        </DialogActions>
      </Dialog>

      <SetFinalPositionsModal
        open={setFinalPositionsModalOpen}
        onClose={() => setSetFinalPositionsModalOpen(false)}
        tournamentId={id}
        teams={tournamentTeams}
        onSuccess={() => {
          tournamentService.find(id).then((res) => {
            if (res.ok && res.data) {
              setTournament(res.data as any);
            }
          });
          tournamentService.getTournamentTeams(id).then((teamsResult) => {
            if (teamsResult.ok && teamsResult.data) {
              setTournamentTeams(teamsResult.data);
            }
          });
        }}
      />

      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
      />
    </MainLayout>
  );
};

export default TournamentDetailPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}: GetServerSidePropsContext) => {
  return {
    props: {
      id: String(params?.id || ""),
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
};
