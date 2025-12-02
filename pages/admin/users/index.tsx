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
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Block, CheckCircle, Email } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import {
  backofficeService,
  type User,
} from "../../../services/backoffice.service";
import { Users2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

export default function AdminUsers() {
  const t = useTranslations("Admin.users");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [filterVerified, setFilterVerified] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, filterVerified, searchEmail, searchUsername]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (searchEmail) params.email = searchEmail;
      if (searchUsername) params.username = searchUsername;
      if (filterVerified !== "all") {
        params.verified = filterVerified === "verified";
      }

      const result = await backofficeService.searchUsers(params);
      if (result.ok && result.data) {
        // result.data has { data: User[], metadata: SearchMetadata }
        const usersData = result.data.data || [];

        setUsers(usersData);
        setTotal(result.data.metadata?.total || usersData.length || 0);
      } else {
        setError(result.ok === false ? result.errorMessage : t("errorLoading"));
      }
    } catch (err: any) {
      setError(err?.message || t("errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (userId: string, isDisabled: boolean) => {
    try {
      const result = isDisabled
        ? await backofficeService.enableUser(userId)
        : await backofficeService.disableUser(userId);

      if (result.ok) {
        await loadUsers();
      } else {
        setError(result.ok === false ? result.errorMessage : t("common.error"));
      }
    } catch (err: any) {
      setError(err?.message || t("common.error"));
    }
  };

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
              placeholder={t("searchEmail")}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": { borderColor: "#6C5CE7" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
            <TextField
              placeholder={t("searchUsername")}
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": { borderColor: "#6C5CE7" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {t("filterVerified")}
              </InputLabel>
              <Select
                value={filterVerified}
                onChange={(e) => {
                  setFilterVerified(e.target.value);
                  setPage(0);
                }}
                label={t("filterVerified")}
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
                <MenuItem value="all">{t("all")}</MenuItem>
                <MenuItem value="verified">{t("verified")}</MenuItem>
                <MenuItem value="unverified">{t("unverified")}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                        {t("common.user")}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 600,
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 600,
                        }}
                      >
                        {t("status")}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 600,
                        }}
                      >
                        {t("verified")}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontWeight: 600,
                        }}
                      >
                        {t("common.actions")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="center"
                          sx={{ color: "rgba(255, 255, 255, 0.7)", py: 4 }}
                        >
                          {t("noUsersFound")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            "&:hover": {
                              background: "rgba(108, 92, 231, 0.05)",
                            },
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
                                {user.username?.[0]?.toUpperCase() || "U"}
                              </Avatar>
                              <Typography
                                sx={{ color: "#fff", fontWeight: 500 }}
                              >
                                @{user.username}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
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
                            <Chip
                              label={
                                user.isDisabled ? t("disabled") : t("active")
                              }
                              size="small"
                              sx={{
                                background: user.isDisabled
                                  ? "rgba(225, 112, 85, 0.2)"
                                  : "rgba(0, 184, 148, 0.2)",
                                color: user.isDisabled ? "#E17055" : "#00B894",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {user.isVerified ? (
                              <CheckCircle sx={{ color: "#00B894" }} />
                            ) : (
                              <Chip
                                label={t("unverified")}
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
                              onClick={() =>
                                handleToggleUser(user.id, !!user.isDisabled)
                              }
                              sx={{
                                color: user.isDisabled ? "#00B894" : "#E17055",
                                "&:hover": {
                                  background: user.isDisabled
                                    ? "rgba(0, 184, 148, 0.1)"
                                    : "rgba(225, 112, 85, 0.1)",
                                },
                              }}
                            >
                              <Block />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "& .MuiTablePagination-selectIcon": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              />
            </>
          )}
        </Paper>
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
