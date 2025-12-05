import React from "react";
import { Link, Theme } from "@mui/material";
import NextLink from "next/link";

/**
 * Parses post text to highlight both hashtags and mentions
 * @param text - The text to parse
 * @param theme - MUI theme object
 * @returns Array of React elements with highlighted hashtags and mentions
 */
export const parsePostText = (
  text: string,
  theme: Theme
): React.ReactNode[] => {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  let keyCounter = 0;

  // Find all matches (mentions and hashtags)
  const mentionRegex = /@([^\s@]+)/g;
  const hashtagRegex = /#(\w+)/g;

  const matches: Array<{
    index: number;
    length: number;
    type: "mention" | "hashtag";
    value: string;
  }> = [];

  let match;
  while ((match = mentionRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "mention",
      value: match[1],
    });
  }

  while ((match = hashtagRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "hashtag",
      value: match[1],
    });
  }

  // Sort by index
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches (keep the first one)
  const filteredMatches: typeof matches = [];
  for (const currentMatch of matches) {
    let overlaps = false;
    for (const existingMatch of filteredMatches) {
      const currentEnd = currentMatch.index + currentMatch.length;
      const existingEnd = existingMatch.index + existingMatch.length;

      if (
        (currentMatch.index >= existingMatch.index &&
          currentMatch.index < existingEnd) ||
        (currentEnd > existingMatch.index && currentEnd <= existingEnd) ||
        (currentMatch.index <= existingMatch.index &&
          currentEnd >= existingEnd)
      ) {
        overlaps = true;
        break;
      }
    }
    if (!overlaps) {
      filteredMatches.push(currentMatch);
    }
  }

  // Build result
  let lastIndex = 0;

  for (const matchItem of filteredMatches) {
    // Add text before the match
    if (matchItem.index > lastIndex) {
      const textBefore = text.substring(lastIndex, matchItem.index);
      if (textBefore) {
        parts.push(
          <React.Fragment key={`text-${keyCounter++}`}>
            {textBefore}
          </React.Fragment>
        );
      }
    }

    // Add the match
    if (matchItem.type === "mention") {
      parts.push(
        <NextLink
          key={`mention-${keyCounter++}`}
          href={`/profile/${encodeURIComponent(matchItem.value)}`}
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
            {`@${matchItem.value}`}
          </Link>
        </NextLink>
      );
    } else {
      parts.push(
        <NextLink
          key={`hashtag-${keyCounter++}`}
          href={`/hashtag/${encodeURIComponent(matchItem.value)}`}
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
            {`#${matchItem.value}`}
          </Link>
        </NextLink>
      );
    }

    lastIndex = matchItem.index + matchItem.length;
  }

  // Add remaining text
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
