import { FC } from "react";
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
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import PublicIcon from "@mui/icons-material/Public";
import { useTheme, alpha } from "@mui/material/styles";
import type { Tournament, User } from "../../../interfaces";

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
  const modeIsTeam = String(tournament.participationMode) === "team";
  const maxCount = modeIsTeam
    ? tournament.maxTeams
    : tournament.maxParticipants;
  const image =
    (tournament as any).image ||
    tournament.game?.image ||
    "/images/image-placeholder.png";
  const gameIcon = tournament.game?.image || "/images/image-placeholder.png";
  const gameName = tournament.game?.name || "";

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
            label={tournament.type === "Oficial" ? "Oficial" : "Amateur"}
            size="small"
            sx={{
              bgcolor:
                tournament.type === "Oficial"
                  ? theme.palette.warning.main
                  : theme.palette.info.main,
              color: theme.palette.getContrastText(
                tournament.type === "Oficial"
                  ? theme.palette.warning.main
                  : theme.palette.info.main
              ),
              fontWeight: 600,
            }}
          />
          <Chip
            icon={modeIsTeam ? <GroupsIcon /> : <PersonIcon />}
            label={modeIsTeam ? "Equipos" : "Individual"}
            size="small"
            sx={{
              bgcolor: theme.palette.background.default,
              color: theme.palette.text.primary,
              border: `1px solid ${alpha(theme.palette.info.main, 0.5)}`,
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
          {modeIsTeam
            ? `Máximo: ${maxCount ?? "-"} equipos`
            : `Máximo: ${maxCount ?? "-"} participantes`}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <CalendarIcon
            sx={{ color: theme.palette.info.main, fontSize: "1rem" }}
          />
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}
          >
            Inicio: {formatStartDate(tournament.startDate)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <PublicIcon
            sx={{ color: theme.palette.info.main, fontSize: "1rem" }}
          />
          <Typography
            sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}
          >
            Región: {tournament.region}
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
              ORGANIZADOR
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
                  {organizer.firstname} {organizer.lastname}
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
