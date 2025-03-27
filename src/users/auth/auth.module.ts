import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/users/user.module';
import { JWTStrategy } from './auth.jwt.strategy';
import { ArtistsModule } from 'src/artists/artist.module';
import { JWT_ACCESS_TOKEN_EXP, JWT_ACCESS_TOKEN_SECRET } from '../../library';
import { MailModule } from 'src/library/mailer/mailer.module';

// import { ApiKeyStrategy } from './apikey.strategy';

@Module({
  imports: [
    UserModule,
    ArtistsModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_ACCESS_TOKEN_EXP),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    MailModule,
  ],
  providers: [
    AuthService,
    JWTStrategy,
    // ApiKeyStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
