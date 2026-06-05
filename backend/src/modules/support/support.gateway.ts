import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportService } from './support.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly supportService: SupportService) {}

  handleConnection(client: Socket) {
    console.log(`Support client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Support client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_session')
  handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userId: string },
  ) {
    client.join(data.sessionId);
    console.log(`Client ${client.id} joined session room: ${data.sessionId}`);
    this.server.to(data.sessionId).emit('user_joined', { userId: data.userId });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sessionId: string;
      senderId: string;
      senderName: string;
      message: string;
      attachmentUrl?: string;
    },
  ) {
    const session = await this.supportService.sendChatMessage(
      data.sessionId,
      data.senderId,
      data.senderName,
      data.message,
      data.attachmentUrl,
    );

    const latestMessage = session.messages[session.messages.length - 1];

    this.server.to(data.sessionId).emit('new_message', {
      sessionId: data.sessionId,
      message: latestMessage,
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; senderName: string; isTyping: boolean },
  ) {
    client.to(data.sessionId).emit('typing_indicator', {
      senderName: data.senderName,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('read_receipt')
  handleReadReceipt(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; messageId: string; userId: string },
  ) {
    client.to(data.sessionId).emit('read_receipt_update', {
      messageId: data.messageId,
      userId: data.userId,
      readAt: new Date(),
    });
  }
}
