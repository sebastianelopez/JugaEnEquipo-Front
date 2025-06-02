import { Message } from "../../../../interfaces/message";


export const getMockMessages = (conversationId: string): Message[] => {
  // Fecha base para crear mensajes en secuencia cronológica
  const baseDate = new Date();
  
  // Mensajes comunes para todas las conversaciones
  const commonMessages: Message[] = [
    {
      id: `${conversationId}-msg1`,
      body: "¡Hola! ¿Cómo estás?",
      createdAt: new Date(baseDate.getTime() - 3600000 * 24).toISOString(), // 24 horas atrás
      senderId: "current-user",
      senderUsername: "current-user",
    },
  ];
  
  // Mensajes específicos según la conversación
  switch (conversationId) {
    case "1": // player1
      return [
        ...commonMessages,
        {
          id: `${conversationId}-msg2`,
          body: "¡Hey! Todo bien, ¿tú?",
          createdAt: new Date(baseDate.getTime() - 3600000 * 23).toISOString(),
          senderId: "player1",
          senderUsername: "player1",
        },
        {
          id: `${conversationId}-msg3`,
          body: "¿Estás disponible para jugar esta noche?",
          createdAt: new Date(baseDate.getTime() - 3600000 * 2).toISOString(),
          senderId: "player1",
          senderUsername: "player1",
        },
        {
          id: `${conversationId}-msg4`,
          body: "Claro, ¿a qué hora?",
          createdAt: new Date(baseDate.getTime() - 3600000 * 1).toISOString(),
          senderId: "current-user",
          senderUsername: "current-user",
        },
        {
          id: `${conversationId}-msg5`,
          body: "Hey, are you available for a match tonight?",
          createdAt: new Date(baseDate.getTime() - 180000).toISOString(), // 30 minutos atrás
          senderId: "player1",
          senderUsername: "player1",
        },
      ];
    
    case "2": // gamer_pro
      return [
        ...commonMessages,
        {
          id: `${conversationId}-msg2`,
          body: "¡Hola! Gracias por aceptar la invitación al equipo.",
          createdAt: new Date(baseDate.getTime() - 3600000 * 22).toISOString(),
          senderId: "gamer_pro",
          senderUsername: "gamer_pro",
        },
        {
          id: `${conversationId}-msg3`,
          body: "Es un placer ser parte del equipo.",
          createdAt: new Date(baseDate.getTime() - 3600000 * 21).toISOString(),
          senderId: "current-user",
          senderUsername: "current-user",
        },
        {
          id: `${conversationId}-msg4`,
          body: "Thanks for joining our team!",
          createdAt: new Date(baseDate.getTime() - 3600000 * 1).toISOString(),
          senderId: "gamer_pro",
          senderUsername: "gamer_pro",
        },
      ];
      
    // Continuar con más casos para el resto de conversaciones
    default:
      // Para el resto de conversaciones, crear mensajes genéricos
      return [
        ...commonMessages,
        {
          id: `${conversationId}-msg2`,
          body: "¡Hola! ¿Cómo va todo?",
          createdAt: new Date(baseDate.getTime() - 3600000 * 12).toISOString(),
          senderId: conversationId,
          senderUsername: `user-${conversationId}`,
        },
        {
          id: `${conversationId}-msg3`,
          body: "Todo bien, gracias por preguntar. ¿Y tú?",
          createdAt: new Date(baseDate.getTime() - 3600000 * 10).toISOString(),
          senderId: "current-user",
          senderUsername: "current-user",
        },
        {
          id: `${conversationId}-msg4`,
          body: "Muy bien también. ¡Hablamos pronto!",
          createdAt: new Date(baseDate.getTime() - 3600000 * 5).toISOString(),
          senderId: conversationId,
          senderUsername: `user-${conversationId}`,
        },
      ];
  }
};