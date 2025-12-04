import { Grid, Paper, Avatar, Chip, Typography, Box, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getRankImageFromPlayer } from "../../../utils/rankImageUtils";

interface GameItem {
  name: string;
  icon?: string;
  rank?: string;
  hoursPlayed?: number;
  accountInfo?: string;
  roles?: Array<{ roleName: string; roleDescription?: string }>;
  gameRank?: { id: string; name: string; level: number };
  gameId?: string; // Needed for rank image
  isOwnershipVerified?: boolean; // Indicates if the account ownership is verified
}

interface GamesGridProps {
  games: GameItem[];
}

export const GamesGrid = ({ games }: GamesGridProps) => {
  const theme = useTheme();
  const t = useTranslations("Settings");

  return (
    <Grid container spacing={2}>
      {games.map((game, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
          <Paper
            sx={{
              bgcolor: theme.palette.background.paper,
              p: 3,
              borderRadius: 2,
              textAlign: "center",
              transition: "all 0.3s ease",
              position: "relative",
              ":hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 20px rgba(0,0,0,0.2)`,
              },
            }}
          >
            {game.isOwnershipVerified === false && (
              <Tooltip title={t("ownershipNotVerified")} arrow placement="top">
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: theme.palette.text.secondary,
                    display: "flex",
                    alignItems: "center",
                    opacity: 0.7,
                    "&:hover": {
                      opacity: 1,
                      color: theme.palette.info.main,
                    },
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </Box>
              </Tooltip>
            )}
            <Avatar
              src={game.icon}
              alt={game.name}
              sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}
            />
            <Typography
              sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1 }}
            >
              {game.name}
            </Typography>
            {game.roles && game.roles.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                {game.roles.map((role, idx) => (
                  <Chip
                    key={idx}
                    label={role.roleName}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Box>
            )}
            {game.gameRank && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                {game.gameId && (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      position: "relative",
                      flexShrink: 0,
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={getRankImageFromPlayer(
                        game.name,
                        game.gameId,
                        game.gameRank
                      )}
                      alt={game.gameRank.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                )}
                <Chip
                  label={`${game.gameRank.name} (Level ${game.gameRank.level})`}
                  size="small"
                  color="secondary"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            )}
            {game.rank && !game.gameRank && (
              <Chip
                label={game.rank}
                size="small"
                color="secondary"
                sx={{ fontWeight: 600, mb: 1 }}
              />
            )}
            {game.accountInfo && (
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                  mt: 1,
                }}
              >
                {game.accountInfo}
              </Typography>
            )}
            {typeof game.hoursPlayed !== "undefined" && (
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.8rem",
                  mt: 1,
                }}
              >
                {game.hoursPlayed.toLocaleString()} horas
              </Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
