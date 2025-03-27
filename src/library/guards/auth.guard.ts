import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { decoded } from '../types';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/user.service';
import { CacheService } from '../cache/cache.service';
import { SESSION_USER } from '../config';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(
    // private userService: UserService,
    private cache: CacheService,

    private jwtService: JwtService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader: string = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    // Extract the token
    const token: string = authHeader.split(' ')[1];

    const decoded: decoded = await this.jwtService.verifyAsync<decoded>(token);

    if (!decoded || !decoded.userId || !decoded.email)
      throw new UnauthorizedException('Session expired, please log in again.');

    const user =
      (await this.cache.get(SESSION_USER(`${decoded.userId}`))) ?? decoded;

    request.user = user;

    return true;
  }
}
