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
import { FeedbackContext } from "../feedback/FeedbackContext";

export interface NotificationState {
  notifications: Notification[];
  messageNotifications: Notification[];
  isLoading: boolean;
}

const NOTIFICATION_INITIAL_STATE: NotificationState = {
  notifications: [],
  messageNotifications: [],
  isLoading: false,
};

export const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useContext(UserContext);
  const feedbackContext = useContext(FeedbackContext);
  const [state, dispatch] = useReducer(
    notificationReducer,
    NOTIFICATION_INITIAL_STATE
  );
  const previousUserIdRef = useRef<string | undefined>(undefined);
  const processedModerationNotificationsRef = useRef<Set<string>>(new Set());

  const unreadCount = state.notifications.filter(
    (n) => n.read === undefined || !n.read
  ).length;
  const unreadChatCount = state.messageNotifications.filter(
    (n) => n.read === undefined || !n.read
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
      if (result.data) {
        // Separar notificaciones de mensajes del resto
        const allNotifications = result.data.notifications;
        const messageNotifications = allNotifications.filter(
          (n) => n.type === "new_message"
        );
        const otherNotifications = allNotifications.filter(
          (n) => n.type !== "new_message" && n.type !== "post_moderated"
        );

        dispatch({
          type: "[Notification] - Set notifications",
          payload: otherNotifications,
        });
        dispatch({
          type: "[Notification] - Set message notifications",
          payload: messageNotifications,
        });
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      dispatch({ type: "[Notification] - Set loading", payload: false });
    }
  }, []);

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
              
              // Handle post_moderated notifications - show alert to user and remove optimistic post
              if (notification.type === "post_moderated") {
                // Only show once per notification ID to avoid duplicates
                if (!processedModerationNotificationsRef.current.has(notification.id)) {
                  processedModerationNotificationsRef.current.add(notification.id);
                  
                  // Show error dialog to inform user
                  if (feedbackContext?.showError) {
                    feedbackContext.showError({
                      title: "Publicación moderada",
                      message: notification.message || 
                        "Tu publicación ha sido moderada y no se ha publicado debido a contenido inapropiado. Por favor, revisa nuestras políticas de comunidad.",
                    });
                  }
                  
                  // Emit custom event to remove optimistic post if postId is available
                  if (notification.postId) {
                    const removePostEvent = new CustomEvent("postModerated", {
                      detail: { postId: notification.postId },
                    });
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(removePostEvent);
                    }
                  }
                  
                  // Clean up old processed notifications (keep last 100)
                  if (processedModerationNotificationsRef.current.size > 100) {
                    const idsArray = Array.from(processedModerationNotificationsRef.current);
                    processedModerationNotificationsRef.current = new Set(
                      idsArray.slice(-100)
                    );
                  }
                }
                // Don't add post_moderated notifications to the list - return early
                return;
              }
              
              if (notification.type === "new_message") {
                dispatch({
                  type: "[Notification] - Add message notification",
                  payload: notification,
                });
              } else {
                addNotification(notification);
              }
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
        messageNotifications: state.messageNotifications,
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
