import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import { ArrowBack, Send as SendIcon } from "@mui/icons-material";
import { Conversation } from "../../../interfaces/conversation";
import { getMockMessages } from "./mocks/getMessagesMocks";
import { useTimeTranslations } from "../../../hooks/useTimeTranslations";
import { Message } from "../../../interfaces/message";
import { formatTimeElapsed } from "../../../utils/formatTimeElapsed";

interface ChatProps {
  isMobile: boolean;
  conversation: Conversation;
  onBack?: () => void;
}

const Chat: React.FC<ChatProps> = ({ isMobile, conversation, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const timeTranslations = useTimeTranslations();
  // Cargar mensajes cuando cambia la conversación
  useEffect(() => {
    if (conversation) {
      // Simulamos la carga de mensajes de la API
      const mockMessages = getMockMessages(conversation.id);
      setMessages(mockMessages);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    const newMsg: Message = {
      id: `temp-${Date.now()}`,
      body: newMessage,
      createdAt: new Date().toISOString(),
      senderId: "current-user",
      senderUsername: "current-user",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  return (
    <Grid size={{xs: 12, md: 7}} sx={{ height: "100%" }}>
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Cabecera del chat */}
        <Box
          sx={{
            padding: 2,
            backgroundColor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isMobile && onBack && (
            <IconButton edge="start" onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Avatar sx={{ mr: 2 }}>
            {conversation.username[0].toUpperCase()}
          </Avatar>
          <Typography variant="h6">{conversation.username}</Typography>
        </Box>

        {/* Área de mensajes */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 2,
            overflow: "auto",
            backgroundColor: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ my: 4 }}
          >
            Inicio de la conversación con {conversation.username}
          </Typography>

          {messages.map((message) => {
            const isCurrentUser = message.senderId === "current-user";
            return (
              <Box
                key={message.id}
                sx={{
                  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: isCurrentUser
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    bgcolor: isCurrentUser
                      ? "primary.light"
                      : "background.paper",
                  }}
                >
                  <Typography variant="body2">{message.body}</Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    ml: isCurrentUser ? 0 : 1,
                    mr: isCurrentUser ? 1 : 0,
                    textAlign: isCurrentUser ? "right" : "left",
                    display: "block",
                  }}
                >
                  {formatTimeElapsed(
                    new Date(message.createdAt),
                    timeTranslations
                  )}
                </Typography>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Área de entrada de texto */}
        <Box
          component="form"
          sx={{
            p: 2,
            backgroundColor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
          }}
          onSubmit={handleSendMessage}
        >
          <TextField
            fullWidth
            placeholder="Escribe un mensaje..."
            variant="outlined"
            size="small"
            autoComplete="off"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton color="primary" type="submit" sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Chat;
