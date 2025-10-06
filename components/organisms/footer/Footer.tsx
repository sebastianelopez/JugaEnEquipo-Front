"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Twitter,
  Facebook,
  Instagram,
  YouTube,
} from "@mui/icons-material";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              fontWeight="bold"
            >
              Juga en Equipo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              La red social definitiva para gamers. Conecta, compite y comparte
              tu pasión por los videojuegos.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Producto
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}
            >
              <Link href="#features" color="text.secondary" underline="hover">
                Características
              </Link>
              <Link href="#community" color="text.secondary" underline="hover">
                Comunidad
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Precios
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Descargas
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Empresa
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}
            >
              <Link href="#" color="text.secondary" underline="hover">
                Sobre Nosotros
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Blog
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Carreras
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Contacto
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Legal
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}
            >
              <Link href="#" color="text.secondary" underline="hover">
                Privacidad
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Términos
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Cookies
              </Link>
              <Link href="#" color="text.secondary" underline="hover">
                Licencias
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Juga en Equipo. Todos los derechos reservados.
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Instagram />
            </IconButton>
            <IconButton
              href="https://youtube.com"
              target="_blank"
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <YouTube />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
