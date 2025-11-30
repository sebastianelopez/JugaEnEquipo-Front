import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SxProps,
  Theme,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { userService } from "../../../services/user.service";
import { User } from "../../../interfaces";

interface SearchProps {
  sx?: SxProps<Theme>;
}

export const Search = ({ sx }: SearchProps) => {
  const t = useTranslations("Navbar");
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleResultClick = (user: User) => {
    router.push(`/profile/${user.username}`);
    setShowResults(false);
    setIsExpanded(false);
    setSearchTerm("");
  };

  const handleExpand = () => {
    setIsExpanded(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCollapse = () => {
    if (!showResults) {
      setIsExpanded(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      setIsLoading(true);

      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(value);
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsLoading(false);
    }
  };

  const searchUsers = async (term: string) => {
    try {
      const users = (await userService.searchUsers(term)).data;
      setShowResults(true);
      setSearchResults(users || []);
      console.log("Search results:", users);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      ref={searchContainerRef}
      sx={[
        { position: "relative", display: "inline-block", zIndex: 1000 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Input
        placeholder={t("search")}
        disableUnderline={true}
        inputRef={inputRef}
        value={searchTerm}
        onChange={handleSearchInputChange}
        sx={{
          borderRadius: "15px",
          border: "none",
          px: isExpanded ? 1 : 0,
          maxWidth: isExpanded ? 300 : 0,
          boxShadow: "inset 2px 5px 10px rgba(0,0,0,0.3)",
          transition: "max-width 0.3s ease",
          backgroundColor: "background.paper",
        }}
        onBlur={handleCollapse}
        endAdornment={
          isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <IconButton onClick={handleExpand}>
              <SearchOutlined />
            </IconButton>
          )
        }
      />

      {showResults && searchResults.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            maxWidth: 300,
            mt: 1,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <List sx={{ py: 0 }}>
            {searchResults.map((user, index) => (
              <ListItem
                key={user.id || index}
                button
                onClick={() => handleResultClick(user)}
                sx={{
                  borderBottom:
                    index < searchResults.length - 1
                      ? "1px solid #eee"
                      : "none",
                  py: 1,
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.04)",
                  },
                  color: "text.primary",
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar de ${user.username}`}
                    src={user.profileImage}
                    sx={{ width: 40, height: 40 }}
                  >
                    {!user.profileImage &&
                      user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={`${user.firstname} ${user.lastname}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
