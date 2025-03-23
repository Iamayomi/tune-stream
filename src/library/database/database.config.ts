// import { ConfigModule, ConfigService } from '@nestjs/config';
// import {
//   TypeOrmModuleAsyncOptions,
//   TypeOrmModuleOptions,
// } from '@nestjs/typeorm';
// import { DATABASE_URL } from '../config';

// export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: async (
//     configService: ConfigService,
//   ): Promise<TypeOrmModuleOptions> => {
//     return {
//       type: 'postgres',
//       url: configService.get<string>('DATABASE_URL'),
//       entities: ['dist/**/*.entity.js'],
//       synchronize: false,
//       migrations: ['dist/db/migrations/*.js'],
//     };
//   },
// };
