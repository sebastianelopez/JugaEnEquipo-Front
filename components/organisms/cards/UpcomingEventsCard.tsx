import {
  Avatar,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { FC, useMemo } from "react";
import { useTranslations } from "next-intl";

interface UpcomingEventItem {
  id: string;
  title: string;
  game: string;
  startAt: string;
}

interface Props {
  events?: UpcomingEventItem[];
}

export const UpcomingEventsCard: FC<Props> = ({ events }) => {
  const t = useTranslations("Events");

  const fallbackEvents: UpcomingEventItem[] = useMemo(
    () => [
      {
        id: "1",
        title: "Valorant Showdown",
        game: "Valorant",
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "2",
        title: "League Clash Cup",
        game: "League of Legends",
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        id: "3",
        title: "Overwatch Community Night",
        game: "Overwatch",
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 50).toISOString(),
      },
      {
        id: "4",
        title: "CS2 Weekend Cup",
        game: "Counter-Strike 2",
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
      },
    ],
    []
  );

  const displayEvents = events && events.length > 0 ? events : fallbackEvents;

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "start",
        width: "100%",
        maxWidth: "250px",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h5" fontWeight="bold">
          {t("upcomingEvents")}
        </Typography>
        <Button size="small" sx={{ textTransform: "none" }}>
          {t("seeAll")}
        </Button>
      </Box>

      <List dense>
        {displayEvents.map((event) => (
          <ListItem key={event.id} alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemAvatar>
              <Avatar
                alt={event.game}
                src="/images/image-placeholder.png"
                sx={{ width: 36, height: 36 }}
              />
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1" fontWeight="bold">
                    {event.title}
                  </Typography>
                </Box>
              }
              secondary={
                <Box display="flex" alignItems="flex-start" flexDirection="column" gap={1}>
                  <Chip label={event.game} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(event.startAt)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
