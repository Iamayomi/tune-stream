import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/module/users/user.module';
import { JWTStrategy } from './auth.jwt.strategy';
import { ArtistsModule } from 'src/module/artists/artist.module';
import { envs } from '../../common';


// import { ApiKeyStrategy } from './apikey.strategy';

@Module({
  imports: [
    UserModule,
    ArtistsModule,
    JwtModule.register({
      secret: envs.authSecret,
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
