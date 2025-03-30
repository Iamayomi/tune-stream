import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto';
import { corsOptions } from 'src/library';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'notification', cors: { origin: '*' } })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationGateway');

  constructor(private notificationsService: NotificationService) {}

  afterInit(server: Server) {
    this.logger.log(
      'Websocket Gateway Initialized with namespace /notification',
    );
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected from /notification: ${client.id}`);
    client.emit(
      'welcome',
      `Hello, client ${client.id}! Welcome to the notification namespace`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from /notification: ${client.id}`);
  }

  @SubscribeMessage('create-notification')
  handleCreateNotification(
    @MessageBody() dto: CreateNotificationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const notification = this.notificationsService.createNotification(dto);
    // Broadcast to specific user if userId is provided
    if (dto.userId) {
      this.logger.log(
        `Message received in /notification from ${client.id}: ${notification}`,
      );
      this.server.to(`${dto.userId}`).emit('new-notification', notification);

      client.emit('new-notification', notification);
    }
    return notification;
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
    this.logger.log(`Message joined in /notification from ${client.id}`);
    return `Joined room for user ${userId}`;
  }

  public async broadcastNotification(
    @MessageBody() dto: CreateNotificationDto,
    @ConnectedSocket() client: Socket,
  ) {
    const notification =
      await this.notificationsService.createNotification(dto);
    this.logger.log(
      `Message Broachcast in /notification from ${client.id}: ${notification}`,
    );
    this.server.emit('new-notification', notification);
  }
}
