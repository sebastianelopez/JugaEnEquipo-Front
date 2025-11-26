import { NotificationState } from ".";
import { Notification } from "../../interfaces/notification";

type NotificationAction =
  | {
      type: "[Notification] - Set notifications";
      payload: Notification[];
    }
  | {
      type: "[Notification] - Add notification";
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

    case "[Notification] - Mark as read":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
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
        isLoading: false,
      };

    default:
      return state;
  }
};
