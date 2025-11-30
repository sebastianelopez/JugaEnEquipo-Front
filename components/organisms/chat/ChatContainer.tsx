import { Grid, Container } from "@mui/material";
import { useState, useRef, useContext, useEffect } from "react";
import { ConversationsList, ConversationsListHandle } from "./MessagesList";
import { ChatWindow } from "./ChatWindow";
import { Conversation } from "../../../interfaces/conversation";
import { chatService } from "../../../services/chat.service";
import { UserContext } from "../../../context/user/UserContext";
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
  const router = useRouter();

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

  const handleSelectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <Container maxWidth="xl" sx={{ height: "calc(100vh - 120px)", py: 2 }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <ConversationsList
          ref={conversationsListRef}
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
        />
        <ChatWindow conversation={selectedConversation} onBack={handleBack} />
      </Grid>
    </Container>
  );
};
