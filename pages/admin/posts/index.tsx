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
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import {
  Block as BlockIcon,
  CheckCircle as CheckIcon,
  Search,
  Email,
  Favorite,
  Comment,
  CalendarToday,
  Info,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../../layouts";
import { formatDate } from "../../../utils/formatDate";
import {
  backofficeService,
  type Post,
  type DisablePostPayload,
} from "../../../services/backoffice.service";
import { useTranslations } from "next-intl";
import type { GetStaticPropsContext } from "next";

const colors = {
  primary: "#6C5CE7",
  secondary: "#2D3436",
  paperBg: "#2D3436",
  warning: "#FDCB6E",
  error: "#E17055",
  success: "#00B894",
};

export default function PostsModeration() {
  const t = useTranslations("Admin.posts");
  const tCommon = useTranslations("Admin.common");

  const disableReasons: { value: DisablePostPayload["reason"]; label: string }[] =
    [
      { value: "inappropriate_content", label: t("inappropriate_content") },
      { value: "spam", label: t("spam") },
      { value: "harassment", label: t("harassment") },
      { value: "hate_speech", label: t("hate_speech") },
      { value: "violence", label: t("violence") },
      { value: "sexual_content", label: t("sexual_content") },
      { value: "misinformation", label: t("misinformation") },
      { value: "copyright_violation", label: t("copyright_violation") },
    ];
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchPostId, setSearchPostId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDisabled, setFilterDisabled] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [disableReason, setDisableReason] = useState<
    DisablePostPayload["reason"]
  >("inappropriate_content");

  useEffect(() => {
    loadPosts();
  }, [
    page,
    rowsPerPage,
    filterDisabled,
    searchEmail,
    searchUsername,
    searchPostId,
    searchUserId,
    searchQuery,
  ]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
      };

      if (searchEmail) params.email = searchEmail;
      if (searchUsername) params.username = searchUsername;
      if (searchPostId) params.postId = searchPostId;
      if (searchUserId) params.userId = searchUserId;
      if (searchQuery) params.q = searchQuery;
      if (filterDisabled !== "all") {
        params.disabled = filterDisabled === "disabled";
      }

      const result = await backofficeService.searchPosts(params);
      if (result.ok && result.data) {
        setPosts(result.data.data || []);
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

  const handleDisablePost = async () => {
    if (!selectedPost) return;

    try {
      const result = await backofficeService.disablePost(
        selectedPost.id,
        disableReason
      );
      if (result.ok) {
        await loadPosts();
        setDisableDialogOpen(false);
        setSelectedPost(null);
      } else {
        setError(
          result.ok === false
            ? result.errorMessage
            : "Error al deshabilitar post"
        );
      }
    } catch (err: any) {
      setError(err?.message || "Error al deshabilitar post");
    }
  };

  const handleEnablePost = async (postId: string) => {
    try {
      const result = await backofficeService.enablePost(postId);
      if (result.ok) {
        await loadPosts();
      } else {
        setError(
          result.ok === false ? result.errorMessage : "Error al habilitar post"
        );
      }
    } catch (err: any) {
      setError(err?.message || "Error al habilitar post");
    }
  };

  const openDisableDialog = (post: Post) => {
    setSelectedPost(post);
    setDisableReason("inappropriate_content");
    setDisableDialogOpen(true);
  };

  return (
    <AdminLayout title={t("title")}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff" }}>
            {t("title")}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, bgcolor: colors.paperBg, mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              placeholder={t("searchEmail")}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
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
            <TextField
              placeholder={t("searchUsername")}
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
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
              placeholder={t("searchPostId")}
              value={searchPostId}
              onChange={(e) => setSearchPostId(e.target.value)}
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
              placeholder={t("searchUserId")}
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
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
              placeholder={t("searchQuery")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                {t("filterDisabled")}
              </InputLabel>
              <Select
                value={filterDisabled}
                onChange={(e) => {
                  setFilterDisabled(e.target.value);
                  setPage(0);
                }}
                label={t("filterDisabled")}
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
                      {t("user")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("content")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("statistics")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("date")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("status")}
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)" }}>
                      {t("actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                        sx={{ color: "rgba(255,255,255,0.7)", py: 4 }}
                      >
                        {t("noPostsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow
                        key={post.id}
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
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: "#6C5CE7",
                                }}
                              >
                                {post.username?.[0]?.toUpperCase() || "P"}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {post.username}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.25,
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
                                    {post.userEmail}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "white", maxWidth: 350 }}>
                          <Typography
                            variant="body2"
                            sx={{ wordBreak: "break-word" }}
                          >
                            {post.body}
                          </Typography>
                          {post.moderationReason && (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1,
                                bgcolor: "rgba(225, 112, 85, 0.1)",
                                borderRadius: 1,
                                borderLeft: "3px solid #E17055",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  mb: 0.5,
                                }}
                              >
                                <Info
                                  sx={{ fontSize: 14, color: "#E17055" }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#E17055", fontWeight: 600 }}
                                >
                                  {t("moderationReason")}:
                                </Typography>
                              </Box>
                              <Typography
                                variant="caption"
                                sx={{ color: "rgba(255,255,255,0.8)" }}
                              >
                                {post.moderationReason}
                              </Typography>
                              {post.disabledAt && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "rgba(255,255,255,0.5)",
                                    display: "block",
                                    mt: 0.5,
                                  }}
                                >
                                  {t("disabledAt")}: {formatDate(post.disabledAt, { includeTime: true })}
                                </Typography>
                              )}
                            </Box>
                          )}
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
                              <Favorite
                                sx={{
                                  fontSize: 16,
                                  color: "rgba(255,255,255,0.7)",
                                }}
                              />
                              <Typography variant="body2">
                                {post.likesCount}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Comment
                                sx={{
                                  fontSize: 16,
                                  color: "rgba(255,255,255,0.7)",
                                }}
                              />
                              <Typography variant="body2">
                                {post.commentsCount}
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
                              {formatDate(post.createdAt, {
                                includeTime: true,
                              })}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          <Chip
                            label={post.disabled ? t("disabled") : tCommon("active")}
                            size="small"
                            sx={{
                              bgcolor: post.disabled
                                ? "rgba(225, 112, 85, 0.2)"
                                : "rgba(0, 184, 148, 0.2)",
                              color: post.disabled
                                ? colors.error
                                : colors.success,
                              fontWeight: "bold",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {post.disabled ? (
                              <Tooltip title={t("enable")}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEnablePost(post.id)}
                                  sx={{ color: colors.success }}
                                >
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title={t("disable")}>
                                <IconButton
                                  size="small"
                                  onClick={() => openDisableDialog(post)}
                                  sx={{ color: colors.error }}
                                >
                                  <BlockIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
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

        <Dialog
          open={disableDialogOpen}
          onClose={() => {
            setDisableDialogOpen(false);
            setSelectedPost(null);
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
                {t("user")}: {selectedPost?.username}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  p: 2,
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                }}
              >
                {selectedPost?.body}
              </Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                {t("disableReason")}
              </InputLabel>
              <Select
                value={disableReason}
                onChange={(e) =>
                  setDisableReason(
                    e.target.value as DisablePostPayload["reason"]
                  )
                }
                label={t("disableReason")}
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
                setSelectedPost(null);
              }}
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleDisablePost}
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
