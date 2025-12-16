import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useMemo, useState, useContext } from "react";
import { MainLayout } from "../../layouts";
import { useRouter } from "next/router";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type { Game, Tournament, Team, User } from "../../interfaces";
import { tournamentService } from "../../services/tournament.service";
import { formatDate } from "../../utils/formatDate";
import { gameService } from "../../services/game.service";
import { teamService } from "../../services/team.service";
import { userService } from "../../services/user.service";
import { UserContext } from "../../context/user";
import { EditTournamentModal } from "../../components/organisms/modals/EditTournamentModal";
import { SetFinalPositionsModal } from "../../components/organisms/modals/SetFinalPositionsModal";
import { TournamentTabs } from "../../components/organisms/tournament/TournamentTabs";
import { TournamentWinners } from "../../components/organisms/tournament/TournamentWinners";
import { TournamentHero } from "../../components/organisms/tournament/TournamentHero";
import { TournamentInfoCard } from "../../components/organisms/tournament/TournamentInfoCard";
import { TournamentTeamsList } from "../../components/organisms/tournament/TournamentTeamsList";
import { TournamentJoinSection } from "../../components/organisms/tournament/TournamentJoinSection";
import { TournamentDialogs } from "../../components/organisms/tournament/TournamentDialogs";
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
  const [finalizedStatusId, setFinalizedStatusId] = useState<string | null>(
    null
  );
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
    if (
      finalizedStatusId &&
      tournament.tournamentStatusId === finalizedStatusId
    ) {
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
        <TournamentHero
          tournament={tournament}
          game={game}
          backgroundImage={backgroundImage}
          tournamentStatusName={tournamentStatusName}
          canEditTournament={canEditTournament ?? false}
          onEditClick={() => setEditModalOpen(true)}
          onDeleteClick={handleDeleteTournamentClick}
          tournamentId={id}
        />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Mobile Tabs View */}
          <TournamentTabs
            informationContent={
              <>
                <TournamentInfoCard
                  tournament={tournament}
                  tournamentStatusName={tournamentStatusName}
                  startDateLabel={startDateLabel}
                  endDateLabel={endDateLabel}
                  responsibleUser={responsibleUser}
                  loadingResponsible={loadingResponsible}
                />

                <TournamentWinners tournamentId={id} />

                <TournamentTeamsList
                  tournament={tournament}
                  teams={tournamentTeams}
                  canEditTournament={canEditTournament ?? false}
                  hasTournamentEnded={hasTournamentEnded ?? false}
                  onRemoveTeam={handleRemoveTeamClick}
                />
              </>
            }
            secondTabContent={
              <TournamentJoinSection
                tournament={tournament}
                tournamentId={id}
                canEditTournament={canEditTournament ?? false}
                isTournamentCreator={isTournamentCreator ?? false}
                isTournamentCreatorOrResponsible={
                  isTournamentCreatorOrResponsible ?? false
                }
                tournamentTeams={tournamentTeams}
                hasTournamentEnded={hasTournamentEnded ?? false}
                hasTournamentStarted={hasTournamentStarted ?? false}
                hasWinners={hasWinners ?? false}
                registeredCount={registeredCount}
                maxCapacity={maxCapacity}
                user={user ?? null}
                userTeams={userTeams}
                selectedTeamId={selectedTeamId}
                loadingTeams={loadingTeams}
                registering={registering}
                leaving={leaving}
                hasPendingRequest={hasPendingRequest}
                onRegisterTeam={handleRegisterTeam}
                onLeaveTournament={handleLeaveTournament}
                onTeamSelected={setSelectedTeamId}
                onSetFinalPositions={() => setSetFinalPositionsModalOpen(true)}
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
              <TournamentInfoCard
                tournament={tournament}
                tournamentStatusName={tournamentStatusName}
                startDateLabel={startDateLabel}
                endDateLabel={endDateLabel}
                responsibleUser={responsibleUser}
                loadingResponsible={loadingResponsible}
              />

              <TournamentWinners tournamentId={id} />

              <TournamentTeamsList
                tournament={tournament}
                teams={tournamentTeams}
                canEditTournament={canEditTournament ?? false}
                hasTournamentEnded={hasTournamentEnded ?? false}
                onRemoveTeam={handleRemoveTeamClick}
              />
            </Box>

            {/* Sidebar */}
            <Box>
              <TournamentJoinSection
                tournament={tournament}
                tournamentId={id}
                canEditTournament={canEditTournament ?? false}
                isTournamentCreator={isTournamentCreator ?? false}
                isTournamentCreatorOrResponsible={
                  isTournamentCreatorOrResponsible ?? false
                }
                tournamentTeams={tournamentTeams}
                hasTournamentEnded={hasTournamentEnded ?? false}
                hasTournamentStarted={hasTournamentStarted ?? false}
                hasWinners={hasWinners ?? false}
                registeredCount={registeredCount}
                maxCapacity={maxCapacity}
                user={user ?? null}
                userTeams={userTeams}
                selectedTeamId={selectedTeamId}
                loadingTeams={loadingTeams}
                registering={registering}
                leaving={leaving}
                hasPendingRequest={hasPendingRequest}
                onRegisterTeam={handleRegisterTeam}
                onLeaveTournament={handleLeaveTournament}
                onTeamSelected={setSelectedTeamId}
                onSetFinalPositions={() => setSetFinalPositionsModalOpen(true)}
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
                isSticky={true}
              />
            </Box>
          </Box>
        </Container>

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

        <TournamentDialogs
          deleteTournamentDialogOpen={deleteTournamentDialogOpen}
          deletingTournament={deletingTournament}
          tournament={tournament}
          onCancelDeleteTournament={handleCancelDeleteTournament}
          onConfirmDeleteTournament={handleConfirmDeleteTournament}
          removeTeamDialogOpen={removeTeamDialogOpen}
          removingTeam={removingTeam}
          teamToRemove={teamToRemove}
          onCancelRemoveTeam={handleCancelRemoveTeam}
          onConfirmRemoveTeam={handleConfirmRemoveTeam}
          leaveTeamDialogOpen={leaveTeamDialogOpen}
          leaving={leaving}
          userRegisteredTeams={userRegisteredTeams}
          selectedLeaveTeamId={selectedLeaveTeamId}
          onCancelLeaveTeam={handleCancelLeaveTeam}
          onConfirmLeaveTeam={handleConfirmLeaveTeam}
          onSelectLeaveTeam={setSelectedLeaveTeamId}
        />

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
      </Box>
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
