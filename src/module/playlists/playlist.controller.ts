import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlist.service';
import { CreatePlayListDto } from './dto/create-playlist-dto';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistsController {
    
  constructor(private playlistService: PlaylistsService) {}

  @Post()
  create(@Body()playlistDTO: CreatePlayListDto ): Promise<Playlist> {
    return this.playlistService.createPlaylist(playlistDTO);
  }
}
