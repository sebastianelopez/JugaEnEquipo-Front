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
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
      {games.map((game, idx) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={idx}>
          <Paper
            sx={{
              bgcolor: theme.palette.background.paper,
              p: { xs: 2, sm: 2.5, lg: 3 },
              borderRadius: 2,
              textAlign: "center",
              transition: "all 0.3s ease",
              position: "relative",
              maxWidth: { md: "400px", lg: "none" },
              mx: { md: "auto", lg: 0 },
              "@media (hover: hover)": {
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 20px rgba(0,0,0,0.2)`,
                },
              },
            }}
          >
            {game.isOwnershipVerified === false && (
              <Tooltip title={t("ownershipNotVerified")} arrow placement="top">
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 6, sm: 7, lg: 8 },
                    right: { xs: 6, sm: 7, lg: 8 },
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
              sx={{
                width: { xs: 48, sm: 56, md: 60, lg: 64 },
                height: { xs: 48, sm: 56, md: 60, lg: 64 },
                mx: "auto",
                mb: { xs: 1.5, sm: 1.75, md: 1.75, lg: 2 },
              }}
            />
            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "0.95rem", sm: "0.98rem", md: "1rem", lg: "1rem" },
              }}
            >
              {game.name}
            </Typography>
            {game.roles && game.roles.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 0.25, sm: 0.5 },
                  justifyContent: "center",
                  mb: { xs: 0.75, sm: 1 },
                }}
              >
                {game.roles.map((role, idx) => (
                  <Chip
                    key={idx}
                    label={role.roleName}
                    size="small"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      height: { xs: 20, sm: 24 },
                    }}
                  />
                ))}
              </Box>
            )}
            {game.gameRank && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: 0.5, sm: 1 },
                  mb: { xs: 0.75, sm: 1 },
                }}
              >
                {game.gameId && (
                  <Box
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
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
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    height: { xs: 20, sm: 24 },
                    maxWidth: { xs: "100%", sm: "none" },
                    "& .MuiChip-label": {
                      whiteSpace: { xs: "normal", sm: "nowrap" },
                      textAlign: "center",
                      px: { xs: 1, sm: 1.5 },
                    },
                  }}
                />
              </Box>
            )}
            {game.rank && !game.gameRank && (
              <Chip
                label={game.rank}
                size="small"
                color="secondary"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  height: { xs: 20, sm: 24 },
                }}
              />
            )}
            {game.accountInfo && (
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  mt: { xs: 0.75, sm: 1 },
                  px: { xs: 0.5, sm: 0 },
                }}
              >
                {game.accountInfo}
              </Typography>
            )}
            {typeof game.hoursPlayed !== "undefined" && (
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  mt: { xs: 0.75, sm: 1 },
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
