import {
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { formatTimeElapsed } from "../../../utils/formatTimeElapsed";
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useContext,
} from "react";
import { Conversation } from "../../../interfaces/conversation";
import { User } from "../../../interfaces/user";
import { useTimeTranslations } from "../../../hooks/useTimeTranslations";
import { chatService } from "../../../services/chat.service";
import { UserContext } from "../../../context/user/UserContext";

export interface ConversationsListHandle {
  selectConversation: (conversation: Conversation | null) => void;
}

interface ConversationListProps {
  conversations: Array<Conversation>;
  onSelectConversation?: (conversation: Conversation | null) => void;
  onCreateConversation?: (userId: string) => void;
}

interface SearchResult {
  type: "conversation" | "user";
  data: Conversation | User;
}

export const ConversationsList = forwardRef<
  ConversationsListHandle,
  ConversationListProps
>(({ conversations, onSelectConversation, onCreateConversation }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const timeTranslations = useTimeTranslations();
  const { user } = useContext(UserContext);

  const handleSelectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  const handleCreateConversation = async (userId: string) => {
    if (onCreateConversation) {
      onCreateConversation(userId);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Search in existing conversations
      const filteredConvos = conversations.filter(
        (convo) =>
          convo.username.toLowerCase().includes(value.toLowerCase()) ||
          convo.lastMessage.toLowerCase().includes(value.toLowerCase())
      );

      // Search for users that the current user follows
      const followingUsers = await chatService.searchFollowingUsers(value);

      // Filter out users that already have conversations
      const existingUserIds = conversations
        .map((conv) => conv.otherUserId || conv.otherUser?.id)
        .filter(Boolean);
      const newUsers = followingUsers.filter(
        (followingUser) => !existingUserIds.includes(followingUser.id)
      );

      const results: SearchResult[] = [
        ...filteredConvos.map((conv) => ({
          type: "conversation" as const,
          data: conv,
        })),
        ...newUsers.map((user) => ({ type: "user" as const, data: user })),
      ];

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    }
  };

  useImperativeHandle(ref, () => ({
    selectConversation: (conversation) => {
      handleSelectConversation(conversation);
    },
  }));

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredConversations(conversations);
      setIsSearching(false);
      setSearchResults([]);
    } else {
      // Use debounced search
      const timeoutId = setTimeout(() => {
        handleSearchChange(searchTerm);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, conversations]);

  return (
    <Grid size={{ xs: 12, md: 5 }} sx={{ height: "100%" }}>
      <Box
        sx={{
          padding: 2,
          backgroundColor: "#f0f0f0",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Mensajes
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar mensajes o contactos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {isSearching && searchTerm.trim() !== "" ? (
          // Show search results
          searchResults.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No se encontraron resultados
            </Typography>
          ) : (
            <List
              sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                overflow: "auto",
                maxHeight: "100%",
              }}
            >
              {searchResults.map((result, index) => {
                const key =
                  result.type === "conversation"
                    ? `conversation-${(result.data as Conversation).id}`
                    : `user-${(result.data as User).id}`;

                return (
                  <Box key={key}>
                    {result.type === "conversation" ? (
                      <ListItem
                        button
                        alignItems="flex-start"
                        onClick={() =>
                          handleSelectConversation(result.data as Conversation)
                        }
                        sx={{
                          position: "relative",
                          ...((result.data as Conversation).unread > 0 && {
                            bgcolor: "rgba(25, 118, 210, 0.08)",
                          }),
                          ...(selectedConversation?.id ===
                            (result.data as Conversation).id && {
                            bgcolor: "rgba(25, 118, 210, 0.15)",
                          }),
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {(
                              result.data as Conversation
                            ).username[0].toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between">
                              <Typography
                                component="span"
                                fontWeight={
                                  (result.data as Conversation).unread > 0
                                    ? "bold"
                                    : "normal"
                                }
                              >
                                {(result.data as Conversation).username}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatTimeElapsed(
                                  new Date(
                                    (result.data as Conversation).createdAt
                                  ),
                                  timeTranslations
                                )}
                              </Typography>
                            </Box>
                          }
                          slotProps={{ secondary: { component: "div" } }}
                          secondary={
                            <Box display="flex" justifyContent="space-between">
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                noWrap
                                sx={{
                                  display: "inline",
                                  maxWidth: "80%",
                                  fontWeight:
                                    (result.data as Conversation).unread > 0
                                      ? "medium"
                                      : "normal",
                                }}
                              >
                                {(result.data as Conversation).lastMessage}
                              </Typography>
                              {(result.data as Conversation).unread > 0 && (
                                <Box
                                  sx={{
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {(result.data as Conversation).unread}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ) : (
                      <ListItem
                        button
                        alignItems="flex-start"
                        onClick={() =>
                          handleCreateConversation((result.data as User).id)
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={(result.data as User).profileImage}>
                            {(result.data as User).username[0].toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography component="span">
                                {(result.data as User).username}
                              </Typography>
                              <Chip
                                icon={<PersonAddIcon />}
                                label="Nuevo chat"
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            (result.data as User).firstname &&
                            (result.data as User).lastname
                              ? `${(result.data as User).firstname} ${
                                  (result.data as User).lastname
                                }`
                              : "Usuario seguido"
                          }
                        />
                      </ListItem>
                    )}
                    {index < searchResults.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Box>
                );
              })}
            </List>
          )
        ) : // Show regular conversations list
        filteredConversations.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No se encontraron conversaciones
          </Typography>
        ) : (
          <List
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
              overflow: "auto",
              maxHeight: "100%",
            }}
          >
            {filteredConversations.map((conversation, index) => (
              <Box key={conversation.id}>
                <ListItem
                  button
                  alignItems="flex-start"
                  onClick={() => handleSelectConversation(conversation)}
                  sx={{
                    position: "relative",
                    ...(conversation.unread > 0 && {
                      bgcolor: "rgba(25, 118, 210, 0.08)",
                    }),
                    ...(selectedConversation?.id === conversation.id && {
                      bgcolor: "rgba(25, 118, 210, 0.15)",
                    }),
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{conversation.username[0].toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography
                          component="span"
                          fontWeight={
                            conversation.unread > 0 ? "bold" : "normal"
                          }
                        >
                          {conversation.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatTimeElapsed(
                            new Date(conversation.createdAt),
                            timeTranslations
                          )}
                        </Typography>
                      </Box>
                    }
                    slotProps={{ secondary: { component: "div" } }}
                    secondary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          noWrap
                          sx={{
                            display: "inline",
                            maxWidth: "80%",
                            fontWeight:
                              conversation.unread > 0 ? "medium" : "normal",
                          }}
                        >
                          {conversation.lastMessage}
                        </Typography>
                        {conversation.unread > 0 && (
                          <Box
                            sx={{
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                            }}
                          >
                            {conversation.unread}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredConversations.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Grid>
  );
});
