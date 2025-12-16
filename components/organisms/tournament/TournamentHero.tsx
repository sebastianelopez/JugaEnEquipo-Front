import { Box, Container, Button, Stack, Typography, Avatar, Chip, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { Tournament, Game } from "../../../interfaces";
import { BackgroundFallback } from "../../atoms/BackgroundFallback";
import { getGameImage } from "../../../utils/gameImageUtils";

interface TournamentHeroProps {
  tournament: Tournament | null;
  game: Game | null;
  backgroundImage: string | null;
  tournamentStatusName: string | null;
  canEditTournament: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  tournamentId: string;
}

export const TournamentHero = ({
  tournament,
  game,
  backgroundImage,
  tournamentStatusName,
  canEditTournament,
  onEditClick,
  onDeleteClick,
  tournamentId,
}: TournamentHeroProps) => {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations("Tournaments");

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active" || statusLower === "ongoing") {
      return {
        bgcolor: theme.palette.success.main,
        color: theme.palette.getContrastText(theme.palette.success.main),
      };
    } else if (
      statusLower === "finalized" ||
      statusLower === "finished" ||
      statusLower === "archived"
    ) {
      return {
        bgcolor: theme.palette.grey[600],
        color: theme.palette.getContrastText(theme.palette.grey[600]),
      };
    } else if (statusLower === "suspended") {
      return {
        bgcolor: theme.palette.error.main,
        color: theme.palette.getContrastText(theme.palette.error.main),
      };
    } else if (statusLower === "created") {
      return {
        bgcolor: theme.palette.info.main,
        color: theme.palette.getContrastText(theme.palette.info.main),
      };
    }
    return {
      bgcolor: theme.palette.primary.main,
      color: theme.palette.getContrastText(theme.palette.primary.main),
    };
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "300px", md: "400px" },
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
    >
      {/* Background Image or Fallback */}
      {backgroundImage ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(to bottom, ${
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)"
                : "rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)"
            }), url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          <BackgroundFallback
            seed={tournament?.name || tournamentId}
            variant="tournament"
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(to bottom, ${
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)"
                  : "rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7)"
              })`,
            }}
          />
        </Box>
      )}
      <Container
        maxWidth="xl"
        sx={{ pb: 4, position: "relative", zIndex: 1 }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/tournaments")}
          sx={{
            color: theme.palette.common.white,
            mb: 2,
            "&:hover": {
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          {t("detail.back")}
        </Button>
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          alignItems="center"
          flexWrap="wrap"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.common.white,
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "3.5rem" },
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              flex: 1,
              minWidth: 0,
            }}
          >
            {tournament?.name}
          </Typography>
          {canEditTournament && (
            <IconButton
              onClick={onEditClick}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: theme.palette.common.white,
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
                "& svg": {
                  fontSize: { xs: "1.1rem", md: "1.5rem" },
                },
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          {canEditTournament && (
            <IconButton
              onClick={onDeleteClick}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                color: theme.palette.error.light,
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "rgba(211, 47, 47, 0.2)",
                },
                "& svg": {
                  fontSize: { xs: "1.1rem", md: "1.5rem" },
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
        >
          {game && (
            <Avatar
              src={getGameImage(game.name)}
              alt={game.name}
              sx={{ width: 48, height: 48 }}
            />
          )}
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.info.main,
              fontWeight: 600,
            }}
          >
            {game?.name}
          </Typography>
          {tournamentStatusName && (
            <Chip
              label={tournamentStatusName}
              size="small"
              sx={{
                ...getStatusColor(tournamentStatusName),
                fontWeight: 700,
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                height: { xs: 28, md: 32 },
              }}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
};

