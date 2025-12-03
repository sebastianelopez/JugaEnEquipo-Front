import { FC, useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import { useTheme, alpha } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import type { Tournament, User, Game } from "../../../interfaces";
import { formatFullName } from "../../../utils/textFormatting";
import { getGameImage } from "../../../utils/gameImageUtils";
import { gameService } from "../../../services/game.service";
import { tournamentService } from "../../../services/tournament.service";
import { BackgroundFallback } from "../../atoms/BackgroundFallback";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [game, setGame] = useState<Game | null>(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loadingBackground, setLoadingBackground] = useState(true);

  // Determine tournament status based on dates
  const tournamentStatus = useMemo(() => {
    const now = new Date();
    const startDate = new Date(tournament.startAt);
    const endDate = new Date(tournament.endAt);

    if (now < startDate) {
      return "upcoming";
    } else if (now >= startDate && now <= endDate) {
      return "ongoing";
    } else {
      return "finished";
    }
  }, [tournament.startAt, tournament.endAt]);

  // Calculate registration progress
  const registrationProgress = useMemo(() => {
    if (!tournament.maxTeams || tournament.maxTeams === 0) return 0;
    const registered = (tournament as any).registeredTeams || 0;
    return Math.min((registered / tournament.maxTeams) * 100, 100);
  }, [tournament]);

  // Check if tournament is almost full
  const isAlmostFull = useMemo(() => {
    const registered = (tournament as any).registeredTeams || 0;
    return registrationProgress >= 80 && registrationProgress < 100;
  }, [registrationProgress]);

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

  // Fetch background image
  useEffect(() => {
    const loadBackgroundImage = async () => {
      if (!tournament.id) {
        setLoadingBackground(false);
        return;
      }
      try {
        setLoadingBackground(true);
        const result = await tournamentService.getBackgroundImage(String(tournament.id));
        if (result.ok) {
          setBackgroundImage(result.data);
        }
      } catch (error) {
        console.error("Error loading background image:", error);
      } finally {
        setLoadingBackground(false);
      }
    };

    loadBackgroundImage();
  }, [tournament.id]);

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
        position: "relative",
        "&:hover": {
          transform: isMobile ? "none" : "translateY(-8px)",
          boxShadow: isMobile
            ? `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
            : `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
          borderColor: theme.palette.primary.main,
        },
        "&:active": {
          transform: isMobile ? "scale(0.98)" : "translateY(-6px)",
        },
      }}
      onClick={() => onClick(tournament)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(tournament);
        }
      }}
      aria-label={`${tournament.name} - ${gameName}`}
    >
      {/* Status Badge */}
      {tournamentStatus === "ongoing" && (
        <Chip
          label={t("card.status.ongoing") || "En curso"}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: theme.palette.success.main,
            color: theme.palette.getContrastText(theme.palette.success.main),
            fontWeight: 700,
            fontSize: { xs: "0.65rem", md: "0.75rem" },
            height: { xs: 20, md: 24 },
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        />
      )}
      {tournamentStatus === "finished" && (
        <Chip
          label={t("card.status.finished") || "Finalizado"}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: theme.palette.grey[600],
            color: theme.palette.getContrastText(theme.palette.grey[600]),
            fontWeight: 700,
            fontSize: { xs: "0.65rem", md: "0.75rem" },
            height: { xs: 20, md: 24 },
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        />
      )}
      {isAlmostFull && tournamentStatus === "upcoming" && (
        <Chip
          label={t("card.status.almostFull") || "Casi lleno"}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: theme.palette.warning.main,
            color: theme.palette.getContrastText(theme.palette.warning.main),
            fontWeight: 700,
            fontSize: { xs: "0.65rem", md: "0.75rem" },
            height: { xs: 20, md: 24 },
            boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        />
      )}
      {/* Background Image or Fallback */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 150, md: 200 },
          overflow: "hidden",
        }}
      >
        {backgroundImage ? (
          <CardMedia
            component="img"
            height="200"
            image={backgroundImage}
            alt={tournament.name}
            sx={{
              objectFit: "cover",
              height: { xs: 150, md: 200 },
              width: "100%",
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
            }}
          >
            <BackgroundFallback seed={tournament.name} variant="tournament" />
          </Box>
        )}
      </Box>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: { xs: 1.5, md: 2 },
            fontSize: { xs: "1rem", md: "1.25rem" },
          }}
        >
          {tournament.name}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: { xs: 1.5, md: 2 } }}
        >
          <Avatar
            src={gameIcon}
            alt={gameName}
            sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 } }}
          />
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.8rem", md: "0.9rem" },
            }}
          >
            {gameName}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: { xs: 1.5, md: 2 }, flexWrap: "wrap", gap: 1 }}
        >
          <Chip
            icon={
              <TrophyIcon sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }} />
            }
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
              fontSize: { xs: "0.7rem", md: "0.875rem" },
              height: { xs: 24, md: 32 },
            }}
          />
        </Stack>

        {/* Registration Progress */}
        <Box sx={{ mb: { xs: 1, md: 1.5 } }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PeopleIcon
                sx={{
                  color: theme.palette.info.main,
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              />
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                }}
              >
                {t("card.teams") || "Equipos"}:
              </Typography>
            </Stack>
            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: "0.75rem", md: "0.85rem" },
                fontWeight: 600,
              }}
            >
              {(tournament as any).registeredTeams || 0} /{" "}
              {tournament.maxTeams ?? 0}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={registrationProgress}
            sx={{
              height: { xs: 4, md: 6 },
              borderRadius: 1,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              "& .MuiLinearProgress-bar": {
                bgcolor:
                  registrationProgress >= 100
                    ? theme.palette.error.main
                    : isAlmostFull
                    ? theme.palette.warning.main
                    : theme.palette.info.main,
                borderRadius: 1,
              },
            }}
          />
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: { xs: 0.75, md: 1 } }}
        >
          <CalendarIcon
            sx={{
              color: theme.palette.info.main,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          />
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
            }}
          >
            {t("card.start")}: {formatStartDate(tournament.startAt)}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: { xs: 1.5, md: 2 } }}
        >
          <PublicIcon
            sx={{
              color: theme.palette.info.main,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
          />
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
            }}
          >
            {t("card.region")}: {tournament.region}
          </Typography>
        </Stack>

        {organizer && (
          <Box
            sx={{
              bgcolor: theme.palette.background.default,
              borderRadius: 2,
              p: { xs: 1, md: 1.5 },
              mt: { xs: 1.5, md: 2 },
              border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
            }}
          >
            <Typography
              sx={{
                color: theme.palette.info.main,
                fontSize: { xs: "0.7rem", md: "0.75rem" },
                fontWeight: 600,
                mb: { xs: 0.75, md: 1 },
              }}
            >
              {t("card.organizer")}
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={organizer.profileImage || "/images/user-placeholder.png"}
                alt={organizer.username}
                sx={{ width: { xs: 32, md: 36 }, height: { xs: 32, md: 36 } }}
              />
              <Box>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: { xs: "0.8rem", md: "0.85rem" },
                    fontWeight: 600,
                  }}
                >
                  {formatFullName(organizer.firstname, organizer.lastname)}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: "0.7rem", md: "0.75rem" },
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
