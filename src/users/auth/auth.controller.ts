import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/users/user.service';
import { AuthService } from 'src/users/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Message, ParsedJWTCookie } from 'src/library/decorator';
import { LoginDTO, CreateUserDTO, VerificationCodeDTO } from './dto';
import { NODE_ENV, TIME_IN } from 'src/library';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  /**
   * @route {POST} /api/v1/auth/register
   * @access public */
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  @Message('User Registration Successfully')
  @Post('register')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() userData: CreateUserDTO,
  ) {
    return await this.userService.createUser(userData, res);
  }

  /**
   * @route {POST} /api/v1/auth/login
   * @access public */
  @ApiOperation({ summary: 'login a user' })
  @Message('Welcome back!')
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDTO: LoginDTO,
  ) {
    const { refresh_token } = await this.authService.userLogin(loginDTO, res);

    // Set refresh token
    res.cookie('refresh_token', refresh_token, {
      secure: this.configService.get<string>(NODE_ENV) === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: TIME_IN.days[7],
    });
  }

  /**
   * @route {POST} /api/v1/auth/verify-email
   * @access public */
  @ApiOperation({ summary: 'verify user email' })
  @Post('verify-email')
  verifyEmail(
    @ParsedJWTCookie() token: string,
    @Res({ passthrough: true }) res: Response,
    @Body() verificationCode: VerificationCodeDTO,
  ) {
    return this.authService.verifyEmail(verificationCode, token, res);
  }

  /**
   * @route {POST} /api/v1/auth/verify-email
   * @access public */
  @ApiOperation({ summary: 'verify user email' })
  @Get('resend-email-code')
  resendEmailVerificationCode(
    @ParsedJWTCookie() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resendEmailVericationCode(token, res);
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
