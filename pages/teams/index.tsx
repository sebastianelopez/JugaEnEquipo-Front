import type React from "react";
import { useTranslations } from "next-intl";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useTheme } from "@mui/material/styles";

import { useState } from "react";
import { Box, Container, Typography, Grid, Pagination } from "@mui/material";
import { useRouter } from "next/navigation";
import { MainLayout } from "../../layouts";
import { TeamCard, TeamsHeader } from "../../components/organisms";

// Mock data para los teams
const mockTeams = [
  {
    id: 1,
    name: "Thunder Gaming",
    logo: "/esports-team-logo-thunder.jpg",
    banner: "/team-banner-thunder.jpg",
    members: [
      { name: "Player1", avatar: "/gamer-avatar-1.png" },
      { name: "Player2", avatar: "/gamer-avatar-2.png" },
      { name: "Player3", avatar: "/gamer-avatar-3.png" },
      { name: "Player4", avatar: "/gamer-avatar-4.png" },
      { name: "Player5", avatar: "/gamer-avatar-5.png" },
    ],
    games: [
      { name: "League of Legends", icon: "/league-of-legends-icon.png" },
      { name: "Valorant", icon: "/valorant-icon.png" },
    ],
    achievements: ["Campeón Regional 2024", "Top 3 Nacional", "MVP del Torneo"],
  },
  {
    id: 2,
    name: "Phoenix Squad",
    logo: "/esports-team-logo-phoenix.jpg",
    banner: "/team-banner-phoenix.jpg",
    members: [
      { name: "ProGamer1", avatar: "/pro-gamer-1.jpg" },
      { name: "ProGamer2", avatar: "/pro-gamer-2.jpg" },
      { name: "ProGamer3", avatar: "/pro-gamer-3.jpg" },
      { name: "ProGamer4", avatar: "/pro-gamer-4.jpg" },
    ],
    games: [{ name: "Counter-Strike 2", icon: "/counter-strike-icon.jpg" }],
    achievements: ["Subcampeón Internacional", "Mejor Equipo 2023"],
  },
  {
    id: 3,
    name: "Cyber Warriors",
    logo: "/esports-team-logo-cyber.jpg",
    banner: "/team-banner-cyber.jpg",
    members: [
      { name: "Warrior1", avatar: "/warrior-gamer-1.jpg" },
      { name: "Warrior2", avatar: "/warrior-gamer-2.jpg" },
      { name: "Warrior3", avatar: "/warrior-gamer-3.jpg" },
      { name: "Warrior4", avatar: "/warrior-gamer-4.jpg" },
      { name: "Warrior5", avatar: "/warrior-gamer-5.jpg" },
      { name: "Warrior6", avatar: "/warrior-gamer-6.jpg" },
    ],
    games: [
      { name: "Valorant", icon: "/valorant-icon.png" },
      { name: "Apex Legends", icon: "/apex-legends-inspired-icon.png" },
    ],
    achievements: ["Ganador Copa América", "5 Torneos Consecutivos"],
  },
  {
    id: 4,
    name: "Dragon Force",
    logo: "/esports-team-logo-dragon.jpg",
    banner: "/team-banner-dragon.jpg",
    members: [
      { name: "Dragon1", avatar: "/dragon-player-1.jpg" },
      { name: "Dragon2", avatar: "/dragon-player-2.jpg" },
      { name: "Dragon3", avatar: "/dragon-player-3.jpg" },
      { name: "Dragon4", avatar: "/dragon-player-4.jpg" },
      { name: "Dragon5", avatar: "/dragon-player-5.jpg" },
    ],
    games: [{ name: "League of Legends", icon: "/league-of-legends-icon.png" }],
    achievements: ["Campeón Mundial Junior", "Mejor Roster 2024"],
  },
  {
    id: 5,
    name: "Neon Strikers",
    logo: "/esports-team-logo-neon.jpg",
    banner: "/team-banner-neon.jpg",
    members: [
      { name: "Neon1", avatar: "/neon-player-1.jpg" },
      { name: "Neon2", avatar: "/neon-player-2.jpg" },
      { name: "Neon3", avatar: "/neon-player-3.jpg" },
    ],
    games: [
      { name: "Rocket League", icon: "/rocket-league-icon.jpg" },
      { name: "Fortnite", icon: "/generic-battle-royale-icon.png" },
    ],
    achievements: ["Top 10 Mundial", "Revelación del Año"],
  },
  {
    id: 6,
    name: "Shadow Legends",
    logo: "/esports-team-logo-shadow.jpg",
    banner: "/team-banner-shadow.jpg",
    members: [
      { name: "Shadow1", avatar: "/shadow-player-1.jpg" },
      { name: "Shadow2", avatar: "/shadow-player-2.jpg" },
      { name: "Shadow3", avatar: "/shadow-player-3.jpg" },
      { name: "Shadow4", avatar: "/shadow-player-4.jpg" },
    ],
    games: [{ name: "Counter-Strike 2", icon: "/counter-strike-icon.jpg" }],
    achievements: ["Campeón Regional", "Mejor Estrategia 2024"],
  },
];

export default function TeamsPage() {
  const router = useRouter();
  const t = useTranslations("Teams");
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredTeams = mockTeams.filter(
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
            onOpenCreate={() => {}}
            placeholder={t("searchPlaceholder") as string}
            createLabel={t("create") as string}
          />
        </Box>

        {/* Teams Grid */}
        <Grid container spacing={3}>
          {paginatedTeams.map((team) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={team.id}>
              <TeamCard
                team={team as any}
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
