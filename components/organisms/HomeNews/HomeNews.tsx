import { Box, Grid, Typography } from "@mui/material";

export const HomeNews = () => {
  return (
    <Box
      component="div"
      sx={{
        background: "#f5f5f5",
        padding: "30px 0",
        height: "100vh",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: '28px', md: '36px' },
          letterSpacing: 3,
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        Las ultimas incorporaciones a nuestra red
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          maxWidth: { md: "60%" },
          letterSpacing: 1.2,
          mx: "auto",
        }}
      >
        Todos los juegos de Blizzard y Riot ya se encuentran disponibles para
        ser asociados a sus cuentas y enseñar tus logros.
      </Typography>
      <Grid container>
        <Grid item>Overwatch</Grid>
        <Grid item>World of Warcraft</Grid>
        <Grid item>Valorant</Grid>
        <Grid item>League of Legends</Grid>
      </Grid>
    </Box>
  );
};
