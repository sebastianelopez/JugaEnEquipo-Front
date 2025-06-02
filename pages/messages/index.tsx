import { Grid } from "@mui/material";

import type { GetStaticPropsContext, NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import { MainLayout } from "../../layouts";

import { Conversation } from "../../interfaces/conversation";
import Chat from "../../components/organisms/chat/Chat";
import {
  ConversationsList,
  ConversationsListHandle,
} from "../../components/organisms/chat/MessagesList";

const mockConversations: Array<Conversation> = [
  {
    id: "1",
    username: "player1",
    lastMessage: "Hey, are you available for a match tonight?",
    createdAt: "2025-05-01T14:30:00Z",
    unread: 2,
  },
  {
    id: "2",
    username: "gamer_pro",
    lastMessage: "Thanks for joining our team!",
    createdAt: "2025-03-30T09:15:00Z",
    unread: 0,
  },
  {
    id: "3",
    username: "esports_coach",
    lastMessage: "Let's review your last game performance",
    createdAt: "2025-02-29T18:45:00Z",
    unread: 1,
  },
  {
    id: "4",
    username: "team_leader",
    lastMessage: "Don't forget about the tournament next week!",
    createdAt: "2025-01-28T12:00:00Z",
    unread: 0,
  },
  {
    id: "5",
    username: "casual_gamer",
    lastMessage: "Anyone up for some casual games this weekend?",
    createdAt: "2024-09-27T20:30:00Z",
    unread: 0,
  },
  {
    id: "6",
    username: "pro_player",
    lastMessage: "Great job in the last match, let's keep it up!",
    createdAt: "2024-09-26T16:00:00Z",
    unread: 0,
  },
  {
    id: "7",
    username: "newbie_gamer",
    lastMessage: "Can you help me with some tips for beginners?",
    createdAt: "2024-09-25T10:30:00Z",
    unread: 0,
  },
  {
    id: "8",
    username: "tournament_organizer",
    lastMessage: "Registration for the next tournament is open!",
    createdAt: "2024-09-24T08:00:00Z",
    unread: 0,
  },
  {
    id: "9",
    username: "streamer_fan",
    lastMessage: "Loved your last stream, keep it up!",
    createdAt: "2023-09-23T15:45:00Z",
    unread: 0,
  },
  {
    id: "10",
    username: "game_dev",
    lastMessage: "Check out our new game release!",
    createdAt: "2023-09-22T11:20:00Z",
    unread: 0,
  },
];

const MessagesPage: NextPage = (props) => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const conversationsListRef = useRef<ConversationsListHandle>(null);

  const handleBackToList = () => {
    setSelectedConversation(null);
    conversationsListRef.current?.selectConversation(null);
  };

  // Callback para cuando se selecciona una conversación
  const handleConversationSelected = (conversation: Conversation | null) => {
    setSelectedConversation(conversation);
  };

  // Detecta si estamos en vista móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Inicializa
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MainLayout
      title={"Juga en Equipo - Mensajes"}
      pageDescription={"Encuentra a tu equipo ideal"}
      fillViewport
    >
      <Grid container sx={{ mt: 12, height: "calc(100vh - 120px)" }}>
        {/* Panel de Conversaciones (oculto en móvil cuando hay selección) */}
        {(!isMobile || !selectedConversation) && (
          <ConversationsList
            ref={conversationsListRef}
            conversations={conversations}
            onSelectConversation={handleConversationSelected}
          />
        )}

        {/* Panel de Chat (visible cuando hay una conversación seleccionada) */}
        {selectedConversation && (
          <Chat
            key={selectedConversation.id}
            isMobile={isMobile}
            conversation={selectedConversation}
            onBack={handleBackToList}
          />
        )}
      </Grid>
    </MainLayout>
  );
};

export default MessagesPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../lang/${locale}.json`)).default,
    },
  };
}
