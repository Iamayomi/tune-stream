import { ConflictException, Injectable, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO, LoginDTO } from './auth/dto';
import { Playlist } from '../playlists/playlist.entity';
import { MailService } from '../library/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { SendEmailResponse } from './types';
import {
  JWT_ACCESS_TOKEN_EXP,
  JWT_ACCESS_TOKEN_SECRET,
  SESSION_USER,
  TIME_IN,
  VERIFY_EMAIL,
  emailVerificationTemplate,
  getRandomNumbers,
  obscureEmail,
} from 'src/library';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/library/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,

    private mailService: MailService,

    private configService: ConfigService,

    private jwtService: JwtService,

    private cache: CacheService,
  ) {}

  /** Creates and returns a new user document */
  public async createUser(data: CreateUserDTO, @Response() res) {
    const existingUser = await this.findByEmail(data.email);

    // step 1: check if the email exist
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create(data);

    const { code } = await getRandomNumbers();

    const access_token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
        expiresIn: `1h`,
      },
    );

    await this.userRepository.save(user);

    await this.cache.set(VERIFY_EMAIL(user.email), code, TIME_IN.minutes[5]);

    await this.cache.set(
      SESSION_USER(`${user.id}`),
      access_token,
      TIME_IN.hours[1],
    );

    res.setHeader('Authorization', access_token);

    const mailOptions = emailVerificationTemplate(user.fullName, code);

    await this.mailService.viaNodemailer({ ...mailOptions, to: user.email });

    return await this.sendEmailResponse(user.email);
  }

  /** Create user by data */
  public async sendEmailResponse(
    email: string,
  ): Promise<Partial<SendEmailResponse>> {
    return {
      message: `Verify your email with the code that was sent to ${obscureEmail(email)} it valid for 5 mins!`,
    };
  }

  /** Create user by data */
  public async forgotPasswordResponse(
    email: string,
  ): Promise<Partial<SendEmailResponse>> {
    return {
      message: `A code that was sent to ${obscureEmail(email)} it valid for 5 mins!`,
    };
  }

  /** Finds a user by their email address */
  public async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  /** update user email status */
  public async updateEmailStatus(email: string) {
    await this.userRepository.update({ email }, { verified_email: true });
  }

  /** update user email status */
  public async updateUserRefreshToken(email: string, refresh_token: string) {
    await this.userRepository.update(
      { email },
      { refresh_token: refresh_token },
    );
  }

  /** update user password */
  public async resetUserPassword(email: string, confirm_newpassword: string) {
    await this.userRepository.update(
      { email },
      { password: confirm_newpassword },
    );
  }

  /** Finds a user by id */
  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('Could not find user');

    return user;
  }

  /** Finds a user by api key */
  async findByApiKey(api_key: string): Promise<User> {
    return this.userRepository.findOneBy({ api_key: api_key });
  }

  /** Finds a user by playlist id */
  async findUserPlaylistsById(userId: number): Promise<Playlist[]> {
    return await this.playlistRepository.find({
      where: { id: userId },
    });
  }
}
