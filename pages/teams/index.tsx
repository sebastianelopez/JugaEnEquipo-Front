import type React from "react";
import { useTranslations } from "next-intl";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useTheme } from "@mui/material/styles";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MainLayout } from "../../layouts";
import {
  TeamCard,
  TeamsHeader,
  CreateTeamModal,
} from "../../components/organisms";
import { teamService } from "../../services/team.service";
import type { Team } from "../../interfaces";
import { getGameImage } from "../../utils/gameImageUtils";

interface TeamCardData {
  id: number | string;
  name: string;
  logo: string;
  banner: string;
  members: Array<{ name: string; avatar: string }>;
  games: Array<{ name: string; icon: string }>;
  achievements: string[];
}

export default function TeamsPage() {
  const router = useRouter();
  const t = useTranslations("Teams");
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teams, setTeams] = useState<TeamCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 6;
  const observerTarget = useRef<HTMLDivElement>(null);

  const transformTeam = async (team: Team): Promise<TeamCardData> => {
    const gamesResult = await teamService.findAllGames(team.id);
    const games =
      gamesResult.ok && gamesResult.data
        ? gamesResult.data.map((game) => ({
            name: game.gameName,
            icon: getGameImage(game.gameName),
          }))
        : [];

    // Try to get members from team.users first, if not available, fetch them
    let members =
      (team as any).users?.map((user: any) => ({
        name: user.username || `${user.firstname} ${user.lastname}`,
        avatar: user.profileImage || "/default-avatar.png",
      })) || [];

    // If no members in response, try to fetch them
    if (members.length === 0) {
      const membersResult = await teamService.findMembers(String(team.id));
      if (membersResult.ok && membersResult.data) {
        members = membersResult.data.map((user: any) => ({
          name: user.username || `${user.firstname} ${user.lastname}`,
          avatar: user.profileImage || "/default-avatar.png",
        }));
      }
    }

    return {
      id: team.id,
      name: team.name,
      logo: team.image || "/default-team-logo.png",
      banner: team.image || "/default-team-banner.png",
      members,
      games,
      achievements: (team as any).achievements || [],
    };
  };

  const fetchTeams = useCallback(
    async (page: number = 1, append: boolean = false) => {
      setLoading(true);
      try {
        const offset = (page - 1) * itemsPerPage;

        const searchParams: any = {
          limit: itemsPerPage,
          offset: offset,
        };

        if (searchQuery.trim()) {
          searchParams.name = searchQuery.trim();
        }

        const result = await teamService.search(searchParams);

        if (result.ok && result.data) {
          const transformedTeams: TeamCardData[] = await Promise.all(
            result.data.map(transformTeam)
          );

          if (append) {
            setTeams((prev) => [...prev, ...transformedTeams]);
          } else {
            setTeams(transformedTeams);
          }

          setHasMore(transformedTeams.length === itemsPerPage);
          setError(null);
          return;
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError((error as any)?.message || (t("loadTeamsError") as string));
      } finally {
        setLoading(false);
      }

      if (!append) {
        setTeams([]);
        setHasMore(false);
      }
    },
    [searchQuery, itemsPerPage, t]
  );

  useEffect(() => {
    setCurrentPage(1);
    setTeams([]);
    setHasMore(true);
    fetchTeams(1, false);
  }, [searchQuery, fetchTeams]);

  useEffect(() => {
    if (currentPage === 1) return;
    fetchTeams(currentPage, true);
  }, [currentPage, fetchTeams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px 400px 0px" // Activa la carga 400px antes de que sea visible
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  const handleTeamClick = (id: number | string) => {
    router.push(`/teams/${id}`);
  };

  return (
    <MainLayout pageDescription="Teams page" title={t("title")}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 4, md: 6 }, mt: { xs: 2, md: 0 } }}>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 800,
              mb: { xs: 1.5, md: 2 },
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
              textAlign: "center",
            }}
          >
            {t("title")}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.info.main,
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "1rem", md: "1.25rem" },
              px: { xs: 2, md: 0 },
            }}
          >
            {t("subtitle")}
          </Typography>

          {/* Search and Create Button */}
          <TeamsHeader
            searchQuery={searchQuery}
            onSearchChange={(v: string) => setSearchQuery(v)}
            onOpenCreate={() => setOpenCreate(true)}
            placeholder={t("searchPlaceholder") as string}
            createLabel={t("create") as string}
          />
        </Box>

        {/* Teams Grid */}
        {teams.length === 0 && !loading ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 6, md: 10 },
              px: { xs: 2, md: 0 },
              color: theme.palette.text.secondary,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                color: theme.palette.text.primary,
                fontWeight: 600,
              }}
            >
              {searchQuery
                ? (t("noTeamsFound") as string)
                : (t("noTeams") as string)}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: "400px",
                mx: "auto",
              }}
            >
              {searchQuery
                ? (t("tryOtherSearchTerms") as string)
                : (t("beFirstToCreateTeam") as string)}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Error State */}
            {error && (
              <Box sx={{ mb: { xs: 3, md: 4 }, px: { xs: 1, md: 0 } }}>
                <Alert
                  severity="error"
                  sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                >
                  {error}
                </Alert>
              </Box>
            )}

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {teams.map((team) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={team.id}>
                  <TeamCard
                    team={team}
                    onClick={handleTeamClick}
                    membersLabel={t("members")}
                    gamesLabel={t("games")}
                    achievementsLabel={t("achievements")}
                    formatMore={(count) => t("more", { count }) as string}
                  />
                </Grid>
              ))}

              {/* Loading skeletons */}
              {loading && teams.length === 0 && (
                <>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Grid
                      size={{ xs: 12, sm: 6, lg: 4 }}
                      key={`skeleton-${item}`}
                    >
                      <Box
                        sx={{
                          p: { xs: 1.5, md: 2 },
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                        }}
                      >
                        <Skeleton
                          variant="rectangular"
                          sx={{
                            height: { xs: 150, md: 200 },
                            mb: { xs: 1.5, md: 2 },
                            borderRadius: 1,
                          }}
                        />
                        <Skeleton
                          variant="text"
                          sx={{
                            width: "60%",
                            height: { xs: 24, md: 30 },
                            mb: 1,
                          }}
                        />
                        <Skeleton
                          variant="text"
                          sx={{
                            width: "80%",
                            height: { xs: 18, md: 20 },
                            mb: 0.5,
                          }}
                        />
                        <Skeleton
                          variant="text"
                          sx={{
                            width: "40%",
                            height: { xs: 18, md: 20 },
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>

            {/* Intersection Observer target */}
            {hasMore && (
              <Box
                ref={observerTarget}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 100,
                  mt: 4,
                }}
              >
                {loading && teams.length > 0 && <CircularProgress />}
              </Box>
            )}
          </>
        )}
      </Container>

      <CreateTeamModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          // Reset and reload teams after creating a new one
          setCurrentPage(1);
          setTeams([]);
          setHasMore(true);
          fetchTeams(1, false);
        }}
      />
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}: GetServerSidePropsContext) => {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
};
