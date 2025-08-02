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
  const [isLoading, setIsLoading] = useState(false);
  const conversationsListRef = useRef<ConversationsListHandle>(null);
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const handleUserIdFromQuery = async () => {
      const { userId } = router.query;
      if (!user || !userId || typeof userId !== "string") return;

      try {
        // 1. Buscar conversación existente por userId
        const conversationId = await chatService.findConversationByUserId(
          userId
        );

        if (conversationId) {
          // 2. Si existe, buscar en las conversaciones cargadas
          const existingConversation = conversations.find(
            (conv) => conv.id === conversationId
          );

          if (existingConversation) {
            // 3. Si ya está en la lista, seleccionarla
            setSelectedConversation(existingConversation);
          } else {
            // 4. Si no está en la lista, crear objeto de conversación temporal
            // (normalmente esto vendría de un endpoint dedicado)
            const tempConversation: Conversation = {
              id: conversationId,
              username: "Usuario", // Esto debería venir del API
              lastMessage: "",
              unread: 0,
              createdAt: new Date().toISOString(),
              otherUserId: userId,
            };

            // Agregar a la lista y seleccionar
            setConversations((prev) => [tempConversation, ...prev]);
            setSelectedConversation(tempConversation);
          }
        }
        // Si no existe conversación, no hacemos nada (el usuario debe crearla manualmente)
      } catch (error) {
        console.error("Error handling userId from query:", error);
      }
    };

    handleUserIdFromQuery();
  }, [router.query, user, conversations]);

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
