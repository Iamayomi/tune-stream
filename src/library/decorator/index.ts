import {
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticationGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const ParsedJWTCookie = createParamDecorator(
  (key: string = 'jwt', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No verification token found in headers');
    }
    const token = authHeader.split(' ')[1];

    return token;
  },
);

export const MESSAGE = 'message';

export const Message = (message: string = 'Success') =>
  SetMetadata('message', message);

export const GuardRoute = () => {
  return applyDecorators(UseGuards(AuthenticationGuard, RolesGuard));
};

// export const ProtectArtist = () => {
//   return applyDecorators(UseGuards(AuthenticationGuard, ArtistGuard));
// };
