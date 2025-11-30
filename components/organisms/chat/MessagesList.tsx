import {
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { formatTimeElapsed } from "../../../utils/formatTimeElapsed";
import { Search as SearchIcon } from "@mui/icons-material";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Conversation } from "../../../interfaces/conversation";
import { useTimeTranslations } from "../../../hooks/useTimeTranslations";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

export interface ConversationsListHandle {
  selectConversation: (conversation: Conversation | null) => void;
}

interface ConversationListProps {
  conversations: Array<Conversation>;
  onSelectConversation?: (conversation: Conversation | null) => void;
}

export const ConversationsList = forwardRef<
  ConversationsListHandle,
  ConversationListProps
>(({ conversations, onSelectConversation }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] =
    useState(conversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const timeTranslations = useTimeTranslations();
  const router = useRouter();
  const t = useTranslations("Chat");

  const handleSelectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredConversations(conversations);
      return;
    }

    // Search only in existing conversations
    const filteredConvos = conversations.filter(
      (convo) =>
        convo.otherUsername?.toLowerCase().includes(value.toLowerCase()) ||
        convo.lastMessageText?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredConversations(filteredConvos);
  };

  useImperativeHandle(ref, () => ({
    selectConversation: (conversation) => {
      handleSelectConversation(conversation);
    },
  }));

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredConversations(conversations);
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
          {t("title")}
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

        {filteredConversations.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            {searchTerm.trim() !== ""
              ? "No se encontraron conversaciones"
              : "No tienes conversaciones aún"}
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
            {filteredConversations.map((conversation, index) => {
              // Ensure conversation.id is a string and unique
              const conversationId =
                typeof conversation.id === "string"
                  ? conversation.id
                  : String(conversation.id || index);

              return (
                <Box key={conversationId}>
                  <ListItemButton
                    alignItems="flex-start"
                    onClick={() => handleSelectConversation(conversation)}
                    sx={{
                      position: "relative",
                      ...(true && {
                        // conversation.unread > 0 && {
                        bgcolor: "rgba(25, 118, 210, 0.08)",
                      }),
                      ...(selectedConversation?.id === conversation.id && {
                        bgcolor: "rgba(25, 118, 210, 0.15)",
                      }),
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={conversation.otherProfileImage ?? undefined}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography
                            component="span"
                            fontWeight={
                              // conversation.unread > 0 ? "bold" : "normal"
                              "normal"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (conversation.otherUsername) {
                                router.push(
                                  `/profile/${conversation.otherUsername}`
                                );
                              }
                            }}
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {conversation.otherUsername}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTimeElapsed(
                              new Date(conversation.lastMessageDate ?? ""),
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
                                // conversation.unread > 0 ? "medium" : "normal"
                                "normal",
                            }}
                          >
                            {conversation.lastMessageText}
                          </Typography>
                          {/* {conversation.unread > 0 && ( */}
                          {true && (
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
                              {/* {conversation.unread} */}
                              {0}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                  {index < filteredConversations.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              );
            })}
          </List>
        )}
      </Box>
    </Grid>
  );
});
