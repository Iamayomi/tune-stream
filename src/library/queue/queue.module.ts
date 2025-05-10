import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StreamProcessor } from './streaam.processor';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheModule } from '../cache/cache.module';
import { REDIS_CLOUD_URL } from '../config';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Stream } from 'src/stream/stream.entity';
import { Album } from 'src/albums/album.entity';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>(REDIS_CLOUD_URL);
        const url = new URL(redisUrl); // Parse the Redis URL

        return {
          redis: {
            host: url.hostname,
            port: parseInt(url.port, 10),
            password: url.password,
          },
          prefix: 'bull',
        };
      },
    }),
    BullModule.registerQueue({
      name: 'stream-queue',
    }),
    TypeOrmModule.forFeature([Stream, Song, Album, User]),
  ],
  providers: [StreamProcessor],
})
export class QueueModule {}
