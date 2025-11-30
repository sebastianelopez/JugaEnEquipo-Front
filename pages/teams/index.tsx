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
            : "Error al cargar los equipos"
        );
      }
    } catch (err: any) {
      setError(err?.message || "Error al cargar los equipos");
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
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
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
              mb: 4,
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
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ mb: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Teams Grid */}
        {!loading && !error && (
          <>
            {paginatedTeams.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  color: theme.palette.text.secondary,
                }}
              >
                <Typography variant="h6">
                  {searchQuery
                    ? t("noTeamsFound") || "No se encontraron equipos"
                    : t("noTeams") || "No hay equipos disponibles"}
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
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
                    sx={{ display: "flex", justifyContent: "center", mt: 6 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      size="large"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: theme.palette.text.primary,
                          borderColor: theme.palette.divider,
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                          },
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
