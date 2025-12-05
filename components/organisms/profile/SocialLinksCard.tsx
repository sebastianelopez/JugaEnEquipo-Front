import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import FacebookIcon from "@mui/icons-material/Facebook";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { userService } from "../../../services/user.service";
import { UserSocialNetwork } from "../../../interfaces/socialNetwork";

interface SocialLinksCardProps {
  userId: string;
}

const getSocialNetworkIcon = (code: string, size: "small" | "medium" = "medium") => {
  const iconSize = size === "small" ? 20 : 28;
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

export const SocialLinksCard = ({ userId }: SocialLinksCardProps) => {
  const theme = useTheme();
  const t = useTranslations("Profile");
  const [userNetworks, setUserNetworks] = useState<UserSocialNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSocialNetworks = async () => {
      try {
        setLoading(true);
        const networks = await userService.getUserSocialNetworks(userId);
        
        // Filter out any invalid networks
        const validNetworks = networks.filter(
          (network) => network && network.id && network.name && network.code && network.username
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
      <Card
        sx={{ bgcolor: theme.palette.background.paper, borderRadius: 3, mb: 3 }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (userNetworks.length === 0) {
    return null;
  }

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        mb: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 2.5,
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          {t("social", { default: "Redes Sociales" })}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(2, 1fr)",
            },
            gap: 1.5,
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
                <Box
                  component="a"
                  href={networkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(networkColor, 0.08),
                    border: `1.5px solid ${alpha(networkColor, 0.2)}`,
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: alpha(networkColor, 0.15),
                      borderColor: networkColor,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${alpha(networkColor, 0.3)}`,
                      "& .social-icon": {
                        transform: "scale(1.1)",
                        color: networkColor,
                      },
                      "& .social-name": {
                        color: networkColor,
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <Box
                    className="social-icon"
                    sx={{
                      color: networkColor,
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {getSocialNetworkIcon(userNetwork.code, "medium")}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      className="social-name"
                      variant="subtitle2"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        transition: "all 0.3s ease",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {userNetwork.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.75rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      @{userNetwork.username}
                    </Typography>
                  </Box>
                  <OpenInNewIcon
                    sx={{
                      fontSize: "1rem",
                      color: theme.palette.text.secondary,
                      opacity: 0.6,
                    }}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

