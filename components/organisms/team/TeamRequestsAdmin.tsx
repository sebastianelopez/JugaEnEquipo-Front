import { FC, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Stack,
  Avatar,
  Alert,
  CircularProgress,
  alpha,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslations } from "next-intl";
import { teamService } from "../../../services/team.service";
import { useFeedback } from "../../../hooks/useFeedback";
import { userService } from "../../../services/user.service";
import { useRouter } from "next/router";

interface TeamRequest {
  id: string;
  teamId: string;
  userId: string;
  status?: string;
  createdAt?: string;
}

interface User {
  id: string;
  username: string;
  nickname?: string;
  profileImage?: string;
}

interface Props {
  teamId: string;
  onRequestUpdated?: () => void;
}

export const TeamRequestsAdmin: FC<Props> = ({ teamId, onRequestUpdated }) => {
  const theme = useTheme();
  const router = useRouter();
  const t = useTranslations("TeamDetail");
  const { showSuccess, showError } = useFeedback();
  const [requests, setRequests] = useState<TeamRequest[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRequests();
  }, [teamId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const result = await teamService.findAllRequests(teamId);
      if (result.ok && result.data) {
        const pendingRequests = result.data.filter(
          (req: TeamRequest) => !req.status || req.status === "pending"
        );
        setRequests(pendingRequests);

        const usersMap: Record<string, User> = {};
        for (const req of pendingRequests) {
          try {
            const userResult = await userService.getUserById(req.userId);
            if (userResult) {
              usersMap[req.userId] = userResult;
            }
          } catch (err) {
            console.error(`Error loading user ${req.userId}:`, err);
          }
        }
        setUsers(usersMap);
      }
    } catch (err: any) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId));
      const result = await teamService.acceptAccess(requestId);
      if (result.ok) {
        showSuccess({
          message: t("requestAcceptedSuccess") as string,
        });
        await loadRequests();
        onRequestUpdated?.();
      } else {
        showError({
          message: result.errorMessage || (t("requestAcceptedError") as string),
        });
      }
    } catch (err: any) {
      showError({
        message: err?.message || (t("requestAcceptedError") as string),
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(requestId));
      const result = await teamService.rejectAccess(requestId);
      if (result.ok) {
        showSuccess({
          message: t("requestRejectedSuccess") as string,
        });
        await loadRequests();
        onRequestUpdated?.();
      } else {
        showError({
          message: result.errorMessage || (t("requestRejectedError") as string),
        });
      }
    } catch (err: any) {
      showError({
        message: err?.message || (t("requestRejectedError") as string),
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  if (loading) {
    return (
      <Card
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: { xs: 2, md: 3 },
          border: `1px solid ${theme.palette.divider}`,
          mt: { xs: 2, md: 3 },
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: { xs: 3, md: 4 },
            }}
          >
            <CircularProgress size={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card
        sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: { xs: 2, md: 3 },
          border: `1px solid ${theme.palette.divider}`,
          mt: { xs: 2, md: 3 },
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Alert
            severity="info"
            sx={{
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            {t("noPendingRequests")}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: { xs: 2, md: 3 },
        border: `1px solid ${theme.palette.divider}`,
        mt: { xs: 2, md: 3 },
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
          }}
        >
          {t("pendingRequestsTitle")}
        </Typography>

        <List sx={{ p: 0, width: "100%" }}>
          {requests.map((request) => {
            const user = users[request.userId];
            const isProcessing = processingIds.has(request.id);

            return (
              <ListItem
                key={request.id}
                disablePadding
                sx={{
                  mb: { xs: 1.5, md: 2 },
                  "&:last-child": {
                    mb: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: theme.palette.background.default,
                    borderRadius: { xs: 1.5, md: 2 },
                    p: { xs: 1.5, sm: 2, md: 2.5 },
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      transform: "translateX(4px)",
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  {/* User Info Section */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Avatar
                      src={user?.profileImage}
                      alt={user?.username || user?.nickname || "User"}
                      sx={{
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
                        border: `2px solid ${theme.palette.primary.main}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                        mr: { xs: 1.5, md: 2 },
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: `0 4px 12px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                        },
                      }}
                      onClick={() =>
                        user?.username && handleUserClick(user.username)
                      }
                    />
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          fontSize: { xs: "0.95rem", md: "1rem" },
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        }}
                        onClick={() =>
                          user?.username && handleUserClick(user.username)
                        }
                      >
                        {user?.username || user?.nickname || "Unknown User"}
                      </Typography>
                      {request.createdAt && (
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: "0.75rem", md: "0.85rem" },
                            mt: 0.5,
                          }}
                        >
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Actions Section */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Tooltip title={t("accept")}>
                      <IconButton
                        color="success"
                        onClick={() => handleAccept(request.id)}
                        disabled={isProcessing}
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          border: `1px solid ${alpha(
                            theme.palette.success.main,
                            0.3
                          )}`,
                          "&:hover": {
                            bgcolor: theme.palette.success.main,
                            color: theme.palette.getContrastText(
                              theme.palette.success.main
                            ),
                          },
                          width: 40,
                          height: 40,
                        }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t("reject")}>
                      <IconButton
                        color="error"
                        onClick={() => handleReject(request.id)}
                        disabled={isProcessing}
                        sx={{
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          border: `1px solid ${alpha(
                            theme.palette.error.main,
                            0.3
                          )}`,
                          "&:hover": {
                            bgcolor: theme.palette.error.main,
                            color: theme.palette.getContrastText(
                              theme.palette.error.main
                            ),
                          },
                          width: 40,
                          height: 40,
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};
