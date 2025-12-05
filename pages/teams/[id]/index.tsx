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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { MainLayout } from "../../../layouts";
import {
  TeamHero,
  TeamGamesGrid,
  AchievementsList,
  JoinCard,
  TeamTabs,
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
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

          // Load team members first, then check user status
          const loadedMembers = await loadMembers(id, teamData);

          // Check user's membership and request status after members are loaded
          if (user?.id) {
            await checkUserStatus(teamData, user.id, loadedMembers);
          } else {
            setJoinCardState("request");
          }
        } else {
          setError(
            (result as any).errorMessage || (t("loadTeamError") as string)
          );
        }
      } catch (err: any) {
        setError(err?.message || (t("loadTeamError") as string));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTeam();
    }
  }, [id, user?.id]);

  const loadMembers = async (
    teamId: string,
    teamData?: Team
  ): Promise<any[]> => {
    try {
      const result = await teamService.findMembers(teamId);
      if (result.ok && result.data) {
        const transformedMembers = result.data.map((member: any) => {
          const fullName = `${member.firstname || ""} ${
            member.lastname || ""
          }`.trim();

          const isCreator = teamData?.creatorId === member.id;
          const isLeader = teamData?.leaderId === member.id;

          return {
            id: member.id,
            name: fullName || member.username,
            username: member.username,
            avatar: member.profileImage || "/default-avatar.png",
            role: isCreator ? "creator" : isLeader ? "leader" : undefined,
            position: "",
            joinDate: member.joinedAt,
            isCreator,
            isLeader,
          };
        });
        setMembers(transformedMembers);
        return transformedMembers;
      }
      return [];
    } catch (err) {
      console.error("Error loading members:", err);
      // Don't set error state, just log it - members are not critical
      return [];
    }
  };

  const checkUserStatus = async (
    teamData: Team,
    userId: string,
    membersList?: any[]
  ) => {
    try {
      // Check if user is leader or creator (should hide join card)
      if (userId === teamData.leaderId || userId === teamData.creatorId) {
        setJoinCardState("hidden");
        setIsMember(false);
        setHasPendingRequest(false);
        return;
      }

      // Use provided members list or current state
      const currentMembers = membersList || members;

      // Check if user is a member of the team by checking members list
      const isUserMember = currentMembers.some(
        (member) => member.id === userId
      );

      if (isUserMember) {
        setIsMember(true);
        setJoinCardState("member");
        return;
      }

      // Check team requests to see if user has a pending request
      const requestsResult = await teamService.findAllRequests(id);
      if (requestsResult.ok && requestsResult.data) {
        const userRequest = requestsResult.data.find(
          (req: any) =>
            req.userId === userId && (!req.status || req.status === "pending")
        );

        if (userRequest) {
          setHasPendingRequest(true);
          setJoinCardState("pending");
          setIsMember(false);
          return;
        }
      }

      // User is not a member and has no pending request
      setIsMember(false);
      setJoinCardState("request");
    } catch (err) {
      console.error("Error checking user status:", err);
      // Default to showing request button if check fails
      setJoinCardState("request");
    }
  };

  const handleTeamUpdated = async () => {
    if (id) {
      const result = await teamService.find(id);
      if (result.ok && result.data) {
        const teamData = result.data;
        setTeam(teamData);

        const userIsLeader = user?.id === teamData.leaderId;
        const userIsCreator = user?.id === teamData.creatorId;
        setIsLeader(userIsLeader);
        setIsCreator(userIsCreator);
        setCanEdit(userIsLeader || userIsCreator);

        const gamesResult = await teamService.findAllGames(id);
        if (gamesResult.ok && gamesResult.data) {
          setTeamGames(gamesResult.data);
        }
        const reloadedMembers = await loadMembers(id, teamData);
        if (user?.id) {
          await checkUserStatus(teamData, user.id, reloadedMembers);
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

  const handleUpdateLeader = async (userId: string) => {
    if (!id || !user?.id) {
      const errorMessage = "Team ID or user ID is missing";
      showError({
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    try {
      const result = await teamService.updateLeader(id, userId);

      if (result.ok) {
        showSuccess({
          message: t("leaderUpdatedSuccess") as string,
        });
        await handleTeamUpdated();
      } else {
        const errorMessage =
          result.errorMessage || (t("leaderUpdatedError") as string);
        showError({
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err?.message || (t("leaderUpdatedError") as string);
      showError({
        message: errorMessage,
      });
      throw err;
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!id || !user?.id) return;

    // Find the member to check permissions
    const memberToRemove = members.find((m) => m.id === userId);

    // Validate permissions
    if (memberToRemove?.isCreator) {
      const errorMessage = t("cannotRemoveCreator") as string;
      showError({
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    if (memberToRemove?.isLeader && !isCreator) {
      const errorMessage = t("cannotRemoveLeader") as string;
      showError({
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    if (!isLeader && !isCreator) {
      const errorMessage = t("onlyLeaderCreatorCanRemove") as string;
      showError({
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }

    try {
      const result = await teamService.removeMember(id, userId);
      if (result.ok) {
        showSuccess({
          message: t("memberRemovedSuccess") as string,
        });
        await handleTeamUpdated();
      } else {
        const errorMessage =
          result.errorMessage || (t("memberRemovedError") as string);
        showError({
          message: errorMessage,
        });
        // Throw error so the calling component can handle it
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err?.message || (t("memberRemovedError") as string);
      showError({
        message: errorMessage,
      });
      // Re-throw the error so the calling component can handle it
      throw err;
    }
  };

  const handleDeleteTeam = async () => {
    if (!id || !isCreator) return;

    setIsDeleting(true);
    try {
      const result = await teamService.delete(id);
      if (result.ok) {
        showSuccess({
          message: t("deleteTeamSuccess") as string,
        });
        setDeleteDialogOpen(false);
        // Redirect to teams page after a short delay
        setTimeout(() => {
          router.push("/teams");
        }, 1000);
      } else {
        showError({
          message: result.errorMessage || (t("deleteTeamError") as string),
        });
        setIsDeleting(false);
      }
    } catch (err: any) {
      showError({
        message: err?.message || (t("deleteTeamError") as string),
      });
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout pageDescription="Team detail" title="Loading...">
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: { xs: "300px", md: "400px" },
              py: { xs: 4, md: 0 },
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
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Alert
            severity="error"
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            {error || (t("teamNotFound") as string)}
          </Alert>
        </Container>
      </MainLayout>
    );
  }

  // Transform games for TeamGamesGrid
  const gamesForDisplay = teamGames.map((game) => ({
    name: game.name,
    icon: getGameImage(game.name),
  }));

  // Mock data for achievements (until API provides them)
  const achievements: any[] = [];
  const stats = {
    totalTournaments: 0,
    wins: 0,
    winRate: 0,
  };

  // Check if there's data to display
  const hasGames = gamesForDisplay.length > 0;
  const hasAchievements = achievements.length > 0;
  const hasStats =
    stats.totalTournaments > 0 || stats.wins > 0 || stats.winRate > 0;
  const hasDescription =
    team?.description && team.description.trim().length > 0;
  const showAboutCard = hasDescription || hasStats;

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
        showDeleteButton={isCreator}
        onDelete={() => setDeleteDialogOpen(true)}
        isCreator={isCreator}
        isLeader={isLeader}
        creatorLabel={t("creator") as string}
        leaderLabel={t("leader") as string}
        teamId={team.id}
      />

      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}
      >
        {/* Mobile Tabs View */}
        <TeamTabs
          informationContent={
            <>
              {/* About Section */}
              {showAboutCard && (
                <Card
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: { xs: 2, md: 3 },
                    border: `1px solid ${theme.palette.divider}`,
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 700,
                        mb: { xs: 2, md: 3 },
                        fontSize: {
                          xs: "1.25rem",
                          sm: "1.5rem",
                          md: "1.75rem",
                        },
                      }}
                    >
                      {t("about")}
                    </Typography>
                    {hasDescription && (
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.8,
                          mb: { xs: 2, md: 3 },
                          fontSize: { xs: "0.875rem", md: "1rem" },
                        }}
                      >
                        {team.description}
                      </Typography>
                    )}

                    {/* Stats */}
                    {hasStats && (
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid size={{ xs: 4 }}>
                          <Paper
                            sx={{
                              bgcolor: theme.palette.background.default,
                              p: { xs: 1.5, sm: 2 },
                              textAlign: "center",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h4"
                              sx={{
                                color: theme.palette.info.main,
                                fontWeight: 800,
                                fontSize: {
                                  xs: "1.5rem",
                                  sm: "2rem",
                                  md: "2.125rem",
                                },
                              }}
                            >
                              {stats.totalTournaments}
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                mt: { xs: 0.5, sm: 0 },
                              }}
                            >
                              {t("tournamentsLabel")}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Paper
                            sx={{
                              bgcolor: theme.palette.background.default,
                              p: { xs: 1.5, sm: 2 },
                              textAlign: "center",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h4"
                              sx={{
                                color: theme.palette.success.main,
                                fontWeight: 800,
                                fontSize: {
                                  xs: "1.5rem",
                                  sm: "2rem",
                                  md: "2.125rem",
                                },
                              }}
                            >
                              {stats.wins}
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                mt: { xs: 0.5, sm: 0 },
                              }}
                            >
                              {t("winsLabel")}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Paper
                            sx={{
                              bgcolor: theme.palette.background.default,
                              p: { xs: 1.5, sm: 2 },
                              textAlign: "center",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h4"
                              sx={{
                                color: theme.palette.warning.main,
                                fontWeight: 800,
                                fontSize: {
                                  xs: "1.5rem",
                                  sm: "2rem",
                                  md: "2.125rem",
                                },
                              }}
                            >
                              {stats.winRate}%
                            </Typography>
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                mt: { xs: 0.5, sm: 0 },
                              }}
                            >
                              {t("winRateLabel")}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Games Section */}
              {(hasGames || canEdit) && (
                <Card
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: { xs: 2, md: 3 },
                    border: `1px solid ${theme.palette.divider}`,
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                    {hasGames ? (
                      <TeamGamesGrid
                        games={gamesForDisplay as any}
                        title={t("gamesTitle") as string}
                      />
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 3,
                          px: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: "0.9rem",
                          }}
                        >
                          {t("addGameMessage")}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Members Section */}
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                  mb: { xs: 2, md: 3 },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                  <MembersList
                    members={members as any}
                    title={
                      t("membersTitle", {
                        count: members.length,
                      }) as string
                    }
                    teamName={team?.name}
                    formatSince={(dateIso?: string) =>
                      t("since", {
                        date: new Date(dateIso || "").toLocaleDateString(),
                      }) as string
                    }
                    currentUserId={user?.id}
                    isCurrentUserLeader={isLeader}
                    isCurrentUserCreator={isCreator}
                    teamId={id}
                    onUpdateLeader={handleUpdateLeader}
                    onRemoveMember={handleRemoveMember}
                    onMemberUpdated={handleTeamUpdated}
                  />
                </CardContent>
              </Card>

              {/* Achievements Section */}
              {hasAchievements && (
                <Card
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: { xs: 2, md: 3 },
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
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
              )}
            </>
          }
          secondTabContent={
            isLeader || isCreator ? (
              <TeamRequestsAdmin
                teamId={id}
                onRequestUpdated={handleTeamUpdated}
              />
            ) : (
              <>
                <Card
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: { xs: 2, md: 3 },
                    border: `1px solid ${theme.palette.divider}`,
                    mb: { xs: 2, md: 3 },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
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
                    {joinCardState !== "member" && (
                      <>
                        <Divider
                          sx={{
                            bgcolor: theme.palette.divider,
                            my: { xs: 2, md: 3 },
                          }}
                        />
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                            textAlign: "center",
                            mb: { xs: 1.5, md: 2 },
                          }}
                        >
                          {t("requirementsTitle")}
                        </Typography>
                        <Stack spacing={1}>
                          {(t.raw("requirements") as string[]).map(
                            (req, idx) => (
                              <Typography
                                key={idx}
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                                }}
                              >
                                • {req}
                              </Typography>
                            )
                          )}
                        </Stack>
                      </>
                    )}
                  </CardContent>
                </Card>
              </>
            )
          }
          secondTabLabel={
            isLeader || isCreator ? t("administration") : t("joinCta")
          }
        />

        {/* Desktop Grid View */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{ display: { xs: "none", lg: "flex" } }}
        >
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* About Section */}
            {showAboutCard && (
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                  mb: { xs: 2, md: 3 },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    }}
                  >
                    {t("about")}
                  </Typography>
                  {hasDescription && (
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.8,
                        mb: { xs: 2, md: 3 },
                        fontSize: { xs: "0.875rem", md: "1rem" },
                      }}
                    >
                      {team.description}
                    </Typography>
                  )}

                  {/* Stats */}
                  {hasStats && (
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid size={{ xs: 4 }}>
                        <Paper
                          sx={{
                            bgcolor: theme.palette.background.default,
                            p: { xs: 1.5, sm: 2 },
                            textAlign: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              color: theme.palette.info.main,
                              fontWeight: 800,
                              fontSize: {
                                xs: "1.5rem",
                                sm: "2rem",
                                md: "2.125rem",
                              },
                            }}
                          >
                            {stats.totalTournaments}
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: { xs: "0.75rem", sm: "0.85rem" },
                              mt: { xs: 0.5, sm: 0 },
                            }}
                          >
                            {t("tournamentsLabel")}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Paper
                          sx={{
                            bgcolor: theme.palette.background.default,
                            p: { xs: 1.5, sm: 2 },
                            textAlign: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              color: theme.palette.success.main,
                              fontWeight: 800,
                              fontSize: {
                                xs: "1.5rem",
                                sm: "2rem",
                                md: "2.125rem",
                              },
                            }}
                          >
                            {stats.wins}
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: { xs: "0.75rem", sm: "0.85rem" },
                              mt: { xs: 0.5, sm: 0 },
                            }}
                          >
                            {t("winsLabel")}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Paper
                          sx={{
                            bgcolor: theme.palette.background.default,
                            p: { xs: 1.5, sm: 2 },
                            textAlign: "center",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              color: theme.palette.warning.main,
                              fontWeight: 800,
                              fontSize: {
                                xs: "1.5rem",
                                sm: "2rem",
                                md: "2.125rem",
                              },
                            }}
                          >
                            {stats.winRate}%
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: { xs: "0.75rem", sm: "0.85rem" },
                              mt: { xs: 0.5, sm: 0 },
                            }}
                          >
                            {t("winRateLabel")}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Games Section */}
            {(hasGames || canEdit) && (
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                  mb: { xs: 2, md: 3 },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                  {hasGames ? (
                    <TeamGamesGrid
                      games={gamesForDisplay as any}
                      title={t("gamesTitle") as string}
                    />
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 3,
                        px: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.9rem",
                        }}
                      >
                        {t("addGameMessage")}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Members Section */}
            <Card
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: { xs: 2, md: 3 },
                border: `1px solid ${theme.palette.divider}`,
                mb: { xs: 2, md: 3 },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                <MembersList
                  members={members as any}
                  title={
                    t("membersTitle", {
                      count: members.length,
                    }) as string
                  }
                  formatSince={(dateIso?: string) =>
                    t("since", {
                      date: new Date(dateIso || "").toLocaleDateString(),
                    }) as string
                  }
                  currentUserId={user?.id}
                  isCurrentUserLeader={isLeader}
                  isCurrentUserCreator={isCreator}
                  teamId={id}
                  onUpdateLeader={handleUpdateLeader}
                  onRemoveMember={handleRemoveMember}
                  onMemberUpdated={handleTeamUpdated}
                />
              </CardContent>
            </Card>

            {/* Achievements Section */}
            {hasAchievements && (
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
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
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {joinCardState !== "hidden" && (
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: { xs: 2, md: 3 },
                  border: `1px solid ${theme.palette.divider}`,
                  position: { xs: "static", lg: "sticky" },
                  top: { lg: 20 },
                  mb: { xs: 2, lg: 0 },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
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
                      <Divider
                        sx={{
                          bgcolor: theme.palette.divider,
                          my: { xs: 2, md: 3 },
                        }}
                      />
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: { xs: "0.8rem", md: "0.85rem" },
                          textAlign: "center",
                          mb: { xs: 1.5, md: 2 },
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
                              fontSize: { xs: "0.75rem", md: "0.8rem" },
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
            )}

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t("deleteTeamTitle") as string}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {t("deleteTeamConfirmation", { teamName: team?.name }) as string}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            disabled={isDeleting}
          >
            {t("cancel") as string}
          </Button>
          <Button
            onClick={handleDeleteTeam}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? (t("deleting") as string) : (t("delete") as string)}
          </Button>
        </DialogActions>
      </Dialog>
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
