import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('[Socket] Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('[Socket] Client disconnected:', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { roomId: string; message: string; sender: string; messageKey?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const senderId = Number(data?.sender);
      console.log('[Socket] sendMessage payload:', data);

      const savedMessage = await this.chatService.saveMessage({
        roomId: data.roomId,
        senderId,
        content: data.message,
        messageKey: data.messageKey,
      });

      this.server.to(data.roomId).emit('receiveMessage', {
        roomId: data.roomId,
        conversationId: savedMessage.conversationId,
        message: savedMessage.content,
        sender: savedMessage.senderId.toString(),
        id: savedMessage.id,
        timestamp: savedMessage.created_at,
        messageKey: savedMessage.messageKey,
      });
    } catch (error) {
      console.error('[Socket] Error handling sendMessage:', error.message);
      client.emit('receiveMessage:error', {
        roomId: data.roomId,
        message: 'Failed to send message',
      });
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    if (!roomId) {
      return;
    }
    console.log('[Socket] joinRoom:', { roomId, clientId: client.id });
    client.join(roomId);
    return { event: 'joined', roomId };
  }
}