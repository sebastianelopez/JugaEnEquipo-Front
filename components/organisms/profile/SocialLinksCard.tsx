import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
}

interface SocialLinksCardProps {
  links: SocialLinks;
}

export const SocialLinksCard = ({ links }: SocialLinksCardProps) => {
  const theme = useTheme();
  const t = useTranslations("Profile");

  return (
    <Card
      sx={{ bgcolor: theme.palette.background.paper, borderRadius: 3, mb: 3 }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
          }}
        >
          {t("social", { default: "Redes Sociales" })}
        </Typography>
        <Stack spacing={2}>
          {links.twitch && (
            <Button
              fullWidth
              startIcon={<LiveTvIcon />}
              variant="contained"
              color="primary"
              href={links.twitch}
              target="_blank"
              sx={{ justifyContent: "flex-start" }}
            >
              Twitch
            </Button>
          )}
          {links.youtube && (
            <Button
              fullWidth
              startIcon={<YouTubeIcon />}
              variant="contained"
              color="error"
              href={links.youtube}
              target="_blank"
              sx={{ justifyContent: "flex-start" }}
            >
              YouTube
            </Button>
          )}
          {links.twitter && (
            <Button
              fullWidth
              startIcon={<TwitterIcon />}
              variant="contained"
              href={links.twitter}
              target="_blank"
              sx={{
                justifyContent: "flex-start",
                bgcolor: theme.palette.info.main,
                ":hover": { bgcolor: theme.palette.info.dark },
              }}
            >
              Twitter
            </Button>
          )}
          {links.instagram && (
            <Button
              fullWidth
              startIcon={<InstagramIcon />}
              variant="outlined"
              href={links.instagram}
              target="_blank"
              sx={{ justifyContent: "flex-start" }}
            >
              Instagram
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

