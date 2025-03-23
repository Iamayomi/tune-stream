import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import { HttpStatus, ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

import {
  AllExceptionsFilter,
  PORT,
  corsOptions,
  swaggerOptions,
} from './library';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Set global prefix for routes
  app.setGlobalPrefix('/api/v1/');

  const { httpAdapter } = app.get(HttpAdapterHost);

  // Set global filters

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('api/v1/docs', app, document);

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

  // app.use(morgan('dev'));
  const config = app.get(ConfigService);

  await app.listen(config.get(PORT, 5000));

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
