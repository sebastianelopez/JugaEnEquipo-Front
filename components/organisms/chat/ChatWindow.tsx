import {
  Grid,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Paper,
  InputAdornment,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Conversation } from "../../../interfaces/conversation";
import { Message } from "../../../interfaces/message";
import { chatService } from "../../../services/chat.service";
import { UserContext } from "../../../context/user/UserContext";
import { useTimeTranslations } from "../../../hooks/useTimeTranslations";
import { useFeedback } from "../../../hooks/useFeedback";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";

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
  const [isSending, setIsSending] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);
  const timeTranslations = useTimeTranslations();
  const { showError } = useFeedback();
  const t = useTranslations("Chat");

  // Helper function to sort messages by creation date (oldest first)
  const sortMessagesByDate = useCallback((messages: Message[]) => {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB; // Ascending order (oldest first)
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadMessages = useCallback(async () => {
    if (!conversation) return;

    setIsLoading(true);
    try {
      const result = await chatService.getConversationMessages(conversation.id);
      if (result.error || !result.data) {
        showError({
          title: t("loadMessagesErrorTitle"),
          message: result.error?.message || t("loadMessagesErrorMessage"),
          onRetry: loadMessages,
          retryLabel: t("retry"),
        });
        setMessages([]);
        return;
      }
      // Sort messages by date (oldest first)
      const sortedMessages = sortMessagesByDate(result.data);
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      showError({
        title: t("loadMessagesErrorTitle"),
        message: t("loadMessagesErrorMessage"),
        onRetry: loadMessages,
        retryLabel: t("retry"),
      });
    } finally {
      setIsLoading(false);
    }
  }, [conversation, sortMessagesByDate, showError, t]);

  const setupSSE = useCallback(() => {
    if (!conversation || !user) return;

    // Close existing connection
    if (eventSource) {
      eventSource.close();
    }

    const newEventSource = chatService.connectToChat(conversation.id);

    // Listen for new messages
    newEventSource.onmessage = (event) => {
      try {
        const messageData: Message = JSON.parse(event.data);
        console.log("Nuevo mensaje recibido via SSE:", messageData);

        setMessages((prev) => {
          // Determine if this message is from the current user
          const isMyMessage = messageData.username === user?.username;

          if (isMyMessage) {
            // If it's our message, replace the temporary message with the real one
            const tempMessageIndex = prev.findIndex(
              (msg) =>
                msg.username === user?.username &&
                msg.content === messageData.content &&
                msg.id.startsWith("temp-")
            );

            if (tempMessageIndex !== -1) {
              const newMessages = [...prev];
              newMessages[tempMessageIndex] = messageData;
              return sortMessagesByDate(newMessages);
            }
            // If no temp message found, it might be from another session, add it
            const exists = prev.some((msg) => msg.id === messageData.id);
            if (!exists) {
              const newMessages = [...prev, messageData];
              return sortMessagesByDate(newMessages);
            }
            return prev;
          } else {
            // If it's not our message, add it if it doesn't exist
            const exists = prev.some((msg) => msg.id === messageData.id);
            if (exists) return prev;
            const newMessages = [...prev, messageData];
            return sortMessagesByDate(newMessages);
          }
        });
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };

    // Handle connection opened
    newEventSource.onopen = () => {
      console.log(
        "Conexión SSE establecida para conversación:",
        conversation.id
      );
    };

    // Handle connection errors
    newEventSource.onerror = (error) => {
      console.error("SSE Error:", error);

      // Implement automatic reconnection
      if (newEventSource.readyState === EventSource.CLOSED) {
        console.log(
          "Conexión SSE cerrada, intentando reconectar en 5 segundos..."
        );
        setTimeout(() => {
          if (conversation && user) {
            setupSSE();
          }
        }, 5000);
      }
    };

    setEventSource(newEventSource);
  }, [conversation, user, eventSource, sortMessagesByDate]);

  useEffect(() => {
    if (!conversation || !user) {
      return;
    }

    loadMessages();
    setupSSE();

    // Cleanup: close connection when component unmounts or conversation changes
    return () => {
      if (eventSource) {
        console.log(
          "Cerrando conexión SSE para conversación:",
          conversation.id
        );
        eventSource.close();
        setEventSource(null);
      }
    };
  }, [conversation, user, loadMessages, setupSSE, eventSource]);

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !conversation || !user || isSending) return;

      const messageContent = newMessage.trim();
      const messageId = uuidv4();

      setNewMessage("");
      setIsSending(true);

      try {
        // Optimistic message
        const optimisticMessage: Message = {
          id: `temp-${messageId}`,
          content: messageContent,
          createdAt: new Date().toISOString(),
          mine: true,
          username: user.username,
        };

        setMessages((prev) => {
          const newMessages = [...prev, optimisticMessage];
          return sortMessagesByDate(newMessages);
        });

        // Send message to server
        const result = await chatService.sendMessage(
          conversation.id,
          messageId,
          messageContent
        );
        if (result.error) {
          throw new Error(result.error.message);
        }

        // The real message will come through SSE and replace the optimistic one
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove optimistic message on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== `temp-${messageId}`)
        );
        setNewMessage(messageContent); // Restore message in input

        const retrySend = async () => {
          setIsSending(true);
          try {
            const retryResult = await chatService.sendMessage(
              conversation.id,
              uuidv4(),
              messageContent
            );
            if (retryResult.error) {
              throw new Error(retryResult.error.message);
            }
          } catch (retryErr) {
            console.error("Retry send failed:", retryErr);
            showError({
              title: t("sendMessageErrorTitle"),
              message:
                typeof (retryErr as any)?.message === "string"
                  ? (retryErr as any).message
                  : t("sendMessageErrorMessage"),
            });
          } finally {
            setIsSending(false);
          }
        };

        showError({
          title: t("sendMessageErrorTitle"),
          message:
            typeof (error as any)?.message === "string"
              ? (error as any).message
              : t("sendMessageErrorMessage"),
          onRetry: retrySend,
          retryLabel: t("retry"),
        });
      } finally {
        setIsSending(false);
      }
    },
    [
      newMessage,
      conversation,
      user,
      isSending,
      sortMessagesByDate,
      showError,
      t,
    ]
  );

  const formatMessageTime = useCallback((createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

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
            {t("selectConversation")}
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
                {t("loadingMessages")}
              </Typography>
            </Box>
          ) : messages.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography color="text.secondary">{t("noMessages")}</Typography>
            </Box>
          ) : (
            <List sx={{ py: 1 }}>
              {messages.map((message, index) => {
                const isOwnMessage = message.username === user?.username;
                const isOptimistic = message.id.startsWith("temp-");
                const showDivider = index < messages.length - 1;

                return (
                  <React.Fragment key={message.id}>
                    <ListItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isOwnMessage ? "flex-end" : "flex-start",
                        py: 1,
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          maxWidth: "70%",
                          bgcolor: isOwnMessage ? "primary.main" : "grey.100",
                          color: isOwnMessage
                            ? "primary.contrastText"
                            : "text.primary",
                          borderRadius: 2,
                          opacity: isOptimistic ? 0.7 : 1,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <Typography variant="body1" sx={{ mb: 0.5 }}>
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            display: "block",
                            textAlign: isOwnMessage ? "right" : "left",
                          }}
                        >
                          {formatMessageTime(message.createdAt)}
                          {isOptimistic && ` (${t("sending")})`}
                        </Typography>
                      </Paper>
                    </ListItem>
                    {showDivider && <Divider variant="middle" />}
                  </React.Fragment>
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
            placeholder={t("inputPlaceholder")}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
            multiline
            maxRows={4}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    color="primary"
                  >
                    {isSending ? <CircularProgress size={24} /> : <SendIcon />}
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
