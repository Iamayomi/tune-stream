import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/module/users/user.module';
import { authConstant } from './auth.constant';
import { JWTStrategy } from './auth.jwt.strategy';
import { ArtistsModule } from 'src/module/artists/artist.module';


// import { ApiKeyStrategy } from './apikey.strategy';

@Module({
  imports: [
    UsersModule,
    ArtistsModule,
    JwtModule.register({
      secret: authConstant.secret,
      signOptions: {
        expiresIn: '1d',
      },
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
