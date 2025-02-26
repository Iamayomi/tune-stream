import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/module/users/user.entity';
import { createArtistDTO } from './dto/create-artist.dto';
import { UserRole } from '../users/types';
import { UserService } from '../users/user.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly userService: UserService,
  ) {}

  async findArtistById(userId: number): Promise<Artist> {
    const user = await this.artistRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async userUpgradeToArtist(
    userId: number,
    artistData: createArtistDTO,
  ): Promise<Artist> {
    const findArtist = await this.findArtistById(userId);

    const user = await this.userService.findById(findArtist.user.id);

    if (user.roles.includes(UserRole.ARTIST)) {
      throw new BadRequestException('User is already an artist');
    }

    user.roles.push(UserRole.ARTIST);

    // Create the artist associated with the user
    const artist = this.artistRepository.create({
      ...artistData,
      user,
    });

    return await this.artistRepository.save(artist);
  }
}
