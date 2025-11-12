import { useContext, useState } from "react";

import {
  Box,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import {
  AccountCircleOutlined,
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

export const SideMenu = () => {
  const router = useRouter();
  const { toggleSideMenu, themeMode, toggleTheme, isMenuOpen } =
    useContext(UiContext);
  const { user, removeUser } = useContext(UserContext);
  const t = useTranslations("SideMenu");
  const tGlobal = useTranslations("Global");

  const [searchTerm, setSearchTerm] = useState("");

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  };

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
          <ListItem>
            <Input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
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
