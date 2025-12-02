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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Block as BlockIcon,
  Add,
  Search,
  Email,
  CalendarToday,
  Person,
  SportsEsports,
  People,
  Verified,
  AttachMoney,
  Public,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import {
  backofficeService,
  type Tournament,
} from "../../../services/backoffice.service";
import { formatDate } from "../../../utils/formatDate";
import { tournamentService } from "../../../services/tournament.service";
import { TournamentForm } from "../../../components/molecules/Form/TournamentForm";
import type { CreateTournamentPayload } from "../../../interfaces";
import { v4 as uuidv4 } from "uuid";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  success: "#00B894",
  error: "#E17055",
  warning: "#FDCB6E",
};

export default function TournamentsModeration() {
  const t = useTranslations("Admin.tournaments");
  const tCommon = useTranslations("Admin.common");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchResponsibleUsername, setSearchResponsibleUsername] = useState("");
  const [searchResponsibleEmail, setSearchResponsibleEmail] = useState("");
  const [filterDisabled, setFilterDisabled] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creatingTournament, setCreatingTournament] = useState(false);

  useEffect(() => {
    loadTournaments();
  }, [
    page,
    rowsPerPage,
    filterDisabled,
    searchName,
    searchResponsibleUsername,
    searchResponsibleEmail,
  ]);

  const loadTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (searchName) params.name = searchName;
      if (searchResponsibleUsername)
        params.responsibleUsername = searchResponsibleUsername;
      if (searchResponsibleEmail)
        params.responsibleEmail = searchResponsibleEmail;
      if (filterDisabled !== "all") {
        params.disabled = filterDisabled === "disabled";
      }

      const result = await backofficeService.searchTournaments(params);
      if (result.ok && result.data) {
        // result.data has { data: Tournament[], metadata: SearchMetadata }
        setTournaments(result.data.data || []);
        setTotal(result.data.metadata?.total || result.data.data?.length || 0);
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

  const handleToggleTournament = async (
    tournamentId: string,
    isDisabled: boolean
  ) => {
    try {
      const result = isDisabled
        ? await backofficeService.enableTournament(tournamentId)
        : await backofficeService.disableTournament(tournamentId);

      if (result.ok) {
        await loadTournaments();
      } else {
        setError(
          result.ok === false ? result.errorMessage : tCommon("error")
        );
      }
    } catch (err: any) {
      setError(err?.message || tCommon("error"));
    }
  };

  const handleCreateTournament = async (values: CreateTournamentPayload) => {
    setCreatingTournament(true);
    setError(null);
    try {
      const tournamentId = uuidv4();
      // Force isOfficial to true for admin-created tournaments
      const result = await tournamentService.create(tournamentId, {
        ...values,
        isOfficial: true,
      });

      if (result.ok) {
        await loadTournaments();
        setCreateDialogOpen(false);
      } else {
        setError(
          result.ok === false ? result.errorMessage : t("errorCreating")
        );
      }
    } catch (err: any) {
      setError(err?.message || t("errorCreating"));
    } finally {
      setCreatingTournament(false);
    }
  };

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
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff" }}>
            {t("title")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5B4BCF 0%, #00B8B1 100%)",
              },
            }}
          >
            {t("createOfficial")}
          </Button>
        </Box>

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
              placeholder={t("searchResponsibleUsername")}
              value={searchResponsibleUsername}
              onChange={(e) => setSearchResponsibleUsername(e.target.value)}
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
              placeholder={t("searchResponsibleEmail")}
              value={searchResponsibleEmail}
              onChange={(e) => setSearchResponsibleEmail(e.target.value)}
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
                      {t("tournament")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("responsible")}
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
                  {tournaments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ color: "rgba(255,255,255,0.7)", py: 4 }}
                      >
                        {t("noTournamentsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    tournaments.map((tournament) => {
                      const imageUrl = tournament.image
                        ? tournament.image.startsWith("http")
                          ? tournament.image
                          : `https://api.jugaenequipo.com/storage/${tournament.image}`
                        : null;

                      return (
                        <TableRow
                          key={tournament.id}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" sx={{ color: "white" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              {imageUrl ? (
                                <Avatar
                                  variant="rounded"
                                  src={imageUrl}
                                  sx={{ width: 48, height: 48 }}
                                >
                                  {tournament.name?.[0]?.toUpperCase() || "T"}
                                </Avatar>
                              ) : (
                                <Avatar
                                  variant="rounded"
                                  sx={{ bgcolor: "#6C5CE7", width: 48, height: 48 }}
                                >
                                  {tournament.name?.[0]?.toUpperCase() || "T"}
                                </Avatar>
                              )}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    {tournament.name}
                                  </Typography>
                                  {tournament.isOfficial && (
                                    <Chip
                                      icon={<Verified sx={{ fontSize: 12 }} />}
                                      label={t("official")}
                                      size="small"
                                      sx={{
                                        bgcolor: "rgba(108, 92, 231, 0.2)",
                                        color: colors.primary,
                                        fontSize: "0.65rem",
                                        height: 18,
                                      }}
                                    />
                                  )}
                                </Box>
                                {tournament.description && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "rgba(255,255,255,0.6)",
                                      display: "block",
                                      mt: 0.5,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: 250,
                                    }}
                                  >
                                    {tournament.description}
                                  </Typography>
                                )}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 0.5,
                                  }}
                                >
                                  <SportsEsports
                                    sx={{
                                      fontSize: 12,
                                      color: "rgba(255,255,255,0.5)",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "rgba(255,255,255,0.5)" }}
                                  >
                                    {tournament.gameName}
                                  </Typography>
                                  {tournament.region && (
                                    <>
                                      <Public
                                        sx={{
                                          fontSize: 12,
                                          color: "rgba(255,255,255,0.5)",
                                          ml: 1,
                                        }}
                                      />
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "rgba(255,255,255,0.5)" }}
                                      >
                                        {tournament.region}
                                      </Typography>
                                    </>
                                  )}
                                </Box>
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
                                  {tournament.responsibleUsername}
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
                                  {tournament.responsibleEmail}
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
                                  {tournament.registeredTeams}/{tournament.maxTeams} {t("teams")}
                                </Typography>
                              </Box>
                              <Chip
                                label={tournament.status}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(108, 92, 231, 0.2)",
                                  color: colors.primary,
                                  fontSize: "0.7rem",
                                  width: "fit-content",
                                }}
                              />
                              {tournament.prize && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <AttachMoney
                                    sx={{
                                      fontSize: 14,
                                      color: "rgba(255,255,255,0.7)",
                                    }}
                                  />
                                  <Typography variant="caption">
                                    {tournament.prize}
                                  </Typography>
                                </Box>
                              )}
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
                                <CalendarToday
                                  sx={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                  }}
                                />
                                <Typography variant="caption">
                                  {t("startDate")}: {formatDate(tournament.startAt, { includeTime: true })}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <CalendarToday
                                  sx={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                  }}
                                />
                                <Typography variant="caption">
                                  {t("endDate")}: {formatDate(tournament.endAt, { includeTime: true })}
                                </Typography>
                              </Box>
                              {tournament.disabledAt && (
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
                                    {t("disabledAt")}: {formatDate(tournament.disabledAt, { includeTime: true })}
                                  </Typography>
                                </Box>
                              )}
                              {tournament.moderationReason && (
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
                                    sx={{ color: colors.error, fontSize: "0.65rem" }}
                                  >
                                    {tournament.moderationReason}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tournament.disabled ? t("disabled") : tCommon("active")}
                              size="small"
                              sx={{
                                bgcolor: tournament.disabled
                                  ? "rgba(225, 112, 85, 0.2)"
                                  : "rgba(0, 184, 148, 0.2)",
                                color: tournament.disabled ? colors.error : colors.success,
                                fontWeight: "bold",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {tournament.disabled ? (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleToggleTournament(tournament.id, true)
                                }
                                sx={{ color: colors.success }}
                              >
                                <CheckIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleToggleTournament(tournament.id, false)
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

        {/* Dialog para crear torneo oficial */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ background: "#2D3436", color: "#fff" }}>
            {t("createOfficial")}
          </DialogTitle>
          <DialogContent sx={{ background: "#2D3436", pt: 3 }}>
            <TournamentForm
              initialValues={{
                isOfficial: true, // Siempre oficial para admin
              }}
              onSubmit={handleCreateTournament}
              submitting={creatingTournament}
            />
          </DialogContent>
          <DialogActions sx={{ background: "#2D3436", p: 2 }}>
            <Button
              onClick={() => setCreateDialogOpen(false)}
              sx={{ color: "rgba(255,255,255,0.7)" }}
              disabled={creatingTournament}
            >
              {tCommon("cancel")}
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
