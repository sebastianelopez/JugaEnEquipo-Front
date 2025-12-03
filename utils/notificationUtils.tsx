import React from "react";
import { Typography } from "@mui/material";
import { NotificationType } from "../interfaces/notification";

/**
 * Gets the translation key for a notification type
 * @param type - The notification type
 * @returns The translation key for the notification message
 */
export const getNotificationTranslationKey = (
  type: NotificationType
): string => {
  const translationKeys: Record<NotificationType, string> = {
    new_message: "newMessage",
    new_follower: "newFollower",
    post_commented: "postCommented",
    post_liked: "postLiked",
    post_shared: "postShared",
    team_request_received: "teamRequestReceived",
    tournament_request_received: "tournamentRequestReceived",
  };
  return translationKeys[type] || "newMessage";
};

/**
 * Renders a notification message with the username highlighted in bold
 * @param type - The notification type
 * @param username - The username to highlight in bold
 * @param customMessage - Optional custom message from backend (if provided, use it instead)
 * @param translationFn - Function to get translations (from useTranslations hook)
 * @param isRead - Whether the notification has been read
 * @returns React node with formatted notification message
 */
export const renderNotificationMessage = (
  type: NotificationType,
  username: string,
  customMessage: string | null,
  translationFn: (key: string, values?: Record<string, string>) => string,
  isRead: boolean
): React.ReactNode => {
  // Get the message to display
  let messageTemplate: string;
  
  if (customMessage) {
    // If there's a custom message from backend, use it
    messageTemplate = customMessage;
  } else {
    // Get the translation key for this notification type
    const translationKey = getNotificationTranslationKey(type);
    messageTemplate = translationFn(`Notifications.${translationKey}`, {
      username,
    });
  }

  // Split message to highlight ONLY username in bold, rest stays normal weight
  const parts: React.ReactNode[] = [];
  const regex = new RegExp(
    `(${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "g"
  );
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(messageTemplate)) !== null) {
    // Add text before the match (normal weight)
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++}>
          {messageTemplate.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add the username in bold
    parts.push(
      <Typography
        key={key++}
        component="span"
        sx={{
          fontWeight: "bold",
        }}
      >
        {username}
      </Typography>
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text (normal weight)
  if (lastIndex < messageTemplate.length) {
    parts.push(
      <span key={key++}>{messageTemplate.substring(lastIndex)}</span>
    );
  }

  return (
    <Typography
      component="span"
      sx={{
        fontWeight: "normal", // Always normal weight for the container
      }}
    >
      {parts.length > 0 ? parts : messageTemplate}
    </Typography>
  );
};

