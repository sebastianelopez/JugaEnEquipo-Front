import { getToken } from "./auth.service";

export const chatService = {
  // Create an SSE connection to listen for messages
  connectToChat: (chatId: string) => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/events`,
      { withCredentials: true }
    );

    return eventSource;
  },

  // Send a new message (regular HTTP request)
  sendMessage: async (chatId: string, content: string) => {
    const token = await getToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    return response.json();
  },

  // Get chat history
  getChatHistory: async (chatId: string) => {
    const token = await getToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/${chatId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.json();
  },

  getOrCreateChatWithUser: async (username: string) => {
    const token = await getToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/with/${username}`,
      {
        method: "POST", // Using POST to create if it doesn't exist
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to initialize chat");
    }

    return response.json();
  },
};
