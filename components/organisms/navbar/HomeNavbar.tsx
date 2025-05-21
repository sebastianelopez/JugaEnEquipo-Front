import { SearchOutlined } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { SelectCountry } from "../../molecules/SelectCountry/SelectCountry";

import logo from "./../../../assets/logo.png";

export const HomeNavbar = () => {
  const { asPath } = useRouter();

  const t = useTranslations("Navbar");

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
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link component="span">
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
              <Typography className="logotitle">Juga en equipo</Typography>
            </Box>
          </Link>
        </NextLink>

        <Box flex={1} component="div" />

        <Box
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          component="div"
        >
          <NextLink href={"/"} passHref>
            <Link component="span">
              <Button color={asPath === "/" ? "primary" : "info"}>Home</Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/women"} passHref>
            <Link component="span">
              <Button color={asPath === "/category/women" ? "primary" : "info"}>
                {t("news")}
              </Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/kid"} passHref>
            <Link component="span">
              <Button color={asPath === "/category/kid" ? "primary" : "info"}>
                {t("aboutus")}
              </Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1} component="div" />
        <SelectCountry />

        <IconButton>
          <SearchOutlined />
        </IconButton>
        <NextLink href={"/auth/login"} passHref>
          <Link component="span">
            <Button>Login</Button>
          </Link>
        </NextLink>
      </Toolbar>
    </AppBar>
  );
};
