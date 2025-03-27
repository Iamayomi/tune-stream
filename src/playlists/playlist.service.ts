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
import {
  AddSongToPlaylist,
  CreatePlayListDto,
} from './dto/create-playlist-dto';

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

  async createPlaylist(
    userId: number,
    playlistDTO: CreatePlayListDto,
  ): Promise<Playlist> {
    const { name, songs, isPublic } = playlistDTO;
    const playlist = new Playlist();

    playlist.name = name;

    const song = await this.songsRepository.find({
      where: { id: In(songs) },
    });

    playlist.songs = song;

    const user = await this.userRepository.findOneBy({ id: userId });

    playlist.creator = user;

    playlist.isPublic = isPublic ?? false;

    return await this.playlistRepository.save(playlist);
  }

  public async getUserPlaylistById(userId: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { creator: { id: userId } },
      relations: ['songs'],
    });

    if (!playlist)
      throw new NotFoundException(
        `User Playlist with this ID ${userId} not found`,
      );

    return playlist;
  }

  public async addSongToPlaylist(addSongToPlaylist: AddSongToPlaylist) {
    const { playlistId, songId } = addSongToPlaylist;
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['tracks'],
    });
    const song = await this.songsRepository.findOne({ where: { id: songId } });

    if (!playlist || !song) {
      throw new NotFoundException('Playlist or Track not found');
    }

    playlist.songs.push(song);
    return this.playlistRepository.save(playlist);
  }

  public async deletePlaylistById(playlistId: number): Promise<DeleteResult> {
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
