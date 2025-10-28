import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useContext, useEffect } from "react";
import { UiContext } from "../../../context";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import GroupsIcon from '@mui/icons-material/Groups';
import { Search } from "../../molecules/Search/Search";

import logo from "./../../../assets/logo.png";
import { NotificationsButton } from "../../atoms/NotificationsButton";

export const MainNavbar = () => {
  const { toggleSideMenu, themeMode, toggleTheme } = useContext(UiContext);

  const t = useTranslations("Navbar");
  const tGlobal = useTranslations("Global");

  const logotitle = ".logotitle";

  useEffect(() => {
    gsap.from(logotitle, {
      opacity: 1,
      x: 100,
      duration: 2,
    });
  }, []);

  return (
    <AppBar component="nav">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: "64px",
          paddingInline: "24px",
        }}
      >
        <NextLink href={"/home"} passHref>
          <Link component="span">
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems="center"
              component="div"
            >
              <Image
                src={logo}
                height={40}
                width={70}
                alt="Juga en Equipo logo"
              />
              <Typography
                className="logotitle"
                sx={{ display: { xs: "none" } }}
              >
                Juga en equipo
              </Typography>
            </Box>
          </Link>
        </NextLink>

        <Box
          component="div"
          position="relative"
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <NextLink href={"/home"} passHref>
            <Link component="span">
              <IconButton>
                <HomeIcon />
              </IconButton>
            </Link>
          </NextLink>
          <NextLink href={"/messages"} passHref>
            <Link component="span">
              <IconButton>
                <MessageIcon />
              </IconButton>
            </Link>
          </NextLink>
          <NextLink href={"/teams"} passHref>
            <Link component="span">
              <IconButton>
                <GroupsIcon />
              </IconButton>
            </Link>
          </NextLink>
          <NextLink href={"/tournaments"} passHref>
            <Link component="span">
              <IconButton>
                <EmojiEventsIcon />
              </IconButton>
            </Link>
          </NextLink>
          <NotificationsButton notificationCount={3} />

          <Search
            sx={{
              display: "none",
              "@media (min-width: 450px)": {
                display: "inline-block",
              },
            }}
          />
        </Box>

        <Box>
          <Tooltip
            title={
              themeMode === "dark"
                ? tGlobal("switchToLightMode")
                : tGlobal("switchToDarkMode")
            }
          >
            <IconButton
              onClick={toggleTheme}
              aria-label={tGlobal("toggleTheme")}
              sx={{
                display: "none",
                "@media (min-width: 680px)": {
                  display: "inline-flex",
                },
              }}
            >
              {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Button
            color="secondary"
            onClick={toggleSideMenu}
            aria-label={tGlobal("toggleSideMenu")}
          >
            <MenuIcon />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
