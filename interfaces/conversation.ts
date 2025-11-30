export interface Conversation {
  id: string;
  otherUserId: string | null;
  otherUsername: string | null;
  otherFirstname: string | null;
  otherLastname: string | null;
  otherProfileImage: string | null;
  lastMessageText: string | null;
  lastMessageDate: string | null;
}
