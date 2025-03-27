import { Module } from '@nestjs/common';
import { PlaylistsController } from './playlist.controller';
import { PlaylistsService } from './playlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
