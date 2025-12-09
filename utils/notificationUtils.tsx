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
    post_moderated: "postModerated",
    team_request_received: "teamRequestReceived",
    tournament_request_received: "tournamentRequestReceived",
    team_request_accepted: "teamRequestAccepted",
    tournament_request_accepted: "tournamentRequestAccepted",
    user_mentioned: "userMentioned",
  };
  return translationKeys[type] || "newMessage";
};

/**
 * Renders a notification message with the username, teamName, and tournamentName highlighted in bold
 * @param type - The notification type
 * @param username - The username to highlight in bold (can be null or undefined)
 * @param customMessage - Optional custom message from backend (if provided, use it instead)
 * @param translationFn - Function to get translations (from useTranslations hook)
 * @param isRead - Whether the notification has been read
 * @param teamName - Optional team name to include in the message (will be highlighted in bold)
 * @param tournamentName - Optional tournament name to include in the message (will be highlighted in bold)
 * @returns React node with formatted notification message
 */
export const renderNotificationMessage = (
  type: NotificationType,
  username: string | null | undefined,
  customMessage: string | null,
  translationFn: (key: string, values?: Record<string, string>) => string,
  isRead: boolean,
  teamName?: string | null,
  tournamentName?: string | null
): React.ReactNode => {
  // Handle null/undefined username
  const safeUsername = username || "Someone";
  
  // Get the message to display
  let messageTemplate: string;
  
  if (customMessage) {
    // If there's a custom message from backend, use it
    messageTemplate = customMessage;
  } else {
    // Get the translation key for this notification type
    const translationKey = getNotificationTranslationKey(type);
    
    // Build values object for translation
    const translationValues: Record<string, string> = {
      username: safeUsername,
    };
    
    // Add teamName if available and relevant
    if (teamName && (type === "team_request_received" || type === "team_request_accepted")) {
      translationValues.teamName = ` ${teamName}`;
    } else if (type === "team_request_received" || type === "team_request_accepted") {
      // If team name is not available, use empty string to avoid showing placeholder
      translationValues.teamName = "";
    }
    
    // Add tournamentName if available and relevant
    if (tournamentName && (type === "tournament_request_received" || type === "tournament_request_accepted")) {
      translationValues.tournamentName = ` ${tournamentName}`;
    } else if (type === "tournament_request_received" || type === "tournament_request_accepted") {
      // If tournament name is not available, use empty string to avoid showing placeholder
      translationValues.tournamentName = "";
    }
    
    messageTemplate = translationFn(`Notifications.${translationKey}`, translationValues);
  }

  // Build list of terms to highlight in bold
  const boldTerms: string[] = [safeUsername];
  
  if (teamName && (type === "team_request_received" || type === "team_request_accepted")) {
    boldTerms.push(teamName.trim());
  }
  
  if (tournamentName && (type === "tournament_request_received" || type === "tournament_request_accepted")) {
    boldTerms.push(tournamentName.trim());
  }

  // Create a regex pattern that matches any of the bold terms
  // Escape special regex characters and sort by length (longest first) to avoid partial matches
  const escapedTerms = boldTerms
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  
  const regex = new RegExp(`(${escapedTerms.join("|")})`, "g");
  
  // Split message to highlight username, teamName, and tournamentName in bold
  const parts: React.ReactNode[] = [];
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

    // Add the matched term in bold
    parts.push(
      <Typography
        key={key++}
        component="span"
        sx={{
          fontWeight: "bold",
        }}
      >
        {match[0]}
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

