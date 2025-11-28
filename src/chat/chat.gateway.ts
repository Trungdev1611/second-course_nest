import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/users/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      // Lấy token từ auth
      const token = client.handshake.auth?.token;
      if (!token) {
        console.log('[Socket] No token provided, disconnecting');
        client.disconnect();
        return;
      }

      // Verify token và lấy userId
      const secret = this.configService.get('jwtkey') || 'superSecretKey';
      const payload = this.jwtService.verify(token, { secret });
      const userId = payload.id;

      if (!userId) {
        console.log('[Socket] Invalid token payload, disconnecting');
        client.disconnect();
        return;
      }

      // Lưu userId vào socket data
      client.data.userId = userId;

      // Join room riêng cho user: `user:${userId}`
      const userRoom = `user:${userId}`;
      client.join(userRoom);

      console.log('[Socket] Client connected:', {
        socketId: client.id,
        userId,
        userRoom,
      });
    } catch (error) {
      console.error('[Socket] Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      console.log('[Socket] Client disconnected:', {
        socketId: client.id,
        userId,
      });
    }
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

  @SubscribeMessage('requestFriend')
  async handleRequestFriend(
    @MessageBody() data: { targetUserId: number; message?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const requesterId = client.data?.userId;
      if (!requesterId) {
        client.emit('requestFriend:error', { message: 'Unauthorized' });
        return;
      }

      const { targetUserId, message } = data;

      if (!targetUserId || targetUserId === requesterId) {
        client.emit('requestFriend:error', {
          message: 'Invalid target user',
        });
        return;
      }

      // Lấy thông tin requester để tạo notification content
      const requester = await this.userService.findOneUser(requesterId);
      if (!requester) {
        client.emit('requestFriend:error', { message: 'User not found' });
        return;
      }

      // Tạo notification content
      const notificationContent =
        message ||
        `${requester.name} gửi cho bạn lời mời kết bạn`;

      // Lưu notification vào database
      const notification = await this.notificationService.createNotification({
        userId: targetUserId,
        content: notificationContent,
        type: 'request_friend',
        requesterId: requesterId,
      });

      // Gửi socket event đến target user
      const targetUserRoom = `user:${targetUserId}`;
      this.server.to(targetUserRoom).emit('friendRequest', {
        id: notification.id,
        requesterId,
        requesterName: requester.name,
        requesterAvatar: requester.image,
        targetUserId,
        content: notificationContent,
        type: 'request_friend',
        timestamp: notification.created_at,
      });

      // Confirm to requester
      client.emit('friendRequest:sent', {
        targetUserId,
        message: 'Friend request sent successfully',
      });

      console.log('[Socket] Friend request sent:', {
        requesterId,
        targetUserId,
        notificationId: notification.id,
      });
    } catch (error) {
      console.error('[Socket] Error handling requestFriend:', error.message);
      client.emit('requestFriend:error', {
        message: 'Failed to send friend request',
      });
    }
  }
}