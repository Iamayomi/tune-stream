import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/module/users/user.entity';
import { createArtistDTO } from './dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findArtist(userId: number): Promise<Artist> {
    return await this.artistRepository.findOneBy({ id: userId });
  }

  async createArtistForUser(userId: number, artistData: createArtistDTO): Promise<Artist> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the artist associated with the user
    const artist = this.artistRepository.create({
      ...artistData,
      user,
    });


    return await this.artistRepository.save(artist);
  }
}
