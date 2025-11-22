"use client";

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
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Edit, Block } from "@mui/icons-material";
import { useState } from "react";
import { AdminLayout } from "../../../layouts";

const mockAdmins = [
  {
    id: 1,
    username: "admin_master",
    email: "admin@gaming.com",
    firstName: "Admin",
    lastName: "Master",
    role: "super_admin",
    active: true,
    avatar: "/admin-avatar.jpg",
  },
  {
    id: 2,
    username: "mod_juan",
    email: "juan@gaming.com",
    firstName: "Juan",
    lastName: "Moderador",
    role: "moderator",
    active: true,
    avatar: "/mod-avatar.jpg",
  },
  {
    id: 3,
    username: "support_ana",
    email: "ana@gaming.com",
    firstName: "Ana",
    lastName: "Soporte",
    role: "support",
    active: true,
    avatar: "/support-avatar.jpg",
  },
];

const roles = [
  { value: "super_admin", label: "Super Admin", color: "#E17055" },
  { value: "moderator", label: "Moderador", color: "#6C5CE7" },
  { value: "support", label: "Soporte", color: "#00CEC9" },
];

export default function AdminAdmins() {
  const [admins, setAdmins] = useState(mockAdmins);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "moderator",
    password: "",
  });

  const handleOpenDialog = (admin?: any) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        password: "",
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        role: "moderator",
        password: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAdmin(null);
  };

  const handleSave = () => {
    if (editingAdmin) {
      setAdmins(
        admins.map((admin) =>
          admin.id === editingAdmin.id ? { ...admin, ...formData } : admin
        )
      );
    } else {
      const newAdmin = {
        id: admins.length + 1,
        ...formData,
        active: true,
        avatar: "/default-avatar.jpg",
      };
      setAdmins([...admins, newAdmin]);
    }
    handleCloseDialog();
  };

  const handleToggleActive = (adminId: number) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === adminId ? { ...admin, active: !admin.active } : admin
      )
    );
  };

  const getRoleConfig = (role: string) =>
    roles.find((r) => r.value === role) || roles[1];

  return (
    <AdminLayout title="Gestión de Administradores">
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
            Gestión de Administradores
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5B4BCF 0%, #00B8B1 100%)",
              },
            }}
          >
            Nuevo Admin
          </Button>
        </Box>

        <Paper
          sx={{
            p: 3,
            background: "rgba(44, 62, 80, 0.95)",
            borderRadius: 2,
            border: "1px solid rgba(108, 92, 231, 0.2)",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Administrador
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
                    Rol
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => {
                  const roleConfig = getRoleConfig(admin.role);
                  return (
                    <TableRow
                      key={admin.id}
                      sx={{
                        "&:hover": { background: "rgba(108, 92, 231, 0.05)" },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar src={admin.avatar} alt={admin.username} />
                          <Typography sx={{ color: "#fff", fontWeight: 500 }}>
                            @{admin.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {admin.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                          {admin.firstName} {admin.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={roleConfig.label}
                          size="small"
                          sx={{
                            background: `${roleConfig.color}20`,
                            color: roleConfig.color,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={admin.active ? "Activo" : "Deshabilitado"}
                          size="small"
                          sx={{
                            background: admin.active
                              ? "rgba(0, 184, 148, 0.2)"
                              : "rgba(225, 112, 85, 0.2)",
                            color: admin.active ? "#00B894" : "#E17055",
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenDialog(admin)}
                          sx={{
                            color: "#6C5CE7",
                            "&:hover": {
                              background: "rgba(108, 92, 231, 0.1)",
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleToggleActive(admin.id)}
                          sx={{
                            color: admin.active ? "#E17055" : "#00B894",
                            "&:hover": {
                              background: admin.active
                                ? "rgba(225, 112, 85, 0.1)"
                                : "rgba(0, 184, 148, 0.1)",
                            },
                          }}
                        >
                          <Block />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ background: "#2D3436", color: "#fff" }}>
            {editingAdmin ? "Editar Administrador" : "Nuevo Administrador"}
          </DialogTitle>
          <DialogContent sx={{ background: "#2D3436", pt: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Nombre"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
                <TextField
                  label="Apellido"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Rol
                </InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  label="Rol"
                  sx={{
                    color: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {!editingAdmin && (
                <TextField
                  label="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ background: "#2D3436", p: 2 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5B4BCF 0%, #00B8B1 100%)",
                },
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
