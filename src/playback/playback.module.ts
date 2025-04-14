import { Module } from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaybackState } from './playback.entity';
import { User } from 'src/users/user.entity';
import { BullModule } from '@nestjs/bull';
import { Song } from 'src/songs/song.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlaybackState, Song, User]),
    BullModule.registerQueue({
      name: 'stream-queue',
    }),
  ],
  providers: [PlaybackService],
})
export class PlaybackModule {}
