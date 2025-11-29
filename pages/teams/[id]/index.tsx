import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { MainLayout } from "../../../layouts";
import {
  TeamHero,
  TeamGamesGrid,
  AchievementsList,
  JoinCard,
} from "../../../components/organisms";
import { EditTeamModal } from "../../../components/organisms/modals/EditTeamModal";
import MembersList from "../../../components/organisms/team/MembersList";
import { TeamRequestsAdmin } from "../../../components/organisms/team/TeamRequestsAdmin";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { teamService } from "../../../services/team.service";
import { gameService } from "../../../services/game.service";
import type { Team, Game } from "../../../interfaces";
import { UserContext } from "../../../context/user";
import { getGameImage } from "../../../utils/gameImageUtils";
import { useFeedback } from "../../../hooks/useFeedback";

interface Props {
  id: string;
}

export default function TeamDetailPage({ id }: Props) {
  const router = useRouter();
  const t = useTranslations("TeamDetail");
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const { showSuccess, showError } = useFeedback();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamGames, setTeamGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [joinCardState, setJoinCardState] = useState<
    "request" | "pending" | "member" | "hidden"
  >("hidden");

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await teamService.find(id);

        if (result.ok && result.data) {
          const teamData = result.data;
          setTeam(teamData);

          // Check if current user is the leader or creator
          const userIsLeader = user?.id === teamData.leaderId;
          const userIsCreator = user?.id === teamData.creatorId;
          setIsLeader(userIsLeader);
          setIsCreator(userIsCreator);
          setCanEdit(userIsLeader || userIsCreator);

          if (teamData.games) {
            setTeamGames(teamData.games);
          }

          // Check user's membership and request status
          if (user?.id) {
            await checkUserStatus(teamData, user.id);
          } else {
            setJoinCardState("request");
          }
        } else {
          setError((result as any).errorMessage || "Error al cargar el equipo");
        }
      } catch (err: any) {
        setError(err?.message || "Error al cargar el equipo");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTeam();
    }
  }, [id, user?.id]);

  const checkUserStatus = async (teamData: Team, userId: string) => {
    try {
      // Check if user is leader or creator (should hide join card)
      if (userId === teamData.leaderId || userId === teamData.creatorId) {
        setJoinCardState("hidden");
        setIsMember(false);
        setHasPendingRequest(false);
        return;
      }

      // Check team requests to see if user has a pending request
      const requestsResult = await teamService.findTeamRequests(id);
      if (requestsResult.ok && requestsResult.data) {
        const userRequest = requestsResult.data.find(
          (req) =>
            req.userId === userId && (!req.status || req.status === "pending")
        );

        if (userRequest) {
          setHasPendingRequest(true);
          setJoinCardState("pending");
          setIsMember(false);
          return;
        }
      }

      // TODO: Check if user is a member of the team
      // For now, we'll assume they're not a member if they're not leader/creator and have no pending request
      // This should be replaced with an actual check when the endpoint is available
      setIsMember(false);
      setJoinCardState("request");
    } catch (err) {
      console.error("Error checking user status:", err);
      // Default to showing request button if check fails
      setJoinCardState("request");
    }
  };

  const handleTeamUpdated = async () => {
    // Reload team data after update
    if (id) {
      const result = await teamService.find(id);
      if (result.ok && result.data) {
        setTeam(result.data);
        const gamesResult = await teamService.findAllGames(id);
        if (gamesResult.ok && gamesResult.data) {
          setTeamGames(gamesResult.data);
        }
        // Recheck user status
        if (user?.id) {
          await checkUserStatus(result.data, user.id);
        }
      }
    }
  };

  const handleRequestJoin = async () => {
    if (!id || !user?.id) return;

    try {
      const result = await teamService.requestAccess(id, user.id);
      if (result.ok) {
        showSuccess({
          message: t("requestJoinSuccess") as string,
        });
        setHasPendingRequest(true);
        setJoinCardState("pending");
      } else {
        showError({
          message: result.errorMessage || (t("requestJoinError") as string),
        });
      }
    } catch (err: any) {
      showError({
        message: err?.message || (t("requestJoinError") as string),
      });
    }
  };

  const handleLeaveTeam = async () => {
    if (!id || !user?.id) return;

    // Prevent creator from leaving
    if (isCreator) {
      showError({
        message: t("creatorCannotLeave") as string,
      });
      return;
    }

    try {
      const result = await teamService.leaveTeam(id);
      if (result.ok) {
        showSuccess({
          message: t("leaveTeamSuccess") as string,
        });
        setIsMember(false);
        setJoinCardState("request");
        // Reload team data
        await handleTeamUpdated();
      } else {
        // If endpoint is not implemented, show appropriate message
        if (result.errorMessage?.includes("not yet implemented")) {
          showError({
            message: t("leaveTeamNotImplemented") as string,
          });
        } else {
          showError({
            message: result.errorMessage || (t("leaveTeamError") as string),
          });
        }
      }
    } catch (err: any) {
      showError({
        message: err?.message || (t("leaveTeamError") as string),
      });
    }
  };

  if (loading) {
    return (
      <MainLayout pageDescription="Team detail" title="Loading...">
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error || !team) {
    return (
      <MainLayout pageDescription="Team detail" title="Error">
        <Container maxWidth="xl">
          <Alert severity="error">{error || "Equipo no encontrado"}</Alert>
        </Container>
      </MainLayout>
    );
  }

  // Transform games for TeamGamesGrid
  const gamesForDisplay = teamGames.map((game) => ({
    name: game.name,
    icon: getGameImage(game.name),
  }));

  // Mock data for members and achievements (until API provides them)
  const members: any[] = [];
  const achievements: any[] = [];
  const stats = {
    totalTournaments: 0,
    wins: 0,
    winRate: 0,
  };

  const foundedYear = team.createdAt
    ? new Date(team.createdAt).getFullYear().toString()
    : "2020";

  return (
    <MainLayout pageDescription="Team detail" title={team.name}>
      {/* Hero Section */}
      <TeamHero
        banner={team.image || "/default-team-banner.png"}
        logo={team.image || "/default-team-logo.png"}
        name={team.name}
        foundedLabel={t("founded", { year: foundedYear }) as string}
        region="LATAM"
        backLabel={t("back") as string}
        onBack={() => router.push("/teams")}
        showEditButton={canEdit}
        onEdit={() => setEditModalOpen(true)}
        isCreator={isCreator}
        isLeader={isLeader}
        creatorLabel={t("creator") as string}
        leaderLabel={t("leader") as string}
      />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* About Section */}
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
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
                  {t("about")}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.8,
                    mb: 3,
                  }}
                >
                  {team.description ||
                    t("noDescription", { default: "Sin descripción" })}
                </Typography>

                {/* Stats */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
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
                        {stats.totalTournaments}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.85rem",
                        }}
                      >
                        {t("tournamentsLabel", { default: "Torneos" })}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
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
                        sx={{
                          color: theme.palette.success.main,
                          fontWeight: 800,
                        }}
                      >
                        {stats.wins}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.85rem",
                        }}
                      >
                        {t("winsLabel", { default: "Victorias" })}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
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
                        sx={{
                          color: theme.palette.warning.main,
                          fontWeight: 800,
                        }}
                      >
                        {stats.winRate}%
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.85rem",
                        }}
                      >
                        {t("winRateLabel", { default: "Win Rate" })}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Games Section */}
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <TeamGamesGrid
                  games={gamesForDisplay as any}
                  title={t("gamesTitle") as string}
                />
              </CardContent>
            </Card>

            {/* Members Section */}
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <MembersList
                  members={members as any}
                  title={
                    t("membersTitle", {
                      count: members.length,
                    }) as string
                  }
                  captainLabel={t("captain") as string}
                  formatSince={(dateIso?: string) =>
                    t("since", {
                      date: new Date(dateIso || "").toLocaleDateString(),
                    }) as string
                  }
                />
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <AchievementsList
                  achievements={achievements as any}
                  title={t("achievementsTitle") as string}
                  formatDate={(iso: string) =>
                    new Date(iso).toLocaleDateString()
                  }
                  formatPrize={(prize: string) =>
                    t("prize", { prize }) as string
                  }
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                position: "sticky",
                top: 20,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <JoinCard
                  title={t("joinCta") as string}
                  membersCount={members.length}
                  currentMembersLabel={t("currentMembers") as string}
                  requestJoinLabel={t("requestJoin") as string}
                  waitingApprovalLabel={t("waitingApproval") as string}
                  leaveTeamLabel={t("leaveTeam") as string}
                  state={joinCardState}
                  onRequestJoin={handleRequestJoin}
                  onLeaveTeam={handleLeaveTeam}
                />
                {!(isCreator || isLeader || joinCardState === "member") && (
                  <>
                    <Divider sx={{ bgcolor: theme.palette.divider, my: 3 }} />
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.85rem",
                        textAlign: "center",
                        mb: 2,
                      }}
                    >
                      {t("requirementsTitle")}
                    </Typography>
                    <Stack spacing={1}>
                      {(t.raw("requirements") as string[]).map((req, idx) => (
                        <Typography
                          key={idx}
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: "0.8rem",
                          }}
                        >
                          • {req}
                        </Typography>
                      ))}
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Requests Admin Section - Only for leader/creator */}
            {(isLeader || isCreator) && (
              <TeamRequestsAdmin
                teamId={id}
                onRequestUpdated={handleTeamUpdated}
              />
            )}
          </Grid>
        </Grid>
      </Container>

      {team && (
        <EditTeamModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          team={team}
          teamGames={teamGames}
          onUpdated={handleTeamUpdated}
        />
      )}
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}: GetServerSidePropsContext) => {
  const id = params?.id as string;
  return {
    props: {
      id,
      messages: (await import(`../../../lang/${locale}.json`)).default,
    },
  };
};
