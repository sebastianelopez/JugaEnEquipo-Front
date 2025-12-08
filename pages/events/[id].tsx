import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { Box, Typography, Chip, Card, CardMedia, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { MainLayout } from "../../layouts";
import { eventService } from "../../services/event.service";
import { Event } from "../../interfaces/event";
import { formatEventDateTime } from "../../utils/formatDate";

interface Props {
  event: Event;
}

const EventDetailPage: NextPage<Props> = ({ event }) => {
  const t = useTranslations("Events");
  const theme = useTheme();
  const router = useRouter();
  const locale = (router.locale as "es" | "en" | "pt") || "es";

  // Parse date range string
  const parseDateRange = (dateRange: string): { start: string; end: string } => {
    const parts = dateRange.split(" - ");
    return {
      start: parts[0] || dateRange,
      end: parts[1] || dateRange,
    };
  };

  const dateRange = parseDateRange(event.date);

  return (
    <>
      <MainLayout
        pageDescription={event.description || `Event: ${event.name}`}
        title={`${event.name} - ${t("title", { default: "Event" })}`}
      >
        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            minHeight: "100vh",
            py: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
            <Card
              sx={{
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              {event.image && (
                <CardMedia
                  component="img"
                  height="400"
                  image={event.image}
                  alt={event.name}
                  sx={{ objectFit: "cover", width: "100%" }}
                />
              )}

              <Box sx={{ p: { xs: 2, md: 4 } }}>
                {/* Header with chips */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  flexWrap="wrap"
                  mb={2}
                >
                  <Chip
                    label={event.game}
                    color="primary"
                    size="medium"
                  />
                  <Chip
                    label={event.type}
                    variant="outlined"
                    size="medium"
                  />
                </Box>

                {/* Event name */}
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.75rem", md: "2.5rem" },
                    color: theme.palette.text.primary,
                  }}
                >
                  {event.name}
                </Typography>

                {/* Date and time */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    {t("date", { default: "Date & Time" })}:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    <strong>{t("start", { default: "Start" })}:</strong>{" "}
                    {formatEventDateTime(dateRange.start, locale)}
                  </Typography>
                  {dateRange.end !== dateRange.start && (
                    <Typography variant="body1">
                      <strong>{t("end", { default: "End" })}:</strong>{" "}
                      {formatEventDateTime(dateRange.end, locale)}
                    </Typography>
                  )}
                </Box>

                {/* Description */}
                {event.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      {t("description", { default: "Description" })}:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.8,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {event.description}
                    </Typography>
                  </Box>
                )}

                {/* Additional info */}
                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {t("createdAt", { default: "Created" })}:{" "}
                    {formatEventDateTime(event.createdAt, locale)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Container>
        </Box>
      </MainLayout>
    </>
  );
};

export default EventDetailPage;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  req,
}: GetServerSidePropsContext) => {
  const { id = "" } = params as { id: string };

  if (!id) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  try {
    const serverToken = req.cookies["token"];
    const result = await eventService.getEventById(id, serverToken);

    if (result.error || !result.data) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    return {
      props: {
        event: result.data,
        messages: (await import(`../../lang/${locale}.json`)).default,
      },
    };
  } catch (error) {
    console.error("Error fetching event data:", error);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

