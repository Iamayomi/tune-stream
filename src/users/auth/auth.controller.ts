import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';
import { AuthService } from 'src/users/auth/auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Message, ParsedJWTCookie, GuardRoute } from 'src/library/decorator';
import { LoginDTO, CreateUserDTO, VerificationCodeDTO } from './dto';
import { NODE_ENV, TIME_IN } from 'src/library';
import { ResetPasswordDTO } from './dto/reset-password-dto';
import { Roles } from 'src/library/types';
import { RoleAllowed } from 'src/library/decorator/role-allowed';

@Message()
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
    const { refresh_token, user } = await this.authService.userLogin(
      loginDTO,
      res,
    );

    // Set refresh token
    res.cookie('refresh_token', refresh_token, {
      secure: this.configService.get<string>(NODE_ENV) === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: TIME_IN.days[7],
    });

    return user;
  }

  /**
   * @route {POST} /api/v1/auth/verify-email
   * @access public */
  @ApiOperation({ summary: 'verify user email' })
  @ApiBearerAuth('JWT-auth')
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
  @ApiBearerAuth('JWT-auth')
  @Get('resend-email-code')
  resendEmailVerificationCode(
    @ParsedJWTCookie() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resendEmailVericationCode(token, res);
  }

  /**
   * @route {POST} /api/v1/auth/forgot-password
   * @access public */
  @ApiOperation({ summary: 'user forgot password' })
  @ApiBearerAuth('JWT-auth')
  @Post('forgot-password')
  forgotPassword(
    @Res({ passthrough: true }) res: Response,
    @Body() email: string,
  ) {
    return this.authService.forgotPassword(email, res);
  }

  /**
   * @route {POST} /api/v1/auth/forgot-password-code
   * @access public */
  @ApiOperation({ summary: 'verify forgot password code' })
  @ApiBearerAuth('JWT-auth')
  @Post('forgot-password-code')
  verifyForgotPasswordCode(
    @ParsedJWTCookie() token: string,
    @Res({ passthrough: true }) res: Response,
    @Body() verificationCode: VerificationCodeDTO,
  ) {
    return this.authService.verifyPasswordCode(verificationCode, token, res);
  }

  /**
   * @route {POST} /api/v1/auth/reset-password
   * @access public */
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reset password' })
  @Patch('reset-password')
  resetPassword(
    @ParsedJWTCookie() token: string,
    @Res({ passthrough: true }) res: Response,
    @Body() password: ResetPasswordDTO,
  ) {
    return this.authService.resetPassword(password, token, res);
  }

  /**
   * Get user's profile
   * @route {GET} /api/v1/user/profile
   * @access protected
   */
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'fetch a user profile' })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get('profile')
  getProfile(@Req() request) {
    delete request.user.password;
    return {
      msg: 'authenticated with api key',
      user: request.user,
    };
  }
}
