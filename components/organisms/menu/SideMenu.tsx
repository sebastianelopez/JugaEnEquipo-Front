import { useContext, useState, useEffect, useRef } from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  AccountCircleOutlined,
  Close,
  LoginOutlined,
  SearchOutlined,
  Settings,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

import { UiContext } from "../../../context";
import { useRouter } from "next/router";
import { logout } from "../../../services/auth.service";
import { UserContext } from "../../../context/user";
import { useTranslations } from "next-intl";
import { SelectCountry } from "../../molecules/SelectCountry/SelectCountry";
import { userService } from "../../../services/user.service";
import { User } from "../../../interfaces";

export const SideMenu = () => {
  const router = useRouter();
  const { toggleSideMenu, themeMode, toggleTheme, isMenuOpen } =
    useContext(UiContext);
  const { user, removeUser } = useContext(UserContext);
  const t = useTranslations("SideMenu");
  const tGlobal = useTranslations("Global");
  const tNavbar = useTranslations("Navbar");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      setIsLoading(true);
      setHasSearched(false);

      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(value);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsLoading(false);
      setHasSearched(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setTotalResults(0);
    setShowResults(false);
    setHasSearched(false);
  };

  const searchUsers = async (term: string) => {
    try {
      const response = await userService.searchUsers(term);
      const users = response || [];
      const total = users.length;
      setHasSearched(true);
      setShowResults(true);
      // Limit to maximum 3 results
      setSearchResults(users.slice(0, 3));
      setTotalResults(total);
    } catch (error) {
      console.error("Error searching users:", error);
      setHasSearched(true);
      setShowResults(true);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (user: User) => {
    navigateTo(`/profile/${user.username}`);
    setShowResults(false);
    setSearchTerm("");
  };

  const handleAdvancedSearch = () => {
    if (searchTerm.trim()) {
      navigateTo(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
      setSearchTerm("");
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSearchResults([]);
    setTotalResults(0);
    setHasSearched(false);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const onLogOut = () => {
    toggleSideMenu();
    router.push("/");
    logout();
    removeUser();
  };

  const navigateTo = (url: string) => {
    toggleSideMenu();
    router.push(url);
  };

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{
        backdropFilter: "blur(4px)",
        transition: "all 0.5s ease-out",
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 250,
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
      variant="temporary"
      ModalProps={{
        keepMounted: true,
      }}
      onClose={toggleSideMenu}
    >
      <Box
        component="div"
        sx={{
          width: 250,
          paddingTop: 5,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <List>
          <ListItem
            sx={{
              position: "relative",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Input
              autoFocus
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
              type="text"
              placeholder={tNavbar("search")}
              endAdornment={
                <InputAdornment position="end">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : searchTerm ? (
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={onSearchTerm} edge="end">
                        <SearchOutlined />
                      </IconButton>
                    )}
                  </Box>
                </InputAdornment>
              }
            />
            {showResults && (
              <Box
                sx={{
                  width: "100%",
                  mt: 1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  bgcolor: "background.paper",
                  overflow: "hidden",
                  maxHeight: 400,
                  overflowY: "auto",
                }}
              >
                {searchResults.length > 0 ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        bgcolor: "action.hover",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {totalResults > 3
                          ? tNavbar("showingResults", {
                              showing: searchResults.length,
                              total: totalResults,
                            })
                          : tNavbar("results") + ` (${totalResults})`}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handleCloseResults}
                        sx={{ color: "text.secondary" }}
                        aria-label="Cerrar resultados"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                    <List sx={{ py: 0 }}>
                      {searchResults.map((user, index) => (
                        <ListItem
                          key={user.id || index}
                          disablePadding
                          sx={{
                            borderBottom:
                              index < searchResults.length - 1
                                ? "1px solid"
                                : "none",
                            borderColor: "divider",
                          }}
                        >
                          <ListItemButton
                            onClick={() => handleResultClick(user)}
                            sx={{
                              py: 1.5,
                              "&:hover": {
                                bgcolor: "action.hover",
                              },
                              color: "text.primary",
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt={`Avatar de ${user.username}`}
                                src={user.profileImage}
                                sx={{ width: 40, height: 40 }}
                              >
                                {!user.profileImage &&
                                  user.username.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={user.username}
                              secondary={`${user.firstname} ${user.lastname}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                    <Box
                      sx={{
                        p: 1,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleAdvancedSearch}
                        sx={{ textTransform: "none" }}
                      >
                        {tNavbar("advancedSearch")}
                      </Button>
                    </Box>
                  </>
                ) : hasSearched && !isLoading ? (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      {tNavbar("noResults")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                        px: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleAdvancedSearch}
                        sx={{ textTransform: "none", flex: 1, mr: 1 }}
                      >
                        {tNavbar("advancedSearch")}
                      </Button>
                      <IconButton
                        size="small"
                        onClick={handleCloseResults}
                        sx={{ color: "text.secondary" }}
                        aria-label="Cerrar resultados"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            )}
          </ListItem>

          <>
            <ListItem
              onClick={() => navigateTo(`/profile/${user?.username}`)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemIcon>
                <AccountCircleOutlined />
              </ListItemIcon>
              <ListItemText primary={t("profile")} />
            </ListItem>
            <ListItem
              onClick={() => navigateTo(`/settings`)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary={t("settings")} />
            </ListItem>
            <ListItem
              onClick={() => navigateTo(`/search`)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemIcon>
                <SearchOutlined />
              </ListItemIcon>
              <ListItemText primary={tNavbar("advancedSearch")} />
            </ListItem>
          </>
        </List>

        <List>
          <ListItem
            onClick={toggleTheme}
            aria-label={tGlobal("toggleTheme")}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "action.hover" },
              "@media (min-width: 680px)": {
                display: "none",
              },
            }}
          >
            <ListItemIcon>
              {themeMode === "dark" ? <LightMode /> : <DarkMode />}
            </ListItemIcon>
            <ListItemText
              primary={
                themeMode === "dark"
                  ? tGlobal("switchToLightMode")
                  : tGlobal("switchToDarkMode")
              }
            />
          </ListItem>
          <ListItem>
            <SelectCountry fullWidth />
          </ListItem>
        </List>

        <Box component="div" sx={{ mt: "auto", p: 2 }}>
          <Button
            variant="contained"
            onClick={onLogOut}
            aria-label={t("logOut")}
            fullWidth
            startIcon={<LoginOutlined />}
          >
            {t("logOut")}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
