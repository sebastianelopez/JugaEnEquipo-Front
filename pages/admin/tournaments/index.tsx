import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  Avatar,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Flag as FlagIcon,
  CalendarMonth,
  Person,
} from "@mui/icons-material";
import { AdminLayout } from "../../../layouts";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  success: "#00B894",
  error: "#E17055",
};

const pendingTournaments = [
  {
    id: 1,
    title: "Copa Amateur CS:GO",
    game: "CS:GO",
    organizer: "CarlosGaming",
    date: "25 Nov 2023",
    image: "/csgo-tournament-arena.jpg",
    status: "pending_approval",
    teams: 8,
  },
  {
    id: 2,
    title: "Valorant Legends",
    game: "Valorant",
    organizer: "TeamLiquid_Fan",
    date: "01 Dec 2023",
    image: "/valorant-esports-tournament-stage.jpg",
    status: "reported",
    reportReason: "Nombre inapropiado",
    teams: 16,
  },
];

export default function TournamentsModeration() {
  return (
    <AdminLayout title="Moderación de Torneos">
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Moderación de Torneos
        </Typography>

        <Typography variant="h6" sx={{ mb: 2, color: "rgba(255,255,255,0.7)" }}>
          Solicitudes de Aprobación & Reportes
        </Typography>

        <Grid container spacing={3}>
          {pendingTournaments.map((tournament) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={tournament.id}>
              <Card sx={{ bgcolor: colors.paperBg, color: "white" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={tournament.image}
                  alt={tournament.title}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={tournament.game}
                      size="small"
                      sx={{ bgcolor: colors.primary, color: "white" }}
                    />
                    {tournament.status === "reported" && (
                      <Chip
                        label="REPORTADO"
                        size="small"
                        sx={{ bgcolor: colors.error, color: "white" }}
                        icon={<FlagIcon />}
                      />
                    )}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {tournament.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <Avatar sx={{ width: 24, height: 24 }} src="" />
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      {tournament.organizer}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                      fontSize: "0.9rem",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarMonth
                        fontSize="small"
                        sx={{ color: colors.primary }}
                      />
                      {tournament.date}
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Person fontSize="small" sx={{ color: colors.primary }} />
                      {tournament.teams} Teams
                    </Box>
                  </Box>

                  {tournament.status === "reported" ? (
                    <Typography
                      variant="body2"
                      sx={{ color: colors.error, mb: 2 }}
                    >
                      Razón: {tournament.reportReason}
                    </Typography>
                  ) : null}

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CheckIcon />}
                      sx={{
                        bgcolor: colors.success,
                        "&:hover": { bgcolor: "#00a383" },
                      }}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CloseIcon />}
                      sx={{
                        bgcolor: colors.error,
                        "&:hover": { bgcolor: "#d66045" },
                      }}
                    >
                      Rechazar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AdminLayout>
  );
}
