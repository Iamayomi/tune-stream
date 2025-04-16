import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterDto } from './dto/analytics-dto';
import { JWT_ACCESS_TOKEN_SECRET } from 'src/library';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'analytics' })
export class AnalyticsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AnalyticsGateway');

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private analyticsService: AnalyticsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token?.replace('Bearer ', '');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
      });
      client.data.userId = payload.sub;
      client.join(`admin:${client.data.userId}`);
    } catch {
      this.logger.warn(`Unauthorized connection attempt from ${client.id}`);
      client.disconnect();
    }
  }

  @SubscribeMessage('getAnalytics')
  async handleGetAnalytics(client: Socket, filter: AnalyticsFilterDto) {
    const artists = await this.analyticsService.topArtists(
      filter.period || 'total',
    );
    const songs = await this.analyticsService.topSongs(
      filter.period || 'total',
    );
    const albums = await this.analyticsService.topAlbums(
      filter.period || 'total',
    );
    this.server
      .to(`admin:${client.data.userId}`)
      .emit('analyticsUpdate', { artists, songs, albums });
  }
}
