import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { User } from "../../../interfaces/user";
import { userService } from "../../../services/user.service";

interface MentionAutocompleteProps {
  searchTerm: string;
  onSelectUser: (user: User) => void;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  cursorPosition?: number;
  textContent?: string;
}

export const MentionAutocomplete = ({
  searchTerm,
  onSelectUser,
  anchorEl,
  onClose,
  cursorPosition,
  textContent,
}: MentionAutocompleteProps) => {
  const t = useTranslations("Publication");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim().length > 0) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(searchTerm.trim());
      }, 300);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const searchUsers = async (term: string) => {
    try {
      const response = await userService.searchUsers({
        username: term,
      });
      const users = response || [];
      setSearchResults(users.slice(0, 5));
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = useCallback((user: User) => {
    onSelectUser(user);
    onClose();
  }, [onSelectUser, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!anchorEl || searchTerm.trim().length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (
        e.key === "Enter" &&
        selectedIndex >= 0 &&
        searchResults[selectedIndex]
      ) {
        e.preventDefault();
        e.stopPropagation();
        handleUserSelect(searchResults[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    if (anchorEl && searchTerm.trim().length > 0) {
      document.addEventListener("keydown", handleKeyDown, true);
      return () => {
        document.removeEventListener("keydown", handleKeyDown, true);
      };
    }
  }, [anchorEl, searchResults, selectedIndex, searchTerm, onClose, handleUserSelect]);

  if (!anchorEl) {
    return null;
  }

  if (searchTerm.trim().length === 0 && !isLoading) {
    return null;
  }

  const calculateCursorPosition = () => {
    if (!anchorEl) {
      return { top: 0, left: 0, width: 300 };
    }

    const inputElement = anchorEl as HTMLInputElement | HTMLTextAreaElement;
    const inputRect = inputElement.getBoundingClientRect();
    const style = window.getComputedStyle(inputElement);
    
    let topPosition = inputRect.bottom + 4;
    let leftPosition = inputRect.left;
    
    if (cursorPosition !== undefined && textContent && cursorPosition >= 0) {
      try {
        const lines = textContent.substring(0, cursorPosition).split('\n');
        const currentLine = lines[lines.length - 1];
        const lineNumber = lines.length - 1;
        
        const fontSize = parseFloat(style.fontSize);
        const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
        const paddingTop = parseFloat(style.paddingTop) || 0;
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        
        topPosition = inputRect.top + paddingTop + (lineNumber * lineHeight) + lineHeight + 4;
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const textWidth = context.measureText(currentLine).width;
          leftPosition = inputRect.left + paddingLeft + textWidth;
        } else {
          leftPosition = inputRect.left + paddingLeft + (currentLine.length * fontSize * 0.6);
        }
      } catch (error) {
        console.error("Error calculating cursor position:", error);
        topPosition = inputRect.bottom + 4;
        leftPosition = inputRect.left;
      }
    }
    
    return {
      top: topPosition,
      left: leftPosition,
      width: Math.max(inputRect.width, 300),
    };
  };

  const position = calculateCursorPosition();

  const autocompleteContent = (
    <Paper
      sx={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: position.width,
        maxWidth: 400,
        maxHeight: 300,
        overflowY: "auto",
        zIndex: 1400,
        boxShadow: 3,
        mt: 0.5,
      }}
    >
      {isLoading ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <CircularProgress size={24} />
        </Box>
      ) : searchResults.length > 0 ? (
        <List sx={{ py: 0 }}>
          {searchResults.map((user, index) => (
            <ListItem
              key={user.id}
              disablePadding
              sx={{
                borderBottom:
                  index < searchResults.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <ListItemButton
                onClick={() => handleUserSelect(user)}
                selected={selectedIndex === index}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={`${user.firstname} ${user.lastname}`}
                    src={user.profileImage}
                    sx={{ width: 40, height: 40 }}
                  >
                    {!user.profileImage &&
                      (user.firstname?.[0] || user.username?.[0] || "U").toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={`${user.firstname} ${user.lastname}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : searchTerm.trim().length > 0 && !isLoading ? (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {t("noUsersFound")}
          </Typography>
        </Box>
      ) : null}
    </Paper>
  );

  if (typeof window !== "undefined") {
    return createPortal(autocompleteContent, document.body);
  }

  return null;
};

