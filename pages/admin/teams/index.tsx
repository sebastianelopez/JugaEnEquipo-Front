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
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  VerifiedUser as VerifiedIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Block as BlockIcon,
  Search,
  Email,
  People,
  SportsEsports,
  CalendarToday,
  Person,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import { formatDate } from "../../../utils/formatDate";
import {
  backofficeService,
  type Team,
} from "../../../services/backoffice.service";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  success: "#00B894",
  warning: "#FDCB6E",
  error: "#E17055",
};

export default function TeamsModeration() {
  const t = useTranslations("Admin.teams");
  const tCommon = useTranslations("Admin.common");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchCreatorUsername, setSearchCreatorUsername] = useState("");
  const [searchCreatorEmail, setSearchCreatorEmail] = useState("");
  const [filterDisabled, setFilterDisabled] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadTeams();
  }, [
    page,
    rowsPerPage,
    filterDisabled,
    searchName,
    searchCreatorUsername,
    searchCreatorEmail,
  ]);

  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (searchName) params.name = searchName;
      if (searchCreatorUsername) params.creatorUsername = searchCreatorUsername;
      if (searchCreatorEmail) params.creatorEmail = searchCreatorEmail;
      if (filterDisabled !== "all") {
        params.disabled = filterDisabled === "disabled";
      }

      const result = await backofficeService.searchTeams(params);
      if (result.ok && result.data) {
        // result.data has { data: Team[], metadata: SearchMetadata }
        setTeams(result.data.data || []);
        setTotal(result.data.metadata?.total || result.data.data?.length || 0);
      } else {
        setError(
          result.ok === false ? result.errorMessage : t("errorLoading")
        );
      }
    } catch (err: any) {
      setError(err?.message || t("errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTeam = async (teamId: string, isDisabled: boolean) => {
    try {
      const result = isDisabled
        ? await backofficeService.enableTeam(teamId)
        : await backofficeService.disableTeam(teamId);

      if (result.ok) {
        await loadTeams();
      } else {
        setError(
          result.ok === false ? result.errorMessage : "Error al cambiar estado"
        );
      }
    } catch (err: any) {
      setError(err?.message || tCommon("error"));
    }
  };

  return (
    <AdminLayout title={t("title")}>
      <Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 4, color: "#fff" }}
        >
          {t("title")}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, bgcolor: colors.paperBg, mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder={t("searchName")}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(255,255,255,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                },
              }}
            />
            <TextField
              placeholder={t("searchCreatorUsername")}
              value={searchCreatorUsername}
              onChange={(e) => setSearchCreatorUsername(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                },
              }}
            />
            <TextField
              placeholder={t("searchCreatorEmail")}
              value={searchCreatorEmail}
              onChange={(e) => setSearchCreatorEmail(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "rgba(255,255,255,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                {tCommon("status")}
              </InputLabel>
              <Select
                value={filterDisabled}
                onChange={(e) => {
                  setFilterDisabled(e.target.value);
                  setPage(0);
                }}
                label={tCommon("status")}
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.7)" },
                }}
              >
                <MenuItem value="all">{t("all")}</MenuItem>
                <MenuItem value="enabled">{t("enabled")}</MenuItem>
                <MenuItem value="disabled">{t("disabled")}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <TableContainer component={Paper} sx={{ bgcolor: colors.paperBg }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("team")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("creator")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("statistics")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("date")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {tCommon("status")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {tCommon("actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teams.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ color: "rgba(255,255,255,0.7)", py: 4 }}
                      >
                        {t("noTeamsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    teams.map((team) => {
                      const imageUrl = team.image
                        ? team.image.startsWith("http")
                          ? team.image
                          : `https://api.jugaenequipo.com/storage/${team.image}`
                        : null;

                      return (
                        <TableRow
                          key={team.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ color: "white" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              {imageUrl ? (
                                <Avatar
                                  variant="rounded"
                                  src={imageUrl}
                                  sx={{ width: 48, height: 48 }}
                                >
                                  {team.name?.[0]?.toUpperCase() || "T"}
                                </Avatar>
                              ) : (
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    bgcolor: "#6C5CE7",
                                    width: 48,
                                    height: 48,
                                  }}
                                >
                                  {team.name?.[0]?.toUpperCase() || "T"}
                                </Avatar>
                              )}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight="bold">
                                  {team.name}
                                </Typography>
                                {team.description && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "rgba(255,255,255,0.6)",
                                      display: "block",
                                      mt: 0.5,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: 200,
                                    }}
                                  >
                                    {team.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Person
                                  sx={{
                                    fontSize: 14,
                                    color: "rgba(255,255,255,0.7)",
                                  }}
                                />
                                <Typography variant="body2">
                                  {team.creatorUsername}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Email
                                  sx={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: "rgba(255,255,255,0.5)" }}
                                >
                                  {team.creatorEmail}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <People
                                  sx={{
                                    fontSize: 16,
                                    color: "rgba(255,255,255,0.7)",
                                  }}
                                />
                                <Typography variant="body2">
                                  {team.membersCount} {t("members")}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <SportsEsports
                                  sx={{
                                    fontSize: 16,
                                    color: "rgba(255,255,255,0.7)",
                                  }}
                                />
                                <Typography variant="body2">
                                  {team.gamesCount} {t("games")}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarToday
                                sx={{
                                  fontSize: 14,
                                  color: "rgba(255,255,255,0.5)",
                                }}
                              />
                              <Typography variant="caption">
                                {formatDate(team.createdAt, {
                                  includeTime: true,
                                })}
                              </Typography>
                            </Box>
                            {team.disabledAt && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  mt: 0.5,
                                }}
                              >
                                <BlockIcon
                                  sx={{
                                    fontSize: 12,
                                    color: colors.error,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: colors.error }}
                                >
                                  {formatDate(team.disabledAt, {
                                    includeTime: true,
                                  })}
                                </Typography>
                              </Box>
                            )}
                            {team.moderationReason && (
                              <Box
                                sx={{
                                  mt: 0.5,
                                  p: 0.5,
                                  bgcolor: "rgba(225, 112, 85, 0.1)",
                                  borderRadius: 0.5,
                                  borderLeft: `2px solid ${colors.error}`,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: colors.error,
                                    fontSize: "0.65rem",
                                  }}
                                >
                                  {team.moderationReason}
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={team.disabled ? t("disabled") : tCommon("active")}
                              size="small"
                              sx={{
                                bgcolor: team.disabled
                                  ? "rgba(225, 112, 85, 0.2)"
                                  : "rgba(0, 184, 148, 0.2)",
                                color: team.disabled
                                  ? colors.error
                                  : colors.success,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {team.disabled ? (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleToggleTeam(team.id, true)
                                  }
                                  sx={{ color: colors.success }}
                                >
                                  <CheckIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleToggleTeam(team.id, false)
                                  }
                                  sx={{ color: colors.error }}
                                >
                                  <BlockIcon />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
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
                  color: "rgba(255,255,255,0.7)",
                  "& .MuiTablePagination-selectIcon": {
                    color: "rgba(255,255,255,0.7)",
                  },
                }}
              />
            </>
          )}
        </TableContainer>
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
