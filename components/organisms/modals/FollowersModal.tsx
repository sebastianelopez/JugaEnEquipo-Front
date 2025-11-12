import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { User } from "../../../interfaces";
import { userService } from "../../../services/user.service";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { formatFullName } from "../../../utils/textFormatting";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "followings";
  title?: string;
}

export const FollowersModal = ({
  open,
  onClose,
  userId,
  type,
  title,
}: Props) => {
  const t = useTranslations("Profile");
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && userId) {
      loadUsers();
    } else {
      setUsers([]);
      setError(null);
    }
  }, [open, userId, type]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: User[];
      if (type === "followers") {
        data = await userService.getUserFollowers(userId);
      } else {
        data = await userService.getUserFollowings(userId);
      }
      setUsers(data || []);
    } catch (err: any) {
      console.error(`Error loading ${type}:`, err);
      setError(err?.message || `Failed to load ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
    onClose();
  };

  const displayTitle = title || (type === "followers" ? t("followers") : t("followings"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {displayTitle}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
            p={3}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : users.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
            p={3}
          >
            <Typography color="text.secondary">
              {type === "followers" ? t("noFollowers") : t("noFollowings")}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {users.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleUserClick(user.username)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                  gap: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={user.profileImage}
                    alt={user.username}
                    sx={{ width: 56, height: 56 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {user.username}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {formatFullName(user.firstname, user.lastname)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

