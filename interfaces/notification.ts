export type NotificationType =
  | "new_message"
  | "new_follower"
  | "post_commented"
  | "post_liked"
  | "post_shared";

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  username: string;
  postId?: string;
  message: string | null;
  date: string;
  read?: boolean;
}

export interface NotificationsResponse {
  data: Notification[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    count: number;
  };
}
