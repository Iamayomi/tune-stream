// import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

// export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
//     return {
//       type: 'postgres',
//       host: configService.get<string>('host'),
//       port: configService.get<number>('dbPort'),
//       username: configService.get<string>('username'),
//       password: configService.get<string>('password'),
//       database: configService.get<string>('database'),
//       entities: ['dist/**/*.entity.js'],
//       synchronize: false,
//       migrations: ['dist/db/migrations/*.js'],
//     };
//   },
// };

export const dataSourceOptions: DataSourceOptions = {
  // type: 'postgres',
  // host: process.env.DB_HOST,
  // port: parseInt(process.env.DB_PORT),
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // entities: ['dist/**/*.entity.js'],
  // synchronize: false,
  // migrations: ['dist/db/migrations/*.js'],
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'myserver',
  database: 'tunestream',
  entities: ['dist/**/*.entity.js'], //1
  synchronize: false, // 2
  migrations: ['dist/src/common/database/migrations/*.js'],
};

// console.log(dataSourceOptions)
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
