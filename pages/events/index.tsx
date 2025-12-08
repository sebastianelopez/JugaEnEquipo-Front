import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { MainLayout } from "../../layouts";
import { eventService } from "../../services/event.service";
import { Event } from "../../interfaces/event";
import { formatEventDateTime } from "../../utils/formatDate";

interface Props {}

const EventsPage: NextPage<Props> = () => {
  const t = useTranslations("Events");
  const theme = useTheme();
  const router = useRouter();
  const locale = (router.locale as "es" | "en" | "pt") || "es";

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const observerTarget = useRef<HTMLDivElement>(null);

  // Parse date range string to get start date
  const parseStartDate = (dateRange: string): string => {
    const startDate = dateRange.split(" - ")[0];
    return startDate;
  };

  const fetchEvents = useCallback(
    async (page: number = 1, append: boolean = false) => {
      setIsLoading(true);
      try {
        const offset = (page - 1) * itemsPerPage;

        const result = await eventService.getEvents({
          limit: itemsPerPage,
          offset: offset,
        });

        if (result.error || !result.data) {
          setHasMore(false);
          return;
        }

        const newEvents = result.data.data || [];
        setEvents((prev) => (append ? [...prev, ...newEvents] : newEvents));
        setHasMore(newEvents.length === itemsPerPage);
      } catch (error) {
        console.error("Error loading events:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  useEffect(() => {
    fetchEvents(1, false);
  }, [fetchEvents]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          fetchEvents(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, currentPage, fetchEvents]);

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <>
      <MainLayout
        pageDescription={t("pageDescription", { default: "Events page" })}
        title={t("title", { default: "Events" })}
      >
        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            minHeight: "100vh",
            py: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ mb: { xs: 3, md: 6 } }}>
              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 800,
                  mb: { xs: 1, md: 2 },
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "3rem" },
                  textAlign: "center",
                }}
              >
                {t("title", { default: "Events" })}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                  mb: { xs: 2, md: 4 },
                  fontSize: { xs: "0.95rem", md: "1.25rem" },
                  px: { xs: 1, md: 0 },
                }}
              >
                {t("subtitle", {
                  default: "Discover and participate in upcoming events",
                })}
              </Typography>
            </Box>

            {/* Events Grid */}
            {events.length === 0 && !isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {t("noEvents", { default: "No events found" })}
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {events.map((event) => {
                    const startDate = parseStartDate(event.date);
                    return (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={event.id}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 4,
                            },
                          }}
                          onClick={() => handleEventClick(event.id)}
                        >
                          {event.image && (
                            <CardMedia
                              component="img"
                              height="200"
                              image={event.image}
                              alt={event.name}
                              sx={{ objectFit: "cover" }}
                            />
                          )}
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={1}
                            >
                              <Chip
                                label={event.game}
                                size="small"
                                color="primary"
                              />
                              <Chip
                                label={event.type}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                fontWeight: 600,
                                mb: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {event.name}
                            </Typography>
                            {event.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 2,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {event.description}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              {formatEventDateTime(startDate, locale)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}

                  {/* Loading skeletons */}
                  {isLoading && events.length === 0 && (
                    <>
                      {[...Array(6)].map((_, index) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                          <Card sx={{ height: "100%" }}>
                            <CardContent>
                              <CircularProgress size={24} />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </>
                  )}
                </Grid>

                {/* Infinite scroll trigger */}
                {hasMore && (
                  <Box
                    ref={observerTarget}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 4,
                    }}
                  >
                    {isLoading && <CircularProgress />}
                  </Box>
                )}
              </>
            )}
          </Container>
        </Box>
      </MainLayout>
    </>
  );
};

export default EventsPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}: GetServerSidePropsContext) => {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
};

