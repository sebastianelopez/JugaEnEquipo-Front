import React from "react";
import { Link, Theme } from "@mui/material";
import NextLink from "next/link";

/**
 * Parses text and highlights mentions (words starting with @) with brand colors
 * Mentions can contain symbols and are clickable to navigate to user profiles
 * @param text - The text to parse
 * @param theme - MUI theme object
 * @returns Array of React elements with highlighted mentions
 */
export const parseMentions = (
  text: string,
  theme: Theme
): React.ReactNode[] => {
  if (!text) return [];

  // Regex to match mentions: @ followed by word characters and symbols (until space or end)
  // This allows mentions like @username, @user_name, @user.name, etc.
  const mentionRegex = /@([^\s@]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before the mention
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore) {
        parts.push(
          <React.Fragment key={`text-${keyCounter++}`}>
            {textBefore}
          </React.Fragment>
        );
      }
    }

    // Add the mention as a clickable link
    const username = match[1];
    parts.push(
      <NextLink
        key={`mention-${keyCounter++}`}
        href={`/profile/${encodeURIComponent(username)}`}
        passHref
      >
        <Link
          component="span"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
              color: theme.palette.primary.dark,
            },
          }}
        >
          {`@${username}`}
        </Link>
      </NextLink>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last mention
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    if (textAfter) {
      parts.push(
        <React.Fragment key={`text-${keyCounter++}`}>
          {textAfter}
        </React.Fragment>
      );
    }
  }

  return parts.length > 0 ? parts : [text];
};

