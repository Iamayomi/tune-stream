import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { createArtistDTO } from './dto/create-artist.dto';
import { Roles } from '../library/types';
import { UserService } from '../users/user.service';
import { Stream } from 'src/stream/stream.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Stream)
    private streamRepository: Repository<Stream>,

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

    user.roles.push(Roles.ARTIST);

    await this.userRepository.save(user);

    // Create the artist associated with the user
    const artist = this.artistRepository.create({
      ...artistData,
      user,
    });

    return await this.artistRepository.save(artist);
  }

  public async updateMonthlyListeners() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const streams = await this.streamRepository.find({
      where: { streamedAt: MoreThan(thirtyDaysAgo) },
      relations: ['song', 'song.artists'],
    });

    const artistListenersMap = new Map<number, Set<number>>();

    for (const stream of streams) {
      const userId = stream.user.id;
      const artists = stream.song?.artists || [];

      for (const artist of artists) {
        if (!artistListenersMap.has(artist.id)) {
          artistListenersMap.set(artist.id, new Set());
        }
        artistListenersMap.get(artist.id).add(userId);
      }
    }

    for (const [artistId, userSet] of artistListenersMap.entries()) {
      await this.artistRepository.update(artistId, {
        monthlyListeners: userSet.size,
      });
    }
  }
}
