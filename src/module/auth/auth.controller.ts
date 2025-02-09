import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/module/users/dto/create-user-dto';
import { LoginDTO } from 'src/module/users/dto/login-user-dto';
import { User } from 'src/module/users/user.entity';
import { UserService } from 'src/module/users/user.service';
import { AuthService } from 'src/module/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  @Post('register')
  signup(@Body() userData: CreateUserDTO): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.userLogin(loginDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Req()
    req,
  ) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
