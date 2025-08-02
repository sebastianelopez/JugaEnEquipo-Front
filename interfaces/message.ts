export interface Message {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  senderUsername: string;
  conversationId?: string;
}

export interface SSEMessageData {
  id: string;
  content: string;
  username: string;
  mine: boolean;
  createdAt: string;
}
