import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstant } from './auth.constant';
import { PayloadType } from './types/payload.type';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConstant.secret, 
    });
  }
  async validate(payload: PayloadType) {
    return { userId: payload.userId, email: payload.email, artistId: payload.artistId }; 
  }
}
