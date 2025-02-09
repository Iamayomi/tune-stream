import { Module } from '@nestjs/common';
import { SongsController } from './song.controller';
import { SongsService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/module/artists/artist.entity';
import { Album } from '../albums/album.entity';
import { AlbumService } from '../albums/album.service';
import { AlbumsModule } from '../albums/album.module';
// import { ElasticsearchService } from '@nestjs/elasticsearch';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Album, Artist])],
  controllers: [SongsController],
  providers: [
    //////// 1. standard providers

    SongsService,
    AlbumService,
    // {
    //   provide: ElasticsearchService,
    //   useClass: ElasticsearchService,
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
