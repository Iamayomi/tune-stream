import {
  BadGatewayException,
  Response,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from '../auth/dto';
import { UserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artist.service';
import { PayloadType } from './types/payload.type';
import { User } from 'src/users/user.entity';
import {
  JWT_ACCESS_TOKEN_EXP,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXP,
  REFRESH_TOKEN,
  SESSION_USER,
  TIME_IN,
  VERIFY_EMAIL,
  emailVerificationResendTemplate,
  emailVerificationTemplate,
  getRandomNumbers,
} from 'src/library';
import { MailService } from 'src/library/mailer/mailer.service';
import { VerificationCodeDTO } from './dto';
import { CacheService } from 'src/library/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
    private mailService: MailService,
    private configService: ConfigService,
    private cache: CacheService,
  ) {}

  /** Login user returns */
  public async userLogin(data: LoginDTO, @Response() res) {
    const user = await this.userService.findByEmail(data.email);

    if (!user || !(await user.verifyPassword(data.password)))
      throw new UnauthorizedException('Invalid email or password');

    if (!user.verified_email)
      throw new UnauthorizedException('Email not verified');

    // if (!user.verified_phone)
    //   throw new UnauthorizedException('Phone not verified');

    const payload: PayloadType = { email: user.email, userId: user.userId };

    const artist = await this.artistService.findArtistById(payload.userId);

    if (artist) {
      payload.artistId = artist.artistId;
    }

    const access_token = this.jwtService.sign(payload);

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
      expiresIn: this.configService.get<string>(JWT_ACCESS_TOKEN_EXP),
    });

    await this.userService.updateUserRefreshToken(data.email, refresh_token);

    await this.cache.set(
      SESSION_USER(user.userId.toString()),
      user.toJSON(),
      TIME_IN.days[7],
    );

    await this.cache.set(
      REFRESH_TOKEN(user.userId.toString()),
      refresh_token,
      TIME_IN.days[7],
    );
    res.setHeader('Authorization', access_token);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  public async verifyEmail(
    code: VerificationCodeDTO,
    token: string,
    @Response() res,
  ) {
    const decoded = await this.jwtService
      .verifyAsync<{ email: string }>(token)
      .then((token) => token)
      .catch((err) => {
        if (err.name === 'TokenExpiredError')
          throw new UnauthorizedException(
            'Token expired, please log in again.',
          );
        throw new UnauthorizedException('Invalid token.');
      });

    const storedCode = await this.cache.get(VERIFY_EMAIL(decoded.email));

    if (!storedCode) {
      throw new BadGatewayException('Email verication code has expired');
    }

    if (storedCode.toString() !== code.verificationCode) {
      throw new UnauthorizedException('Invalid verification code');
    }

    await this.userService.updateEmailStatus(decoded.email);
    await this.cache.delete(VERIFY_EMAIL(decoded.email));

    const access_token = await this.jwtService.signAsync({
      email: decoded.email,
    });

    res.setHeader('Authorization', access_token);

    return {
      message: 'Email verified successfully',
    };
  }

  public async resendEmailVericationCode(token: string, @Response() res) {
    const decoded = await this.jwtService
      .verifyAsync<{ email: string }>(token)
      .then((token) => token)
      .catch((err) => {
        if (err.name === 'TokenExpiredError')
          throw new UnauthorizedException(
            'Token expired, please log in again.',
          );
        throw new UnauthorizedException('Invalid token.');
      });

    const user = await this.userService.findByEmail(decoded.email);

    const user_cache = await this.cache.get(SESSION_USER(`${user.userId}`));

    if (!user_cache) {
      throw new NotFoundException('User session not found');
    }
    const { code } = await getRandomNumbers();

    await this.cache.set(VERIFY_EMAIL(user.email), code, TIME_IN.minutes[5]);

    const mailOptions = emailVerificationResendTemplate(user.fullName, code);

    await this.mailService.viaNodemailer({ ...mailOptions, to: user.email });

    const access_token = await this.jwtService.signAsync({
      email: user.email,
    });

    res.setHeader('Authorization', access_token);

    return await this.userService.sendEmailResponse(user.email);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }
}
