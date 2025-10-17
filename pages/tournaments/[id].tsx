import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
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
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import type { Tournament } from "../../interfaces";
import { tournamentService } from "../../services/tournament.service";

interface Props {
  id: string;
}

// removed local color palette and inline mock; we now use theme + real data

const TournamentDetailPage: NextPage<Props> = ({ id }) => {
  const router = useRouter();
  const theme = useTheme();
  const [tournament, setTournament] = useState<Tournament | any | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await tournamentService.getById(id);
      if (!mounted) return;
      if (res.ok) {
        setTournament(res.data as any);
        setLoading(false);
        return;
      }
      if (process.env.NODE_ENV !== "production") {
        try {
          const { generateManyTournaments } = await import("./mocks");
          const mocks = generateManyTournaments(100) as any[];
          const found = mocks.find(
            (m) => String(m.id) === id || encodeURIComponent(m.name) === id
          );
          if (found) setTournament(found);
        } catch {}
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleOpenModal = (team: any) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeam(null);
  };

  const isTeamMode = (tournament?.participationMode || "team") === "team";
  const teams: any[] = useMemo(
    () => (tournament?.teams ? (tournament as any).teams : []),
    [tournament]
  );
  const users: any[] = useMemo(
    () =>
      tournament?.users
        ? (tournament as any).users
        : (tournament as any)?.participants || [],
    [tournament]
  );
  const registeredCount =
    tournament?.registeredTeams ??
    (isTeamMode ? teams.length : users.length) ??
    0;
  const maxCapacity =
    tournament?.maxTeams ?? tournament?.maxParticipants ?? undefined;
  const startDateLabel = useMemo(() => {
    if (!tournament?.startDate) return "-";
    try {
      return new Date(tournament.startDate).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return String(tournament.startDate);
    }
  }, [tournament]);

  return (
    <MainLayout
      pageDescription="Tournament detail"
      title={tournament?.name || "Torneo"}
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
            backgroundImage: tournament?.image
              ? `linear-gradient(to bottom, rgba(15, 15, 30, 0.3), rgba(15, 15, 30, 0.9)), url(${
                  (tournament as any).image
                })`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "flex-end",
            bgcolor: tournament?.image
              ? undefined
              : theme.palette.background.default,
          }}
        >
          <Container maxWidth="xl" sx={{ pb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/tournaments")}
              sx={{
                color: tournament?.image
                  ? theme.palette.common.white
                  : theme.palette.text.primary,
                mb: 2,
                "&:hover": {
                  bgcolor: "rgba(108, 92, 231, 0.1)",
                },
              }}
            >
              Volver a Torneos
            </Button>
            <Typography
              variant="h2"
              sx={{
                color: tournament?.image
                  ? theme.palette.common.white
                  : theme.palette.text.primary,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3.5rem" },
                mb: 2,
              }}
            >
              {tournament?.name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {tournament?.game?.image && (
                <Avatar
                  src={(tournament as any).game?.image}
                  alt={tournament?.game?.name}
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
                {tournament?.game?.name}
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
                    Información del Torneo
                  </Typography>

                  <Stack spacing={3}>
                    {/* Type and Mode */}
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      <Chip
                        icon={<TrophyIcon />}
                        label={
                          tournament?.type === "Oficial"
                            ? "Torneo Oficial"
                            : "Torneo Amateur"
                        }
                        sx={{
                          bgcolor:
                            tournament?.type === "Oficial"
                              ? theme.palette.warning.main
                              : theme.palette.info.main,
                          color: theme.palette.common.black,
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          py: 2.5,
                        }}
                      />
                      <Chip
                        icon={isTeamMode ? <GroupsIcon /> : <PersonIcon />}
                        label={isTeamMode ? "Modo Equipos" : "Modo Individual"}
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
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
                              Fecha de Inicio
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
                              Región
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
                              {isTeamMode
                                ? "Equipos Registrados"
                                : "Participantes"}
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
                              Premio
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
                        Descripción
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
                        Reglas del Torneo
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
                    {isTeamMode
                      ? `Equipos Participantes (${teams.length})`
                      : `Participantes (${users.length})`}
                  </Typography>

                  {isTeamMode ? (
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
                      {teams.map((team: any) => (
                        <Box key={team.id}>
                          <Card
                            sx={{
                              bgcolor: theme.palette.secondary.dark,
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              border: `1px solid transparent`,
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                                transform: "translateY(-4px)",
                              },
                            }}
                            onClick={() => handleOpenModal(team)}
                          >
                            <CardContent sx={{ p: 2, textAlign: "center" }}>
                              <Avatar
                                src={team.profileImage || team.logo}
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
                              <Typography
                                sx={{
                                  color: theme.palette.info.main,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {team.users?.length ||
                                  team.members?.length ||
                                  0}{" "}
                                miembros
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      {users.map((user: any, idx: number) => (
                        <Card
                          key={user.id || idx}
                          sx={{
                            bgcolor: theme.palette.secondary.dark,
                            borderRadius: 2,
                          }}
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              src={user.profileImage || user.avatar}
                              alt={user.username || user.name}
                            />
                            <Typography
                              sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                              }}
                            >
                              {user.username || user.name}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
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
                    Únete al Torneo
                  </Typography>

                  <Box
                    sx={{
                      bgcolor: theme.palette.secondary.dark,
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
                      Cupos Disponibles
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
                      {maxCapacity ?? "-"}{" "}
                      {isTeamMode ? "equipos" : "participantes"}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<RegisterIcon />}
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
                    Registrar {isTeamMode ? "Equipo" : "Participación"}
                  </Button>

                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.75rem",
                      textAlign: "center",
                    }}
                  >
                    Al registrarte aceptas las reglas del torneo
                  </Typography>
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
              Miembros del Equipo
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
                          {member.role || "Miembro"}
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
