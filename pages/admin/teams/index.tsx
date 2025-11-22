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
  Button,
} from "@mui/material";
import {
  VerifiedUser as VerifiedIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  GppGood as ShieldIcon,
  Check as CheckIcon, // Import CheckIcon here
} from "@mui/icons-material";
import { AdminLayout } from "../../../layouts";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  success: "#00B894",
  warning: "#FDCB6E",
  error: "#E17055",
};

const teamsData = [
  {
    id: 1,
    name: "Thunder Gaming",
    members: 5,
    status: "verified",
    reports: 0,
    image: "/team-banner-thunder.jpg",
  },
  {
    id: 2,
    name: "Dark Side",
    members: 4,
    status: "pending",
    reports: 0,
    image: "/team-banner-shadow.jpg",
  },
  {
    id: 3,
    name: "Trolls United",
    members: 3,
    status: "reported",
    reports: 8,
    image: null,
  },
  {
    id: 4,
    name: "Phoenix Rising",
    members: 6,
    status: "verified",
    reports: 1,
    image: "/team-banner-phoenix.jpg",
  },
];

export default function TeamsModeration() {
  return (
    <AdminLayout title="Moderación de Equipos">
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Moderación de Equipos
        </Typography>

        <TableContainer component={Paper} sx={{ bgcolor: colors.paperBg }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Equipo
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Miembros
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Estado
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Reportes
                </TableCell>
                <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamsData.map((team) => (
                <TableRow
                  key={team.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ color: "white" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={team.image || undefined} variant="rounded">
                        {team.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {team.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="rgba(255,255,255,0.5)"
                        >
                          ID: {team.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{team.members}</TableCell>
                  <TableCell>
                    {team.status === "verified" && (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Verificado"
                        size="small"
                        sx={{
                          bgcolor: "rgba(0, 184, 148, 0.2)",
                          color: colors.success,
                        }}
                      />
                    )}
                    {team.status === "pending" && (
                      <Chip
                        label="Pendiente"
                        size="small"
                        sx={{
                          bgcolor: "rgba(253, 203, 110, 0.2)",
                          color: colors.warning,
                        }}
                      />
                    )}
                    {team.status === "reported" && (
                      <Chip
                        icon={<WarningIcon />}
                        label="Reportado"
                        size="small"
                        sx={{
                          bgcolor: "rgba(225, 112, 85, 0.2)",
                          color: colors.error,
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {team.reports > 0 ? (
                      <Typography color={colors.error} fontWeight="bold">
                        {team.reports}
                      </Typography>
                    ) : (
                      <Typography color="rgba(255,255,255,0.5)">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton size="small" sx={{ color: "white" }}>
                        <InfoIcon />
                      </IconButton>
                      {team.status === "pending" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          sx={{ minWidth: 0, p: 1 }}
                        >
                          <CheckIcon fontSize="small" />
                        </Button>
                      )}
                      {team.status !== "verified" && (
                        <IconButton size="small" sx={{ color: colors.success }}>
                          <ShieldIcon />
                        </IconButton>
                      )}
                      <IconButton size="small" sx={{ color: colors.error }}>
                        <DeleteIcon />
                      </IconButton>
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
