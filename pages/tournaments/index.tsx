import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

import { MainLayout } from "../../layouts";
import { CreateTournamentModal } from "../../components/organisms";
import { tournamentService } from "../../services/tournament.service";
import { gameService } from "../../services/game.service";
import type { Tournament, User, Game } from "../../interfaces";
import { UserContext } from "../../context/user";

import { TournamentCard } from "../../components/organisms/cards/TournamentCard";
import { TournamentsHeader } from "../../components/organisms/headers/TournamentsHeader";
import { TournamentFiltersDialog } from "../../components/organisms/modals/TournamentFiltersDialog";

interface Props {}

const TournamentsPage: NextPage<Props> = ({}) => {
  const t = useTranslations("Tournaments");
  const theme = useTheme();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [openCreate, setOpenCreate] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<{
    gameId?: string;
    statusId?: string;
    mine?: boolean;
    open?: boolean;
  }>({
    gameId: undefined,
    statusId: undefined,
    mine: false,
    open: undefined,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 6;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGames = async () => {
      const result = await gameService.getAllGames();
      if (result.ok && result.data) {
        setGames(result.data);
      }
    };
    loadGames();
  }, []);

  const fetchTournaments = useCallback(
    async (page: number = 1, append: boolean = false) => {
      setIsLoading(true);
      try {
        const offset = (page - 1) * itemsPerPage;

        const searchParams: any = {
          limit: itemsPerPage,
          offset: offset,
        };

        if (searchQuery.trim()) {
          searchParams.name = searchQuery.trim();
        }

        if (filters.gameId) {
          searchParams.gameId = filters.gameId;
        }

        if (filters.statusId) {
          searchParams.statusId = filters.statusId;
        }

        if (filters.mine && user?.id) {
          searchParams.mine = true;
        }

        if (filters.open !== undefined) {
          searchParams.open = filters.open;
        }

        const result = await tournamentService.search(searchParams);
        if (result.ok && result.data) {
          if (append) {
            setTournaments((prev) => [...prev, ...result.data!]);
          } else {
            setTournaments(result.data);
          }

          setHasMore(result.data.length === itemsPerPage);
          return;
        }
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setIsLoading(false);
      }

      if (!append) {
        setTournaments([]);
        setHasMore(false);
      }
    },
    [
      searchQuery,
      filters.gameId,
      filters.statusId,
      filters.mine,
      filters.open,
      user?.id,
      itemsPerPage,
    ]
  );

  React.useEffect(() => {
    setCurrentPage(1);
    setTournaments([]);
    setHasMore(true);
    fetchTournaments(1, false);
  }, [
    searchQuery,
    filters.gameId,
    filters.statusId,
    filters.mine,
    filters.open,
    user?.id,
    fetchTournaments,
  ]);

  React.useEffect(() => {
    if (currentPage === 1) return;
    fetchTournaments(currentPage, true);
  }, [currentPage, fetchTournaments]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
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
  }, [hasMore, isLoading]);

  const handleTournamentClick = (tournament: Tournament) => {
    const key = tournament?.id || encodeURIComponent(tournament?.name || "");
    if (key) router.push(`/tournaments/${key}`);
  };

  const formatStartDate = (iso?: string) => {
    if (!iso) return t("startDateTbd", { default: "Por definir" }) as string;
    try {
      return new Date(iso).toLocaleDateString("es-ES");
    } catch {
      return t("startDateTbd", { default: "Por definir" }) as string;
    }
  };

  const getOrganizer = (tournament: Tournament) => {
    const tournamentAny = tournament as any;
    const type =
      tournamentAny.type || (tournament.isOfficial ? "Oficial" : "Amateur");
    if (type !== "Amateur") return undefined;
    return typeof tournamentAny.createdBy === "object"
      ? (tournamentAny.createdBy as User)
      : undefined;
  };

  return (
    <>
      <MainLayout
        pageDescription={`Tournaments page`}
        title={`${t("tournaments")}`}
      >
        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            minHeight: "100vh",
            py: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ mb: { xs: 3, md: 6 } }}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 800,
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "3rem" },
                  textAlign: "center",
                }}
              >
                {t("title", { default: "Torneos Gaming" })}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.info.main,
                  textAlign: "center",
                  mb: { xs: 2, md: 4 },
                  fontSize: { xs: "0.95rem", md: "1.25rem" },
                  px: { xs: 1, md: 0 },
                }}
              >
                {t("subtitle", {
                  default:
                    "Encuentra y participa en los mejores torneos de esports",
                })}
              </Typography>

              {/* Search / Create / Filters */}
              <TournamentsHeader
                searchQuery={searchQuery}
                onSearchChange={(v: string) => {
                  setSearchQuery(v);
                }}
                onOpenCreate={() => setOpenCreate(true)}
                onOpenFilters={() => setFiltersOpen(true)}
                placeholder={
                  t("searchPlaceholder", {
                    default: "Buscar torneos por nombre o juego...",
                  }) as string
                }
                createLabel={t("create", { default: "Crear Torneo" }) as string}
                filtersTooltip={
                  t("filters.tooltip", { default: "Filtros" }) as string
                }
              />
            </Box>

            {/* Tournaments Grid */}
            {tournaments.length === 0 && !isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {t("noTournaments")}
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {tournaments.map((tournament) => {
                    const organizer = getOrganizer(tournament);
                    return (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={tournament.id}>
                        <TournamentCard
                          tournament={tournament as any}
                          organizer={organizer}
                          formatStartDate={formatStartDate}
                          onClick={handleTournamentClick}
                        />
                      </Grid>
                    );
                  })}

                  {/* Loading skeletons */}
                  {isLoading && tournaments.length === 0 && (
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
                    {isLoading && tournaments.length > 0 && (
                      <CircularProgress />
                    )}
                  </Box>
                )}
              </>
            )}
          </Container>
        </Box>

        <CreateTournamentModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreated={() => {
            // Reset and reload tournaments after creating a new one
            setCurrentPage(1);
            setTournaments([]);
            setHasMore(true);
            fetchTournaments(1, false);
          }}
        />
        <TournamentFiltersDialog
          open={filtersOpen}
          onClose={() => {
            setFiltersOpen(false);
          }}
          filters={filters}
          games={games}
          onChange={(next) => {
            setFilters(next);
          }}
          labels={{
            title: t("filters.title", { default: "Filtros" }) as string,
            game: t("filters.game", { default: "Juego" }) as string,
            clear: t("filters.clear", { default: "Limpiar" }) as string,
            apply: t("filters.apply", { default: "Aplicar" }) as string,
          }}
        />
      </MainLayout>
    </>
  );
};

export default TournamentsPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}: GetServerSidePropsContext) => {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
};
