import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
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

  public async findArtistById(userId: number): Promise<Artist> {
    return await this.artistRepository.findOneBy({ user: { id: userId } });
  }

  public async userUpgradeToArtist(
    userId: number,
    artistData: createArtistDTO,
  ): Promise<Artist> {
    const findArtist = await this.findArtistById(userId);

    if (findArtist)
      throw new BadRequestException('This Artist has already exist');

    const user = await this.userService.findById(userId);

    // if (user.roles.includes(UserRole.ARTIST)) {
    //   throw new BadRequestException('User is already an artist');
    // }

    user.roles.push(UserRole.ARTIST);

    // Create the artist associated with the user
    const artist = this.artistRepository.create({
      ...artistData,
      user,
    });

    return await this.artistRepository.save(artist);
  }
}
