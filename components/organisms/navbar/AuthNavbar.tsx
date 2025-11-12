import {
  AppBar,
  Box,
  Link,
  MenuItem,
  Select,
  Toolbar,
} from "@mui/material";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { gsap } from "gsap";

import { ResponsiveLogo } from "../../atoms";

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
    <AppBar component="nav">
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link component="span">
            <ResponsiveLogo size="medium" />
          </Link>
        </NextLink>

        <Box flex={1} component="div" />

        <Box flex={1} component="div" />
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
