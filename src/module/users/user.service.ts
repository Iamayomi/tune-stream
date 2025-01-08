import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDTO } from './dto/create-user-dto';
import { LoginDTO } from './dto/login-user-dto';
import { generateUUID } from './uuid';
import { Playlist } from '../playlists/playlist.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}

  async createUser(userDTO: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt();

    userDTO.password = await bcrypt.hash(userDTO.password, salt);

    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = await generateUUID();
    user.password = userDTO.password;
    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;

    return savedUser;
  }

  async findUser(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }

    return user;
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }

  async findUserPlaylistsById(userId: number): Promise<Playlist[]> {
    return await this.playlistRepository.find({ where: { userId } });
  }
}
