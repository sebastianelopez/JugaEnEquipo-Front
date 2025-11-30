import { FC } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import GameIcon from "@mui/icons-material/SportsEsports";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import { useTheme, alpha } from "@mui/material/styles";

interface Member {
  name: string;
  avatar: string;
}
interface Game {
  name: string;
  icon: string;
}
interface TeamLite {
  id: number | string;
  name: string;
  logo: string;
  banner: string;
  members: Member[];
  games: Game[];
  achievements: string[];
}

interface Props {
  team: TeamLite;
  onClick: (id: number | string) => void;
  membersLabel: string;
  gamesLabel: string;
  achievementsLabel: string;
  formatMore: (count: number) => string;
}

export const TeamCard: FC<Props> = ({
  team,
  onClick,
  membersLabel,
  gamesLabel,
  achievementsLabel,
  formatMore,
}) => {
  const theme = useTheme();
  const moreCount = Math.max(0, (team.achievements?.length || 0) - 1);

  return (
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={() => onClick(team.id)}
    >
      <CardMedia
        component="img"
        height={160}
        image={team.banner}
        alt={team.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            src={team.logo}
            alt={team.name}
            sx={{
              width: 64,
              height: 64,
              borderWidth: 3,
              borderStyle: "solid",
              borderColor: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
          >
            {team.name}
          </Typography>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <GroupsIcon
              sx={{ color: theme.palette.info.main, fontSize: "1.2rem" }}
            />
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {team.members.length} {membersLabel}
            </Typography>
          </Stack>
          <Box sx={{ display: "flex" }}>
            {team.members.slice(0, 5).map((m, i) => (
              <Avatar
                key={i}
                src={m.avatar}
                alt={m.name}
                sx={{
                  width: 32,
                  height: 32,
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: theme.palette.background.default,
                  ml: i === 0 ? 0 : -1,
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <GameIcon
              sx={{ color: theme.palette.info.main, fontSize: "1.2rem" }}
            />
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {gamesLabel}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {team.games.map((g, i) => (
              <Chip
                key={i}
                avatar={
                  <Avatar
                    src={g.icon}
                    alt={g.name}
                    sx={{ width: 20, height: 20 }}
                  />
                }
                label={g.name}
                size="small"
                sx={{
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  fontSize: "0.75rem",
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            p: 1.5,
            mt: 2,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <TrophyIcon
              sx={{ color: theme.palette.warning.main, fontSize: "1.2rem" }}
            />
            <Typography
              sx={{
                color: theme.palette.warning.main,
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {achievementsLabel}
            </Typography>
          </Stack>
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.8rem",
              lineHeight: 1.4,
            }}
          >
            {team.achievements?.[0]}
          </Typography>
          {moreCount > 0 && (
            <Chip
              label={formatMore(moreCount)}
              size="small"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontSize: "0.7rem",
                height: 20,
                mt: 1,
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
