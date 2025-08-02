import { getToken } from "./auth.service";
import { userService } from "./user.service";
import { Conversation } from "../interfaces/conversation";
import { Message } from "../interfaces/message";
import { User } from "../interfaces/user";
import { api } from "../lib/api"; // Asegúrate de importar la instancia de axios

const MERCURE_URL = "https://mercure.jugaenequipo.com";

export type ConversationIdResponse = {
  data: {
    id: string;
  };
};

export const chatService = {
  // Create an SSE connection to listen for messages using Mercure
  connectToChat: (conversationId: string) => {
    const eventSource = new EventSource(
      `${MERCURE_URL}/.well-known/mercure?topic=${process.env.NEXT_PUBLIC_API_URL}/conversation/${conversationId}`,
      { withCredentials: false }
    );

    return eventSource;
  },

  // Send a new message
  sendMessage: async (
    conversationId: string,
    messageId: string,
    content: string
  ) => {
    const token = await getToken();

    const response = await api.put(
      `/conversation/${conversationId}/message/${messageId}`,
      { content },
      token
    );

    return response;
  },

  // Get conversation messages
  getConversationMessages: async (
    conversationId: string
  ): Promise<Message[]> => {
    const token = await getToken();

    const data: any = await api.get(
      `/conversation/${conversationId}/messages`,
      undefined,
      token
    );
    return data.data || [];
  },

  // Find conversation by other user ID
  findConversationByUserId: async (userId: string): Promise<string | null> => {
    const token = await getToken();
    try {
      // Usar el proxy local y la instancia de axios (api)
      const response = await api.get<ConversationIdResponse>(
        `/conversation/by-other-user/${userId}`,
        {},
        token
      );
      return response.data.id;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // No conversation exists
      }
      console.error("Error finding conversation:", error);
      return null;
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
