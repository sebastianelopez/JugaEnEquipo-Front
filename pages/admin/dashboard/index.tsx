"use client";

import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { People, Article, Groups, EmojiEvents } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import {
  backofficeService,
  type DashboardStats,
} from "../../../services/backoffice.service";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

export default function AdminDashboard() {
  const t = useTranslations("Admin.dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backofficeService.getDashboardStats();
      if (result.ok && result.data) {
        setStats(result.data);
      } else {
        setError(
          result.ok === false
            ? result.errorMessage
            : "Error al cargar estadísticas"
        );
      }
    } catch (err: any) {
      setError(err?.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString("es-ES");
  };

  const statsConfig = [
    {
      title: t("stats.users"),
      value: formatNumber(stats?.users),
      icon: <People />,
      color: "#6C5CE7",
      key: "users",
    },
    {
      title: t("stats.posts"),
      value: formatNumber(stats?.posts),
      icon: <Article />,
      color: "#00CEC9",
      key: "posts",
    },
    {
      title: t("stats.teams"),
      value: formatNumber(stats?.teams),
      icon: <Groups />,
      color: "#00B894",
      key: "teams",
    },
    {
      title: t("stats.tournaments"),
      value: formatNumber(stats?.tournaments),
      icon: <EmojiEvents />,
      color: "#FDCB6E",
      key: "tournaments",
    },
  ];

  return (
    <AdminLayout title={t("title")}>
      <Box>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>
          {t("title")}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {statsConfig.map((stat, index) => (
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
                      justifyContent: "flex-start",
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
        )}
      </Box>
    </AdminLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../../lang/${locale}.json`)).default,
    },
  };
}
