import { useEffect, useState, useContext, useCallback } from "react";
import { chatService } from "../services/chat.service";
import { UserContext } from "../context/user/UserContext";
import { NotificationContext } from "../context/notification";

export const useUnreadMessages = () => {
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const { messageNotifications } = useContext(NotificationContext);

  const refreshUnreadCount = useCallback(async () => {
    if (!user) {
      setTotalUnreadMessages(0);
      return;
    }

    try {
      setIsLoading(true);
      const result = await chatService.getTotalUnreadMessages();
      if (result.data !== null) {
        setTotalUnreadMessages(result.data);
      }
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  // Refresh when a new message notification arrives
  useEffect(() => {
    if (messageNotifications.length > 0) {
      // Debounce to avoid too many requests
      const timeoutId = setTimeout(() => {
        refreshUnreadCount();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [messageNotifications.length, refreshUnreadCount]);

  return { totalUnreadMessages, refreshUnreadCount, isLoading };
};

