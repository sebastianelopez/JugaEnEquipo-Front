import { NotificationState } from ".";
import { Notification } from "../../interfaces/notification";

type NotificationAction =
  | {
      type: "[Notification] - Set notifications";
      payload: Notification[];
    }
  | {
      type: "[Notification] - Set message notifications";
      payload: Notification[];
    }
  | {
      type: "[Notification] - Add notification";
      payload: Notification;
    }
  | {
      type: "[Notification] - Add message notification";
      payload: Notification;
    }
  | {
      type: "[Notification] - Mark as read";
      payload: string;
    }
  | {
      type: "[Notification] - Set loading";
      payload: boolean;
    }
  | {
      type: "[Notification] - Clear notifications";
    };

export const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case "[Notification] - Set notifications":
      return {
        ...state,
        notifications: action.payload,
        isLoading: false,
      };

    case "[Notification] - Set message notifications":
      return {
        ...state,
        messageNotifications: action.payload,
        isLoading: false,
      };

    case "[Notification] - Add notification":
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id
      );
      if (exists) {
        return state;
      }
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case "[Notification] - Add message notification":
      const messageExists = state.messageNotifications.some(
        (n) => n.id === action.payload.id
      );
      if (messageExists) {
        return state;
      }
      return {
        ...state,
        messageNotifications: [action.payload, ...state.messageNotifications],
      };

    case "[Notification] - Mark as read":
      const updatedNotifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? { ...notification, read: true }
          : notification
      );
      const updatedMessageNotifications = state.messageNotifications.map(
        (notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        messageNotifications: updatedMessageNotifications,
      };

    case "[Notification] - Set loading":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "[Notification] - Clear notifications":
      return {
        ...state,
        notifications: [],
        messageNotifications: [],
        isLoading: false,
      };

    default:
      return state;
  }
};
