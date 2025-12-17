import {
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Box,
} from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import {
  ProfileHero,
  ProfileTabs,
  AboutCard,
  GamesGrid,
  TeamsList,
  TournamentsGrid,
  SocialLinksCard,
  ProfileEditModal,
} from "../../components/organisms";
import { Post, User, Team, Player, Game, Role } from "../../interfaces";
import { MainLayout } from "../../layouts";
import { userService } from "../../services/user.service";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { postService } from "../../services/post.service";
import { teamService } from "../../services/team.service";
import { playerService } from "../../services/player.service";
import { roleService } from "../../services/role.service";
import { UserContext } from "../../context/user";
import { PostList } from "../../components/molecules/Post/PostList";
import { sortPostsByDate } from "../../utils/sortPosts";
import { formatFullName } from "../../utils/textFormatting";
import { getGameImage } from "../../utils/gameImageUtils";
import { tournamentService } from "../../services/tournament.service";
import type { Tournament } from "../../interfaces";

interface Props {
  userFound: User;
}

const ProfilePage: NextPage<Props> = ({ userFound }) => {
  const t = useTranslations("Profile");
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);

  const isLoggedUser = user?.username === userFound.username;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [teams, setTeams] = useState<
    {
      id: string | number;
      name: string;
      logo?: string;
      role?: string;
      position?: string;
      joinDate?: string | number | Date;
      leftDate?: string | number | Date;
    }[]
  >([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rolesData, setRolesData] = useState<Map<string, Role[]>>(new Map());
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [wonTournaments, setWonTournaments] = useState<Tournament[]>([]);
  const [loadingWonTournaments, setLoadingWonTournaments] = useState(false);

  // Load background image
  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const result = await userService.getBackgroundImage(userFound.id);
        if (result.ok) {
          setBackgroundImage(result.data);
        }
      } catch (error) {
        console.error("Error loading background image:", error);
      }
    };

    loadBackgroundImage();
  }, [userFound.id]);

  const loadPosts = useCallback(async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const result = await postService.getPostsByUsername(userFound.username);
      if (result.error || !result.data) {
        setHasError(true);
        setPosts([]);
        return;
      }
      const postsArray = result.data;
      const sortedPosts = sortPostsByDate(postsArray);
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      setHasError(true);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [userFound.username]);

  const removePost = useCallback((postId: string) => {
    setPosts((prevPosts) => {
      return prevPosts.filter((post) => post.id !== postId);
    });
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const handlePostDeleted = (event: CustomEvent<{ postId: string }>) => {
      removePost(event.detail.postId);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "postDeleted",
        handlePostDeleted as EventListener
      );
      return () => {
        window.removeEventListener(
          "postDeleted",
          handlePostDeleted as EventListener
        );
      };
    }
  }, [removePost]);

  useEffect(() => {
    const handlePostModerated = (event: CustomEvent<{ postId: string }>) => {
      removePost(event.detail.postId);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "postModerated",
        handlePostModerated as EventListener
      );
      return () => {
        window.removeEventListener(
          "postModerated",
          handlePostModerated as EventListener
        );
      };
    }
  }, [removePost]);

  const loadTeams = useCallback(async () => {
    try {
      setIsLoadingTeams(true);
      const result = await teamService.getTeamsByUserId(userFound.id);
      if (result.ok && result.data) {
        // Deduplicate teams by ID (in case user appears multiple times)
        const uniqueTeamsMap = new Map<string, Team>();
        result.data.forEach((team: Team) => {
          if (!uniqueTeamsMap.has(team.id)) {
            uniqueTeamsMap.set(team.id, team);
          }
        });

        // Transform Team[] to TeamItem[]
        const transformedTeams = Array.from(uniqueTeamsMap.values()).map(
          (team: Team) => {
            // Determine role based on user's relationship to the team
            // Priority: creator > leader > member
            let role: string;
            if (team.creatorId === userFound.id) {
              role = "creator";
            } else if (team.leaderId === userFound.id) {
              role = "leader";
            } else {
              // If user is in the team but not creator or leader, they are a member
              role = "member";
            }

            return {
              id: team.id,
              name: team.name,
              logo: team.image || undefined,
              role,
              joinDate: team.createdAt,
              leftDate: team.deletedAt || undefined,
            };
          }
        );
        setTeams(transformedTeams);
      } else {
        setTeams([]);
      }
    } catch (error) {
      console.error("Error loading teams:", error);
      setTeams([]);
    } finally {
      setIsLoadingTeams(false);
    }
  }, [userFound.id]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Load user players
  const loadPlayers = useCallback(async () => {
    try {
      setIsLoadingPlayers(true);

      const result = await playerService.search(
        isLoggedUser && user?.id
          ? { userId: user.id }
          : { userId: userFound.id }
      );
      if (result.ok && result.data) {
        setPlayers(result.data || []);

        // Load roles data for each unique game (gameName already comes in the response)
        const rolesMap = new Map<string, Role[]>();
        const uniqueGameIds = Array.from(
          new Set(result.data.map((p: Player) => p.gameId))
        );

        for (const gameId of uniqueGameIds) {
          if (!rolesMap.has(gameId)) {
            const rolesResult = await roleService.findAllByGame(gameId);
            if (rolesResult.ok && rolesResult.data) {
              rolesMap.set(gameId, rolesResult.data);
            }
          }
        }

        setRolesData(rolesMap);
      } else {
        setPlayers([]);
      }
    } catch (error) {
      console.error("Error loading players:", error);
      setPlayers([]);
    } finally {
      setIsLoadingPlayers(false);
    }
  }, [isLoggedUser, userFound.id, userFound.username]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  useEffect(() => {
    const loadWonTournaments = async () => {
      if (!userFound.id) return;
      setLoadingWonTournaments(true);
      try {
        const result = await tournamentService.findTournamentsWon({
          userId: userFound.id,
          limit: 10,
          page: 1,
        });
        if (result.ok && result.data) {
          setWonTournaments(result.data);
        }
      } catch (error) {
        console.error("Error loading won tournaments:", error);
      } finally {
        setLoadingWonTournaments(false);
      }
    };

    loadWonTournaments();
  }, [userFound.id]);

  const handleOnSave = useCallback(
    async ({
      description: newDescription,
      socialLinks: newLinks,
      profileImage,
      backgroundImage,
    }: {
      description: string;
      socialLinks: {
        twitter?: string;
        instagram?: string;
        youtube?: string;
        twitch?: string;
      };
      profileImage?: File;
      backgroundImage?: string;
    }) => {
      try {
        const promises: Promise<any>[] = [];

        // Actualizar imagen de perfil si hay una nueva
        if (profileImage) {
          promises.push(
            userService.updateProfileImage(profileImage).then((response) => {
              // Actualizar el usuario en el contexto con la nueva URL de imagen
              if (user && response?.imageUrl) {
                const updatedUser = {
                  ...user,
                  profileImage: response.imageUrl,
                };
                setUser(updatedUser);
              }
            })
          );
        }

        // Actualizar imagen de fondo si hay una nueva
        if (backgroundImage) {
          promises.push(userService.updateBackgroundImage(backgroundImage));
        }

        // Actualizar descripción si cambió
        if (newDescription !== userFound.description) {
          promises.push(userService.updateUserDescription(newDescription));
        }

        // Ejecutar ambas actualizaciones en paralelo si es necesario
        await Promise.all(promises);

        // TODO: Actualizar socialLinks cuando el backend lo soporte

        // Recargar la página para mostrar los cambios
        router.reload();
      } catch (error) {
        console.error("Error saving profile:", error);
        // TODO: Mostrar notificación de error al usuario
      }
    },
    [user, setUser, router, userFound.description]
  );

  // Transform players to games format for display
  const games = players.map((player) => {
    const roles = rolesData.get(player.gameId) || [];
    const playerRoles = roles.filter((r) => player.gameRoleIds?.includes(r.id));

    // Build account info string
    let accountInfo = "";
    if (player.accountData?.steamId) {
      accountInfo = `Steam ID: ${player.accountData.steamId}`;
    } else if (player.accountData?.username) {
      accountInfo = player.accountData.username;
      if (player.accountData.tag) {
        accountInfo += `#${player.accountData.tag}`;
      }
      if (player.accountData.region) {
        accountInfo += ` (${player.accountData.region})`;
      }
    }

    return {
      name: player.gameName || "Unknown Game",
      icon: player.gameName ? getGameImage(player.gameName) : undefined,
      rank:
        playerRoles.length > 0
          ? playerRoles.map((r) => r.roleName).join(", ")
          : undefined,
      accountInfo: accountInfo || undefined,
      roles: playerRoles.map((r) => ({
        roleName: r.roleName,
        roleDescription: r.roleDescription,
      })),
      gameRank: player.gameRank,
      gameId: player.gameId,
      isOwnershipVerified: player.isOwnershipVerified,
    };
  });

  const hasGames = games.length > 0;

  const hasTeams = teams.length > 0;

  const tournaments = wonTournaments.map((t) => ({
    id: t.id,
    name: t.name,
    game: t.gameName,
    date: t.endAt,
    placement: "1er Lugar",
  }));
  const hasTournaments = tournaments.length > 0;

  const currentTeams = teams.filter((team) => !team.leftDate).length;
  const activeGames = games.length;
  const hasQuickStats = currentTeams > 0 || activeGames > 0;

  // Calculate victories (1st place) and podiums (1st, 2nd, 3rd place)
  const userTeamIds = teams.map((team) => String(team.id));
  const victories = useMemo(() => {
    return wonTournaments.filter((tournament) => {
      if (!tournament.firstPlaceTeamId) return false;
      return userTeamIds.includes(String(tournament.firstPlaceTeamId));
    }).length;
  }, [wonTournaments, userTeamIds]);

  const stats: { label: string; value: string | number; color?: any }[] = [
    { label: "Victorias", value: victories, color: "success" },
    { label: "Equipos", value: currentTeams, color: "info" },
  ];

  const hasDescription =
    (userFound.description?.trim?.() || "").length > 0 ||
    (stats?.length || 0) > 0;

  return (
    <>
      <MainLayout
        pageDescription={`${formatFullName(
          userFound.firstname,
          userFound.lastname
        )}'s profile page with all their information.`}
        title={`${t("profile")} - ${formatFullName(
          userFound.firstname,
          userFound.lastname
        )}`}
      >
        <ProfileHero
          fullName={formatFullName(userFound.firstname, userFound.lastname)}
          username={userFound.username}
          userId={userFound.id}
          avatarSrc={userFound.profileImage || "/images/user-placeholder.png"}
          regionLabel={userFound.country}
          memberSinceLabel={t("memberSince", {
            date: new Date(userFound.createdAt).toLocaleDateString(),
          })}
          isOwnProfile={isLoggedUser}
          onEditClick={() => setIsEditOpen(true)}
          onMessageClick={() => {
            if (isLoggedUser) return;
            window.location.href = `/messages?userId=${encodeURIComponent(
              userFound.id
            )}`;
          }}
        />

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {/* Mobile View: Tabs */}
          <ProfileTabs
            posts={posts}
            isLoading={isLoading}
            hasError={hasError}
            onRetry={loadPosts}
            hasDescription={hasDescription}
            description={userFound.description}
            stats={stats}
            hasGames={hasGames}
            games={games}
            hasTeams={hasTeams}
            teams={teams}
            hasTournaments={hasTournaments}
            tournaments={tournaments}
            userId={userFound.id}
            currentTeams={currentTeams}
            activeGames={activeGames}
          />

          {/* Desktop View: Grid Layout */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <Grid container spacing={4}>
              {/* Left Column: Posts */}
              <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <PostList
                  isLoading={isLoading}
                  posts={posts}
                  error={hasError}
                  onRetry={loadPosts}
                />
              </Grid>

              {/* Right Column: About, Games, Teams, Tournaments, Achievements, Social Links, Quick Stats */}
              <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                {hasDescription && (
                  <AboutCard
                    description={userFound.description!}
                    stats={stats}
                  />
                )}

                {hasGames && (
                  <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                        {t("games")}
                      </Typography>
                      <GamesGrid games={games} />
                    </CardContent>
                  </Card>
                )}

                {hasTeams && (
                  <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                        {t("teams")}
                      </Typography>
                      <TeamsList teams={teams} />
                    </CardContent>
                  </Card>
                )}

                {hasTournaments && (
                  <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                        {t("recentTournaments")}
                      </Typography>
                      <TournamentsGrid tournaments={tournaments} />
                    </CardContent>
                  </Card>
                )}

                <SocialLinksCard userId={userFound.id} />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </MainLayout>
      {isLoggedUser && (
        <ProfileEditModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialDescription={userFound.description || ""}
          initialSocialLinks={{}}
          initialProfileImage={userFound.profileImage}
          initialBackgroundImage={backgroundImage || undefined}
          initialUsername={userFound.username}
          onSave={handleOnSave}
        />
      )}
    </>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  req,
  res,
}: GetServerSidePropsContext) => {
  const { nickname = "" } = params as { nickname: string };
  const serverToken = req.cookies["token"];

  if (!nickname) {
    return {
      notFound: true,
    };
  }

  try {
    // Fetch user data with the server token
    const userFound = await userService.getUserByUsername(
      nickname,
      serverToken
    );

    if (!userFound) {
      return {
        notFound: true,
      };
    }

    // Set cache headers for ISR-like behavior with SSR
    // Cache for 60 seconds, revalidate in background
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=120'
    );

    return {
      props: {
        userFound,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      notFound: true,
    };
  }
};
