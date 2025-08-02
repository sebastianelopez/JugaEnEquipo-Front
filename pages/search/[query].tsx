import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
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
import { mockSearchResults } from "./mock";

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
      title={"Juga en Equipo - Search"}
      pageDescription={"Encuentra a jugadores o a tu equipo"}
    >
      <Box sx={{ padding: 3, paddingTop: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resultados para: &quot;{query}&quot;
        </Typography>

        <Grid container spacing={3}>
          {/* Users Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Usuarios
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
                  <InputLabel>Juego</InputLabel>
                  <Select
                    value={selectedGame}
                    label="Juego"
                    onChange={handleGameChange}
                  >
                    <MenuItem value="all">Todos los juegos</MenuItem>
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
                  <InputLabel>Ranking</InputLabel>
                  <Select
                    value={selectedElo}
                    label="Ranking"
                    onChange={handleEloChange}
                  >
                    <MenuItem value="all">Todos los rankings</MenuItem>
                    <MenuItem value="low">{"Bajo (< 1000)"}</MenuItem>
                    <MenuItem value="medium">{"Medio (1000-2000)"}</MenuItem>
                    <MenuItem value="high">{"Alto (> 2000)"}</MenuItem>
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
                      Cargar más usuarios
                    </Button>
                  )}
                </List>
              ) : (
                <Typography>
                  No se encontraron usuarios para tu búsqueda
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Groups Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Grupos
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Group results */}
              {displayedTeams.length > 0 ? (
                <Box>
                  {displayedTeams.map((team) => (
                    <Box key={team._id} sx={{ mb: 2 }}>
                      <ListItem>
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar
                              alt={`Logo de ${team.name}`}
                              src={
                                team.profileImage || "/images/default-team.png"
                              }
                            />
                          </ListItemAvatar>
                          <ListItemText id={team._id} primary={team.name} />
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
                      Cargar más grupos
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography>
                  No se encontraron grupos para tu búsqueda
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
      },
    };
  }
};
