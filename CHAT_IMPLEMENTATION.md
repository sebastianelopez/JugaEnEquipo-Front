# Chat Implementation - JugaEnEquipo

## 📋 Descripción General

Sistema de chat en tiempo real implementado con **Server-Sent Events (SSE)** y **Mercure Hub** para la comunicación bidireccional entre usuarios.

## 🔧 Arquitectura

### Componentes Principales

1. **ChatContainer** - Orchestador principal del sistema de chat
2. **ConversationsList** - Lista de conversaciones con búsqueda inteligente
3. **ChatWindow** - Ventana de chat con mensajes en tiempo real

### Servicios

- **chatService** - Manejo de conexiones SSE, envío de mensajes y gestión de conversaciones
- **userService** - Búsqueda de usuarios seguidos

## 🚀 Funcionalidades

### ✅ Chat en Tiempo Real

- Conexión SSE con Mercure Hub (`https://mercure.jugaenequipo.com`)
- Recepción automática de mensajes nuevos
- Reconexión automática en caso de fallos de conexión
- Mensajes optimistas para mejor UX

### ✅ Gestión de Conversaciones

- Búsqueda en conversaciones existentes
- Búsqueda de usuarios seguidos para nuevas conversaciones
- Creación automática de conversaciones
- Carga de historial de mensajes

### ✅ Interfaz de Usuario

- Diseño responsivo con Material-UI
- Indicadores de estado de mensajes (enviando, enviado)
- Auto-scroll a nuevos mensajes
- Timestamps formateados

## 📡 Endpoints Utilizados

```
PUT  /api/conversation/:conversationId/message/:messageId  - Enviar mensaje
GET  /api/conversation/by-other-user/:userId              - Buscar conversación por usuario
GET  /api/conversation/:conversationId/messages          - Obtener mensajes
GET  /.well-known/mercure?topic=...                      - Conexión SSE
```

## 🔄 Flujo de Mensajes SSE

### Formato de Mensaje Recibido

```json
{
  "id": "1f65bcb5-2513-43ee-8a3c-b6fe8d1ba824",
  "content": "Mensaje de ejemplo",
  "username": "slopez",
  "mine": true,
  "createdAt": "2025-08-01T20:20:02-03:00"
}
```

### Proceso de Envío

1. **Usuario escribe mensaje** → Input del formulario
2. **Mensaje optimista** → Se muestra inmediatamente con ID temporal
3. **Envío al servidor** → PUT request con contenido
4. **Confirmación SSE** → Servidor envía mensaje real via SSE
5. **Actualización UI** → Reemplaza mensaje temporal con real

### Manejo de Estados

- **Mensajes propios**: Se reemplazan los temporales con los reales
- **Mensajes de otros**: Se agregan directamente a la lista
- **Reconexión**: Automática cada 5 segundos si se pierde conexión
- **Duplicados**: Se previenen verificando IDs existentes

## 🔧 Implementación Técnica

### ChatWindow - Configuración SSE

```tsx
const setupSSE = () => {
  const newEventSource = chatService.connectToChat(conversation.id);

  newEventSource.onmessage = (event) => {
    const messageData: SSEMessageData = JSON.parse(event.data);

    // Transformar formato del backend al de la app
    const newMessage: Message = {
      id: messageData.id,
      body: messageData.content,
      createdAt: messageData.createdAt,
      senderId: messageData.mine ? user.id : conversation.otherUserId || "",
      senderUsername: messageData.username,
      conversationId: conversation.id,
    };

    // Lógica de manejo según si es mensaje propio o ajeno
    setMessages((prev) => {
      if (messageData.mine) {
        // Reemplazar mensaje temporal
        const tempIndex = prev.findIndex(
          (msg) =>
            msg.senderId === user.id &&
            msg.body === messageData.content &&
            msg.id.startsWith("temp-")
        );
        if (tempIndex !== -1) {
          const newMessages = [...prev];
          newMessages[tempIndex] = newMessage;
          return newMessages;
        }
      } else {
        // Agregar mensaje de otro usuario
        const exists = prev.some((msg) => msg.id === messageData.id);
        if (!exists) return [...prev, newMessage];
      }
      return prev;
    });
  };
};
```

### Envío de Mensajes Optimistas

```tsx
const handleSendMessage = async (e: React.FormEvent) => {
  const tempMessageId = chatService.generateTempMessageId();

  // 1. Crear mensaje optimista
  const optimisticMessage: Message = {
    id: tempMessageId,
    body: messageContent,
    createdAt: new Date().toISOString(),
    senderId: user.id,
    senderUsername: user.username,
    conversationId: conversation.id,
  };

  // 2. Mostrar inmediatamente
  setMessages((prev) => [...prev, optimisticMessage]);

  try {
    // 3. Enviar al servidor
    await chatService.sendMessage(
      conversation.id,
      tempMessageId,
      messageContent
    );
    // 4. El mensaje real llegará via SSE
  } catch (error) {
    // 5. Remover en caso de error
    setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));
  }
};
```

## 🛠 Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

### Mercure URL

```typescript
const MERCURE_URL = "https://mercure.jugaenequipo.com";
```

## 📱 Integración con Perfiles

Desde `ProfileCard.tsx`, al hacer click en "Enviar Mensaje":

```tsx
const handleSendMessage = async () => {
  router.push({
    pathname: "/messages",
    query: { userId: user.id },
  });
};
```

El `ChatContainer` detecta el `userId` en la query y:

1. Busca conversación existente
2. Si no existe, la crea
3. Selecciona automáticamente la conversación
4. Establece conexión SSE

## 🎨 Características de UI

- **Mensajes optimistas**: Opacidad reducida mientras se envían
- **Indicadores de estado**: "enviando..." para mensajes temporales
- **Auto-scroll**: A nuevos mensajes automáticamente
- **Timestamps**: Formato HH:MM local
- **Estados de carga**: Spinner en botón de envío
- **Responsive**: Adaptable a móvil y desktop

## 🔄 Estados del Sistema

1. **Conexión SSE**: Abierta/Cerrada/Error
2. **Mensajes**: Temporal/Confirmado/Error
3. **UI**: Cargando/Enviando/Idle
4. **Conversaciones**: Seleccionada/Lista/Búsqueda

## 🚀 Próximos Pasos

- [ ] Notificaciones push del navegador
- [ ] Indicador "escribiendo..."
- [ ] Soporte para archivos adjuntos
- [ ] Paginación de mensajes antiguos
- [ ] Configuración de notificaciones
- [ ] Modo oscuro
- [ ] Emojis y reacciones
