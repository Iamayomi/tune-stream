import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Playlist } from '../playlists/playlist.entity';
import { MailModule } from '../library/mailer/mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_ACCESS_TOKEN_EXP, JWT_ACCESS_TOKEN_SECRET } from 'src/library';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Playlist]),
    MailModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_ACCESS_TOKEN_EXP),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
