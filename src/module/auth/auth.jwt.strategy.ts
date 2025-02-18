import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadType } from './types/payload.type';
import { envs } from '../../common';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.authSecret, 
    });
  }
  async validate(payload: PayloadType) {
    return { userId: payload.userId, email: payload.email, artistId: payload.artistId }; 
  }
}
