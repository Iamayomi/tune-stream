import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as bodyParser from 'body-parser';
import { HttpExceptionFilter } from './common';
import { corsOptions } from './common';
import {options} from "../src/common"


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/v1/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // security
  // app.use(helmet());

  app.enableCors(corsOptions);

  // app.use(compression());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  // app.use(morgan('dev'));

  // Set global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  //  Set global prefix for routes
    // app.setGlobalPrefix('/api/v1/');

  await app.listen(false || process.env.PORT);

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
