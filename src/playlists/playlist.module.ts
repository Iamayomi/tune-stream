import { Module } from '@nestjs/common';
import { PlaylistsController } from './playlist.controller';
import { PlaylistsService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, Song, User]),
    NotificationModule,
  ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
