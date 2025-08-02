import {
  Grid,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useEffect, useState, useRef, useContext } from "react";
import { Conversation } from "../../../interfaces/conversation";
import { Message } from "../../../interfaces/message";
import { chatService } from "../../../services/chat.service";
import { UserContext } from "../../../context/user/UserContext";
import { formatTimeElapsed } from "../../../utils/formatTimeElapsed";
import { useTimeTranslations } from "../../../hooks/useTimeTranslations";

interface ChatWindowProps {
  conversation: Conversation | null;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);
  const timeTranslations = useTimeTranslations();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversation) {
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const conversationMessages = await chatService.getConversationMessages(
          conversation.id
        );
        setMessages(conversationMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const setupSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      const newEventSource = chatService.connectToChat(conversation.id);

      newEventSource.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);

          // Add new message if it's not from the current user
          if (messageData.senderId !== user?._id) {
            setMessages((prev) => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some((msg) => msg.id === messageData.id);
              if (exists) return prev;

              return [...prev, messageData];
            });
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      newEventSource.onerror = (error) => {
        console.error("SSE Error:", error);
      };

      setEventSource(newEventSource);
    };

    loadMessages();
    setupSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [conversation?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !conversation || !user) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      // Generate a temporary ID for the message
      const tempMessageId = `temp-${Date.now()}`;

      // Optimistically add message to UI
      const optimisticMessage: Message = {
        id: tempMessageId,
        body: messageContent,
        createdAt: new Date().toISOString(),
        senderId: user.id,
        senderUsername: user.username,
        conversationId: conversation.id,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      // Send message to server
      await chatService.sendMessage(
        conversation.id,
        tempMessageId,
        messageContent
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== `temp-${Date.now()}`)
      );
      setNewMessage(messageContent); // Restore the message in input
    }
  };

  if (!conversation) {
    return (
      <Grid size={{ xs: 12, md: 7 }} sx={{ height: "100%" }}>
        <Box
          sx={{
            padding: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Selecciona una conversación para empezar a chatear
          </Typography>
        </Box>
      </Grid>
    );
  }

  return (
    <Grid size={{ xs: 12, md: 7 }} sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#fff",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f5f5f5",
          }}
        >
          {onBack && (
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar sx={{ mr: 2 }}>
            {conversation.username[0].toUpperCase()}
          </Avatar>
          <Typography variant="h6" component="h2">
            {conversation.username}
          </Typography>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            padding: 1,
            backgroundColor: "#fafafa",
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography color="text.secondary">
                Cargando mensajes...
              </Typography>
            </Box>
          ) : messages.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography color="text.secondary">
                No hay mensajes aún. ¡Envía el primer mensaje!
              </Typography>
            </Box>
          ) : (
            <List sx={{ py: 1 }}>
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === user?._id;
                const showTimestamp =
                  index === 0 ||
                  new Date(message.createdAt).getTime() -
                    new Date(messages[index - 1].createdAt).getTime() >
                    300000; // 5 minutes

                return (
                  <ListItem
                    key={message.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isOwnMessage ? "flex-end" : "flex-start",
                      py: 0.5,
                    }}
                  >
                    {showTimestamp && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 0.5, textAlign: "center", width: "100%" }}
                      >
                        {formatTimeElapsed(
                          new Date(message.createdAt),
                          timeTranslations
                        )}
                      </Typography>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        padding: 1.5,
                        maxWidth: "70%",
                        backgroundColor: isOwnMessage ? "#1976d2" : "#e0e0e0",
                        color: isOwnMessage ? "white" : "text.primary",
                        borderRadius: 2,
                        ...(isOwnMessage
                          ? {
                              borderBottomRightRadius: 4,
                            }
                          : {
                              borderBottomLeftRadius: 4,
                            }),
                      }}
                    >
                      <ListItemText
                        primary={message.body}
                        primaryTypographyProps={{
                          variant: "body2",
                          sx: { wordBreak: "break-word" },
                        }}
                      />
                    </Paper>
                  </ListItem>
                );
              })}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            display: "flex",
            padding: 2,
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#fff",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            multiline
            maxRows={3}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    disabled={!newMessage.trim()}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
        </Box>
      </Box>
    </Grid>
  );
};
