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
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
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

        <List sx={{ p: 0 }}>
          {requests.map((request) => {
            const user = users[request.userId];
            const isProcessing = processingIds.has(request.id);

            return (
              <ListItem
                key={request.id}
                sx={{
                  bgcolor: theme.palette.background.default,
                  borderRadius: { xs: 1.5, md: 2 },
                  mb: { xs: 1.5, md: 2 },
                  p: { xs: 1.5, sm: 2 },
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
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: { xs: "100%", sm: "auto" },
                    mb: { xs: 1.5, sm: 0 },
                    flex: { sm: 1 },
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      minWidth: { xs: 48, sm: 56 },
                      mr: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <Avatar
                      src={user?.profileImage}
                      alt={user?.username || user?.nickname || "User"}
                      sx={{
                        width: { xs: 48, sm: 56 },
                        height: { xs: 48, sm: 56 },
                        border: {
                          xs: `2px solid ${theme.palette.primary.main}`,
                          sm: `2px solid ${theme.palette.primary.main}`,
                        },
                        cursor: "pointer",
                        transition: "all 0.2s ease",
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
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      mr: { xs: 0, sm: 2 },
                    }}
                    primary={
                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          fontSize: { xs: "0.95rem", sm: "1rem" },
                          cursor: "pointer",
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
                    }
                    secondary={
                      request.createdAt && (
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: "0.75rem", sm: "0.85rem" },
                            mt: 0.5,
                          }}
                        >
                          {new Date(request.createdAt).toLocaleDateString()}
                        </Typography>
                      )
                    }
                  />
                </Box>
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 1.5 }}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: { xs: "flex-end", sm: "flex-start" },
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
                        display: { xs: "flex", sm: "none" },
                      }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleAccept(request.id)}
                    disabled={isProcessing}
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      minWidth: { sm: 100 },
                    }}
                  >
                    {t("accept")}
                  </Button>
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
                        display: { xs: "flex", sm: "none" },
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={() => handleReject(request.id)}
                    disabled={isProcessing}
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      minWidth: { sm: 100 },
                    }}
                  >
                    {t("reject")}
                  </Button>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};
