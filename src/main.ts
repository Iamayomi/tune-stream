import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

import {
  AllExceptionsFilter,
  PORT,
  corsOptions,
  setupSwagger,
  swaggerOptions,
} from './library';
import { io, Socket } from 'socket.io-client';

async function bootstrap() {
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

  // app.useLogger(app.get(CustomLogger));

  // app.use(morgan('dev'));
  const config = app.get(ConfigService);

  await app.listen(config.get(PORT, 5000));

  const logger = new Logger('WebSocketTest');

  // Simulate a WebSocket client connecting to the server
  const socket: Socket = io(`http://localhost:8080/notification`, {
    reconnection: false, // Avoid reconnection loops in this test
  });

  socket.on('connect', () => {
    logger.log('Test client connected to WebSocket server');
    socket.emit('message', 'Test message from backend client');
  });

  socket.on('welcome', (msg) => {
    logger.log(`Received welcome message: ${msg}`);
  });

  socket.on('notification', (msg) => {
    logger.log(`Received server response: ${msg}`);
    // Close the client and server after the test
    socket.disconnect();
    app.close().then(() => logger.log('Test complete, server closed'));
  });

  socket.on('connect_error', (err) => {
    logger.error(`Connection error: ${err.message}`);
    app.close();
  });

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
