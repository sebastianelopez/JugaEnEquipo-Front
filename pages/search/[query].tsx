import type { NextPage } from "next";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MainLayout } from "../../layouts";
import { User, Team } from "../../interfaces";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  ListItemText,
} from "@mui/material";
import { mockSearchResults } from "../../mocks/search";

interface Props {
  users: User[];
  teams: Team[];
  foundResults: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({
  users: initialUsers,
  teams: initialTeams,
  foundResults,
  query,
}) => {
  const t = useTranslations("Search");
  
  // Separate users and teams
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  // Pagination states
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [hasMoreGroups, setHasMoreGroups] = useState(false);

  // Filter states
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedElo, setSelectedElo] = useState<string>("all");
  const [availableGames, setAvailableGames] = useState<string[]>([]);

  useEffect(() => {
    // Split users and groups from the results
    const games = initialUsers.flatMap(
      (user) => user.games?.map((game) => game.name) || []
    );
    setAvailableGames(Array.from(new Set(games)));

    updateDisplayedUsers(initialUsers);
    updateDisplayedGroups(initialTeams);
  }, [initialUsers, initialTeams]);

  const updateDisplayedUsers = (filteredUsers: User[]) => {
    setDisplayedUsers(filteredUsers.slice(0, 5));
    setHasMoreUsers(filteredUsers.length > 5);
  };

  const updateDisplayedGroups = (filteredGroups: Team[]) => {
    setDisplayedTeams(filteredGroups.slice(0, 5));
    setHasMoreGroups(filteredGroups.length > 5);
  };

  const loadMoreUsers = () => {
    const currentCount = displayedUsers.length;
    const filteredUsers = filterUsers(users);
    setDisplayedUsers(filteredUsers.slice(0, currentCount + 5));
    setHasMoreUsers(filteredUsers.length > currentCount + 5);
  };

  const loadMoreGroups = () => {
    const currentCount = displayedTeams.length;
    setDisplayedTeams(teams.slice(0, currentCount + 5));
    setHasMoreGroups(teams.length > currentCount + 5);
  };

  const filterUsers = (userList: User[]) => {
    let filtered = [...userList];

    if (selectedGame !== "all") {
      filtered = filtered.filter((user) =>
        user.games?.some((game) => game.name === selectedGame)
      );
    }

    if (selectedElo !== "all") {
      filtered = filtered.filter((user) => {
        const gameWithElo = user.games?.find(
          (game) => game.name === selectedGame
        );
        if (!gameWithElo) return false;

        switch (selectedElo) {
          case "low":
            return gameWithElo.elo < 1000;
          case "medium":
            return gameWithElo.elo >= 1000 && gameWithElo.elo < 2000;
          case "high":
            return gameWithElo.elo >= 2000;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const handleGameChange = (event: any) => {
    setSelectedGame(event.target.value);
    updateDisplayedUsers(
      filterUsers(
        users.filter(
          (user) =>
            event.target.value === "all" ||
            user.games?.some((game) => game.name === event.target.value)
        )
      )
    );
  };

  const handleEloChange = (event: any) => {
    setSelectedElo(event.target.value);
    updateDisplayedUsers(filterUsers(users));
  };

  return (
    <MainLayout
      title={t("title")}
      pageDescription={t("pageDescription")}
    >
      <Box sx={{ padding: 3, paddingTop: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("resultsFor")} &quot;{query}&quot;
        </Typography>

        <Grid container spacing={3}>
          {/* Users Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {t("users")}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Filters */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <FormControl fullWidth size="small">
                  <InputLabel>{t("game")}</InputLabel>
                  <Select
                    value={selectedGame}
                    label={t("game")}
                    onChange={handleGameChange}
                  >
                    <MenuItem value="all">{t("allGames")}</MenuItem>
                    {availableGames.map((game) => (
                      <MenuItem key={game} value={game}>
                        {game}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  size="small"
                  disabled={selectedGame === "all"}
                >
                  <InputLabel>{t("ranking")}</InputLabel>
                  <Select
                    value={selectedElo}
                    label={t("ranking")}
                    onChange={handleEloChange}
                  >
                    <MenuItem value="all">{t("allRankings")}</MenuItem>
                    <MenuItem value="low">{t("low")}</MenuItem>
                    <MenuItem value="medium">{t("medium")}</MenuItem>
                    <MenuItem value="high">{t("high")}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* User results */}
              {displayedUsers.length > 0 ? (
                <List>
                  {displayedUsers.map((user) => (
                    <ListItem key={user.id}>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            alt={`Avatar de ${user.username}`}
                            src={user.profileImage}
                          />
                        </ListItemAvatar>
                        <ListItemText id={user.id} primary={user.username} />
                      </ListItemButton>
                    </ListItem>
                  ))}

                  {hasMoreUsers && (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={loadMoreUsers}
                      sx={{ mt: 2 }}
                    >
                      {t("loadMoreUsers")}
                    </Button>
                  )}
                </List>
              ) : (
                <Typography>
                  {t("noUsersFound")}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Groups Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {t("groups")}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Group results */}
              {displayedTeams.length > 0 ? (
                <Box>
                  {displayedTeams.map((team) => (
                    <Box key={team.id} sx={{ mb: 2 }}>
                      <ListItem>
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar
                              alt={`Logo de ${team.name}`}
                              src={team.image || "/images/default-team.png"}
                            />
                          </ListItemAvatar>
                          <ListItemText id={team.id} primary={team.name} />
                        </ListItemButton>
                      </ListItem>
                    </Box>
                  ))}

                  {hasMoreGroups && (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={loadMoreGroups}
                      sx={{ mt: 2 }}
                    >
                      {t("loadMoreGroups")}
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography>
                  {t("noGroupsFound")}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default SearchPage;

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}: GetServerSidePropsContext) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  try {
    // When API is ready, use this:
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${query}`);
    // const data = await response.json();

    // Using mock data instead
    const filteredUsers = mockSearchResults.users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );

    const filteredTeams = mockSearchResults.teams.filter((team) =>
      team.name.toLowerCase().includes(query.toLowerCase())
    );

    return {
      props: {
        users: filteredUsers,
        teams: filteredTeams,
        foundResults: filteredUsers.length > 0 || filteredTeams.length > 0,
        query,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return {
      props: {
        users: [],
        teams: [],
        foundResults: false,
        query,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  }
};
