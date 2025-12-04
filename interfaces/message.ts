export interface Message {
  id: string;
  content: string;
  username: string;
  mine: boolean;
  createdAt: string;
  readAt?: string | null;
}