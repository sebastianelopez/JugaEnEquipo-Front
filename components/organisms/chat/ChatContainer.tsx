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
    const fetchConversation = async () => {
      const { userId } = router.query;
      if (!user && !userId) return;

      if (userId && typeof userId === "string") {
        // Buscar o crear conversación con ese usuario
        const conversationId = await chatService.findConversationByUserId(
          userId
        );
        console.log("Conversation ID:", conversationId);
        if (conversationId) chatService.connectToChat(conversationId);
        //   chatService.getOrCreateConversationWithUser(userId).then((conv) => {
        //     setConversations((prev) => {
        //       const exists = prev.some((c) => c.id === conv.id);
        //       if (exists) return prev;
        //       return [conv, ...prev];
        //     });
        //     setSelectedConversation(conv);
        //   });
      }
    };
    fetchConversation();
    // eslint-disable-next-line
  }, [router.query, user]);

  const handleSelectConversation = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  const handleCreateConversation = async (userId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get or create conversation with the user
      const conversation = await chatService.getOrCreateConversationWithUser(
        userId
      );

      // Add to conversations list if it's new
      setConversations((prev) => {
        const exists = prev.some((conv) => conv.id === conversation.id);
        if (exists) return prev;
        return [conversation, ...prev];
      });

      // Select the conversation
      setSelectedConversation(conversation);

      // Update the conversations list to show it as selected
      if (conversationsListRef.current) {
        conversationsListRef.current.selectConversation(conversation);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsLoading(false);
    }
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
          onCreateConversation={handleCreateConversation}
        />
        <ChatWindow conversation={selectedConversation} onBack={handleBack} />
      </Grid>
    </Container>
  );
};
