"use client";

import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Tag as TagIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { AdminLayout } from "../../../layouts";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  accent: "#00CEC9",
  error: "#E17055",
};

const trendingTags = [
  { id: 1, tag: "#ValorantChampions", posts: "12.5k" },
  { id: 2, tag: "#Worlds2023", posts: "45.2k" },
  { id: 3, tag: "#GamingSetup", posts: "8.1k" },
];

const blockedTags = [
  { id: 1, tag: "#scam", reason: "Estafas" },
  { id: 2, tag: "#hate", reason: "Discurso de odio" },
];

export default function HashtagsModeration() {
  return (
    <AdminLayout title="Gestión de Hashtags">
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Gestión de Hashtags
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, bgcolor: colors.paperBg, color: "white" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <TrendingUpIcon sx={{ color: colors.accent, mr: 1 }} />
                <Typography variant="h6">Trending Topics</Typography>
              </Box>

              <TextField
                fullWidth
                placeholder="Buscar hashtag..."
                variant="outlined"
                size="small"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(255,255,255,0.05)",
                  input: { color: "white" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "rgba(255,255,255,0.5)" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <List>
                {trendingTags.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="block"
                        sx={{ color: colors.error }}
                      >
                        <BlockIcon />
                      </IconButton>
                    }
                    sx={{
                      bgcolor: "rgba(255,255,255,0.02)",
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(108, 92, 231, 0.2)",
                          color: colors.primary,
                        }}
                      >
                        <TagIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.tag}
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          {item.posts} posts
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, bgcolor: colors.paperBg, color: "white" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <BlockIcon sx={{ color: colors.error, mr: 1 }} />
                <Typography variant="h6">Hashtags Bloqueados</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Bloquear nuevo tag..."
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    input: { color: "white" },
                  }}
                />
                <IconButton
                  sx={{
                    bgcolor: colors.error,
                    color: "white",
                    borderRadius: 1,
                  }}
                >
                  <BlockIcon />
                </IconButton>
              </Box>

              <List>
                {blockedTags.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{
                      bgcolor: "rgba(225, 112, 85, 0.1)",
                      mb: 1,
                      borderRadius: 1,
                      borderLeft: `4px solid ${colors.error}`,
                    }}
                  >
                    <ListItemText
                      primary={item.tag}
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          Razón: {item.reason}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
}
