"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Container,
  Typography,
  useTheme,
  alpha,
  Link,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import Image from "next/image";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { SelectCountry } from "../../molecules/SelectCountry/SelectCountry";
import { UiContext } from "../../../context";
import logo from "../../../assets/logo.png";

export function HomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const theme = useTheme();
  const t = useTranslations("Navbar");
  const tGlobal = useTranslations("Global");
  const { themeMode, toggleTheme } = useContext(UiContext);

  const itemsHeight = 40;
  const itemsRightMargin = 1.5;

  const menuItems = [
    { label: t("features"), href: "#features" },
    { label: t("community"), href: "#community" },
    { label: t("about"), href: "#about" },
  ];

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY || currentScrollY < 50) {
      setShowNavbar(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setShowNavbar(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <NextLink href={"/"} passHref>
            <Link component="span" sx={{ textDecoration: "none" }}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems="center"
                component={"div"}
              >
                <Image
                  src={logo}
                  height={40}
                  width={70}
                  alt="Juga en Equipo logo"
                />
                <Typography
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                  }}
                >
                  Juga en equipo
                </Typography>
              </Box>
            </Link>
          </NextLink>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
            {menuItems.map((item) => (
              <Button
                key={item.href}
                href={item.href}
                sx={{
                  color: "text.primary",
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.3s",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Box sx={{ marginRight: itemsRightMargin }}>
              <SelectCountry height={itemsHeight} />
            </Box>
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
                  color: "text.primary",
                }}
              >
                {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <NextLink href={"/auth/login"} passHref>
              <Link component="span" sx={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  sx={{
                    color: "text.primary",
                    height: itemsHeight,
                  }}
                >
                  {t("login")}
                </Button>
              </Link>
            </NextLink>
            <NextLink href={"/auth/register"} passHref>
              <Link component="span" sx={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    height: itemsHeight,
                  }}
                >
                  {t("signUp")}
                </Button>
              </Link>
            </NextLink>
          </Box>

          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "text.primary" }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box
          sx={{
            width: 250,
            pt: 2,
            bgcolor: "background.paper",
            height: "100%",
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Typography sx={{ color: "text.primary" }}>
                    {item.label}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              px: 2,
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SelectCountry height={itemsHeight} />
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
                    color: "text.primary",
                  }}
                >
                  {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
            <NextLink href={"/auth/login"} passHref>
              <Link
                component="span"
                sx={{ textDecoration: "none", width: "100%" }}
              >
                <Button variant="text" fullWidth sx={{ color: "text.primary" }}>
                  {t("login")}
                </Button>
              </Link>
            </NextLink>
            <NextLink href={"/auth/register"} passHref>
              <Link
                component="span"
                sx={{ textDecoration: "none", width: "100%" }}
              >
                <Button variant="contained" color="primary" fullWidth>
                  {t("signUp")}
                </Button>
              </Link>
            </NextLink>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
