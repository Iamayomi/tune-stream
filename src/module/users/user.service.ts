import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO, LoginDTO } from './dto';
import { Playlist } from '../playlists/playlist.entity';
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
    const existingUser = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  /** Finds a user by their email address */
  async findByEmail(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user) sendError.unauthenticatedError('Could not find user');

    return user;
  }

  /** Finds a user by id */
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) sendError.unauthenticatedError('Could not find user');

    return user;
  }
  /** Finds a user by api key */
  async findByApiKey(api_key: string): Promise<User> {
    return this.userRepository.findOneBy({ api_key: api_key });
  }

  /** Finds a user by playlist id */
  async findUserPlaylistsById(userId: number): Promise<Playlist[]> {
    return await this.playlistRepository.find({ where: { id: userId } });
  }
}
