"use client";

import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  People,
  Article,
  Groups,
  EmojiEvents,
  TrendingUp,
} from "@mui/icons-material";
import { AdminLayout } from "../../../layouts";

const stats = [
  {
    title: "Usuarios Totales",
    value: "12,458",
    icon: <People />,
    color: "#6C5CE7",
    change: "+12%",
  },
  {
    title: "Posts Publicados",
    value: "8,234",
    icon: <Article />,
    color: "#00CEC9",
    change: "+8%",
  },
  {
    title: "Equipos Activos",
    value: "1,234",
    icon: <Groups />,
    color: "#00B894",
    change: "+15%",
  },
  {
    title: "Torneos en Curso",
    value: "45",
    icon: <EmojiEvents />,
    color: "#FDCB6E",
    change: "+5%",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Panel de Control">
      <Box>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                sx={{
                  p: 3,
                  background: "rgba(44, 62, 80, 0.95)",
                  borderRadius: 2,
                  border: "1px solid rgba(108, 92, 231, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 24px rgba(108, 92, 231, 0.3)`,
                    borderColor: stat.color,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: `${stat.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#00B894",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <TrendingUp fontSize="small" />
                    {stat.change}
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  {stat.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AdminLayout>
  );
}
