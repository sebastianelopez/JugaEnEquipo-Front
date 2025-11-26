import { getToken } from "./auth.service";
import { api } from "../lib/api";
import {
  Notification,
  NotificationsResponse,
} from "../interfaces/notification";

const MERCURE_URL = "https://mercure.jugaenequipo.com";

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

export const notificationService = {
  connectToNotifications: (userId: string): EventSource => {
    const topicUrl = `https://api.jugaenequipo.com/notification/${userId}`;
    const encodedTopic = encodeURIComponent(topicUrl);
    const url = `${MERCURE_URL}/.well-known/mercure?topic=${encodedTopic}`;

    const eventSource = new EventSource(url, {
      withCredentials: false,
    });

    return eventSource;
  },

  getNotifications: async (
    limit: number = 10,
    offset: number = 0
  ): Promise<Result<{ notifications: Notification[]; pagination: any }>> => {
    try {
      const token = await getToken();
      if (!token) {
        return {
          data: null,
          error: { message: "No authentication token", status: 401 },
        };
      }

      // Build q parameter - limit and offset are optional
      const qParts: string[] = [];
      if (limit !== undefined && limit !== null) {
        qParts.push(`limit:${limit}`);
      }
      if (offset !== undefined && offset !== null) {
        qParts.push(`offset:${offset}`);
      }

      const requestParams = qParts.length > 0 ? { q: qParts.join(";") } : {};

      const response = await api.get<NotificationsResponse>(
        `/notifications`,
        requestParams,
        token
      );

      // Handle different response structures
      let notifications: Notification[] = [];
      let pagination: any = null;

      // Check if response has nested data structure
      if (response && typeof response === "object") {
        if ("data" in response && Array.isArray(response.data)) {
          notifications = response.data;
          pagination = response.pagination;
        } else if (Array.isArray(response)) {
          // Response is directly an array
          notifications = response;
        } else if (
          "data" in response &&
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data
        ) {
          // Nested structure: { data: { data: [...], pagination: {...} } }
          notifications = (response.data as any).data || [];
          pagination = (response.data as any).pagination;
        }
      }

      // Ensure notifications have read property (default to false if not present)
      const processedNotifications = notifications.map((notification) => ({
        ...notification,
        read: notification.read ?? false,
      }));

      return {
        data: {
          notifications: processedNotifications,
          pagination: pagination || {
            limit: limit || 10,
            offset: offset || 0,
            total: processedNotifications.length,
            count: processedNotifications.length,
          },
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

  markAsRead: async (notificationId: string): Promise<Result<void>> => {
    try {
      const token = await getToken();
      if (!token) {
        return {
          data: null,
          error: { message: "No authentication token", status: 401 },
        };
      }

      await api.put<void>(
        `/notification/${notificationId}/mark-as-read`,
        {},
        token
      );

      return { data: null, error: null };
    } catch (error: any) {
      const message = toErrorMessage(
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      const status = error?.response?.status;
      return { data: null, error: { message, status } };
    }
  },
};
