import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/module/songs/song.entity';
import { User } from 'src/module/users/user.entity';
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

  async createPlaylist(playListDTO: CreatePlayListDto): Promise<Playlist> {
    
    const playList = new Playlist();

    playList.name = playListDTO.name;
    
    const songs = await this.songsRepository.findBy(playListDTO.songs);

    // playList.songs = songs;

    // const user = await this.userRepository.findOneBy({ id: playListDTO.user });

    // playList.user = user;

    return this.playlistRepository.save(playList);
  }
}
