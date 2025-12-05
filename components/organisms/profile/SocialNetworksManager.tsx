import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useFeedback } from "../../../hooks/useFeedback";
import { userService } from "../../../services/user.service";
import {
  SocialNetwork,
  UserSocialNetwork,
} from "../../../interfaces/socialNetwork";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

interface SocialNetworksManagerProps {
  userId: string;
  onUpdate?: () => void;
}

const getSocialNetworkIcon = (code: string) => {
  switch (code.toLowerCase()) {
    case "twitter":
      return <TwitterIcon />;
    case "instagram":
      return <InstagramIcon />;
    case "youtube":
      return <YouTubeIcon />;
    case "twitch":
      return <LiveTvIcon />;
    case "tiktok":
      return <MusicNoteIcon />;
    default:
      return null;
  }
};

const getSocialNetworkColor = (code: string, theme: any) => {
  switch (code.toLowerCase()) {
    case "twitter":
      return theme.palette.info.main;
    case "instagram":
      return "#E4405F";
    case "youtube":
      return theme.palette.error.main;
    case "twitch":
      return "#9146FF";
    case "tiktok":
      return "#000000";
    default:
      return theme.palette.primary.main;
  }
};

export const SocialNetworksManager = ({
  userId,
  onUpdate,
}: SocialNetworksManagerProps) => {
  const theme = useTheme();
  const t = useTranslations("Profile");
  const { showError, showSuccess } = useFeedback();

  const [availableNetworks, setAvailableNetworks] = useState<SocialNetwork[]>(
    []
  );
  const [userNetworks, setUserNetworks] = useState<UserSocialNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] =
    useState<UserSocialNetwork | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | null>(
    null
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [available, user] = await Promise.all([
        userService.searchAvailableSocialNetworks(true),
        userService.getUserSocialNetworks(userId),
      ]);
      setAvailableNetworks(available);

      const validNetworks = user.filter(
        (network) =>
          network &&
          network.id &&
          network.name &&
          network.code &&
          network.username
      );

      setUserNetworks(validNetworks);
    } catch (error) {
      console.error("Error loading social networks:", error);
      showError({
        title: t("errorLoadingSocialNetworks") || "Error",
        message:
          t("errorLoadingSocialNetworksMessage") ||
          "Failed to load social networks",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, t, showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddClick = () => {
    setSelectedNetwork(null);
    setNewUsername("");
    setAddDialogOpen(true);
  };

  const handleDeleteClick = (userNetwork: UserSocialNetwork) => {
    setNetworkToDelete(userNetwork);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedNetwork || !newUsername.trim()) {
      showError({
        title: t("validationError") || "Validation Error",
        message:
          t("pleaseSelectNetworkAndUsername") ||
          "Please select a network and enter a username",
      });
      return;
    }

    try {
      const result = await userService.addUserSocialNetwork(
        selectedNetwork.id,
        newUsername.trim()
      );
      if (result.ok) {
        showSuccess({
          title: t("socialNetworkAdded") || "Success",
          message:
            t("socialNetworkAddedMessage") ||
            "Social network added successfully",
        });
        await loadData();
        onUpdate?.();
        setAddDialogOpen(false);
        setSelectedNetwork(null);
        setNewUsername("");
      } else {
        showError({
          title: t("errorAddingSocialNetwork") || "Error",
          message:
            result.errorMessage ||
            t("errorAddingSocialNetworkMessage") ||
            "Failed to add social network",
        });
      }
    } catch (error) {
      console.error("Error saving social network:", error);
      showError({
        title: t("errorSavingSocialNetwork") || "Error",
        message:
          t("errorSavingSocialNetworkMessage") ||
          "An error occurred while saving",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!networkToDelete) return;

    try {
      const result = await userService.removeUserSocialNetwork(
        networkToDelete.id
      );
      if (result.ok) {
        showSuccess({
          title: t("socialNetworkRemoved") || "Success",
          message:
            t("socialNetworkRemovedMessage") ||
            "Social network removed successfully",
        });
        await loadData();
        onUpdate?.();
        setDeleteDialogOpen(false);
        setNetworkToDelete(null);
      } else {
        showError({
          title: t("errorRemovingSocialNetwork") || "Error",
          message:
            result.errorMessage ||
            t("errorRemovingSocialNetworkMessage") ||
            "Failed to remove social network",
        });
      }
    } catch (error) {
      console.error("Error removing social network:", error);
      showError({
        title: t("errorRemovingSocialNetwork") || "Error",
        message:
          t("errorRemovingSocialNetworkMessage") ||
          "An error occurred while removing",
      });
    }
  };

  const getAvailableNetworksToAdd = () => {
    const userNetworkSocialIds = userNetworks.map(
      (un) => un.socialNetworkId || un.id
    );
    return availableNetworks.filter(
      (network) => !userNetworkSocialIds.includes(network.id)
    );
  };

  const buildSocialNetworkUrl = (url: string, username: string) => {
    if (!url || !username) {
      return "#";
    }
    return url.replace("@", username);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("socialNetworks") || "Social Networks"}
        </Typography>
        {getAvailableNetworksToAdd().length > 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            size="small"
          >
            {t("addSocialNetwork") || "Add Network"}
          </Button>
        )}
      </Box>

      {userNetworks.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t("noSocialNetworks") ||
            "No social networks added yet. Click 'Add Network' to get started."}
        </Alert>
      ) : (
        <Stack spacing={1.5}>
          {userNetworks.map((userNetwork) => {
            const networkColor = getSocialNetworkColor(userNetwork.code, theme);
            const networkUrl =
              userNetwork.fullUrl ||
              buildSocialNetworkUrl(userNetwork.url, userNetwork.username);

            return (
              <Card
                key={userNetwork.id}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: theme.shadows[4],
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center" gap={1.5} flex={1}>
                      <Box
                        sx={{
                          color: networkColor,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {getSocialNetworkIcon(userNetwork.code)}
                      </Box>
                      <Box flex={1} minWidth={0}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          {userNetwork.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          @{userNetwork.username}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        size="small"
                        component="a"
                        href={networkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(userNetwork)}
                        sx={{
                          color: theme.palette.error.main,
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Add Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setSelectedNetwork(null);
          setNewUsername("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t("addSocialNetwork") || "Add Social Network"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label={t("selectNetwork") || "Select Network"}
              value={selectedNetwork?.id || ""}
              onChange={(e) => {
                const network = availableNetworks.find(
                  (n) => n.id === e.target.value
                );
                setSelectedNetwork(network || null);
              }}
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            >
              <option value="">
                {t("selectNetworkPlaceholder") || "-- Select a network --"}
              </option>
              {getAvailableNetworksToAdd().map((network) => (
                <option key={network.id} value={network.id}>
                  {network.name}
                </option>
              ))}
            </TextField>
            {selectedNetwork && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: alpha(
                    getSocialNetworkColor(selectedNetwork.code, theme),
                    0.1
                  ),
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    color: getSocialNetworkColor(selectedNetwork.code, theme),
                  }}
                >
                  {getSocialNetworkIcon(selectedNetwork.code)}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {selectedNetwork.url}
                </Typography>
              </Box>
            )}
            <TextField
              label={t("username") || "Username"}
              placeholder={t("enterUsername") || "Enter username"}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              fullWidth
              helperText={
                selectedNetwork
                  ? `${selectedNetwork.url}${newUsername || "{username}"}`
                  : undefined
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddDialogOpen(false);
              setSelectedNetwork(null);
              setNewUsername("");
            }}
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!selectedNetwork || !newUsername.trim()}
          >
            {t("save") || "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setNetworkToDelete(null);
        }}
      >
        <DialogTitle>{t("confirmDelete") || "Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("confirmDeleteSocialNetwork") ||
              `Are you sure you want to remove ${networkToDelete?.name}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setNetworkToDelete(null);
            }}
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {t("delete") || "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
