import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DeleteResult,
  ILike,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Song } from './song.entity';
import { UpdateSongDTO } from './dto/update-song-dto';
import { Artist } from 'src/artists/artist.entity';
import { AlbumService } from '../albums/album.service';
import { SearchDto } from './dto/search-dto';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/type';
import { UploadSongDto } from './dto/create-song-dto';
import { Playlist } from 'src/playlists/playlist.entity';
import { SearchSongDto } from './dto/search-song-dto';
import { SongGenre } from './types';
import { SESSION_SONG, TIME_IN } from 'src/library';
import { CacheService } from 'src/library/cache/cache.service';

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

    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,

    private notificationService: NotificationService,

    private cache: CacheService,

    // @Inject(SearchService) // Explicitly inject ElasticSearchService
    // private readonly searchService: SearchService,
  ) {}

  private async songNotification(song: Song, artist: Artist[]) {
    //  Notify artist
    const user = artist.map((val) => val);

    const artistMsg =
      artist.length <= 1
        ? `Your Song ${song.title} has been created successfully`
        : `Your Collaboration Song title ${song.title} has been created successfully`;

    user.map((user) => {
      this.notificationService.createNotification({
        type: NotificationType.NEW_MUSIC,
        message: artistMsg,
        userId: user.user.id,
        data: song,
      });
    });

    //  Notify artist followers
    const followers = artist.find((fol) => fol.followers);

    const folUser = user.find((val) => val);

    followers.followers.map((fol) => {
      this.notificationService.createNotification({
        type: NotificationType.NEW_MUSIC,
        message: `${folUser} just release a new song: ${song.title}`,
        userId: fol.id,
        data: song,
      });
    });
  }

  public async uploadSong(
    songDTO: UploadSongDto,
    audioUrl: string,
    coverImgUrl: string,
  ): Promise<Song> {
    const artist = await this.artistRepository.find({
      where: { id: In(songDTO.artists) },
      relations: ['user', 'followers'],
    });

    if (artist.length === 0) {
      throw new NotFoundException('Artist not found');
    }

    const song = new Song();
    song.title = songDTO.title;
    song.coverImgUrl = coverImgUrl;
    song.audioUrl = audioUrl;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releaseDate = songDTO.releaseDate;
    song.artists = artist;
    songDTO.album === undefined ? true : false;

    if (songDTO.album) {
      const album = await this.albumService.findAlbumById(songDTO.album);

      if (!album)
        throw new NotFoundException(
          `Album with this ID ${songDTO.album} not found`,
        );

      song.album = album;
    }
    const songSaved = await this.songRepository.save(song);

    await this.songNotification(songSaved, artist);

    // await this.elasticSearch.indexDocument(
    //   this.index,
    //   String(song.songId),
    //   song,
    // );

    // this.logger.log(`Song created: ${JSON.stringify(song)}`);

    await this.cache.set(SESSION_SONG(`${song.id}`), song, TIME_IN.hours[1]);

    return songSaved;
  }

  public async findSongById(songId: number): Promise<Song> {
    const song = await this.songRepository.findOneBy({ id: songId });

    if (!song)
      throw new NotFoundException(`Song with this ID ${songId} not found`);

    return song;
  }

  public async updateSongById(
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

    await this.cache.delete(SESSION_SONG(`${song.id}`));

    await this.cache.set(SESSION_SONG(`${song.id}`), song, TIME_IN.hours[1]);

    return await this.songRepository.update(songId, updateSongData);
  }

  public async deleteSongById(
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

  public async findAllSong(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  public async search(searchDto: SearchDto) {
    const {
      song,
      page,
      limit,
      artist,
      playlist,
      genre,
      sortBy,
      offset,
      order,
    } = searchDto;

    if (song || genre) {
      const [songs, totalSong] = await this.songRepository.findAndCount({
        where: [{ title: ILike(`%${song}%`) }, { genre }],
        relations: ['artists', 'album'],
        take: limit,
        skip: offset,
        order: { [sortBy]: order.toUpperCase() as 'ASC' | 'DESC' },
      });

      return results('song', totalSong, songs);
    }

    if (artist) {
      const [artists, totalArtist] = await this.artistRepository.findAndCount({
        where: { name: ILike(`%${artist}%`) },
        relations: ['songs', 'albums'],
        take: limit,
        skip: offset,
        order: { createdAt: order.toUpperCase() as 'ASC' | 'DESC' },
      });

      return results('artists', totalArtist, artists);
    }

    if (playlist) {
      const [playlists, totalPlaylist] =
        await this.playlistRepository.findAndCount({
          where: { name: ILike(`%${playlist}%`), isPublic: true },
          relations: ['songs', 'creator'],
          take: limit,
          skip: offset,
          order: { createdAt: order.toUpperCase() as 'ASC' | 'DESC' },
        });

      return results('playlist', totalPlaylist, playlists);
    }

    function results(name: string, total: number, data: Record<string, any>) {
      return {
        success: true,
        message: `Found ${total} ${name}(s) matching your query.`,
        data,
        total,
        page,
        limit,
      };
    }
  }

  public async findSongs(searchSongDto: SearchSongDto) {
    const {
      query,
      page = 1,
      limit = 10,
      filters,
      sortBy,
      order,
    } = searchSongDto;

    const offset = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.title = ILike(`%${query}%`);
    }

    if (filters) {
      if (filters.popularity !== undefined) {
        where.popularity = filters.popularity;
      }

      if (filters.album) {
        where.album = { id: filters.album };
      }

      if (filters.genre) {
        where.genre = ILike(`%${filters.genre}%`);
      }
    }

    const [songs, total] = await this.songRepository.findAndCount({
      where,
      relations: ['artists', 'album', 'playlists', 'likedByUsers', 'comments'],
      take: limit,
      skip: offset,
      order: { [sortBy]: order.toUpperCase() as 'ASC' | 'DESC' },
    });

    return {
      success: true,
      message: `Found ${total} song(s) matching your query.`,
      data: songs,
      total,
      page,
      limit,
    };
  }
}
