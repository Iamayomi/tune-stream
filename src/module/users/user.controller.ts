import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/module/auth/auth.guide/jwt.guard';

@Controller('users')
export class UsersController {
    // constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  getProfile(
    @Req()
    request,
  ) {
    return {
      msg: 'authenticated with api key',
      user: request.user,
      };
  }
}
