"use client";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { Search, Block, CheckCircle, Email } from "@mui/icons-material";
import { useState } from "react";
import { AdminLayout } from "../../../layouts";

const mockUsers = [
  {
    id: 1,
    username: "carlos",
    email: "carlos@example.com",
    firstName: "Carlos",
    lastName: "García",
    verified: true,
    active: true,
    avatar: "/user-avatar.jpg",
  },
  {
    id: 2,
    username: "ana_gamer",
    email: "ana@example.com",
    firstName: "Ana",
    lastName: "Martínez",
    verified: true,
    active: true,
    avatar: "/user-avatar2.jpg",
  },
  {
    id: 3,
    username: "pedro_pro",
    email: "pedro@example.com",
    firstName: "Pedro",
    lastName: "López",
    verified: false,
    active: true,
    avatar: "/user-avatar3.jpg",
  },
  {
    id: 4,
    username: "maria_esports",
    email: "maria@example.com",
    firstName: "María",
    lastName: "Rodríguez",
    verified: true,
    active: false,
    avatar: "/user-avatar4.jpg",
  },
  {
    id: 5,
    username: "juan_gaming",
    email: "juan@example.com",
    firstName: "Juan",
    lastName: "Fernández",
    verified: false,
    active: true,
    avatar: "/user-avatar5.jpg",
  },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState(mockUsers);

  const handleDisableUser = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase());

    const matchesVerified =
      filterVerified === "all" ||
      (filterVerified === "verified" && user.verified) ||
      (filterVerified === "unverified" && !user.verified);

    return matchesSearch && matchesVerified;
  });

  return (
    <AdminLayout title="Gestión de Usuarios">
      <Box>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>
          Gestión de Usuarios
        </Typography>

        <Paper
          sx={{
            p: 3,
            background: "rgba(44, 62, 80, 0.95)",
            borderRadius: 2,
            border: "1px solid rgba(108, 92, 231, 0.2)",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              placeholder="Buscar por username, email o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": { borderColor: "#6C5CE7" },
                },
              }}
            />

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Estado de Verificación
              </InputLabel>
              <Select
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                label="Estado de Verificación"
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6C5CE7",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="verified">Verificados</MenuItem>
                <MenuItem value="unverified">No Verificados</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Usuario
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Nombre Completo
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Verificado
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:hover": { background: "rgba(108, 92, 231, 0.05)" },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar src={user.avatar} alt={user.username} />
                          <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                            @{user.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Email
                            fontSize="small"
                            sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                          />
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.active ? "Activo" : "Deshabilitado"}
                          size="small"
                          sx={{
                            background: user.active
                              ? "rgba(0, 184, 148, 0.2)"
                              : "rgba(225, 112, 85, 0.2)",
                            color: user.active ? "#00B894" : "#E17055",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {user.verified ? (
                          <CheckCircle sx={{ color: "#00B894" }} />
                        ) : (
                          <Chip
                            label="No verificado"
                            size="small"
                            sx={{
                              background: "rgba(253, 203, 110, 0.2)",
                              color: "#FDCB6E",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDisableUser(user.id)}
                          sx={{
                            color: user.active ? "#E17055" : "#00B894",
                            "&:hover": {
                              background: user.active
                                ? "rgba(225, 112, 85, 0.1)"
                                : "rgba(0, 184, 148, 0.1)",
                            },
                          }}
                        >
                          <Block />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) =>
              setRowsPerPage(parseInt(e.target.value, 10))
            }
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "& .MuiTablePagination-selectIcon": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
}
