import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Paper,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { MainLayout } from "../../../layouts";
import {
  TeamHero,
  TeamGamesGrid,
  AchievementsList,
  JoinCard,
} from "../../../components/organisms";
import MembersList from "../../../components/organisms/team/MembersList";
import { useTranslations } from "next-intl";
import { useTheme } from "@mui/material/styles";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

// Mock data para el team específico
const mockTeamDetail = {
  id: 1,
  name: "Thunder Gaming",
  logo: "/esports-team-logo-thunder.jpg",
  banner: "/team-banner-thunder.jpg",
  description:
    "Thunder Gaming es uno de los equipos más prestigiosos de Latinoamérica. Fundado en 2020, hemos conquistado múltiples torneos regionales e internacionales. Nuestro objetivo es llevar el gaming competitivo al siguiente nivel.",
  founded: "2020",
  region: "LATAM",
  members: [
    {
      id: 1,
      name: "Carlos Mendez",
      username: "ThunderStrike",
      avatar: "/gamer-avatar-1.png",
      role: "Capitán",
      position: "Mid Laner",
      joinDate: "2020-01-15",
    },
    {
      id: 2,
      name: "Miguel Torres",
      username: "LightningBolt",
      avatar: "/gamer-avatar-2.png",
      role: "Jugador",
      position: "ADC",
      joinDate: "2020-03-20",
    },
    {
      id: 3,
      name: "Ana Rodriguez",
      username: "StormQueen",
      avatar: "/gamer-avatar-3.png",
      role: "Jugador",
      position: "Support",
      joinDate: "2021-06-10",
    },
    {
      id: 4,
      name: "Luis Ramirez",
      username: "ThunderGod",
      avatar: "/gamer-avatar-4.png",
      role: "Jugador",
      position: "Jungle",
      joinDate: "2021-08-05",
    },
    {
      id: 5,
      name: "Sofia Martinez",
      username: "ElectricDream",
      avatar: "/gamer-avatar-5.png",
      role: "Jugador",
      position: "Top Laner",
      joinDate: "2022-01-12",
    },
  ],
  games: [
    { name: "League of Legends", icon: "/league-of-legends-icon.png" },
    { name: "Valorant", icon: "/valorant-icon.png" },
  ],
  achievements: [
    {
      title: "Campeón Regional LATAM 2024",
      date: "2024-12-15",
      game: "League of Legends",
      prize: "$5,000 USD",
    },
    {
      title: "Top 3 Copa América Esports",
      date: "2024-09-20",
      game: "League of Legends",
      prize: "$2,000 USD",
    },
    {
      title: "MVP del Torneo Nacional",
      date: "2024-06-10",
      game: "Valorant",
      prize: "Trofeo + Reconocimiento",
    },
    {
      title: "Subcampeón Liga Pro",
      date: "2024-03-15",
      game: "League of Legends",
      prize: "$3,000 USD",
    },
    {
      title: "Ganador Torneo Comunitario",
      date: "2023-11-05",
      game: "Valorant",
      prize: "$1,000 USD",
    },
  ],
  stats: {
    totalTournaments: 24,
    wins: 18,
    winRate: 75,
  },
};

export default function TeamDetailPage() {
  const router = useRouter();
  const t = useTranslations("TeamDetail");
  const theme = useTheme();

  return (
    <MainLayout pageDescription="Team detail" title={mockTeamDetail.name}>
      {/* Hero Section */}
      <TeamHero
        banner={mockTeamDetail.banner}
        logo={mockTeamDetail.logo}
        name={mockTeamDetail.name}
        foundedLabel={t("founded", { year: mockTeamDetail.founded }) as string}
        region={mockTeamDetail.region}
        backLabel={t("back") as string}
        onBack={() => router.push("/teams")}
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
                  {mockTeamDetail.description}
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
                        {mockTeamDetail.stats.totalTournaments}
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
                        {mockTeamDetail.stats.wins}
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
                        {mockTeamDetail.stats.winRate}%
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
                  games={mockTeamDetail.games as any}
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
                  members={mockTeamDetail.members as any}
                  title={
                    t("membersTitle", {
                      count: mockTeamDetail.members.length,
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
                  achievements={mockTeamDetail.achievements as any}
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
                  membersCount={mockTeamDetail.members.length}
                  currentMembersLabel={t("currentMembers") as string}
                  requestJoinLabel={t("requestJoin") as string}
                />
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}: GetServerSidePropsContext) => {
  return {
    props: {
      messages: (await import(`../../../lang/${locale}.json`)).default,
    },
  };
};
