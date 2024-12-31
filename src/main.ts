import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

dotenv.config();
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import cookieparser from 'cookie-parser';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';

import { SeedService } from './module/seed/seed.service';
import { HttpExceptionFilter } from 'src/common/helper/filter';

// declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // security
  app.use(helmet());

  app.enableCors();

  app.use(helmet());

  app.use(compression());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(morgan('dev'));

  // Set global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  //  Set global prefix for routes
  app.setGlobalPrefix('/api/v1/');

  // const seedService = app.get(SeedService);

  // await seedService.seeder();

  await app.listen( false || process.env.PORT);

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
