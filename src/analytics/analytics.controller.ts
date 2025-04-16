import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterDto } from './dto/analytics-dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('artists')
  async getTopArtists(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.topArtists(filter.period || 'total');
  }

  @Get('songs')
  async getTopSongs(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.topSongs(filter.period || 'total');
  }

  @Get('albums')
  async getTopAlbums(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.topAlbums(filter.period || 'total');
  }

  @Get('user/songs')
  async getUserSongs(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getUserStats(
      filter.userId,
      'song',
      filter.period || 'total',
    );
  }

  @Get('user/albums')
  async getUserAlbums(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getUserStats(
      filter.userId,
      'album',
      filter.period || 'total',
    );
  }

  @Get('user/artists')
  async getUserArtists(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getUserStats(
      filter.userId,
      'artist',
      filter.period || 'total',
    );
  }

  @Get('user/most-listened/song')
  async getMostListenedSong(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getMostListened(
      filter.userId,
      'song',
      filter.period || 'total',
    );
  }

  @Get('user/most-listened/album')
  async getMostListenedAlbum(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getMostListened(
      filter.userId,
      'album',
      filter.period || 'total',
    );
  }

  @Get('user/most-listened/artist')
  async getMostListenedArtist(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getMostListened(
      filter.userId,
      'artist',
      filter.period || 'total',
    );
  }

  @Get('artists/popular')
  async getMostListenedArtists() {
    return this.analyticsService.getMostListenedArtists();
  }

  @Get('user/:userId/stats')
  async getUserStats(@Param('userId') userId: number) {
    return this.analyticsService.getUserStat(userId);
  }

  @Get('artist/:artistId/stats')
  async getArtistStats(@Param('artistId') artistId: number) {
    return this.analyticsService.getArtistStats(artistId);
  }
}
