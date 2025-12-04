import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { Close, SearchOutlined } from "@mui/icons-material";
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
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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
    setSelectedIndex(-1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      setIsLoading(true);
      setHasSearched(false);

      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(value);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsLoading(false);
      setHasSearched(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setTotalResults(0);
    setShowResults(false);
    setHasSearched(false);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const searchUsers = async (term: string) => {
    try {
      const response = await userService.searchUsers({ username: term });
      const users = response || [];
      const total = users.length;
      setHasSearched(true);
      setShowResults(true);
      // Limit to maximum 3 results
      setSearchResults(users.slice(0, 3));
      setTotalResults(total);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Error searching users:", error);
      setHasSearched(true);
      setShowResults(true);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvancedSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search/${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
      setIsExpanded(false);
      setSearchTerm("");
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isExpanded || !showResults) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (
        e.key === "Enter" &&
        selectedIndex >= 0 &&
        searchResults[selectedIndex]
      ) {
        e.preventDefault();
        const selectedUser = searchResults[selectedIndex];
        router.push(`/profile/${selectedUser.username}`);
        setShowResults(false);
        setIsExpanded(false);
        setSearchTerm("");
      } else if (e.key === "Escape") {
        setShowResults(false);
        setIsExpanded(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded, showResults, selectedIndex, searchResults, router]);

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
        onFocus={() => {
          if (searchTerm.trim() && searchResults.length > 0) {
            setShowResults(true);
          }
        }}
        endAdornment={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isLoading ? (
              <CircularProgress size={20} />
            ) : searchTerm && isExpanded ? (
              <IconButton size="small" onClick={handleClearSearch} edge="end">
                <Close fontSize="small" />
              </IconButton>
            ) : (
              <IconButton onClick={handleExpand} edge="end">
                <SearchOutlined />
              </IconButton>
            )}
          </Box>
        }
      />

      {showResults && (
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
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          {searchResults.length > 0 ? (
            <>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {totalResults > 3
                    ? t("showingResults", {
                        showing: searchResults.length,
                        total: totalResults,
                      })
                    : t("results") + ` (${totalResults})`}
                </Typography>
              </Box>
              <List sx={{ py: 0 }}>
                {searchResults.map((user, index) => (
                  <ListItem
                    key={user.id || index}
                    disablePadding
                    sx={{
                      borderBottom:
                        index < searchResults.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleResultClick(user)}
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
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleAdvancedSearch}
                  sx={{ textTransform: "none" }}
                >
                  {t("advancedSearch")}
                </Button>
              </Box>
            </>
          ) : hasSearched && !isLoading ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {t("noResults")}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleAdvancedSearch}
                sx={{ mt: 2, textTransform: "none" }}
                fullWidth
              >
                {t("advancedSearch")}
              </Button>
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};
