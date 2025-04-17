import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

import {
  AllExceptionsFilter,
  PORT,
  REDIS_CLOUD_URL,
  corsOptions,
  setupSwagger,
  swaggerOptions,
} from './library';
import { io, Socket } from 'socket.io-client';
import { NotificationGateway } from './notification/notification.gateway';
import { PlaybackGateway } from './playback/playback.gateway';
import { AnalyticsGateway } from './analytics/analytics.gateway';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  //  Set global prefix for routes
  app.setGlobalPrefix('/api/v1/');

  const { httpAdapter } = app.get(HttpAdapterHost);

  // Set global filters
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  setupSwagger(app, swaggerOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  // security
  app.use(helmet());

  app.enableCors(corsOptions);

  // app.use(compression());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  const config = app.get(ConfigService);

  // app.useLogger(app.get(CustomLogger));

  const redisClient = createClient({
    url: config.get<string>(REDIS_CLOUD_URL),
  });
  await redisClient.connect();
  const pubClient = redisClient.duplicate();
  await pubClient.connect();

  const playbackGateway = app.get(PlaybackGateway);
  const analyticsGateway = app.get(AnalyticsGateway);
  const notificationGateway = app.get(NotificationGateway);

  if (notificationGateway?.server) {
    notificationGateway.server.adapter(createAdapter(pubClient, redisClient));
  }

  if (playbackGateway?.server) {
    playbackGateway.server.adapter(createAdapter(pubClient, redisClient));
  }

  if (analyticsGateway?.server) {
    analyticsGateway.server.adapter(createAdapter(pubClient, redisClient));
  }

  // process.on('SIGTERM', async () => {
  //   logger.log('Shutting down...');
  //   if (pubClient) await pubClient.quit();
  //   if (subClient) await subClient.quit();
  //   await app.close();
  //   process.exit(0);
  // });

  // app.use(morgan('dev'));

  await app.listen(config.get(PORT, 5000));

  // const logger = new Logger('WebSocketTest');

  // // Simulate a WebSocket client connecting to the server
  // const socket: Socket = io(`http://localhost:8080/notification`, {
  // auth: { token: 'Bearer <token>' },
  //   reconnection: false, // Avoid reconnection loops in this test
  // });

  // socket.on('connect', () => {
  //   logger.log('Test client connected to WebSocket server');
  //   socket.emit('message', 'Test message from backend client');
  // });

  // socket.on('welcome', (msg) => {
  //   logger.log(`Received welcome message: ${msg}`);
  // });

  // socket.on('notification', (msg) => {
  //   logger.log(`Received server response: ${msg}`);
  //   // Close the client and server after the test
  //   socket.disconnect();
  //   app.close().then(() => logger.log('Test complete, server closed'));
  // });

  // socket.on('connect_error', (err) => {
  //   logger.error(`Connection error: ${err.message}`);
  //   app.close();
  // });

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
