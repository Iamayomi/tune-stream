import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { Song } from 'src/module/songs/song.entity';
import { User } from 'src/module/users/user.entity';
import { CreatePlayListDto } from './dto/create-playlist-dto';
import { sendError } from '../../common/library/errors';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createPlaylist(playlistDTO: CreatePlayListDto): Promise<Playlist> {
    const { name, songs, user } = playlistDTO;
    const playlist = new Playlist();

    playlist.name = name;

    const song = await this.songsRepository.find({ where: { id: In(songs) } });

    playlist.songs = song;

    const users = await this.userRepository.findOneBy({ id: user });

    playlist.user = users;

    return await this.playlistRepository.save(playlist);
  }

  async getPlaylistById(playlistId: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['songs'],
    });

    if (!playlist)
      sendError.notfoundError(`Playlist with this ID ${playlistId} not found`);

    return playlist;
  }

  async deletePlaylistById(playlistId: number): Promise<DeleteResult> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new NotFoundException(
        `Playlist with this ID ${playlistId} not found`,
      );
    }
    return await this.playlistRepository.delete(playlistId);
  }
}
