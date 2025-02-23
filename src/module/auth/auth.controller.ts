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

  /**
   * @route {POST} /api/v1/auth/register
   * @access public */
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  @Post('register')
  signup(@Body() userData: CreateUserDTO): Promise<User> {
    return this.userService.createUser(userData);
  }

  /**
   * @route {POST} /api/v1/auth/login
   * @access public */
  @ApiOperation({ summary: 'login a user' })
  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.userLogin(loginDTO);
  }

  /**
   * Get user's profile
   * @route {GET} /api/v1/user/profile
   * @access protected
   */
  @ApiOperation({ summary: 'fetch a user profile' })
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() request) {
    delete request.user.password;
    return {
      msg: 'authenticated with api key',
      user: request.user,
    };
  }
}
