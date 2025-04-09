import { Module } from '@nestjs/common';
import { SongsController } from './song.controller';
import { SongsService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artists/artist.entity';
import { Album } from '../albums/album.entity';
import { AlbumService } from '../albums/album.service';
import { NotificationModule } from 'src/notification/notification.module';
import { CloudinaryModule } from 'src/library/cloudinary/cloudinary.module';
import { Playlist } from 'src/playlists/playlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Album, Artist, Playlist]),
    CloudinaryModule,
    NotificationModule,
  ],
  controllers: [SongsController],
  providers: [
    //////// 1. standard providers

    SongsService,
    AlbumService,

    // ElasticSearchService
    // {
    //   provide: NotificationService,
    //   useClass: NotificationService,
    // },

    //////// 2. value providers
    // {
    //   provide: SongsService,
    //   useValue: mockSongsService,
    // },
  ],
  exports: [SongsService],
})
export class SongsModule {}
