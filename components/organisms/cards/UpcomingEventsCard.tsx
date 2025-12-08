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
  CircularProgress,
} from "@mui/material";
import { FC, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { formatEventDateTime } from "../../../utils/formatDate";
import { Event } from "../../../interfaces/event";

interface Props {
  events?: Event[];
  isLoading?: boolean;
}

export const UpcomingEventsCard: FC<Props> = ({ events, isLoading = false }) => {
  const t = useTranslations("Events");
  const router = useRouter();
  const locale = (router.locale as "es" | "en" | "pt") || "es";

  // Parse date range string to get start date
  const parseStartDate = (dateRange: string): string => {
    // Format: "2025-12-30T10:00:00-03:00 - 2025-12-30T18:00:00-03:00"
    const startDate = dateRange.split(" - ")[0];
    return startDate;
  };

  // Convert Event to display format
  const displayEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    return events
      .map((event) => ({
        id: event.id,
        name: event.name,
        game: event.game,
        startAt: parseStartDate(event.date),
        image: event.image,
      }))
      .slice(0, 3); // Limit to 3 events
  }, [events]);

  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "start",
        width: "100%",
        maxWidth: "250px",
        position: "relative",
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
        <Button
          size="small"
          sx={{
            textTransform: "none",
          }}
          onClick={() => router.push("/events")}
        >
          {t("seeAll")}
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      ) : displayEvents.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          {t("noEvents") || "No hay eventos próximos"}
        </Typography>
      ) : (
        <List dense>
          {displayEvents.map((event) => (
            <ListItem 
              key={event.id} 
              alignItems="flex-start" 
              sx={{ px: 0, cursor: "pointer" }}
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <ListItemAvatar>
                <Avatar
                  alt={event.game}
                  src={event.image || "/images/image-placeholder.png"}
                  sx={{ width: 36, height: 36 }}
                />
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" fontWeight="bold">
                      {event.name}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    flexDirection="column"
                    gap={1}
                  >
                    <Chip label={event.game} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {formatEventDateTime(event.startAt, locale)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};
