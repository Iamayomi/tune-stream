import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user-dto';
import { LoginDTO } from './dto/login-user-dto';
import { Playlist } from '../playlists/playlist.entity';
import { generateUUID } from '../../common/library/helper/utils';
import { sendError } from '../../common/library/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}

  /** Creates and returns a new user document */
  async createUser(data: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  /** Finds a user by their email address */
  async findByEmail(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user) sendError.unauthenticatedError('Could not find user');

    return user;
  }
  /** Finds a user by api key */
  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }

  /** Finds a user by playlist id */
  async findUserPlaylistsById(userId: number): Promise<Playlist[]> {
    return await this.playlistRepository.find({ where: { userId } });
  }
}
