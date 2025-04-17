import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_URL } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>(DATABASE_URL),
        autoLoadEntities: true,
        synchronize: false, // ⚠️ Set to false in production
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/src/library/database/migrations/*.js'],
      }),
    }),
  ],
})
export class DatabaseModule {}
