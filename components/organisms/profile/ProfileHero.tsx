import {
  Box,
  Container,
  Stack,
  Avatar,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useRouter } from "next/router";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useContext } from "react";
import { userService } from "../../../services/user.service";
import { FollowersModal } from "../modals/FollowersModal";
import { MediaViewerModal } from "../modals/MediaViewerModal";
import { UserContext } from "../../../context/user/UserContext";

interface ProfileHeroProps {
  fullName: string;
  username: string;
  userId: string;
  avatarSrc?: string;
  bannerSrc?: string;
  regionLabel?: string;
  memberSinceLabel?: string;
  isOwnProfile?: boolean;
  initialIsFollowing?: boolean;
  onEditClick?: () => void;
  onMessageClick?: () => void;
  onFollowChange?: (isFollowing: boolean) => void;
}

export const ProfileHero = ({
  fullName,
  username,
  userId,
  avatarSrc,
  bannerSrc,
  regionLabel,
  memberSinceLabel,
  isOwnProfile = false,
  initialIsFollowing = false,
  onEditClick,
  onMessageClick,
  onFollowChange,
}: ProfileHeroProps) => {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations("Profile");
  const { user: currentUser } = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "followings">(
    "followers"
  );
  const [isCheckingFollowStatus, setIsCheckingFollowStatus] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);

  const bgGradient = `linear-gradient(to bottom, ${alpha(
    theme.palette.background.default,
    0.3
  )}, ${alpha(theme.palette.background.default, 0.9)})`;

  const loadCounts = useCallback(async () => {
    try {
      const [followers, followings] = await Promise.all([
        userService.getUserFollowers(userId),
        userService.getUserFollowings(userId),
      ]);
      setFollowersCount(Array.isArray(followers) ? followers.length : 0);
      setFollowingsCount(Array.isArray(followings) ? followings.length : 0);
    } catch (error) {
      console.error("Error loading counts");
    }
  }, [userId]);

  const checkFollowStatus = useCallback(async () => {
    if (isOwnProfile || !currentUser?.id) return;

    setIsCheckingFollowStatus(true);
    try {
      const followings = await userService.getUserFollowings(currentUser.id);

      if (Array.isArray(followings)) {
        const isCurrentlyFollowing = followings.some(
          (user) => user.id === userId
        );
        setIsFollowing(isCurrentlyFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status");
      setIsFollowing(initialIsFollowing);
    } finally {
      setIsCheckingFollowStatus(false);
    }
  }, [userId, isOwnProfile, currentUser?.id, initialIsFollowing]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  useEffect(() => {
    if (!isOwnProfile && currentUser?.id) {
      checkFollowStatus();
    }
  }, [checkFollowStatus, isOwnProfile, currentUser?.id]);

  const handleFollowClick = async () => {
    if (isLoading || isOwnProfile) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        console.log("Unfollowing user:", userId);
        const result = await userService.unfollowUser(userId);
        if (result.ok) {
          setIsFollowing(result.data.isFollowing);
          onFollowChange?.(result.data.isFollowing);
          // Reload counts
          loadCounts();
        } else {
          console.error("Error unfollowing user");
        }
      } else {
        const result = await userService.followUser(userId);
        if (result.ok) {
          setIsFollowing(result.data.isFollowing);
          onFollowChange?.(result.data.isFollowing);
          // Reload counts
          loadCounts();
        } else {
          console.error("Error following user");
        }
      }
    } catch (error) {
      console.error("Error toggling follow status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (type: "followers" | "followings") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    loadCounts();
  };

  const handleCloseMediaViewer = () => {
    setMediaViewerOpen(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 250, md: 350 },
        backgroundImage: `${bgGradient}, url(${bannerSrc || "/images.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          pb: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            color: theme.palette.text.primary,
            mb: { xs: 1.5, md: 2 },
            ":hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
          }}
        >
          {t("back")}
        </Button>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
        >
          <Avatar
            src={avatarSrc}
            alt={username}
            onClick={() => avatarSrc && setMediaViewerOpen(true)}
            sx={{
              width: { xs: 80, sm: 100, md: 140 },
              height: { xs: 80, sm: 100, md: 140 },
              border: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
              cursor: avatarSrc ? "pointer" : "default",
              alignSelf: { sm: "flex-start" },
              "&:hover": avatarSrc
                ? {
                    opacity: 0.9,
                    transform: "scale(1.02)",
                    transition: "all 0.2s ease-in-out",
                  }
                : {},
            }}
          />

          <Box sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: { xs: 0.5, md: 0 } }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.5rem" },
                  wordBreak: "break-word",
                }}
              >
                {fullName}
              </Typography>

              {isOwnProfile && (
                <IconButton
                  onClick={onEditClick}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    width: { xs: 32, md: 40 },
                    height: { xs: 32, md: 40 },
                    ":hover": {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  <EditIcon sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
                </IconButton>
              )}
            </Stack>

            <Typography
              sx={{
                color: theme.palette.info.main,
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                fontWeight: 600,
                mb: { xs: 0.5, md: 1 },
              }}
            >
              @{username}
            </Typography>

            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              flexWrap="wrap"
              gap={{ xs: 0.5, sm: 1 }}
              sx={{ mb: { xs: 1, md: 0 } }}
            >
              {regionLabel && (
                <Chip
                  icon={
                    <LocationOnIcon
                      sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    />
                  }
                  label={regionLabel}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    height: { xs: 24, md: 32 },
                  }}
                />
              )}
              {memberSinceLabel && (
                <Chip
                  icon={
                    <CalendarTodayIcon
                      sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                    />
                  }
                  label={memberSinceLabel}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    height: { xs: 24, md: 32 },
                  }}
                />
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 3 }}
              sx={{ mt: { xs: 1, md: 2 } }}
              flexWrap="wrap"
            >
              <Box
                onClick={() => handleOpenModal("followers")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  {followersCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: "uppercase",
                    fontSize: { xs: "0.65rem", md: "0.75rem" },
                  }}
                >
                  {t("followers")}
                </Typography>
              </Box>
              <Box
                onClick={() => handleOpenModal("followings")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontSize: { xs: "1rem", md: "1.25rem" },
                  }}
                >
                  {followingsCount}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: "uppercase",
                    fontSize: { xs: "0.65rem", md: "0.75rem" },
                  }}
                >
                  {t("followings")}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {!isOwnProfile && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ width: { xs: "100%", sm: "auto" }, mt: { xs: 2, sm: 0 } }}
            >
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                fullWidth={true}
                sx={{
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.2 },
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
                color="primary"
                onClick={handleFollowClick}
                disabled={isLoading || isCheckingFollowStatus}
              >
                {isLoading || isCheckingFollowStatus
                  ? t("loading")
                  : isFollowing
                  ? t("unfollowUser")
                  : t("followUser")}
              </Button>
              <Button
                variant="outlined"
                fullWidth={true}
                sx={{
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.2 },
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
                color="primary"
                onClick={onMessageClick}
              >
                {t("sendMessage")}
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>

      <FollowersModal
        open={modalOpen}
        onClose={handleCloseModal}
        userId={userId}
        type={modalType}
      />
      {avatarSrc && (
        <MediaViewerModal
          open={mediaViewerOpen}
          onClose={handleCloseMediaViewer}
          allMedia={[{ url: avatarSrc, type: "image" }]}
          initialIndex={0}
          ariaLabel="Profile image viewer"
        />
      )}
    </Box>
  );
};
