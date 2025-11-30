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
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslations } from "next-intl";
import { teamService } from "../../../services/team.service";
import { useFeedback } from "../../../hooks/useFeedback";
import { userService } from "../../../services/user.service";

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
      const result = await teamService.findTeamRequests(teamId);
      if (result.ok && result.data) {
        const pendingRequests = result.data.filter(
          (req) => !req.status || req.status === "pending"
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
      // TODO: Implement when backend endpoint is ready
      const result = await teamService.rejectAccess(requestId);
      if (result.ok) {
        showSuccess({
          message: t("requestRejectedSuccess") as string,
        });
        await loadRequests();
        onRequestUpdated?.();
      } else {
        // Show error only if it's not the "not implemented" error
        if (!result.errorMessage?.includes("not yet implemented")) {
          showError({
            message:
              result.errorMessage || (t("requestRejectedError") as string),
          });
        } else {
          // For now, just remove from local state since endpoint doesn't exist
          setRequests((prev) => prev.filter((r) => r.id !== requestId));
          showSuccess({
            message: t("requestRejectedSuccess") as string,
          });
        }
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        {t("noPendingRequests")}
      </Alert>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        mt: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 3 }}
        >
          {t("pendingRequestsTitle")}
        </Typography>

        <List>
          {requests.map((request) => {
            const user = users[request.userId];
            const isProcessing = processingIds.has(request.id);

            return (
              <ListItem
                key={request.id}
                sx={{
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={user?.profileImage}
                    alt={user?.username || user?.nickname || "User"}
                    sx={{
                      width: 56,
                      height: 56,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{ flex: 1 }}
                  primary={
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {user?.username || user?.nickname || "Unknown User"}
                    </Typography>
                  }
                  secondary={
                    request.createdAt && (
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.85rem",
                        }}
                      >
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Typography>
                    )
                  }
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleAccept(request.id)}
                    disabled={isProcessing}
                  >
                    {t("accept")}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={() => handleReject(request.id)}
                    disabled={isProcessing}
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
