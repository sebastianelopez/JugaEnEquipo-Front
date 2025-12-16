import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  Box,
  Avatar,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  Public as PublicIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { Tournament, User } from "../../../interfaces";
import { formatDate } from "../../../utils/formatDate";
import { formatFullName } from "../../../utils/textFormatting";

interface TournamentInfoCardProps {
  tournament: Tournament | null;
  tournamentStatusName: string | null;
  startDateLabel: string;
  endDateLabel: string;
  responsibleUser: User | null;
  loadingResponsible: boolean;
}

export const TournamentInfoCard = ({
  tournament,
  tournamentStatusName,
  startDateLabel,
  endDateLabel,
  responsibleUser,
  loadingResponsible,
}: TournamentInfoCardProps) => {
  const router = useRouter();
  const theme = useTheme();
  const t = useTranslations("Tournaments");

  const registeredCount = tournament?.registeredTeams ?? 0;
  const maxCapacity = tournament?.maxTeams ?? 0;

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
    <Card
      sx={{
        bgcolor: theme.palette.background.paper,
        borderRadius: { xs: 2, md: 3 },
        border: `1px solid ${theme.palette.secondary.dark}`,
        mb: { xs: 2, md: 3 },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            mb: 3,
            fontSize: {
              xs: "1.25rem",
              sm: "1.5rem",
              md: "1.75rem",
            },
          }}
        >
          {t("detail.tournamentInfo")}
        </Typography>

        <Stack spacing={3}>
          {/* Type and Mode */}
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            alignItems="center"
          >
            <Chip
              icon={<TrophyIcon />}
              label={
                tournament?.isOfficial
                  ? t("detail.official")
                  : t("detail.amateur")
              }
              sx={{
                bgcolor: tournament?.isOfficial
                  ? theme.palette.warning.main
                  : theme.palette.info.main,
                color: theme.palette.common.black,
                fontWeight: 600,
                fontSize: "0.9rem",
                py: 2.5,
              }}
            />
            {tournamentStatusName && (
              <Chip
                label={tournamentStatusName}
                sx={{
                  ...getStatusColor(tournamentStatusName),
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  py: 2.5,
                }}
              />
            )}
          </Stack>

          <Divider sx={{ bgcolor: theme.palette.secondary.dark }} />

          {/* Details Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarIcon sx={{ color: theme.palette.info.main }} />
                <Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("detail.startDate")}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {startDateLabel}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                <CalendarIcon sx={{ color: theme.palette.info.main }} />
                <Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("detail.endDate")}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {endDateLabel}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <PublicIcon sx={{ color: theme.palette.info.main }} />
                <Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("detail.region")}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {tournament?.region}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupsIcon sx={{ color: theme.palette.info.main }} />
                <Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("detail.registeredTeams")}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {registeredCount}
                    {maxCapacity ? ` / ${maxCapacity}` : ""}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <TrophyIcon sx={{ color: theme.palette.warning.main }} />
                <Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.85rem",
                    }}
                  >
                    {t("detail.prize")}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.warning.main,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                    }}
                  >
                    {(tournament as any)?.prize ?? "-"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {tournament?.responsibleId && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon sx={{ color: theme.palette.info.main }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.85rem",
                        mb: 0.5,
                      }}
                    >
                      {t("detail.responsible") || "Responsable"}
                    </Typography>
                    {loadingResponsible ? (
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.9rem",
                        }}
                      >
                        {t("detail.loading")}
                      </Typography>
                    ) : responsibleUser ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        onClick={() => {
                          router.push(`/profile/${responsibleUser.username}`);
                        }}
                      >
                        <Avatar
                          src={
                            responsibleUser.profileImage ||
                            "/images/user-placeholder.png"
                          }
                          sx={{
                            width: 32,
                            height: 32,
                          }}
                        />
                        <Box>
                          <Typography
                            sx={{
                              color: theme.palette.text.primary,
                              fontWeight: 600,
                              fontSize: "0.9rem",
                            }}
                          >
                            {responsibleUser.username}
                          </Typography>
                          {(responsibleUser.firstname ||
                            responsibleUser.lastname) && (
                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.75rem",
                              }}
                            >
                              {formatFullName(
                                responsibleUser.firstname,
                                responsibleUser.lastname
                              )}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    ) : (
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.9rem",
                        }}
                      >
                        -
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>

          <Divider sx={{ bgcolor: theme.palette.secondary.dark }} />

          {/* Description */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                mb: 2,
              }}
            >
              {t("detail.description")}
            </Typography>
            {tournament?.description && (
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                }}
              >
                {tournament.description}
              </Typography>
            )}
          </Box>

          {/* Rules */}
          {tournament?.rules && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                {t("detail.rules")}
              </Typography>
              {Array.isArray((tournament as any)?.rules) ? (
                <Stack spacing={1}>
                  {(tournament as any).rules.map(
                    (rule: string, index: number) => (
                      <Stack key={index} direction="row" spacing={1}>
                        <Typography sx={{ color: theme.palette.info.main }}>
                          •
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {rule}
                        </Typography>
                      </Stack>
                    )
                  )}
                </Stack>
              ) : (tournament as any)?.rules ? (
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {String((tournament as any).rules)}
                </Typography>
              ) : null}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

