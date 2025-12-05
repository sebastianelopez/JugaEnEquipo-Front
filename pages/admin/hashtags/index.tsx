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
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Tag as TagIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  CheckCircle as CheckIcon,
  CalendarToday,
  Numbers,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import { formatDate } from "../../../utils/formatDate";
import {
  backofficeService,
  type Hashtag,
  type DisableReason,
} from "../../../services/backoffice.service";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  accent: "#00CEC9",
  error: "#E17055",
  success: "#00B894",
};

export default function HashtagsModeration() {
  const t = useTranslations("Admin.hashtags");
  const tCommon = useTranslations("Admin.common");

  const disableReasons: { value: DisableReason; label: string }[] = [
    { value: "inappropriate_content", label: tCommon("inappropriate_content") },
    { value: "spam", label: tCommon("spam") },
    { value: "harassment", label: tCommon("harassment") },
    { value: "hate_speech", label: tCommon("hate_speech") },
    { value: "violence", label: tCommon("violence") },
    { value: "sexual_content", label: tCommon("sexual_content") },
    { value: "misinformation", label: tCommon("misinformation") },
    { value: "copyright_violation", label: tCommon("copyright_violation") },
  ];

  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState("");
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [selectedHashtag, setSelectedHashtag] = useState<Hashtag | null>(null);
  const [disableReason, setDisableReason] = useState<DisableReason>(
    "inappropriate_content"
  );

  useEffect(() => {
    loadHashtags();
  }, [searchTag]);

  const loadHashtags = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (searchTag) {
        params.tag = searchTag;
      }

      const result = await backofficeService.searchHashtags(params);
      if (result.ok && result.data) {
        // result.data has { data: Hashtag[], metadata: SearchMetadata }
        setHashtags(result.data.data || []);
      } else {
        setError(result.ok === false ? result.errorMessage : t("errorLoading"));
      }
    } catch (err: any) {
      setError(err?.message || t("errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleEnableHashtag = async (hashtagId: string) => {
    try {
      const result = await backofficeService.enableHashtag(hashtagId);
      if (result.ok) {
        await loadHashtags();
      } else {
        setError(
          result.ok === false
            ? result.errorMessage
            : "Error al habilitar hashtag"
        );
      }
    } catch (err: any) {
      setError(err?.message || "Error al habilitar hashtag");
    }
  };

  const handleDisableHashtag = async () => {
    if (!selectedHashtag) return;

    try {
      const result = await backofficeService.disableHashtag(
        selectedHashtag.id,
        disableReason
      );
      if (result.ok) {
        await loadHashtags();
        setDisableDialogOpen(false);
        setSelectedHashtag(null);
      } else {
        setError(
          result.ok === false
            ? result.errorMessage
            : "Error al deshabilitar hashtag"
        );
      }
    } catch (err: any) {
      setError(err?.message || "Error al deshabilitar hashtag");
    }
  };

  const openDisableDialog = (hashtag: Hashtag) => {
    setSelectedHashtag(hashtag);
    setDisableReason("inappropriate_content");
    setDisableDialogOpen(true);
  };

  const disabledHashtags = hashtags.filter((h) => h.disabled);
  const enabledHashtags = hashtags.filter((h) => !h.disabled);

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

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Paper sx={{ p: 3, bgcolor: colors.paperBg, color: "white" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <TagIcon sx={{ color: colors.accent, mr: 1 }} />
                <Typography variant="h6">{t("active")}</Typography>
              </Box>

              <TextField
                fullWidth
                placeholder={t("searchTag")}
                variant="outlined"
                size="small"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
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

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {enabledHashtags.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "center",
                        py: 2,
                      }}
                    >
                      {t("noHashtagsFound")}
                    </Typography>
                  ) : (
                    enabledHashtags.map((item) => (
                      <ListItem
                        key={item.id}
                        secondaryAction={
                          <Tooltip title={t("disable")}>
                            <IconButton
                              edge="end"
                              aria-label="block"
                              onClick={() => openDisableDialog(item)}
                              sx={{ color: colors.error }}
                            >
                              <BlockIcon />
                            </IconButton>
                          </Tooltip>
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
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                sx={{ color: "#fff", fontWeight: 500 }}
                              >
                                #{item.tag}
                              </Typography>
                              <Chip
                                label={`${item.count} ${t("usage")}`}
                                size="small"
                                icon={<Numbers sx={{ fontSize: 12 }} />}
                                sx={{
                                  bgcolor: "rgba(108, 92, 231, 0.2)",
                                  color: colors.primary,
                                  fontSize: "0.7rem",
                                  height: 20,
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                                mt: 0.5,
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
                                <Typography
                                  variant="caption"
                                  sx={{ color: "rgba(255,255,255,0.5)" }}
                                >
                                  {t("createdAt")}:{" "}
                                  {formatDate(item.createdAt, {
                                    includeTime: true,
                                  })}
                                </Typography>
                              </Box>
                              {item.updatedAt !== item.createdAt && (
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
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "rgba(255,255,255,0.5)" }}
                                  >
                                    {t("updatedAt")}:{" "}
                                    {formatDate(item.updatedAt, {
                                      includeTime: true,
                                    })}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <Paper sx={{ p: 3, bgcolor: colors.paperBg, color: "white" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <BlockIcon sx={{ color: colors.error, mr: 1 }} />
                <Typography variant="h6">{t("blocked")}</Typography>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {disabledHashtags.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "center",
                        py: 2,
                      }}
                    >
                      {t("noHashtagsFound")}
                    </Typography>
                  ) : (
                    disabledHashtags.map((item) => (
                      <ListItem
                        key={item.id}
                        secondaryAction={
                          <Tooltip title={t("enable")}>
                            <IconButton
                              edge="end"
                              aria-label="enable"
                              onClick={() => handleEnableHashtag(item.id)}
                              sx={{ color: colors.success }}
                            >
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                        }
                        sx={{
                          bgcolor: "rgba(225, 112, 85, 0.1)",
                          mb: 1,
                          borderRadius: 1,
                          borderLeft: `4px solid ${colors.error}`,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(225, 112, 85, 0.2)",
                              color: colors.error,
                            }}
                          >
                            <TagIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                sx={{ color: "#fff", fontWeight: 500 }}
                              >
                                #{item.tag}
                              </Typography>
                              <Chip
                                label={`${item.count} ${t("usage")}`}
                                size="small"
                                icon={<Numbers sx={{ fontSize: 12 }} />}
                                sx={{
                                  bgcolor: "rgba(225, 112, 85, 0.2)",
                                  color: colors.error,
                                  fontSize: "0.7rem",
                                  height: 20,
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                                mt: 0.5,
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
                                <Typography
                                  variant="caption"
                                  sx={{ color: "rgba(255,255,255,0.5)" }}
                                >
                                  {t("createdAt")}:{" "}
                                  {formatDate(item.createdAt, {
                                    includeTime: true,
                                  })}
                                </Typography>
                              </Box>
                              {item.updatedAt !== item.createdAt && (
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
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "rgba(255,255,255,0.5)" }}
                                  >
                                    {t("updatedAt")}:{" "}
                                    {formatDate(item.updatedAt, {
                                      includeTime: true,
                                    })}
                                  </Typography>
                                </Box>
                              )}
                              {item.disabledAt && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
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
                                    {t("disabledAt")}:{" "}
                                    {formatDate(item.disabledAt, {
                                      includeTime: true,
                                    })}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Dialog
          open={disableDialogOpen}
          onClose={() => {
            setDisableDialogOpen(false);
            setSelectedHashtag(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ background: "#2D3436", color: "#fff" }}>
            {t("disable")}
          </DialogTitle>
          <DialogContent sx={{ background: "#2D3436", pt: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                Hashtag: #{selectedHashtag?.tag}
              </Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                {tCommon("disableReason")}
              </InputLabel>
              <Select
                value={disableReason}
                onChange={(e) =>
                  setDisableReason(e.target.value as DisableReason)
                }
                label={tCommon("disableReason")}
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.7)" },
                }}
              >
                {disableReasons.map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ background: "#2D3436", p: 2 }}>
            <Button
              onClick={() => {
                setDisableDialogOpen(false);
                setSelectedHashtag(null);
              }}
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleDisableHashtag}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5B4BCF 0%, #00B8B1 100%)",
                },
              }}
            >
              {t("disable")}
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
