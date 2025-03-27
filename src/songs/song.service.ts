import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ElasticSearchService } from '../search/search.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { UpdateSongDTO } from './dto/update-song-dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';
import { Album } from '../albums/album.entity';
import { AlbumService } from '../albums/album.service';

import { SearchSongDto } from './dto/search-song-dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);
  private readonly index = 'songs';
  constructor(
    private albumService: AlbumService,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    // @Inject(ElasticSearchService) // Explicitly inject ElasticSearchService
    // private readonly elasticSearch: ElasticSearchService,
  ) {}

  async createSong(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.coverImage = songDTO.coverImage;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releaseDate = songDTO.releaseDate;

    song.artists = await this.artistRepository.find({
      where: { id: In(songDTO.artists) },
    });
    songDTO.album === undefined ? true : false;

    if (songDTO.album) {
      const album = await this.albumService.findAlbumById(songDTO.album);

      if (!album)
        throw new NotFoundException(
          `Album with this ID ${songDTO.album} not found`,
        );

      song.album = album;
    }
    await this.songRepository.save(song);

    // await this.elasticSearch.indexDocument(
    //   this.index,
    //   String(song.songId),
    //   song,
    // );

    this.logger.log(`Song created: ${JSON.stringify(song)}`);

    return song;
  }

  async findSongById(songId: number): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id: songId });

    if (!song)
      throw new NotFoundException(`Song with this ID ${songId} not found`);

    return song;
  }

  async updateSongById(
    songId: number,
    artistId: number,
    updateSongData: UpdateSongDTO,
  ): Promise<UpdateResult> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['songs'],
    });

    if (!artist)
      throw new NotFoundException(`Artist with this ID ${artistId} not found`);

    const song = artist.songs.find((song) => song.id === songId);

    if (!song)
      throw new NotFoundException(`Song with this ID ${songId} not found`);

    return await this.songRepository.update(songId, updateSongData);
  }

  async deleteSongById(
    songId: number,
    artistId: number,
  ): Promise<DeleteResult> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['songs'],
    });

    if (!artist)
      throw new NotFoundException(`Artist with this ID ${artistId} not found`);

    const song = artist.songs.find((song) => song.id === songId);

    if (!song)
      throw new NotFoundException(`Song with this ID ${songId} not found`);

    return await this.songRepository.delete(songId);
  }

  async findAllSong(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  async searchSong(searchSongDto: SearchSongDto) {
    // return await this.elasticSearch.searchsong(searchSongDto);
  }

  async pagination(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releaseDate', 'DESC');
    return await paginate<Song>(queryBuilder, options);
  }
}
