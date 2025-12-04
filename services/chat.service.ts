import { getToken } from "./auth.service";
import { userService } from "./user.service";
import { Message } from "../interfaces/message";
import { User } from "../interfaces/user";
import { Conversation } from "../interfaces/conversation";
import { api } from "../lib/api"; // Asegúrate de importar la instancia de axios

const MERCURE_URL = "https://mercure.jugaenequipo.com";

export type MessagesResponse = {
  data: Message[];
};

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

export const chatService = {
  // Create an SSE connection to listen for messages using Mercure
  connectToChat: (conversationId: string) => {
    // Use the working format: Full URL without double /api
    const topicUrl = `https://api.jugaenequipo.com/conversation/${conversationId}`;
    const encodedTopic = encodeURIComponent(topicUrl);
    const url = `${MERCURE_URL}/.well-known/mercure?topic=${encodedTopic}`;

    const eventSource = new EventSource(url, {
      withCredentials: false,
    });

    return eventSource;
  },

  // Send a new message
  sendMessage: async (
    conversationId: string,
    messageId: string,
    content: string
  ): Promise<Result<unknown>> => {
    try {
      const token = await getToken();
      const response = await api.put(
        `/conversation/${conversationId}/message/${messageId}`,
        { content },
        token
      );
      return { data: response, error: null };
    } catch (error: any) {
      const message = toErrorMessage(
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      const status = error?.response?.status;
      return { data: null, error: { message, status } };
    }
  },

  // Get conversation messages
  getConversationMessages: async (
    conversationId: string
  ): Promise<Result<Message[]>> => {
    try {
      const token = await getToken();
      const response = await api.get<MessagesResponse>(
        `/conversation/${conversationId}/messages`,
        undefined,
        token
      );
      return { data: response.data || [], error: null };
    } catch (error: any) {
      const message = toErrorMessage(
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      const status = error?.response?.status;
      return { data: null, error: { message, status } };
    }
  },

  // Find conversation by other user ID
  findConversationByUserId: async (
    userId: string
  ): Promise<Result<Conversation | null>> => {
    try {
      const token = await getToken();
      const response = await api.get<{ data: Conversation }>(
        `/conversation/by-other-user/${userId}`,
        {},
        token
      );
      return { data: response.data, error: null };
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return { data: null, error: { message: "Not found", status: 404 } };
      }
      const message = toErrorMessage(
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      const status = error?.response?.status;
      return { data: null, error: { message, status } };
    }
  },

  // Get all conversations
  getAllConversations: async (): Promise<
    Result<{ conversations: Conversation[]; totalUnreadMessages: number }>
  > => {
    try {
      const token = await getToken();
      const response = await api.get<{
        data: Conversation[];
        metadata?: { totalUnreadMessages?: number };
      }>(`/conversations`, {}, token);

      // Handle both response structures: response.data.data or response.data
      const conversationsData = (response as any).data?.data || response.data || [];
      const conversations: Conversation[] = conversationsData.map(
        (conv: any) => ({
          id: conv.id,
          otherUserId: conv.otherUserId,
          otherUsername: conv.otherUsername,
          otherFirstname: conv.otherFirstname,
          otherLastname: conv.otherLastname,
          otherProfileImage: conv.otherProfileImage,
          lastMessageText: conv.lastMessageText,
          lastMessageDate: conv.lastMessageDate,
          unreadCount: conv.unreadCount ?? 0,
        })
      );

      // Get metadata from response (could be response.metadata or response.data.metadata)
      const metadata = (response as any).metadata || (response as any).data?.metadata;
      const totalUnreadMessages = metadata?.totalUnreadMessages ?? 0;

      return {
        data: { conversations, totalUnreadMessages },
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

  // Get total unread messages count
  getTotalUnreadMessages: async (): Promise<Result<number>> => {
    try {
      const token = await getToken();
      const response = await api.get<{
        data: Conversation[];
        metadata?: { totalUnreadMessages?: number };
      }>(`/conversations`, {}, token);

      // Get metadata from response (could be response.metadata or response.data.metadata)
      const metadata = (response as any).metadata || (response as any).data?.metadata;
      const totalUnreadMessages = metadata?.totalUnreadMessages ?? 0;

      return { data: totalUnreadMessages, error: null };
    } catch (error: any) {
      const message = toErrorMessage(
        error?.response?.data?.message || error?.message || "Unknown error"
      );
      const status = error?.response?.status;
      return { data: null, error: { message, status } };
    }
  },

  // Mark a message as read
  markMessageAsRead: async (
    conversationId: string,
    messageId: string
  ): Promise<Result<void>> => {
    try {
      const token = await getToken();
      await api.put(
        `/conversation/${conversationId}/message/${messageId}/mark-as-read`,
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

  // Search users that the current user follows (delegated to userService)
  searchFollowingUsers: async (searchTerm: string): Promise<User[]> => {
    const result = await userService.searchFollowingUsers({
      query: searchTerm,
    });
    return result.users;
  },
};
