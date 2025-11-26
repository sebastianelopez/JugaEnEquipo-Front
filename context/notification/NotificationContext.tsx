import { createContext } from "react";
import { Notification } from "../../interfaces/notification";

interface NotificationProps {
  notifications: Notification[];
  unreadCount: number;
  unreadChatCount: number;
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export const NotificationContext = createContext({} as NotificationProps);
