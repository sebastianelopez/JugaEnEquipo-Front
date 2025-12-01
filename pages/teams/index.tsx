import type React from "react";
import { useTranslations } from "next-intl";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useTheme } from "@mui/material/styles";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const itemsPerPage = 6;

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await teamService.search();

      if (result.ok && result.data) {
        const transformedTeams: TeamCardData[] = await Promise.all(
          result.data.map(async (team: Team) => {
            const gamesResult = await teamService.findAllGames(team.id);
            const games =
              gamesResult.ok && gamesResult.data
                ? gamesResult.data.map((game) => ({
                    name: game.name,
                    icon: game.image || "/default-game-icon.png",
                  }))
                : [];

            const members =
              (team as any).users?.map((user: any) => ({
                name: user.username || `${user.firstname} ${user.lastname}`,
                avatar: user.profileImage || "/default-avatar.png",
              })) || [];

            return {
              id: team.id,
              name: team.name,
              logo: team.image || "/default-team-logo.png",
              banner: team.image || "/default-team-banner.png",
              members,
              games,
              achievements: (team as any).achievements || [],
            };
          })
        );
        setTeams(transformedTeams);
      } else {
        setError(
          result.ok === false
            ? result.errorMessage
            : (t("loadTeamsError") as string)
        );
      }
    } catch (err: any) {
      setError(err?.message || (t("loadTeamsError") as string));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.games.some((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

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

        {/* Loading State */}
        {loading && (
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
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ mb: { xs: 3, md: 4 }, px: { xs: 1, md: 0 } }}>
            <Alert
              severity="error"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Teams Grid */}
        {!loading && !error && (
          <>
            {paginatedTeams.length === 0 ? (
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
                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  {paginatedTeams.map((team) => (
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
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: { xs: 4, md: 6 },
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      size="medium"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: theme.palette.text.primary,
                          borderColor: theme.palette.divider,
                          fontSize: { xs: "0.875rem", md: "1rem" },
                          minWidth: { xs: "32px", md: "40px" },
                          height: { xs: "32px", md: "40px" },
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                          },
                        },
                        "& .MuiPaginationItem-root:hover": {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>

      <CreateTeamModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => {
          // Reload teams after creating a new one
          loadTeams();
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
