import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { AdminLayout } from "../../../layouts";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  warning: "#FDCB6E",
  error: "#E17055",
};

const mockPosts = [
  {
    id: 1,
    user: "GamerPro123",
    content: "Este juego es una basura total...",
    reports: 5,
    reason: "Lenguaje Ofensivo",
    date: "Hace 2h",
    status: "pending",
  },
  {
    id: 2,
    user: "ToxicPlayer",
    content: "[SPAM] Únete a mi servidor de discord...",
    reports: 12,
    reason: "Spam",
    date: "Hace 5h",
    status: "pending",
  },
  {
    id: 3,
    user: "UnknownUser",
    content: "Alguien para duo en Valorant?",
    reports: 1,
    reason: "Falso reporte",
    date: "Hace 1d",
    status: "reviewed",
  },
];

export default function PostsModeration() {
  return (
    <AdminLayout title="Moderación de Posts">
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Moderación de Posts
          </Typography>
          <Box>
            <Chip label="Pendientes: 15" color="warning" sx={{ mr: 1 }} />
            <Chip label="Hoy: 45" color="primary" />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ bgcolor: colors.paperBg }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Usuario
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Contenido
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Reportes
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Razón
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockPosts.map((post) => (
                <TableRow
                  key={post.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ color: "white" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {post.user[0]}
                      </Avatar>
                      <Typography variant="body2">{post.user}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "white", maxWidth: 300 }}>
                    <Typography noWrap variant="body2">
                      {post.content}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <Chip
                      label={post.reports}
                      size="small"
                      sx={{
                        bgcolor:
                          post.reports > 10 ? colors.error : colors.warning,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{post.reason}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Ver Contexto">
                        <IconButton size="small" sx={{ color: "white" }}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ignorar">
                        <IconButton size="small" sx={{ color: colors.warning }}>
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar Post">
                        <IconButton size="small" sx={{ color: colors.error }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Banear Usuario">
                        <IconButton size="small" sx={{ color: "red" }}>
                          <BlockIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}
