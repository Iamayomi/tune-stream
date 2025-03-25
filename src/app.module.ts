import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { ResponseInterceptor } from './library';

import { LoggerMiddleware } from './library';
// import { SongsController } from './songs/songs.controller';
// import { DataSource } from 'typeorm';
import { SongsModule } from './songs/song.module';
// import { Song } from './module/songs/song.entity';

import { UserModule } from './users/user.module';
// import { User } from './module/users/user.entity';

import { ArtistsModule } from './artists/artist.module';
// import { Artist } from './module/artists/artist.entity';

import { PlaylistsModule } from './playlists/playlist.module';
// import { Playlist } from './module/playlists/playlist.entity';

import { AuthModule } from './users/auth/auth.module';

import { AlbumsModule } from './albums/album.module';

// import { SeedModule } from './module/seed/seed.module';

import { AppController } from './app.controller';

import { SearchModule } from './search/search.module';
import { MailModule } from './library/mailer/mailer.module';
import { AppConfigModule } from './library/config/config.module';
import { CacheModule } from './library/cache/cache.module';
import { DatabaseModule } from './library/database/database.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', '../public'), // Path to your static files directory
      serveRoot: '/public',
    }),
    DatabaseModule,
    SongsModule,
    UserModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
    // SeedModule,
    AlbumsModule,
    SearchModule,
    MailModule,
    AppConfigModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
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
