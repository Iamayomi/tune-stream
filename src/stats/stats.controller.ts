import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsDTO } from './dto/stats-dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('songs')
  getTopSongs(@Query() statsDto: StatsDTO) {
    return this.statsService.topSongs(statsDto.time);
  }

  @Get('albums')
  getTopAlbums(@Query() statsDto: StatsDTO) {
    return this.statsService.topAlbums(statsDto.time);
  }

  @Get('artists')
  getTopArtists(@Query() statsDto: StatsDTO) {
    return this.statsService.topArtists(statsDto.time);
  }

  // Get the most listened song, album, or artist for a user
  @Get('user/most-listened')
  getMostListened(
    @Query('userId') userId: number,
    @Query('category') category: 'song' | 'album' | 'artist',
    @Query() statsDto: StatsDTO,
  ) {
    return this.statsService.getMostListened(userId, category, statsDto.time);
  }

  // Get top songs, albums, or artists for a user
  @Get('user/top')
  getUserTopStats(
    @Query('userId') userId: number,
    @Query('category') category: 'song' | 'album' | 'artist',
    @Query() statsDto: StatsDTO,
  ) {
    return this.statsService.getUserStats(userId, category, statsDto.time);
  }
}
