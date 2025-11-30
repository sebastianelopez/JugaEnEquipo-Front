import React from "react";
import { Link, Theme } from "@mui/material";
import NextLink from "next/link";

/**
 * Parses text and highlights hashtags with brand colors
 * @param text - The text to parse
 * @param theme - MUI theme object
 * @returns Array of React elements with highlighted hashtags
 */
export const parseHashtags = (
  text: string,
  theme: Theme
): React.ReactNode[] => {
  if (!text) return [];

  // Regex to match hashtags: # followed by alphanumeric characters and underscores
  // Updated to handle hashtags at word boundaries
  const hashtagRegex = /#(\w+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = hashtagRegex.exec(text)) !== null) {
    // Add text before the hashtag
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

    // Add the hashtag as a clickable link
    const hashtag = match[1];
    parts.push(
      <NextLink
        key={`hashtag-${keyCounter++}`}
        href={`/hashtag/${encodeURIComponent(hashtag)}`}
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
          {`#${hashtag}`}
        </Link>
      </NextLink>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last hashtag
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
