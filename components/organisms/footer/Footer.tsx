import { Box, Grid, Link, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";

import logo from "./../../../assets/logo.png";

export const Footer = () => {
  return (
    <footer>
      <Grid container columns={12} padding={2} >
        <Grid
          item
          position="relative"
          display="flex"
          alignItems="center"
          flexDirection="row"
          columns={12}
          width="100%"
        >
          <Grid
            item
            display="flex"
            alignItems="center"
            flexDirection="column"
            md={4}
          >
            <NextLink href={"/"} passHref>
              <Link>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems="center"
                  component="div"
                >
                  <Image src={logo} height={40} width={70} />
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
            item
            display="flex"
            alignItems="center"
            flexDirection="column"
            md={4}
          ></Grid>
          <Grid
            item
            display="flex"
            alignItems="center"
            flexDirection="column"
            md={4}
          ></Grid>
        </Grid>
        <Grid
          item
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="row"
          width="100%"
        >
          <Image src={logo} height={40} width={70} />
        </Grid>
      </Grid>
    </footer>
  );
};
