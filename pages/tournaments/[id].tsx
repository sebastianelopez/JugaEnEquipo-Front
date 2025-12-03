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
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type { Game, Tournament, Team } from "../../interfaces";
import { tournamentService } from "../../services/tournament.service";
import { formatDate } from "../../utils/formatDate";
import { gameService } from "../../services/game.service";
import { getGameImage } from "../../utils/gameImageUtils";
import { teamService } from "../../services/team.service";
import { UserContext } from "../../context/user";
import { BackgroundFallback } from "../../components/atoms/BackgroundFallback";

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
  const [tournamentTeams, setTournamentTeams] = useState<Team[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loadingBackground, setLoadingBackground] = useState(true);

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

  const handleRegisterTeam = async () => {
    if (!selectedTeamId || !tournament) {
      setError(t("detail.selectTeamError") || "Por favor selecciona un equipo");
      return;
    }

    setRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await tournamentService.addTeam(
        tournament.id,
        selectedTeamId
      );
      if (result.ok) {
        setSuccess(
          t("detail.registerSuccess") || "Equipo registrado exitosamente"
        );

        const res = await tournamentService.find(id);
        if (res.ok && res.data) {
          setTournament(res.data as any);
        }

        const teamsResult = await tournamentService.getTournamentTeams(id);
        if (teamsResult.ok && teamsResult.data) {
          setTournamentTeams(teamsResult.data);
        }
      } else {
        setError(
          result.errorMessage ||
            t("detail.registerError") ||
            "Error al registrar el equipo"
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          t("detail.registerError") ||
          "Error al registrar el equipo"
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleLeaveTournament = async () => {
    if (!tournament) return;

    // Necesitamos obtener el teamId del usuario registrado
    // Por ahora, vamos a intentar obtenerlo de los equipos del usuario
    setLeaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Obtener los equipos del usuario para encontrar el que está registrado
      const teamsResult = await teamService.search({ mine: true });
      if (teamsResult.ok && teamsResult.data && teamsResult.data.length > 0) {
        // Por ahora, usamos el primer equipo. En el futuro, el backend debería devolver el teamId registrado
        const teamId = teamsResult.data[0].id;
        const result = await tournamentService.leaveTournament(
          tournament.id,
          teamId
        );
        if (result.ok) {
          setSuccess(
            t("detail.leaveSuccess") || "Has dejado el torneo exitosamente"
          );

          const res = await tournamentService.find(id);
          if (res.ok && res.data) {
            setTournament(res.data as any);
          }

          const teamsResult = await tournamentService.getTournamentTeams(id);
          if (teamsResult.ok && teamsResult.data) {
            setTournamentTeams(teamsResult.data);
          }
        } else {
          setError(
            result.errorMessage ||
              t("detail.leaveError") ||
              "Error al dejar el torneo"
          );
        }
      } else {
        setError(
          t("detail.noTeamFound") || "No se encontró un equipo registrado"
        );
      }
    } catch (err: any) {
      setError(
        err.message || t("detail.leaveError") || "Error al dejar el torneo"
      );
    } finally {
      setLeaving(false);
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

  const registeredCount = tournament?.registeredTeams ?? 0;
  const maxCapacity = tournament?.maxTeams ?? 0;
  const isTournamentCreator = useMemo(() => {
    return user && tournament && tournament.responsibleId === user.id;
  }, [user, tournament]);
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
          <Container maxWidth="xl" sx={{ pb: 4, position: "relative", zIndex: 1 }}>
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
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.common.white,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3.5rem" },
                mb: 2,
              }}
            >
              {tournament?.name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
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
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
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
                    <Stack direction="row" spacing={2} flexWrap="wrap">
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
                  </Stack>
                </CardContent>
              </Card>

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
                      <Box key={team.id}>
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
                          onClick={() => handleOpenModal(team)}
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

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {success}
                    </Alert>
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
                  ) : (
                    <>
                      {user && userTeams.length > 0 && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>{t("detail.selectTeam")}</InputLabel>
                          <Select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            label={t("detail.selectTeam")}
                            disabled={loadingTeams || registering}
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
                          userTeams.length === 0
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
                          ? t("detail.registering")
                          : t("detail.registerTeam")}
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
