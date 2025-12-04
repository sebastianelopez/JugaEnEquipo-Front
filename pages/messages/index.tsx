import type { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { MainLayout } from "../../layouts";
import { ChatContainer } from "../../components/organisms/chat";
import { Conversation } from "../../interfaces/conversation";
import { chatService } from "../../services/chat.service";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const MessagesPage: NextPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("Chat");

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const result = await chatService.getAllConversations();

        if (result.error) {
          console.error("Error loading conversations:", result.error);
          setConversations([]);
          return;
        }

        if (result.data) {
          setConversations(result.data.conversations);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  if (isLoading) {
    return (
      <MainLayout
        title={`Juga en Equipo - ${t("title")}`}
        pageDescription={"Sistema de mensajería en tiempo real"}
        fillViewport
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: "400px",
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            {t("loadingConversations")}
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={`Juga en Equipo - ${t("title")}`}
      pageDescription={"Sistema de mensajería en tiempo real"}
      fillViewport
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatContainer initialConversations={conversations} />
      </Box>
    </MainLayout>
  );
};

export default MessagesPage;

export async function getServerSideProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../lang/${locale || "es"}.json`)).default,
    },
  };
}
