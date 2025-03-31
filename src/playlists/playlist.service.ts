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
import { NotificationType } from 'src/notification/type';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private notificationService: NotificationService,
  ) {}

  public async createPlaylist(
    userId: number,
    playlistDTO: CreatePlayListDto,
  ): Promise<Playlist> {
    const { name, songs, isPublic } = playlistDTO;
    const playlist = new Playlist();

    playlist.name = name;

    const song = await this.songsRepository.find({
      where: { id: In(songs) },
    });

    if (song.length === 0)
      throw new NotFoundException(`Song with this ID ${songs} not found`);

    playlist.songs = song;

    const user = await this.userRepository.findOneBy({ id: userId });

    playlist.creator = user;

    playlist.isPublic = isPublic ?? false;
    const playist = await this.playlistRepository.save(playlist);

    await this.playlistNotification(
      playist,
      user,
      `Your playist ${playlist.name} has been created successfully`,
    );
    return playist;
  }

  private async playlistNotification(
    playlist: Playlist,
    user: User,
    message: string,
  ) {
    //  Notify user
    this.notificationService.createNotification({
      type: NotificationType.PLAYLIST_UPDATE,
      message,
      userId: user.id,
      data: playlist,
    });
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

  public async addSongToPlaylist(
    userId: number,
    addSongToPlaylist: AddSongToPlaylist,
  ) {
    const { playlistId, songs } = addSongToPlaylist;

    // const user = await this.userRepository.findOne({
    //   where: { id: userId },
    //   relations: ['playlists'],
    // });

    // console.log(user.playlists);
    // if (!user) throw new NotFoundException('User not found');

    // console.log(user);

    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['songs'],
    });

    const song = await this.songsRepository.find({ where: { id: In(songs) } });

    if (!playlist || !song) {
      throw new NotFoundException('Playlist or Song not found');
    }

    playlist.songs.push(...song);

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
