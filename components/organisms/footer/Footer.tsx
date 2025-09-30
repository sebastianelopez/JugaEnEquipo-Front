import { Box, Grid, Link, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";

import logo from "./../../../assets/logo.png";

export const Footer = () => {
  return (
    <footer>
      <Grid container columns={12} padding={2}>
        <Grid
          position="relative"
          display="flex"
          alignItems="center"
          flexDirection="row"
          columns={12}
          width="100%"
        >
          <Grid
            display="flex"
            alignItems="center"
            flexDirection="column"
            item
            md={4}
          >
            <NextLink href={"/"} passHref>
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
                    alt="Juga en equipo logo "
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
          </Grid>
          <Grid
            display="flex"
            alignItems="center"
            flexDirection="column"
            item
            md={4}
          ></Grid>
          <Grid
            display="flex"
            alignItems="center"
            flexDirection="column"
            item
            md={4}
          ></Grid>
        </Grid>
        <Grid
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="row"
          width="100%"
        >
          <Image src={logo} height={40} width={70} alt="Juga en Equipo Logo" />
        </Grid>
      </Grid>
    </footer>
  );
};
