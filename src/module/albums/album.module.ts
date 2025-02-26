import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Album } from './album.entity';
import { Artist } from '../artists/artist.entity';
import { Song } from '../songs/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist, Song])],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumsModule {}
