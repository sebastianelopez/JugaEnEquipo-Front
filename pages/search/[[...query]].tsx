import type { NextPage } from "next";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
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
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { SearchOutlined, Close } from "@mui/icons-material";
import { gameService } from "../../services/game.service";
import { rankService } from "../../services/rank.service";
import { teamService } from "../../services/team.service";
import { userService } from "../../services/user.service";
import { api } from "../../lib/api";
import { Game } from "../../interfaces/game";
import { Rank } from "../../interfaces/rank";
import { getRankImage } from "../../utils/rankImageUtils";
import Image from "next/image";

interface SearchUsersResponse {
  data: User[];
  metadata: {
    quantity: number;
  };
}

interface Props {
  users: User[];
  teams: Team[];
  foundResults: boolean;
  query: string;
  games: Game[];
}

const SearchPage: NextPage<Props> = ({
  users: initialUsers,
  teams: initialTeams,
  foundResults,
  query,
  games: initialGames,
}) => {
  const t = useTranslations("Search");
  const tNavbar = useTranslations("Navbar");
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(query || "");

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [hasMoreGroups, setHasMoreGroups] = useState(false);

  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [selectedRank, setSelectedRank] = useState<string>("all");
  const [availableGames, setAvailableGames] = useState<Game[]>(initialGames);
  const [availableRanks, setAvailableRanks] = useState<Rank[]>([]);
  const [loadingRanks, setLoadingRanks] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useEffect(() => {
    setSearchValue(query || "");
  }, [query]);

  useEffect(() => {
    setUsers(initialUsers);
    setTeams(initialTeams);
    updateDisplayedUsers(initialUsers);
    updateDisplayedGroups(initialTeams);
  }, [initialUsers, initialTeams]);

  const getRankDisplayName = (rank: Rank): string => {
    const ranksWithSameName = availableRanks.filter(
      (r) => r.rankId === rank.rankId || r.rankName === rank.rankName
    );

    if (ranksWithSameName.length > 1) {
      return `${rank.rankName} ${rank.level}`;
    }

    return rank.rankName;
  };

  useEffect(() => {
    const fetchRanks = async () => {
      if (selectedGameId) {
        setLoadingRanks(true);
        const result = await rankService.findAllByGame(selectedGameId);
        if (result.ok && result.data) {
          const sortedRanks = [...result.data].sort(
            (a, b) => a.level - b.level
          );
          setAvailableRanks(sortedRanks);
        } else {
          setAvailableRanks([]);
        }
        setLoadingRanks(false);
      } else {
        setAvailableRanks([]);
        setSelectedRank("all");
      }
    };

    fetchRanks();
  }, [selectedGameId]);

  const handleSearchSubmit = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue && trimmedValue !== query) {
      router.replace(`/search/${encodeURIComponent(trimmedValue)}`);
    } else if (!trimmedValue && query) {
      router.replace(`/search`);
    } else {
      searchUsersWithFilters();
      searchTeamsWithFilters();
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setUsers([]);
    setTeams([]);
    setDisplayedUsers([]);
    setDisplayedTeams([]);
    setHasMoreUsers(false);
    setHasMoreGroups(false);
    setSelectedGame("all");
    setSelectedGameId("");
    setSelectedRank("all");
    router.replace(`/search`);
  };

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
    setDisplayedUsers(users.slice(0, currentCount + 5));
    setHasMoreUsers(users.length > currentCount + 5);
  };

  const loadMoreGroups = () => {
    const currentCount = displayedTeams.length;
    setDisplayedTeams(teams.slice(0, currentCount + 5));
    setHasMoreGroups(teams.length > currentCount + 5);
  };

  const searchUsersWithFilters = async () => {
    setLoadingUsers(true);
    try {
      const searchParams: any = {};

      if (searchValue.trim()) {
        searchParams.username = searchValue.trim();
      }

      if (selectedGameId) {
        searchParams.gameId = selectedGameId;
      }

      if (selectedRank !== "all" && selectedGameId) {
        const selectedRankData = availableRanks.find(
          (rank) => rank.id === selectedRank
        );
        if (selectedRankData) {
          searchParams.gameRankId = selectedRankData.id;
        }
      }

      const result = await userService.searchUsers(searchParams);
      const fetchedUsers = (result as any)?.data || result || [];
      setUsers(fetchedUsers);
      updateDisplayedUsers(fetchedUsers);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const searchTeamsWithFilters = async () => {
    setLoadingTeams(true);
    try {
      const searchParams: any = {};

      if (selectedGameId) {
        searchParams.gameId = selectedGameId;
      }

      const result = await teamService.search(searchParams);
      const fetchedTeams = result.ok && result.data ? result.data : [];

      if (searchValue.trim()) {
        const filteredTeams = fetchedTeams.filter((team) =>
          team.name.toLowerCase().includes(searchValue.toLowerCase().trim())
        );
        setTeams(filteredTeams);
        updateDisplayedGroups(filteredTeams);
      } else {
        setTeams(fetchedTeams);
        updateDisplayedGroups(fetchedTeams);
      }
    } catch (error) {
      console.error("Error searching teams:", error);
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsersWithFilters();
      searchTeamsWithFilters();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedGameId, selectedRank, searchValue, availableRanks]);

  const handleGameChange = (event: any) => {
    const gameName = event.target.value;
    setSelectedGame(gameName);
    setSelectedRank("all");

    if (gameName === "all") {
      setSelectedGameId("");
    } else {
      const game = availableGames.find((g) => g.name === gameName);
      if (game) {
        setSelectedGameId(game.id);
      }
    }
  };

  const handleRankChange = (event: any) => {
    setSelectedRank(event.target.value);
  };

  const showInitialMessage =
    !query &&
    !searchValue.trim() &&
    selectedGame === "all" &&
    selectedRank === "all" &&
    displayedUsers.length === 0 &&
    displayedTeams.length === 0 &&
    !loadingUsers &&
    !loadingTeams;

  return (
    <MainLayout title={t("title")} pageDescription={t("pageDescription")}>
      <Box sx={{ padding: { xs: 2, sm: 3 }, paddingTop: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              mb: 3,
              textAlign: "center",
            }}
          >
            {tNavbar("advancedSearch")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <TextField
              fullWidth
              placeholder={tNavbar("search")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: searchValue ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                      sx={{ mr: -1 }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchSubmit}
              sx={{ minWidth: { xs: "100%", sm: "120px" } }}
            >
              {tNavbar("search")}
            </Button>
          </Box>
        </Box>

        {query && (
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, mb: 3 }}
          >
            {t("resultsFor")} &quot;{query}&quot;
          </Typography>
        )}

        {showInitialMessage ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {t("enterSearchTerm")}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {t("users")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

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
                        <MenuItem key={game.id} value={game.name}>
                          {game.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    size="small"
                    disabled={selectedGame === "all" || loadingRanks}
                  >
                    <InputLabel>{t("ranking")}</InputLabel>
                    <Select
                      value={selectedRank}
                      label={t("ranking")}
                      onChange={handleRankChange}
                      renderValue={(value) => {
                        if (value === "all") return t("allRankings");
                        const rank = availableRanks.find((r) => r.id === value);
                        if (!rank) return "";
                        const game = availableGames.find(
                          (g) => g.name === selectedGame
                        );
                        if (!game) return getRankDisplayName(rank);
                        return (
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <Image
                              src={getRankImage({
                                gameId: game.id,
                                gameName: game.name,
                                rankId: rank.rankId,
                                rankName: rank.rankName,
                                level: rank.level,
                              })}
                              alt={rank.rankName}
                              width={20}
                              height={20}
                              style={{ objectFit: "contain" }}
                            />
                            <span>{getRankDisplayName(rank)}</span>
                          </Box>
                        );
                      }}
                    >
                      <MenuItem value="all">{t("allRankings")}</MenuItem>
                      {availableRanks.map((rank) => {
                        const game = availableGames.find(
                          (g) => g.name === selectedGame
                        );
                        return (
                          <MenuItem key={rank.id} value={rank.id}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {game && (
                                <Image
                                  src={getRankImage({
                                    gameId: game.id,
                                    gameName: game.name,
                                    rankId: rank.rankId,
                                    rankName: rank.rankName,
                                    level: rank.level,
                                  })}
                                  alt={rank.rankName}
                                  width={20}
                                  height={20}
                                  style={{ objectFit: "contain" }}
                                />
                              )}
                              <span>{getRankDisplayName(rank)}</span>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>

                {loadingUsers ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : displayedUsers.length > 0 ? (
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
                  <Typography>{t("noUsersFound")}</Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {t("groups")}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {loadingTeams ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : displayedTeams.length > 0 ? (
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
                  <Typography>{t("noGroupsFound")}</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </MainLayout>
  );
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  req,
}: GetServerSidePropsContext) => {
  const queryParam = params?.query;
  const query =
    Array.isArray(queryParam) && queryParam.length > 0
      ? queryParam[0]
      : Array.isArray(queryParam)
      ? ""
      : queryParam || "";
  const serverToken = req.cookies["token"];

  try {
    let users: User[] = [];
    let teams: Team[] = [];

    if (serverToken) {
      const searchParams: any = {};

      if (query.length > 0) {
        searchParams.username = query;
      }

      const usersResult = await api.get<SearchUsersResponse>(
        `/users`,
        searchParams,
        serverToken
      );
      users = usersResult?.data || [];

      const teamsResult = await api.get<{ data: Team[] }>(
        `/teams`,
        {},
        serverToken
      );
      const allTeams = teamsResult?.data || [];

      if (query.length > 0) {
        teams = allTeams.filter((team) =>
          team.name.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        teams = allTeams;
      }
    }

    const gamesResult = await gameService.getAllGames();
    const games = gamesResult.ok ? gamesResult.data : [];

    return {
      props: {
        users,
        teams,
        foundResults: users.length > 0 || teams.length > 0,
        query,
        games,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  } catch (error) {
    console.error("Error fetching search results:", error);

    let games: Game[] = [];
    try {
      const gamesResult = await gameService.getAllGames();
      games = gamesResult.ok ? gamesResult.data : [];
    } catch (gamesError) {
      console.error("Error fetching games:", gamesError);
    }

    return {
      props: {
        users: [],
        teams: [],
        foundResults: false,
        query,
        games,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  }
};

