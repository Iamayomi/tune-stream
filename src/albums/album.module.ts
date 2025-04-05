import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { Album } from './album.entity';
import { Artist } from '../artists/artist.entity';
import { Song } from '../songs/song.entity';

import { CloudinaryModule } from 'src/library/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist, Song]), CloudinaryModule],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumsModule {}
