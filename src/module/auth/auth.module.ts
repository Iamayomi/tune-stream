import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/module/users/user.module';
import { JWTStrategy } from './auth.jwt.strategy';
import { ArtistsModule } from 'src/module/artists/artist.module';

// import { ApiKeyStrategy } from './apikey.strategy';

@Module({
  imports: [
    UserModule,
    ArtistsModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JWTStrategy,
    // ApiKeyStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
