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
} from "@mui/material";
import {
  AccountCircleOutlined,
  LoginOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import { UiContext } from "../../../context";
import { useRouter } from "next/router";
import { logout } from "../../../services/auth.service";
import { UserContext } from "../../../context/user";
import { useTranslations } from "next-intl";
import { SelectCountry } from "../../molecules/SelectCountry";

export const SideMenu = () => {
  const router = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
  const { removeUser } = useContext(UserContext);
  const t = useTranslations("SideMenu");

  const [searchTerm, setSearchTerm] = useState("");

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  };

  const onLogOut = () => {
    logout();
    removeUser();
    router.push("/");
  };

  const navigateTo = (url: string) => {
    toggleSideMenu();
    router.push(url);
  };

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
      onClose={toggleSideMenu}
    >
      <Box component="div" sx={{ width: 250, paddingTop: 5 }}>
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
            <ListItem button onClick={() => navigateTo("/orders/history")}>
              <ListItemIcon>
                <AccountCircleOutlined />
              </ListItemIcon>
              <ListItemText primary={t("profile")} />
            </ListItem>
            <ListItem>
              <SelectCountry fullWidth />
            </ListItem>
          </>

          <ListItem button onClick={onLogOut}>
            <ListItemIcon>
              <LoginOutlined />
            </ListItemIcon>
            <ListItemText primary={t("logOut")} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
