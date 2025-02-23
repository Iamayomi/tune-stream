import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { envs } from '../env';

const description = ` 🎵 **TuneStream API** provides a seamless music streaming experience, enabling users to discover, play, and manage their favorite songs, albums, and playlists.`;

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Tunestream Api')
  .setDescription(description)
  .setVersion('1.0')
  .setContact(
    'Amodu Ayomide',
    '#',
    'ayomidesherif2019@gmail.com', // Email
  )
  .setLicense(
    'Apache 2.0', // License Name
    'http://www.apache.org/licenses/LICENSE-2.0.html', // License URL
  )
  .addServer(`http://localhost:${envs.port}/`, 'Local environment')
  // .addServer('https://staging.yourapi.com/', 'Staging')
  // .addServer('https://production.yourapi.com/', 'Production')
  .addBearerAuth(
    // Enable Bearer Auth here
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();

// export function setupSwagger(app: INestApplication, options: any) {
//   const document = SwaggerModule.createDocument(app, options);
//   SwaggerModule.setup('api/v1/docs', app, document);
// }
