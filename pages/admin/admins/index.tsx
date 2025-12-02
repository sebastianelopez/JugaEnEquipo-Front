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
  CircularProgress,
  Alert,
  TextField as MuiTextField,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import {
  backofficeService,
  type Admin,
} from "../../../services/backoffice.service";
import { v4 as uuidv4 } from "uuid";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

export default function AdminAdmins() {
  const t = useTranslations("Admin.admins");
  const tCommon = useTranslations("Admin.common");

  const roles = [
    { value: "admin", label: t("admin"), color: "#6C5CE7" },
    { value: "superadmin", label: t("superadmin"), color: "#E17055" },
  ];
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    user: "",
    role: "admin" as "admin" | "superadmin",
    password: "",
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backofficeService.searchAdmins({
        includeDeleted: false,
        limit: 100,
        offset: 0,
      });
      if (result.ok && result.data) {
        // result.data has { data: Admin[], metadata: SearchMetadata }
        setAdmins(result.data.data || []);
      } else {
        setError(
          result.ok === false
            ? result.errorMessage
            : t("errorLoading")
        );
      }
    } catch (err: any) {
      setError(err?.message || t("errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name || "",
        user: admin.user || "",
        role: admin.role || "admin",
        password: "",
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        name: "",
        user: "",
        role: "admin",
        password: "",
      });
    }
    setOpenDialog(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAdmin(null);
    setFormData({
      name: "",
      user: "",
      role: "admin",
      password: "",
    });
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.user) {
      setError(t("name") + " y " + t("username") + " son requeridos");
      return;
    }

    if (!editingAdmin && !formData.password) {
      setError(t("password") + " es requerida para nuevos administradores");
      return;
    }

    setError(null);
    try {
      const adminId = editingAdmin?.id || uuidv4();
      // For updates, if password is empty, send empty string (backend should ignore it)
      // For new admins, password is required (already validated above)
      const result = await backofficeService.createOrUpdateAdmin(adminId, {
        name: formData.name,
        user: formData.user,
        role: formData.role,
        password: formData.password || "",
      });

      if (result.ok) {
        await loadAdmins();
        handleCloseDialog();
      } else {
        setError(
          result.ok === false ? result.errorMessage : tCommon("error")
        );
      }
    } catch (err: any) {
      setError(err?.message || tCommon("error"));
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm(t("confirmDelete"))) {
      return;
    }

    try {
      const result = await backofficeService.deleteAdmin(adminId);
      if (result.ok) {
        await loadAdmins();
      } else {
        setError(
          result.ok === false ? result.errorMessage : tCommon("error")
        );
      }
    } catch (err: any) {
      setError(err?.message || tCommon("error"));
    }
  };

  const getRoleConfig = (role: string) =>
    roles.find((r) => r.value === role) || roles[0];

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.user?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title={t("title")}>
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
            {t("title")}
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
            {t("create")}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper
          sx={{
            p: 3,
            background: "rgba(44, 62, 80, 0.95)",
            borderRadius: 2,
            border: "1px solid rgba(108, 92, 231, 0.2)",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <MuiTextField
              placeholder={t("searchName") + " o " + t("searchUser")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",
                maxWidth: 400,
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

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 600,
                      }}
                    >
                      {t("name")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 600,
                      }}
                    >
                      {t("username")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 600,
                      }}
                    >
                      {t("role")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 600,
                      }}
                    >
                      {tCommon("status")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: 600,
                      }}
                    >
                      {tCommon("actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ color: "rgba(255, 255, 255, 0.7)", py: 4 }}
                      >
                        {t("noAdminsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.map((admin) => {
                      const roleConfig = getRoleConfig(admin.role);
                      const isDeleted = !!admin.deletedAt;
                      return (
                        <TableRow
                          key={admin.id}
                          sx={{
                            "&:hover": {
                              background: "rgba(108, 92, 231, 0.05)",
                            },
                            opacity: isDeleted ? 0.6 : 1,
                          }}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Avatar sx={{ bgcolor: "#6C5CE7" }}>
                                {admin.name?.[0]?.toUpperCase() ||
                                  admin.user?.[0]?.toUpperCase() ||
                                  "A"}
                              </Avatar>
                              <Typography
                                sx={{ color: "#fff", fontWeight: 500 }}
                              >
                                {admin.name || t("noName")}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            >
                              {admin.user}
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
                              label={isDeleted ? tCommon("deleted") : tCommon("active")}
                              size="small"
                              sx={{
                                background: isDeleted
                                  ? "rgba(225, 112, 85, 0.2)"
                                  : "rgba(0, 184, 148, 0.2)",
                                color: isDeleted ? "#E17055" : "#00B894",
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
                              onClick={() => handleDelete(admin.id)}
                              sx={{
                                color: "#E17055",
                                "&:hover": {
                                  background: "rgba(225, 112, 85, 0.1)",
                                },
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ background: "#2D3436", color: "#fff" }}>
            {editingAdmin ? t("edit") : t("create")}
          </DialogTitle>
          <DialogContent sx={{ background: "#2D3436", pt: 3 }}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label={t("name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                required
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
                label={t("username")}
                value={formData.user}
                onChange={(e) =>
                  setFormData({ ...formData, user: e.target.value })
                }
                fullWidth
                required
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
              <FormControl fullWidth>
                <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  {t("role")}
                </InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "admin" | "superadmin",
                    })
                  }
                  label={t("role")}
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
              <TextField
                label={t("password")}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                fullWidth
                required={!editingAdmin}
                helperText={
                  editingAdmin
                    ? t("password") + " - " + tCommon("leaveEmpty")
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ background: "#2D3436", p: 2 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              {tCommon("cancel")}
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
              {tCommon("save")}
            </Button>
          </DialogActions>
        </Dialog>
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
