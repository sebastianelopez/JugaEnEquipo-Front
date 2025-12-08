import { api } from "../lib/api";
import { getToken } from "./auth.service";
import { Event, EventsResponse, EventResponse } from "../interfaces/event";
import { buildQ } from "../utils/buildQ";

type Result<T> = {
  data: T | null;
  error: { message: string; status?: number } | null;
};

const toErrorMessage = (input: unknown): string => {
  if (typeof input === "string") return input;
  try {
    return JSON.stringify(input);
  } catch {
    return "Unknown error";
  }
};

export const eventService = {
  /**
   * Get events with optional filters
   * GET /api/events?gameId=:game_id&type=presencial&limit=10&offset=0
   */
  getEvents: async (params?: {
    gameId?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<Result<EventsResponse>> => {
    try {
      const token = await getToken();
      const queryParams: any = {};

      if (params?.gameId) {
        queryParams.gameId = params.gameId;
      }
      if (params?.type) {
        queryParams.type = params.type;
      }
      if (params?.limit !== undefined) {
        queryParams.limit = params.limit.toString();
      }
      if (params?.offset !== undefined) {
        queryParams.offset = params.offset.toString();
      }

      // Build query string using buildQ utility if needed, or use direct params
      const q = buildQ({
        ...(params?.limit && { limit: params.limit }),
        ...(params?.offset && { offset: params.offset }),
      });

      const finalParams = Object.keys(queryParams).length > 0 
        ? queryParams 
        : (q ? { q } : {});

      const response = await api.get<EventsResponse>(
        `/events`,
        finalParams,
        token
      );

      // Handle different response structures
      let events: Event[] = [];
      let metadata = { total: 0, count: 0 };

      if (response && typeof response === "object") {
        if ("data" in response && Array.isArray(response.data)) {
          events = response.data;
          metadata = response.metadata || { total: events.length, count: events.length };
        } else if ("data" in response && response.data && typeof response.data === "object" && "data" in response.data) {
          // Nested structure: { data: { data: [...], metadata: {...} } }
          events = (response.data as any).data || [];
          metadata = (response.data as any).metadata || { total: events.length, count: events.length };
        } else if (Array.isArray(response)) {
          events = response;
          metadata = { total: events.length, count: events.length };
        }
      }

      return {
        data: {
          data: events,
          metadata,
        },
        error: null,
      };
    } catch (error: any) {
      const message = toErrorMessage(
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      const status = error?.response?.status;
      return { data: null, error: { message, status } };
    }
  },

  /**
   * Get a single event by ID
   * GET /api/event/:event_id
   */
  getEventById: async (eventId: string, serverToken?: string): Promise<Result<Event>> => {
    try {
      const token =
        typeof window === "undefined" ? serverToken : await getToken();
      const response = await api.get<EventResponse>(
        `/event/${eventId}`,
        {},
        token
      );

      // Handle different response structures
      let event: Event | null = null;

      if (response && typeof response === "object") {
        if ("data" in response && response.data) {
          event = response.data;
        } else if ("id" in response) {
          // Handle case where API returns Event directly instead of EventResponse
          event = response as unknown as Event;
        }
      }

      return {
        data: event,
        error: null,
      };
    } catch (error: any) {
      const message = toErrorMessage(
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      const status = error?.response?.status;
      return { data: null, error: { message, status } };
    }
  },
};

