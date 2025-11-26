import {
  FC,
  PropsWithChildren,
  useEffect,
  useReducer,
  useCallback,
  useContext,
  useRef,
} from "react";
import { NotificationContext } from "./NotificationContext";
import { notificationReducer } from "./notificationReducer";
import { notificationService } from "../../services/notification.service";
import { Notification } from "../../interfaces/notification";
import { getToken } from "../../services/auth.service";
import { UserContext } from "../user";
import { decodeUserIdByToken } from "../../utils/decodeIdByToken";

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
}

const NOTIFICATION_INITIAL_STATE: NotificationState = {
  notifications: [],
  isLoading: false,
};

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useContext(UserContext);
  const [state, dispatch] = useReducer(
    notificationReducer,
    NOTIFICATION_INITIAL_STATE
  );
  const previousUserIdRef = useRef<string | undefined>(undefined);

  const unreadCount = state.notifications.filter(
    (n) => n.read === undefined || !n.read
  ).length;
  const unreadChatCount = state.notifications.filter(
    (n) => n.type === "new_message" && (n.read === undefined || !n.read)
  ).length;

  const setNotifications = useCallback((notifications: Notification[]) => {
    dispatch({
      type: "[Notification] - Set notifications",
      payload: notifications,
    });
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    dispatch({
      type: "[Notification] - Add notification",
      payload: notification,
    });
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const result = await notificationService.markAsRead(notificationId);
      if (result.error) {
        console.error("Error marking notification as read:", result.error);
        return;
      }
      dispatch({
        type: "[Notification] - Mark as read",
        payload: notificationId,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      dispatch({ type: "[Notification] - Set loading", payload: true });
      const result = await notificationService.getNotifications(20, 0);
      console.log("result", result);
      if (result.data) {
        setNotifications(result.data.notifications);
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      dispatch({ type: "[Notification] - Set loading", payload: false });
    }
  }, [setNotifications]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isMounted = true;

    const initializeNotifications = async () => {
      try {
        const token = await getToken();
        if (!token || !isMounted) {
          return;
        }

        let userId: string | undefined = user?.id;
        if (!userId) {
          try {
            userId = decodeUserIdByToken(token);
          } catch (error) {
            console.error("Error decoding user ID from token:", error);
            return;
          }
        }

        if (!userId || !isMounted) {
          return;
        }

        if (
          previousUserIdRef.current !== undefined &&
          previousUserIdRef.current !== userId
        ) {
          dispatch({ type: "[Notification] - Clear notifications" });
        }
        previousUserIdRef.current = userId;

        await refreshNotifications();

        if (!isMounted) {
          return;
        }

        // Connect to Mercure for real-time updates
        try {
          eventSource = notificationService.connectToNotifications(userId);

          eventSource.onopen = () => {
            console.log("Mercure notification connection established");
          };

          eventSource.onmessage = (event) => {
            try {
              const notification: Notification = {
                ...JSON.parse(event.data),
                read: false,
              };
              addNotification(notification);
            } catch (error) {
              console.error("Error parsing notification:", error);
            }
          };

          eventSource.onerror = (error) => {
            if (eventSource?.readyState === EventSource.CLOSED) {
              console.warn("Mercure notification connection closed");
              // Attempt to reconnect after a delay if component is still mounted
              if (isMounted) {
                reconnectTimeout = setTimeout(() => {
                  if (isMounted) {
                    initializeNotifications();
                  }
                }, 5000);
              }
            }
          };
        } catch (error) {
          console.error("Error connecting to Mercure:", error);
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    initializeNotifications();

    return () => {
      isMounted = false;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [addNotification, refreshNotifications, user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        unreadChatCount,
        isLoading: state.isLoading,
        setNotifications,
        addNotification,
        markAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
