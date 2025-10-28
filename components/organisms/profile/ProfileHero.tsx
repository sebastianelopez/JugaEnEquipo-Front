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

interface ProfileHeroProps {
  fullName: string;
  username: string;
  avatarSrc?: string;
  bannerSrc?: string;
  regionLabel?: string;
  memberSinceLabel?: string;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  onMessageClick?: () => void;
}

export const ProfileHero = ({
  fullName,
  username,
  avatarSrc,
  bannerSrc,
  regionLabel,
  memberSinceLabel,
  isOwnProfile = false,
  onEditClick,
  onMessageClick,
}: ProfileHeroProps) => {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations("Profile");

  const bgGradient = `linear-gradient(to bottom, ${alpha(
    theme.palette.background.default,
    0.3
  )}, ${alpha(theme.palette.background.default, 0.9)})`;

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
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            color: theme.palette.text.primary,
            mb: 2,
            ":hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
          }}
        >
          {t("back", { default: "Volver" })}
        </Button>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
        >
          <Avatar
            src={avatarSrc}
            alt={username}
            sx={{
              width: { xs: 100, md: 140 },
              height: { xs: 100, md: 140 },
              border: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 800,
                  fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
              >
                {fullName}
              </Typography>

              {isOwnProfile && (
                <IconButton
                  onClick={onEditClick}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    ":hover": {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Stack>

            <Typography
              sx={{
                color: theme.palette.info.main,
                fontSize: { xs: "1rem", md: "1.2rem" },
                fontWeight: 600,
                mb: 1,
              }}
            >
              @{username}
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
              {regionLabel && (
                <Chip
                  icon={<LocationOnIcon />}
                  label={regionLabel}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                />
              )}
              {memberSinceLabel && (
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={memberSinceLabel}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>
          </Box>

          {!isOwnProfile && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700 }}
                color="primary"
              >
                {t("followUser")}
              </Button>
              <Button
                variant="outlined"
                sx={{ px: 3, py: 1.2, borderRadius: 2, fontWeight: 700 }}
                color="primary"
                onClick={onMessageClick}
              >
                {t("sendMessage")}
              </Button>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
