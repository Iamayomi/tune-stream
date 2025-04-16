import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlaybackService } from './playback.service';
import { ConfigService } from '@nestjs/config';
import { PlaybackActionDTO } from './dto/create-playback-dto';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/library';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'playback',
})
export class PlaybackGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('PlaybackGateway');

  constructor(
    private jwtService: JwtService,
    private playbackService: PlaybackService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.replace('Bearer ', '');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
      });

      const data = {
        userId: payload.sub,
        clientId: client.id,
      };

      await this.playbackService.joinSession(data);

      client.emit('connected', { message: 'Connected to playback session' });

      client.join(`user:${data.userId}`);
    } catch {
      client.disconnect();
      this.logger.warn(`Unauthorized connection attempt from ${client.id}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  handleDisconnect(client: Socket) {
    this.playbackService.leaveSession(client.data.userId, client.id);
  }

  @SubscribeMessage('play')
  public async handlePlay(
    @MessageBody() data: PlaybackActionDTO,
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.songId) throw new BadRequestException('Song ID required');

    const userId = client.data.userId;

    const result = await this.playbackService.playSong(userId, data.songId);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('pause')
  public async handlePause(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    const result = await this.playbackService.pauseSong(userId);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('stop')
  async handleStop(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    const result = await this.playbackService.stopSong(userId);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('seek')
  async handleSeek(
    @MessageBody() data: PlaybackActionDTO,
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.position) throw new BadRequestException('Position required');

    const userId = client.data.userId;

    const payload = {
      userId: client.data.userId,
      position: data.position,
    };

    const result = await this.playbackService.seekSong(payload);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('next')
  async handleNext(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    const result = await this.playbackService.nextSong(userId);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('previous')
  async handlePrevious(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    const result = await this.playbackService.previousSong(userId);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('addToQueue')
  async handleAddToQueue(
    @MessageBody() data: PlaybackActionDTO,
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.songId) throw new BadRequestException('Song ID required');

    const userId = client.data.userId;

    const result = await this.playbackService.addToQueue(userId, data.songId);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('removeFromQueue')
  async handleRemoveFromQueue(
    @MessageBody() data: PlaybackActionDTO,
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.songId) throw new BadRequestException('Song ID required');

    const payload = {
      userId: client.data.userId,
      songId: data.songId,
    };

    const result = await this.playbackService.removeFromQueue(payload);

    this.server.to(`user:${payload.userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('toggleShuffle')
  async handleToggleShuffle(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;

    const result = await this.playbackService.toggleShuffle(userId);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('toggleRepeat')
  async handleToggleRepeat(
    @MessageBody() data: PlaybackActionDTO,
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.repeat) throw new BadRequestException('Repeat mode required');

    const userId = client.data.userId;

    const result = await this.playbackService.toggleRepeat(userId, data.repeat);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }

  @SubscribeMessage('playFromQueue')
  async handlePlayFromQueue(
    @MessageBody() data: PlaybackActionDTO,
    @ConnectedSocket() client: Socket,
  ) {
    if (data.queueIndex === undefined)
      throw new BadRequestException('Queue index required');

    const userId = client.data.userId;

    const payload = {
      userId: client.data.userId,
      queueIndex: data.queueIndex,
    };

    const result = await this.playbackService.playFromQueue(payload);

    this.server.to(`user:${userId}`).emit('playbackState', result);
  }
}
