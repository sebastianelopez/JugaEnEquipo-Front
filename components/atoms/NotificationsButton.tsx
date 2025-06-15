import {
  Avatar,
  Badge,
  IconButton,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Menu, MenuItem } from "@mui/material";
import React from "react";

interface Props {
  notificationCount?: number;
}

export const NotificationsButton = ({ notificationCount = 0 }: Props) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadNotifications, setUnreadNotifications] =
    useState<number>(notificationCount);

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      avatar: "https://via.placeholder.com/40",
      message: "A usuario le ha gustado tu publicacion",
      read: false,
    },
    {
      id: "2",
      avatar: "https://via.placeholder.com/40",
      message:
        "Usuario te ha enviado una invitacion para unirte al team KruSports",
      read: false,
    },
    {
      id: "3",
      avatar: "https://via.placeholder.com/40",
      message: "A usuario le ha gustado tu publicacion",
      read: false,
    },
    {
      id: "4",
      avatar: "https://via.placeholder.com/40",
      message: "A usuario le ha gustado tu publicacion",
      read: true,
    },
    {
      id: "5",
      avatar: "https://via.placeholder.com/40",
      message: "A usuario le ha gustado tu publicacion",
      read: true,
    },
  ]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setUnreadNotifications(0);
    setAnchorEl(event.currentTarget);
    setPressed(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPressed(false);
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
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
          badgeContent={unreadNotifications}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#ffa599",
              color: "black",
            },
          }}
          invisible={unreadNotifications === 0}
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
        {notifications.length === 0 ? (
          <MenuItem onClick={handleClose}>No new notifications</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              sx={{
                backgroundColor: notification.read
                  ? "inherit"
                  : "rgba(255, 0, 0, 0.1)",
                whiteSpace: "normal",
                width: "100%",
                display: "flex",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar de team o usuario`}
                  src={notification.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                id={notification.id}
                primary={notification.message}
                slotProps={{
                  primary: {
                    style: {
                      width: "100%",
                      fontWeight: notification.read ? "normal" : "bold",
                    },
                  },
                }}
                sx={{ flex: 1 }}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};
