import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { Playlist } from '../playlists/playlist.entity';
import { SendEmailResponse } from './types';
import { obscureEmail } from 'src/library';
import { SUBSCRIPTION_PLAN } from 'src/subscriptions/type';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}

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
