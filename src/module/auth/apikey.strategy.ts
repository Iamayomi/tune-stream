import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Strategy } from "passport-http-bearer";
import { UnauthorizedException } from '@nestjs/common';

export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(apikey: string) {
    const user = await this.authService.validateUserByApiKey(apikey);
    if (!user) {
      throw new UnauthorizedException();
    } else {
      return user;
    }
  }
}
