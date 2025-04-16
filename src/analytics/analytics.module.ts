import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Stream } from '../stream/stream.entity';
import { Song } from 'src/songs/song.entity';
import { AnalyticsGateway } from './analytics.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Stream, Song])],
  providers: [AnalyticsService, AnalyticsGateway],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
