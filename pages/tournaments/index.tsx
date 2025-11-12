import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { Box, Container, Typography, Pagination } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

import { MainLayout } from "../../layouts";
import { CreateTournamentModal } from "../../components/organisms";
import { tournamentService } from "../../services/tournament.service";
import type { Tournament, User } from "../../interfaces";

import { TournamentCard } from "../../components/organisms/cards/TournamentCard";
import { TournamentsHeader } from "../../components/organisms/headers/TournamentsHeader";
import { TournamentFiltersDialog } from "../../components/organisms/modals/TournamentFiltersDialog";
import { generateManyTournaments } from "./mocks";
import { formatFullName } from "../../utils/textFormatting";

interface Props {}

const TournamentsPage: NextPage<Props> = ({}) => {
  const t = useTranslations("Tournaments");
  const theme = useTheme();
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([] as any);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    games: [] as string[],
    types: [] as ("Oficial" | "Amateur")[],
    modes: [] as ("team" | "individual")[],
    organizer: "",
    regions: [] as string[],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchTournaments = async () => {
    try {
      const result = await tournamentService.list();
      if (result.ok) {
        setTournaments(result.data as any);
        return;
      }
    } catch {}
    // Fallback to mocks while service is not ready
    setTournaments(generateManyTournaments(24) as any);
  };

  React.useEffect(() => {
    fetchTournaments();
  }, []);

  const filteredTournaments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let data = tournaments || [];
    if (q) {
      data = data.filter((t) => {
        const byName = t.name?.toLowerCase().includes(q);
        const byGame = t.game?.name?.toLowerCase().includes(q);
        return byName || byGame;
      });
    }
    if (filters.games.length > 0) {
      data = data.filter((t) => filters.games.includes(String(t.game?.name)));
    }
    if (filters.types.length > 0) {
      data = data.filter((t) => (filters.types as any).includes(t.type));
    }
    if (filters.modes.length > 0) {
      data = data.filter((t) =>
        (filters.modes as any).includes(t.participationMode)
      );
    }
    if (filters.regions.length > 0) {
      data = data.filter((t) => filters.regions.includes(String(t.region)));
    }
    if (filters.organizer.trim()) {
      const oq = filters.organizer.trim().toLowerCase();
      data = data.filter((t) => {
        if (typeof t.createdBy === "object" && t.createdBy) {
          const u = t.createdBy as User;
          return (
            u.username?.toLowerCase().includes(oq) ||
            formatFullName(u.firstname || "", u.lastname || "")
              .toLowerCase()
              .includes(oq)
          );
        }
        return String(t.createdBy || "")
          .toLowerCase()
          .includes(oq);
      });
    }
    return data;
  }, [tournaments, searchQuery, filters]);

  const totalPages =
    Math.ceil((filteredTournaments?.length || 0) / itemsPerPage) || 1;
  const paginatedTournaments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filteredTournaments.slice(start, end);
  }, [filteredTournaments, currentPage]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

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
    if (tournament.type !== "Amateur") return undefined;
    return typeof tournament.createdBy === "object"
      ? (tournament.createdBy as User)
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
            py: 4,
          }}
        >
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
                {t("title", { default: "Torneos Gaming" })}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.info.main,
                  textAlign: "center",
                  mb: 4,
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
                  setCurrentPage(1);
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
            <Grid container spacing={3}>
              {paginatedTournaments.map((tournament) => {
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
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
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
          </Container>
        </Box>

        <CreateTournamentModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreated={fetchTournaments}
        />
        <TournamentFiltersDialog
          open={filtersOpen}
          onClose={() => {
            setFiltersOpen(false);
            setCurrentPage(1);
          }}
          filters={filters}
          onChange={(next) => setFilters(next)}
          labels={{
            title: t("filters.title", { default: "Filtros" }) as string,
            game: t("filters.game", { default: "Juego" }) as string,
            type: t("filters.type", { default: "Tipo" }) as string,
            mode: t("filters.mode", { default: "Modo" }) as string,
            organizer: t("filters.organizer", {
              default: "Organizador",
            }) as string,
            region: t("filters.region", { default: "Región" }) as string,
            clear: t("filters.clear", { default: "Limpiar" }) as string,
            apply: t("filters.apply", { default: "Aplicar" }) as string,
          }}
          regionOptions={["NA", "EU", "LATAM", "ASIA", "OCE"]}
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
