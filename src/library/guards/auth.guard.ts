import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { decoded } from '../types';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader: any = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    // Extract the token
    const token: string = authHeader.split(' ')[1];

    let decoded: decoded | void = await this.jwtService
      .verifyAsync<decoded>(token)
      .then((token) => token)
      .catch((err) => {
        if (err.name === 'TokenExpiredError')
          throw new UnauthorizedException(
            'Token expired, please log in again.',
          );
        throw new UnauthorizedException('Invalid token.');
      });

    if (!decoded || !decoded.sub || !decoded.email)
      throw new UnauthorizedException('Session expired, please log in again.');

    const user = await this.userService.findById(+decoded.sub);

    request.user = user;
    return true;
  }
}
