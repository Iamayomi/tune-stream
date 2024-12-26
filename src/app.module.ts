import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
// import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
import { SongsModule } from './module/songs/song.module';
import { Song } from './module/songs/song.entity';

import { UsersModule } from './module/users/user.module';
import { User } from './module/users/user.entity';

import { ArtistsModule } from './module/artists/artist.module';
import { Artist } from './module/artists/artist.entity';

import { PlaylistsModule } from './module/playlists/playlist.module';
import { Playlist } from './module/playlists/playlist.entity';

import { AuthModule } from './module/auth/auth.module';

import { dataSourceOptions } from '../db/data-source';
import { SeedModule } from './module/seed/seed.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    UsersModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // constructor(private dataSource: DataSource) {
  //   console.log('database_name', dataSource.driver.database);
  // }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); option 1.
    // consumer.apply(LoggerMiddleware).forRoutes({path: 'songs', method: RequestMethod.POST}); // option 2.
    // consumer.apply(LoggerMiddleware).forRoutes(SongsController); // option 3.
  }
}
