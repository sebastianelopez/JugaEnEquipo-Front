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
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add,
  Search,
  CalendarToday,
  SportsEsports,
  Image as ImageIcon,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "../../../layouts";
import {
  backofficeService,
} from "../../../services/backoffice.service";
import { formatDate } from "../../../utils/formatDate";
import { Event } from "../../../interfaces/event";
import { v4 as uuidv4 } from "uuid";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";
import { fileToBase64 } from "../../../utils/imageFileUtils";
import { gameService } from "../../../services/game.service";
import { Game } from "../../../interfaces/game";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MyTextInput, MySelect, MyDateTimePicker } from "../../../components/atoms";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  success: "#00B894",
  error: "#E17055",
  warning: "#FDCB6E",
};

interface EventFormValues {
  name: string;
  description: string;
  gameId: string;
  type: string;
  startAt: string;
  endAt: string;
  image: string;
}

export default function EventsModeration() {
  const t = useTranslations("Admin.events");
  const tCommon = useTranslations("Admin.common");

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      loadEvents();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [page, rowsPerPage, searchName]);

  const loadGames = async () => {
    try {
      const result = await gameService.getAllGames();
      if (result.ok && result.data) {
        setGames(result.data);
      }
    } catch (err) {
      console.error("Error loading games:", err);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: {
        name?: string;
        limit?: number;
        offset?: number;
      } = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (searchName && searchName.trim()) {
        params.name = searchName.trim();
      }

      const result = await backofficeService.searchEvents(params);
      if (result.ok && result.data) {
        setEvents(result.data.data || []);
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

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const result = await backofficeService.deleteEvent(selectedEvent.id);
      if (result.ok) {
        await loadEvents();
        setDeleteDialogOpen(false);
        setSelectedEvent(null);
      } else {
        setError(
          result.ok === false
            ? result.errorMessage
            : t("errorDeleting")
        );
      }
    } catch (err: any) {
      setError(err?.message || t("errorDeleting"));
    }
  };

  const openDeleteDialog = (event: Event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setImageFile(file);
    } catch (err) {
      console.error("Error converting image to base64:", err);
      setError(t("errorImageConversion"));
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("nameRequired"))
      .max(100, t("nameMaxLength")),
    description: Yup.string()
      .required(t("descriptionRequired"))
      .max(1000, t("descriptionMaxLength")),
    gameId: Yup.string().required(t("gameRequired")),
    type: Yup.string().required(t("typeRequired")),
    startAt: Yup.string().required(t("startAtRequired")),
    endAt: Yup.string()
      .required(t("endAtRequired"))
      .test("is-after-start", t("endAtAfterStart"), function (value) {
        const { startAt } = this.parent;
        if (!startAt || !value) return true;
        return new Date(value) > new Date(startAt);
      }),
    image: Yup.string().required(t("imageRequired")),
  });

  const handleCreateEvent = async (values: EventFormValues) => {
    setCreatingEvent(true);
    setError(null);
    try {
      const eventId = uuidv4();

      // Format dates to ISO 8601 with timezone (e.g., "2025-12-15T10:00:00+00:00")
      // Use dayjs format to avoid milliseconds which the backend doesn't accept
      const startAtISO = dayjs(values.startAt).utc().format("YYYY-MM-DDTHH:mm:ss") + "+00:00";
      const endAtISO = dayjs(values.endAt).utc().format("YYYY-MM-DDTHH:mm:ss") + "+00:00";

      // Prepare payload for backoffice endpoint
      const payload = {
        name: values.name,
        description: values.description,
        gameId: values.gameId,
        type: values.type,
        startAt: startAtISO,
        endAt: endAtISO,
        image: values.image, // Already base64 from form
      };

      // Create event using backoffice endpoint
      const result = await backofficeService.createOrUpdateEvent(eventId, payload);

      if (result.ok) {
        await loadEvents();
        setCreateDialogOpen(false);
        setImagePreview(null);
        setImageFile(null);
      } else {
        setError(result.errorMessage || t("errorCreating"));
      }
    } catch (err: any) {
      setError(err?.message || t("errorCreating"));
    } finally {
      setCreatingEvent(false);
    }
  };

  const initialValues: EventFormValues = {
    name: "",
    description: "",
    gameId: "",
    type: "presencial",
    startAt: dayjs().add(1, "day").toISOString(),
    endAt: dayjs().add(2, "days").toISOString(),
    image: "",
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
            {t("create")}
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
              onChange={(e) => {
                setSearchName(e.target.value);
                setPage(0); // Reset to first page when searching
              }}
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
                      {t("event")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("game")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("type")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("dates")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {tCommon("actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ color: "rgba(255,255,255,0.7)", py: 4 }}
                      >
                        {t("noEventsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => {
                      const imageUrl = event.image
                        ? event.image.startsWith("http") || event.image.startsWith("data:")
                          ? event.image
                          : `https://api.jugaenequipo.com/storage/${event.image}`
                        : null;

                      return (
                        <TableRow
                          key={event.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row" sx={{ color: "white" }}>
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
                                  {event.name?.[0]?.toUpperCase() || "E"}
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
                                  {event.name?.[0]?.toUpperCase() || "E"}
                                </Avatar>
                              )}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight="bold">
                                  {event.name}
                                </Typography>
                                {event.description && (
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
                                    {event.description}
                                  </Typography>
                                )}
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
                              <SportsEsports
                                sx={{
                                  fontSize: 16,
                                  color: "rgba(255,255,255,0.7)",
                                }}
                              />
                              <Typography variant="body2">{event.game}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            <Typography variant="body2">{event.type}</Typography>
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
                                  {formatDate(event.date, {
                                    includeTime: true,
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => openDeleteDialog(event)}
                              sx={{ color: colors.error }}
                            >
                              <DeleteIcon />
                            </IconButton>
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

        {/* Dialog para crear evento */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            setImagePreview(null);
            setImageFile(null);
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: "linear-gradient(135deg, #2D3436 0%, #1A1A2E 100%)",
              border: "1px solid rgba(108, 92, 231, 0.3)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #6C5CE7 0%, #5B4BCF 100%)",
              color: "#fff",
              fontWeight: "bold",
              py: 2,
            }}
          >
            {t("create")}
          </DialogTitle>
          <DialogContent sx={{ background: "#2D3436", pt: 3 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setFieldValue }) => {
                // If image was selected, convert it to base64
                if (imageFile) {
                  try {
                    const base64 = await fileToBase64(imageFile);
                    setFieldValue("image", base64);
                    // Wait a bit for the field to update
                    await new Promise((resolve) => setTimeout(resolve, 100));
                  } catch (err) {
                    setError(t("errorImageConversion"));
                    return;
                  }
                }
                await handleCreateEvent({ ...values, image: values.image || imagePreview || "" });
              }}
            >
              {({ setFieldValue, values, isValid, isSubmitting }) => {
                // Update image field when imagePreview changes
                useEffect(() => {
                  if (imagePreview) {
                    setFieldValue("image", imagePreview);
                  }
                }, [imagePreview, setFieldValue]);

                return (
                  <Form>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <MyTextInput
                        name="name"
                        label={t("name")}
                        placeholder={t("namePlaceholder")}
                        fullWidth
                        whiteText={true}
                      />
                      <MyTextInput
                        name="description"
                        label={t("description")}
                        placeholder={t("descriptionPlaceholder")}
                        multiline
                        rows={4}
                        fullWidth
                        whiteText={true}
                      />
                      <MySelect
                        name="gameId"
                        label={t("game")}
                        fullWidth
                        whiteText={true}
                      >
                        {games.map((game) => (
                          <MenuItem key={game.id} value={game.id}>
                            {game.name}
                          </MenuItem>
                        ))}
                      </MySelect>
                      <MySelect
                        name="type"
                        label={t("type")}
                        fullWidth
                        whiteText={true}
                      >
                        <MenuItem value="presencial">{t("presencial")}</MenuItem>
                        <MenuItem value="online">{t("online")}</MenuItem>
                      </MySelect>
                      <MyDateTimePicker
                        name="startAt"
                        label={t("startAt")}
                        minDateTime={dayjs()}
                        fullWidth
                        whiteText={true}
                      />
                      <MyDateTimePicker
                        name="endAt"
                        label={t("endAt")}
                        minDateTime={dayjs(values.startAt)}
                        fullWidth
                        whiteText={true}
                      />
                      <Box>
                        <InputLabel sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                          {t("image")}
                        </InputLabel>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const base64 = await fileToBase64(file);
                              setImagePreview(base64);
                              setImageFile(file);
                              setFieldValue("image", base64);
                            } catch (err) {
                              console.error("Error converting image to base64:", err);
                              setError(t("errorImageConversion"));
                            }
                          }}
                          style={{ display: "none" }}
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<ImageIcon />}
                            sx={{
                              color: "#6C5CE7",
                              borderColor: "rgba(108, 92, 231, 0.5)",
                              bgcolor: "rgba(108, 92, 231, 0.1)",
                              "&:hover": {
                                borderColor: "#6C5CE7",
                                bgcolor: "rgba(108, 92, 231, 0.2)",
                                color: "#fff",
                              },
                            }}
                          >
                            {t("uploadImage")}
                          </Button>
                        </label>
                        {imagePreview && (
                          <Box sx={{ mt: 2 }}>
                            <Avatar
                              variant="rounded"
                              src={imagePreview}
                              sx={{ width: 200, height: 200 }}
                            />
                          </Box>
                        )}
                      </Box>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={creatingEvent || isSubmitting || !isValid}
                        sx={{
                          background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #5B4BCF 0%, #00B8B1 100%)",
                          },
                          "&:disabled": {
                            background: "rgba(108, 92, 231, 0.3)",
                            color: "rgba(255, 255, 255, 0.5)",
                          },
                          mt: 2,
                        }}
                      >
                        {creatingEvent || isSubmitting ? t("creating") : t("create")}
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
          <DialogActions sx={{ background: "#2D3436", p: 2, gap: 1 }}>
            <Button
              onClick={() => {
                setCreateDialogOpen(false);
                setImagePreview(null);
                setImageFile(null);
              }}
              sx={{
                color: "rgba(255,255,255,0.7)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                },
              }}
              disabled={creatingEvent}
            >
              {tCommon("cancel")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para eliminar evento */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedEvent(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ background: "#2D3436", color: "#fff" }}>
            {t("delete")}
          </DialogTitle>
          <DialogContent sx={{ background: "#2D3436", pt: 3 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
              {t("deleteConfirmation")}: {selectedEvent?.name}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ background: "#2D3436", p: 2 }}>
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedEvent(null);
              }}
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleDeleteEvent}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #E17055 0%, #D63031 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #D63031 0%, #C0392B 100%)",
                },
              }}
            >
              {t("delete")}
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

