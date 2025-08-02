export interface Conversation {
  id: string;
  username: string;
  lastMessage: string;
  unread: number;
  createdAt: string;
  otherUserId?: string;
  otherUser?: {
    id: string;
    username: string;
    firstname?: string;
    lastname?: string;
    profileImage?: string;
  };
}
