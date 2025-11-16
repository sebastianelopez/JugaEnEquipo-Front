import { AppBar, Box, Link, Toolbar } from "@mui/material";

import NextLink from "next/link";

import { ResponsiveLogo, ThemeToggleButton } from "../../atoms";
import { SelectCountry } from "../../molecules/SelectCountry/SelectCountry";
import { itemsHeight } from "./constants";

export const AuthNavbar = () => {
  return (
    <AppBar component="nav">
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link component="span">
            <ResponsiveLogo size="medium" />
          </Link>
        </NextLink>

        <Box flex={1} component="div" />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <ThemeToggleButton />

          <SelectCountry height={itemsHeight} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
