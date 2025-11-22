import { FC, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import PublicIcon from "@mui/icons-material/Public";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type { Tournament, User, Game } from "../../../interfaces";
import { formatFullName } from "../../../utils/textFormatting";
import { getGameImage } from "../../../utils/gameImageUtils";
import { gameService } from "../../../services/game.service";

interface TournamentCardProps {
  tournament: Tournament & { image?: string; teams?: any[]; users?: any[] };
  onClick: (t: Tournament) => void;
  organizer?: User | undefined;
  formatStartDate: (iso?: string) => string;
}

export const TournamentCard: FC<TournamentCardProps> = ({
  tournament,
  onClick,
  organizer,
  formatStartDate,
}) => {
  const theme = useTheme();
  const t = useTranslations("Tournaments");
  const [game, setGame] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState(false);

  // Fetch game information using gameId
  useEffect(() => {
    const tournamentAny = tournament as any;
    if (tournament.gameId && !tournamentAny.game) {
      setLoadingGame(true);
      gameService
        .getGameById(tournament.gameId)
        .then((result) => {
          if (result.ok && result.data) {
            setGame(result.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching game:", error);
        })
        .finally(() => {
          setLoadingGame(false);
        });
    } else if (tournamentAny.game) {
      setGame(tournamentAny.game);
    }
  }, [tournament.gameId]);

  const tournamentAny = tournament as any;
  const gameInfo = game || tournamentAny.game;
  const gameName = gameInfo?.name || "";

  const image =
    tournamentAny.image || gameInfo?.image || "/images/image-placeholder.png";

  const gameIcon =
    getGameImage(gameName) ||
    gameInfo?.image ||
    "/images/image-placeholder.png";

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={() => onClick(tournament)}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={tournament.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 2 }}
        >
          {tournament.name}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src={gameIcon}
            alt={gameName}
            sx={{ width: 32, height: 32 }}
          />
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}
          >
            {gameName}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
        >
          <Chip
            icon={<TrophyIcon />}
            label={
              tournament.isOfficial ? t("card.official") : t("card.amateur")
            }
            size="small"
            sx={{
              bgcolor: tournament.isOfficial
                ? theme.palette.warning.main
                : theme.palette.info.main,
              color: theme.palette.getContrastText(
                tournament.isOfficial
                  ? theme.palette.warning.main
                  : theme.palette.info.main
              ),
              fontWeight: 600,
            }}
          />
        </Stack>

        <Typography
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.85rem",
            mb: 1,
          }}
        >
          {t("card.maxTeams", { count: tournament.maxTeams ?? 0 })}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <CalendarIcon
            sx={{ color: theme.palette.info.main, fontSize: "1rem" }}
          />
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}
          >
            {t("card.start")}: {formatStartDate(tournament.startAt)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <PublicIcon
            sx={{ color: theme.palette.info.main, fontSize: "1rem" }}
          />
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}
          >
            {t("card.region")}: {tournament.region}
          </Typography>
        </Stack>

        {organizer && (
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              p: 1.5,
              mt: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
            }}
          >
            <Typography
              sx={{
                color: theme.palette.info.main,
                fontSize: "0.75rem",
                fontWeight: 600,
                mb: 1,
              }}
            >
              {t("card.organizer")}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={organizer.profileImage || "/images/user-placeholder.png"}
                alt={organizer.username}
                sx={{ width: 36, height: 36 }}
              />
              <Box>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {formatFullName(organizer.firstname, organizer.lastname)}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  @{organizer.username}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
