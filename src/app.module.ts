import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { LoggerMiddleware } from './common';
// import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
import { SongsModule } from './module/songs/song.module';
// import { Song } from './module/songs/song.entity';

import { UserModule } from './module/users/user.module';
// import { User } from './module/users/user.entity';

import { ArtistsModule } from './module/artists/artist.module';
// import { Artist } from './module/artists/artist.entity';

import { PlaylistsModule } from './module/playlists/playlist.module';
// import { Playlist } from './module/playlists/playlist.entity';

import { AuthModule } from './module/auth/auth.module';

import { AlbumsModule } from './module/albums/album.module';


import { dataSourceOptions } from '../db/data-source';

import { SeedModule } from './module/seed/seed.module';

import {AppController} from "./app.controller"

import { SearchModule } from './module/search/search.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'public'), // Path to your static files directory
      serveRoot: '/public', 
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    UserModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
    SeedModule,
    AlbumsModule,
    SearchModule,
    // SearchModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  // constructor(private dataSource: DataSource) {
  //   console.log('database_name', dataSource.driver.database);
  // }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); option 1.
    // consumer.apply(LoggerMiddleware).forRoutes({path: 'songs', method: RequestMethod.POST}); // option 2.
    // consumer.apply(LoggerMiddleware).forRoutes(SongsController); // option 3.
  }
}

