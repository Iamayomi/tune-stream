import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ResponseInterceptor } from './library';
import { LoggerMiddleware } from './library';
import { SongsModule } from './songs/song.module';
import { UserModule } from './users/user.module';
import { ArtistsModule } from './artists/artist.module';
import { PlaylistsModule } from './playlists/playlist.module';
import { AuthModule } from './users/auth/auth.module';
import { AlbumsModule } from './albums/album.module';
import { AppController } from './app.controller';
import { MailModule } from './library/mailer/mailer.module';
import { AppConfigModule } from './library/config/config.module';
import { CacheModule } from './library/cache/cache.module';
import { DatabaseModule } from './library/database/database.module';
import { LikeModule } from './likes/like.module';
import { FollowModule } from './follows/follow.module';
import { CommentModule } from './comments/comment.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { PaymentModule } from './payments/payments.module';

@Module({
  imports: [
    NotificationModule,
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
    SubscriptionModule,
    // SeedModule,
    AlbumsModule,
    // SearchModule,
    MailModule,
    AppConfigModule,
    CacheModule,
    LikeModule,
    FollowModule,
    CommentModule,
    PaymentModule,
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
    consumer.apply(LoggerMiddleware).forRoutes('');
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); option 1.
    // consumer.apply(LoggerMiddleware).forRoutes({path: 'songs', method: RequestMethod.POST}); // option 2.
    // consumer.apply(LoggerMiddleware).forRoutes(SongsController); // option 3.
  }
}
