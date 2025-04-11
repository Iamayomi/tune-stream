import { ConflictException, Injectable, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { CreateUserDTO } from './auth/dto';
import { Playlist } from '../playlists/playlist.entity';
import { MailService } from '../library/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { SendEmailResponse } from './types';
import {
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
import { SUBSCRIPTION_PLAN } from 'src/subscriptions/type';
import { UpdateUserDto } from './types/dto/update-user.dto';

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
  public async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('Could not find user');

    return user;
  }

  /** Finds a user by api key */
  public async findByApiKey(api_key: string): Promise<User> {
    return this.userRepository.findOneBy({ api_key: api_key });
  }

  public async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    return await this.userRepository.update(
      { id: userId },
      { ...updateUserDto, password: hashedPassword },
    );
  }

  /** Finds a user by playlist id */
  public async findUserPlaylistsById(userId: number): Promise<Playlist[]> {
    return await this.playlistRepository.find({
      where: { id: userId },
    });
  }
  /** downgrade user to free */
  public async downgradeToFree(user: User) {
    user.isPremium = false;
    user.subscription = SUBSCRIPTION_PLAN.FREE;
    user.subscriptions = null;
    await this.userRepository.save(user);
  }
}
