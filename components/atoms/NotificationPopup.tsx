import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Snackbar,
  Alert,
  Box,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { NotificationContext } from "../../context/notification";
import { Notification, NotificationType } from "../../interfaces/notification";
import { renderNotificationMessage } from "../../utils/notificationUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export const NotificationPopup: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { notifications, isLoading, removeNotification } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] =
    useState<Notification | null>(null);
  const previousNotificationsRef = useRef<Notification[]>([]);
  const notificationsLoadedRef = useRef(false);
  const t = useTranslations();
  const router = useRouter();

  useEffect(() => {
    if (
      notifications.length === 0 &&
      previousNotificationsRef.current.length > 0
    ) {
      notificationsLoadedRef.current = false;
      previousNotificationsRef.current = [];
      setOpen(false);
      setCurrentNotification(null);
    }
  }, [notifications]);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    if (isLoading) {
      notificationsLoadedRef.current = false;
      return;
    }

    if (!notificationsLoadedRef.current && !isLoading) {
      notificationsLoadedRef.current = true;
      previousNotificationsRef.current = [...notifications];
      return;
    }

    if (notificationsLoadedRef.current && notifications.length > 0) {
      const previousIds = new Set(
        previousNotificationsRef.current.map((n) => n.id)
      );

      // Filter out new_message notifications - post_moderated should show in snackbar
      const newNotification = notifications.find(
        (n) => 
          n.type !== "new_message" &&
          (n.read === undefined || !n.read) && 
          !previousIds.has(n.id)
      );

      if (newNotification) {
        setCurrentNotification(newNotification);
        setOpen(true);
      }
    }

    previousNotificationsRef.current = [...notifications];
  }, [notifications, isDesktop, isLoading]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);

    // Remove post_moderated notifications immediately when snackbar closes
    if (currentNotification?.type === "post_moderated") {
      removeNotification(currentNotification.id);
    }

    setTimeout(() => {
      setCurrentNotification(null);
    }, 300);
  };

  const handleNotificationClick = () => {
    if (!currentNotification) return;

    const postTypes: NotificationType[] = [
      "post_liked",
      "post_shared",
      "post_commented",
    ];

    if (
      postTypes.includes(currentNotification.type) &&
      currentNotification.postId
    ) {
      router.push(`/post/${currentNotification.postId}`);
    } else if (currentNotification.type === "new_follower") {
      router.push(`/profile/${currentNotification.username}`);
    } else if (
      (currentNotification.type === "team_request_received" ||
        currentNotification.type === "team_request_accepted") &&
      currentNotification.teamId
    ) {
      router.push(`/teams/${currentNotification.teamId}`);
    } else if (
      (currentNotification.type === "tournament_request_received" ||
        currentNotification.type === "tournament_request_accepted") &&
      currentNotification.tournamentId
    ) {
      router.push(`/tournaments/${currentNotification.tournamentId}`);
    }

    handleClose();
  };

  if (!currentNotification) {
    return null;
  }

  const isRead =
    currentNotification.read === undefined ? false : currentNotification.read;

  const isPostModerated = currentNotification.type === "post_moderated";
  const autoHideDuration = isPostModerated ? 12000 : 5000; // 12 seconds for post_moderated, 5 seconds for others

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={isPostModerated ? "error" : "info"}
        icon={false}
        sx={{
          minWidth: 320,
          maxWidth: 400,
          width: "100%",
          cursor: "pointer",
          backgroundColor: isPostModerated 
            ? theme.palette.mode === "dark" 
              ? "rgba(211, 47, 47, 0.15)" // Dark red background for dark mode
              : "rgba(244, 67, 54, 0.1)" // Light red background for light mode
            : theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: isPostModerated
            ? `1px solid ${theme.palette.error.main}`
            : `1px solid ${theme.palette.primary.main}`,
          boxShadow: theme.shadows[4],
          "&:hover": {
            backgroundColor: isPostModerated
              ? theme.palette.mode === "dark"
                ? "rgba(211, 47, 47, 0.25)"
                : "rgba(244, 67, 54, 0.15)"
              : theme.palette.action.hover,
          },
          "& .MuiAlert-message": {
            width: "100%",
            padding: 0,
            color: theme.palette.text.primary,
          },
          "& .MuiAlert-action": {
            padding: 0,
            marginRight: 0,
            color: theme.palette.text.primary,
          },
        }}
        onClick={handleNotificationClick}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            sx={{ padding: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            padding: 1,
            width: "100%",
            color: theme.palette.text.primary,
          }}
        >
          {currentNotification.type !== "post_moderated" && (
            <Avatar
              alt={currentNotification.username}
              src={currentNotification.profileImage || "/images/user-placeholder.png"}
              sx={{ width: 40, height: 40 }}
            >
              {currentNotification.username?.[0]?.toUpperCase()}
            </Avatar>
          )}
          <Box sx={{ flex: 1, minWidth: 0, color: theme.palette.text.primary }}>
            {renderNotificationMessage(
              currentNotification.type,
              currentNotification.username,
              currentNotification.message,
              t,
              isRead
            )}
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};
