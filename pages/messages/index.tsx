import type { GetStaticPropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { MainLayout } from "../../layouts";
import { ChatContainer } from "../../components/organisms/chat";
import { Conversation } from "../../interfaces/conversation";
import { chatService } from "../../services/chat.service";

const MessagesPage: NextPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        // Here you would typically fetch conversations from your API
        // For now, using mock data until the API endpoint is available
        const mockConversations: Array<Conversation> = [
          {
            id: "1",
            username: "player1",
            lastMessage: "Hey, are you available for a match tonight?",
            createdAt: "2025-05-01T14:30:00Z",
            unread: 2,
            otherUserId: "user1",
          },
          {
            id: "2",
            username: "gamer_pro",
            lastMessage: "Thanks for joining our team!",
            createdAt: "2025-03-30T09:15:00Z",
            unread: 0,
            otherUserId: "user2",
          },
          {
            id: "3",
            username: "esports_coach",
            lastMessage: "Let's review your last game performance",
            createdAt: "2025-02-29T18:45:00Z",
            unread: 1,
            otherUserId: "user3",
          },
          {
            id: "4",
            username: "team_leader",
            lastMessage: "Don't forget about the tournament next week!",
            createdAt: "2025-01-28T12:00:00Z",
            unread: 0,
            otherUserId: "user4",
          },
          {
            id: "5",
            username: "casual_gamer",
            lastMessage: "Anyone up for some casual games this weekend?",
            createdAt: "2024-09-27T20:30:00Z",
            unread: 0,
            otherUserId: "user5",
          },
          {
            id: "6",
            username: "pro_player",
            lastMessage: "Great job in the last match, let's keep it up!",
            createdAt: "2024-09-26T16:00:00Z",
            unread: 0,
            otherUserId: "user6",
          },
          {
            id: "7",
            username: "newbie_gamer",
            lastMessage: "Can you help me with some tips for beginners?",
            createdAt: "2024-09-25T10:30:00Z",
            unread: 0,
            otherUserId: "user7",
          },
          {
            id: "8",
            username: "tournament_organizer",
            lastMessage: "Registration for the next tournament is open!",
            createdAt: "2024-09-24T08:00:00Z",
            unread: 0,
            otherUserId: "user8",
          },
          {
            id: "9",
            username: "streamer_fan",
            lastMessage: "Loved your last stream, keep it up!",
            createdAt: "2023-09-23T15:45:00Z",
            unread: 0,
            otherUserId: "user9",
          },
          {
            id: "10",
            username: "game_dev",
            lastMessage: "Check out our new game release!",
            createdAt: "2023-09-22T11:20:00Z",
            unread: 0,
            otherUserId: "user10",
          },
        ];

        setConversations(mockConversations);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  if (isLoading) {
    return (
      <MainLayout
        title={"Juga en Equipo - Mensajes"}
        pageDescription={"Sistema de mensajería en tiempo real"}
        fillViewport
      >
        <div>Cargando conversaciones...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={"Juga en Equipo - Mensajes"}
      pageDescription={"Sistema de mensajería en tiempo real"}
      fillViewport
    >
      <ChatContainer initialConversations={conversations} />
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
