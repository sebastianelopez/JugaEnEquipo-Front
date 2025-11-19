import { Typography, Container, Card, CardContent, Grid } from "@mui/material";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import {
  ProfileHero,
  AboutCard,
  GamesGrid,
  TeamsList,
  TournamentsGrid,
  ProfileAchievementsList,
  SocialLinksCard,
  QuickStatsCard,
  ProfileEditModal,
} from "../../components/organisms";
import { Post, User } from "../../interfaces";
import { MainLayout } from "../../layouts";
import { userService } from "../../services/user.service";
import { useContext, useEffect, useState, useCallback } from "react";
import { postService } from "../../services/post.service";
import { UserContext } from "../../context/user";
import { PostList } from "../../components/molecules/Post/PostList";
import { sortPostsByDate } from "../../utils/sortPosts";
import { formatFullName } from "../../utils/textFormatting";

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

  const loadPosts = useCallback(async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const result = await await postService.getPostsByUsername(
        userFound.username
      );
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

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleOnSave = useCallback(
    async ({
      description: newDescription,
      socialLinks: newLinks,
      profileImage,
    }: {
      description: string;
      socialLinks: {
        twitter?: string;
        instagram?: string;
        youtube?: string;
        twitch?: string;
      };
      profileImage?: File;
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

        // Actualizar descripción si cambió
        if (newDescription !== userFound.description) {
          promises.push(userService.updateUserDescription(newDescription));
        }

        // Ejecutar ambas actualizaciones en paralelo si es necesario
        await Promise.all(promises);

        // TODO: Actualizar socialLinks cuando el backend lo soporte
        console.log("Saving social links", {
          newLinks,
        });

        // Recargar la página para mostrar los cambios
        router.reload();
      } catch (error) {
        console.error("Error saving profile:", error);
        // TODO: Mostrar notificación de error al usuario
      }
    },
    [user, setUser, router]
  );

  // Derived data and visibility checks
  // MOCK DATA - Temporal until backend integration

  const stats: { label: string; value: string | number; color?: any }[] = [
    { label: "Torneos", value: 24, color: "primary" },
    { label: "Victorias", value: 18, color: "success" },
    { label: "Equipos", value: 5, color: "info" },
    { label: "Horas", value: 2500, color: "warning" },
  ];

  const games = (userFound.games || []).map((g) => ({
    name: g.name,
    icon: (g as any).image || undefined,
    rank: String(g.elo),
  }));
  const hasGames = games.length > 0;

  // MOCK DATA - Temporal until backend integration
  const teams: {
    id: string | number;
    name: string;
    logo?: string;
    role?: string;
    position?: string;
    joinDate?: string | number | Date;
    leftDate?: string | number | Date;
  }[] = [
    {
      id: 1,
      name: "Team Thunder",
      logo: "/images/user-placeholder.png",
      role: "Capitán",
      position: "DPS",
      joinDate: new Date("2023-01-15"),
    },
    {
      id: 2,
      name: "Elite Gaming Squad",
      logo: "/images/user-placeholder.png",
      position: "Support",
      joinDate: new Date("2022-06-20"),
      leftDate: new Date("2023-12-01"),
    },
    {
      id: 3,
      name: "Pro Players League",
      logo: "/images/user-placeholder.png",
      position: "Tank",
      joinDate: new Date("2021-03-10"),
      leftDate: new Date("2022-08-15"),
    },
  ];
  const hasTeams = teams.length > 0;

  // MOCK DATA - Temporal until backend integration
  const tournaments: {
    id: string | number;
    name: string;
    game?: string;
    image?: string;
    date?: string | number | Date;
    placement?: string;
  }[] = [
    {
      id: 1,
      name: "Championship 2024",
      game: "Counter-Strike",
      date: new Date("2024-10-15"),
      placement: "1er Lugar",
    },
    {
      id: 2,
      name: "Pro League Season 12",
      game: "Valorant",
      date: new Date("2024-08-22"),
      placement: "3er Lugar",
    },
    {
      id: 3,
      name: "Regional Tournament",
      game: "Overwatch",
      date: new Date("2024-05-10"),
      placement: "5to Lugar",
    },
  ];
  const hasTournaments = tournaments.length > 0;

  // MOCK DATA - Temporal until backend integration
  const achievements: {
    title: string;
    tournament?: string;
    game?: string;
    date?: string | number | Date;
    prize?: string;
  }[] = [
    {
      title: "Campeón Internacional",
      tournament: "Championship 2024",
      game: "Counter-Strike",
      date: new Date("2024-10-15"),
      prize: "$5,000",
    },
    {
      title: "MVP del Torneo",
      tournament: "Pro League Season 12",
      game: "Valorant",
      date: new Date("2024-08-22"),
      prize: "$1,500",
    },
    {
      title: "Mejor Jugador de la Semana",
      tournament: "Regional Tournament",
      game: "Overwatch",
      date: new Date("2024-05-10"),
    },
    {
      title: "Consistencia Global",
      tournament: "Mensual League",
      game: "Heroes of the Storm",
      date: new Date("2024-03-15"),
    },
  ];
  const hasAchievements = achievements.length > 0;

  // MOCK DATA - Temporal until backend integration
  const socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    twitch?: string;
  } = {
    twitch: "https://www.twitch.tv/jugaenequipo",
    youtube: "https://www.youtube.com/@jugaenequipo",
    twitter: "https://twitter.com/jugaenequipo",
    instagram: "https://www.instagram.com/jugaenequipo",
  };
  const hasSocialLinks = Object.values(socialLinks).some(Boolean);

  const hasDescription =
    (userFound.description?.trim?.() || "").length > 0 ||
    (stats?.length || 0) > 0;

  const currentTeams = teams.length;
  const activeGames = games.length;
  const totalAchievements = achievements.length;
  const hasQuickStats =
    currentTeams > 0 || activeGames > 0 || totalAchievements > 0;

  const showPostsSection = isLoading || hasError || posts.length > 0;

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
          bannerSrc={"/assets/images.jpg"}
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
                <AboutCard description={userFound.description!} stats={stats} />
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

              {hasAchievements && (
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                      {t("achievements")}
                    </Typography>
                    <ProfileAchievementsList achievements={achievements} />
                  </CardContent>
                </Card>
              )}

              {hasSocialLinks && <SocialLinksCard links={socialLinks} />}
              {hasQuickStats && (
                <QuickStatsCard
                  currentTeams={currentTeams}
                  activeGames={activeGames}
                  totalAchievements={totalAchievements}
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </MainLayout>
      {isLoggedUser && (
        <ProfileEditModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialDescription={userFound.description || ""}
          initialSocialLinks={socialLinks}
          initialProfileImage={userFound.profileImage}
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
}: GetServerSidePropsContext) => {
  const { nickname = "" } = params as { nickname: string };
  const serverToken = req.cookies["token"];

  if (!nickname) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  try {
    // Fetch user data with the server token
    const userFound = await userService.getUserByUsername(
      nickname,
      serverToken
    );

    if (!userFound) {
      console.log("User not found:", nickname);
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      props: {
        userFound,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};
