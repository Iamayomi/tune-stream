import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { SeedService } from './module/seed/seed.service';
import { HttpExceptionFilter } from 'src/common/helper/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  //  Set global prefix for routes
  app.setGlobalPrefix('/api/v1/');

  // const seedService = app.get(SeedService);

  // await seedService.seeder();

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
