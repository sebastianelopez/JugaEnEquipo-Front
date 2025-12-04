import { Grid, Container } from "@mui/material";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { ConversationsList, ConversationsListHandle } from "./MessagesList";
import { ChatWindow } from "./ChatWindow";
import { Conversation } from "../../../interfaces/conversation";
import { chatService } from "../../../services/chat.service";
import { UserContext } from "../../../context/user/UserContext";
import { NotificationContext } from "../../../context/notification";
import { useRouter } from "next/router";

interface ChatContainerProps {
  initialConversations: Conversation[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  initialConversations,
}) => {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const conversationsListRef = useRef<ConversationsListHandle>(null);
  const { user } = useContext(UserContext);
  const { messageNotifications } = useContext(NotificationContext);
  const router = useRouter();

  // Refresh conversations when a new message notification arrives
  const refreshConversations = useCallback(async () => {
    try {
      const result = await chatService.getAllConversations();
      if (result.data) {
        const updatedConversations = result.data.conversations;
        
        setConversations((prevConversations) => {
          // Create a map for quick lookup
          const updatedMap = new Map(
            updatedConversations.map((conv) => [conv.id, conv])
          );

          // Update existing conversations and preserve order
          const mergedConversations = prevConversations.map((prevConv) => {
            const updated = updatedMap.get(prevConv.id);
            return updated || prevConv;
          });

          // Add new conversations that don't exist yet
          const existingIds = new Set(prevConversations.map((c) => c.id));
          const newConversations = updatedConversations.filter(
            (conv) => !existingIds.has(conv.id)
          );

          // Combine and sort by last message date (most recent first)
          const allConversations = [...mergedConversations, ...newConversations];
          return allConversations.sort((a, b) => {
            const dateA = new Date(a.lastMessageDate || 0).getTime();
            const dateB = new Date(b.lastMessageDate || 0).getTime();
            return dateB - dateA;
          });
        });

        // Update selected conversation if it exists
        if (selectedConversation) {
          const updatedConversation = updatedConversations.find(
            (conv) => conv.id === selectedConversation.id
          );
          if (updatedConversation) {
            setSelectedConversation(updatedConversation);
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing conversations:", error);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const handleUserIdFromQuery = async () => {
      const { userId } = router.query;
      if (!user || !userId || typeof userId !== "string") return;

      try {
        // 1. Buscar conversación existente por userId
        const result = await chatService.findConversationByUserId(userId);

        if (result.error) {
          console.error("Error finding conversation:", result.error);
          return;
        }

        const conversationData = result.data;
        if (conversationData && conversationData.id) {
          const conversationId = conversationData.id;

          // 2. Si existe, buscar en las conversaciones cargadas usando función de actualización
          setConversations((prevConversations) => {
            const existingConversation = prevConversations.find(
              (conv) => conv.id === conversationId
            );

            if (existingConversation) {
              // 3. Si ya está en la lista, seleccionarla
              setSelectedConversation(existingConversation);
              return prevConversations; // No cambiar el array
            } else {
              // 4. Si no está en la lista, crear objeto de conversación con los datos del API
              const newConversation: Conversation = {
                id: conversationId,
                otherUsername: conversationData.otherUsername || "Usuario",
                lastMessageText: conversationData.lastMessageText || "",
                lastMessageDate: conversationData.lastMessageDate || "",
                otherUserId: conversationData.otherUserId || userId,
                otherFirstname: conversationData.otherFirstname || "",
                otherLastname: conversationData.otherLastname || "",
                otherProfileImage: conversationData.otherProfileImage || "",
                unreadCount: conversationData.unreadCount ?? 0,
              };

              // Seleccionar la nueva conversación
              setSelectedConversation(newConversation);

              // Agregar a la lista y retornar
              return [newConversation, ...prevConversations];
            }
          });
        }
        // Si no existe conversación, no hacemos nada (el usuario debe crearla manualmente)
      } catch (error) {
        console.error("Error handling userId from query:", error);
      }
    };

    handleUserIdFromQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.userId, user]);

  // Listen for new message notifications and refresh conversations
  useEffect(() => {
    if (messageNotifications.length > 0) {
      // Debounce to avoid too many requests
      const timeoutId = setTimeout(() => {
        refreshConversations();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [messageNotifications.length, refreshConversations]);

  const handleSelectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100%",
        minHeight: 0,
        maxHeight: "100%",
        py: { xs: 0, md: 2 },
        px: { xs: 0, md: 2 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={{ xs: 0, md: 2 }} sx={{ height: "100%", minHeight: 0, flex: 1 }}>
        <ConversationsList
          ref={conversationsListRef}
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={
            selectedConversation?.id
              ? typeof selectedConversation.id === "string"
                ? selectedConversation.id
                : String(selectedConversation.id)
              : null
          }
        />
        <ChatWindow
          conversation={selectedConversation}
          onBack={handleBack}
        />
      </Grid>
    </Container>
  );
};
