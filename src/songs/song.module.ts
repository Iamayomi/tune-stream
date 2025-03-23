import { Module } from '@nestjs/common';
import { SongsController } from './song.controller';
import { SongsService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artists/artist.entity';
import { Album } from '../albums/album.entity';
import { AlbumService } from '../albums/album.service';
import { AlbumsModule } from '../albums/album.module';
import { ElasticSearchService } from '../search/search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Album, Artist]), SearchModule],
  controllers: [SongsController],
  providers: [
    //////// 1. standard providers

    SongsService,
    AlbumService,
    // ElasticSearchService
    // {
    //   provide: ElasticSearchService,
    //   useClass: ElasticSearchService,
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
