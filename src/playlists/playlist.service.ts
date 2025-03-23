import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlayListDto } from './dto/create-playlist-dto';

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

    const song = await this.songsRepository.find({
      where: { songId: In(songs) },
    });

    playlist.songs = song;

    const users = await this.userRepository.findOneBy({ userId: user });

    playlist.user = users;

    return await this.playlistRepository.save(playlist);
  }

  async getPlaylistById(playlistId: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { playlistId },
      relations: ['songs'],
    });

    if (!playlist)
      throw new NotFoundException(
        `Playlist with this ID ${playlistId} not found`,
      );

    return playlist;
  }

  async deletePlaylistById(playlistId: number): Promise<DeleteResult> {
    const playlist = await this.playlistRepository.findOne({
      where: { playlistId },
    });

    if (!playlist) {
      throw new NotFoundException(
        `Playlist with this ID ${playlistId} not found`,
      );
    }
    return await this.playlistRepository.delete(playlistId);
  }
}
