import {
  Avatar,
  Badge,
  IconButton,
  ListItemAvatar,
  ListItemText,
  alpha,
  useTheme,
} from "@mui/material";
import { useState, useContext, useEffect, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Menu, MenuItem } from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { NotificationContext } from "../../context/notification";
import { renderNotificationMessage } from "../../utils/notificationUtils";
import { NotificationType } from "../../interfaces/notification";
import { formatTimeElapsed } from "../../utils/formatTimeElapsed";
import { useTimeTranslations } from "../../hooks/useTimeTranslations";

interface Props {}

export const NotificationsButton = ({}: Props) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hasMarkedAsReadRef = useRef(false);
  const t = useTranslations();
  const router = useRouter();
  const theme = useTheme();
  const timeTranslations = useTimeTranslations();

  const { notifications, unreadCount, markAsRead, refreshNotifications } =
    useContext(NotificationContext);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setPressed(true);
    hasMarkedAsReadRef.current = false;
    await refreshNotifications();
  };

  useEffect(() => {
    if (anchorEl && !hasMarkedAsReadRef.current) {
      const unreadNotifications = notifications.filter(
        (n) => n.read === undefined || !n.read
      );

      if (unreadNotifications.length > 0) {
        hasMarkedAsReadRef.current = true;

        Promise.all(
          unreadNotifications.map((notification) => markAsRead(notification.id))
        ).catch((error) => {
          console.error("Error marking notifications as read:", error);
        });
      }
    }
  }, [anchorEl, notifications, markAsRead]);

  const handleClose = () => {
    setAnchorEl(null);
    setPressed(false);
  };

  const handleNotificationClick = async (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification) {
      handleClose();
      return;
    }

    if (notification.read === undefined || !notification.read) {
      await markAsRead(id);
    }

    const postTypes: NotificationType[] = [
      "post_liked",
      "post_shared",
      "post_commented",
      "user_mentioned",
    ];

    if (postTypes.includes(notification.type) && notification.postId) {
      router.push(`/post/${notification.postId}`);
    } else if (notification.type === "new_follower") {
      router.push(`/profile/${notification.username}`);
    } else if (notification.type === "team_request_received" && notification.teamId) {
      router.push(`/teams/${notification.teamId}`);
    } else if (notification.type === "tournament_request_received" && notification.tournamentId) {
      router.push(`/tournaments/${notification.tournamentId}`);
    }

    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="notifications"
        aria-pressed={pressed}
        onClick={handleClick}
      >
        <Badge
          badgeContent={unreadCount}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#ffa599",
              color: "black",
            },
          }}
          invisible={unreadCount === 0}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        sx={{
          "& .MuiPaper-root": {
            width: "auto",
            minWidth: 280,
            maxWidth: "min(95vw, 400px)",
          },
          "& .MuiMenu-list": {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {notifications.filter((n) => n.type !== "post_moderated").length === 0 ? (
          <MenuItem onClick={handleClose}>
            {t("Notifications.noNotifications")}
          </MenuItem>
        ) : (
          notifications
            .filter((n) => n.type !== "post_moderated")
            .map((notification) => {
            const isRead =
              notification.read === undefined ? false : notification.read;

            return (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                sx={{
                  backgroundColor: isRead
                    ? "inherit"
                    : alpha(theme.palette.primary.main, 0.15),
                  whiteSpace: "normal",
                  width: "100%",
                  display: "flex",
                  "&:hover": {
                    backgroundColor: isRead
                      ? alpha(theme.palette.action.hover, 0.5)
                      : alpha(theme.palette.primary.main, 0.12),
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={notification.username}
                    src="/images/user-placeholder.png"
                  >
                    {notification.username?.[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  id={notification.id}
                  primary={renderNotificationMessage(
                    notification.type,
                    notification.username,
                    notification.message,
                    t,
                    isRead
                  )}
                  secondary={formatTimeElapsed(
                    new Date(notification.date),
                    timeTranslations
                  )}
                  slotProps={{
                    primary: {
                      style: {
                        width: "100%",
                      },
                    },
                  }}
                  sx={{ flex: 1 }}
                />
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
};
