import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Stream } from './stream.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stream])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
