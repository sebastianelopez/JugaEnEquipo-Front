import {
  AppBar,
  Box,
  Link,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { gsap } from "gsap";

import logo from "./../../../assets/logo.png";

export const AuthNavbar = () => {
  const { asPath, push, locale, query, pathname } = useRouter();

  const [selectValue, setSelectValue] = useState(locale ? locale : "en");

  const onSelectChange = (newLocale: string) => {
    setSelectValue(newLocale);
    push({ pathname, query }, asPath, { locale: newLocale });
  };

  const logotitle = ".logotitle";

  useEffect(() => {    
    gsap.from(logotitle, {
      opacity: 1,
      x: 100,
      duration: 2,
    });
  }, []);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link>
            <Box display={"flex"} justifyContent={"center"} alignItems="center">
              <Image src={logo} height={40} width={70} />
              <Typography className="logotitle">Juga en equipo</Typography>
            </Box>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box flex={1} />
        <Select
          variant="outlined"
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}          
        >
          <MenuItem value={"es"}>
            <span className="fi fi-ar" />
          </MenuItem>
          <MenuItem value={"en"}>
            <span className="fi fi-us" />
          </MenuItem>
          <MenuItem value={"pt"}>
            <span className="fi fi-br" />
          </MenuItem>
        </Select>
      </Toolbar>
    </AppBar>
  );
};
