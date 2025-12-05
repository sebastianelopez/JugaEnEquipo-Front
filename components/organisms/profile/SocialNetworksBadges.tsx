import {
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useEffect, useState } from "react";
import { userService } from "../../../services/user.service";
import { UserSocialNetwork } from "../../../interfaces/socialNetwork";

interface SocialNetworksBadgesProps {
  userId: string;
  compact?: boolean;
  size?: "small" | "medium" | "large";
}

const getSocialNetworkIcon = (code: string, size: "small" | "medium" | "large" = "medium") => {
  const iconSize = size === "small" ? 18 : size === "medium" ? 24 : 32;
  const iconProps = { sx: { fontSize: iconSize } };
  
  switch (code.toLowerCase()) {
    case "twitter":
      return <TwitterIcon {...iconProps} />;
    case "instagram":
      return <InstagramIcon {...iconProps} />;
    case "youtube":
      return <YouTubeIcon {...iconProps} />;
    case "twitch":
      return <LiveTvIcon {...iconProps} />;
    case "tiktok":
      return <MusicNoteIcon {...iconProps} />;
    case "facebook":
      return <FacebookIcon {...iconProps} />;
    default:
      return null;
  }
};

const getSocialNetworkColor = (code: string, theme: any) => {
  switch (code.toLowerCase()) {
    case "twitter":
      return "#1DA1F2";
    case "instagram":
      return "#E4405F";
    case "youtube":
      return "#FF0000";
    case "twitch":
      return "#9146FF";
    case "tiktok":
      return "#000000";
    case "facebook":
      return "#1877F2";
    default:
      return theme.palette.primary.main;
  }
};

export const SocialNetworksBadges = ({
  userId,
  compact = false,
  size = "medium",
}: SocialNetworksBadgesProps) => {
  const theme = useTheme();
  const [userNetworks, setUserNetworks] = useState<UserSocialNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSocialNetworks = async () => {
      try {
        setLoading(true);
        const networks = await userService.getUserSocialNetworks(userId);
        const validNetworks = networks.filter(
          (network) =>
            network && network.id && network.name && network.code && network.username
        );
        setUserNetworks(validNetworks);
      } catch (error) {
        console.error("Error loading social networks:", error);
        setUserNetworks([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadSocialNetworks();
    }
  }, [userId]);

  const buildSocialNetworkUrl = (network: UserSocialNetwork) => {
    if (network.fullUrl) {
      return network.fullUrl;
    }
    if (network.url && network.username) {
      return network.url.replace("@", network.username);
    }
    return "#";
  };

  if (loading) {
    return (
      <Box display="flex" gap={1} alignItems="center">
        <CircularProgress size={16} />
      </Box>
    );
  }

  if (userNetworks.length === 0) {
    return null;
  }

  const buttonSize = size === "small" ? 32 : size === "medium" ? 40 : 48;
  const spacing = compact ? 0.5 : 1;

  return (
    <Box
      display="flex"
      gap={spacing}
      flexWrap="wrap"
      alignItems="center"
      sx={{
        mt: compact ? 0 : 1,
      }}
    >
      {userNetworks.map((userNetwork) => {
        const networkColor = getSocialNetworkColor(userNetwork.code, theme);
        const networkUrl = buildSocialNetworkUrl(userNetwork);

        return (
          <Tooltip
            key={userNetwork.id}
            title={`${userNetwork.name}: @${userNetwork.username}`}
            arrow
            placement="top"
          >
            <IconButton
              component="a"
              href={networkUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: buttonSize,
                height: buttonSize,
                bgcolor: alpha(networkColor, 0.1),
                color: networkColor,
                border: `1.5px solid ${alpha(networkColor, 0.3)}`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: alpha(networkColor, 0.2),
                  borderColor: networkColor,
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: `0 4px 12px ${alpha(networkColor, 0.4)}`,
                },
                "&:active": {
                  transform: "translateY(0) scale(1)",
                },
              }}
            >
              {getSocialNetworkIcon(userNetwork.code, size)}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

