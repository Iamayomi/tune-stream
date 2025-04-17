import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterDto } from './dto/analytics-dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { GuardPremium, GuardRoute } from 'src/library/decorator';
import { Roles } from 'src/library/types';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({
    summary: 'Fetch Top Artists filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('artists')
  async getTopArtists(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.topArtists(filter.period || 'total');
  }

  @ApiOperation({
    summary: 'Fetch Top Song filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('songs')
  async getTopSongs(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.topSongs(filter.period || 'total');
  }

  @ApiOperation({
    summary: 'Fetch Top Album filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('albums')
  async getTopAlbums(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.topAlbums(filter.period || 'total');
  }

  @ApiOperation({
    summary:
      'Stats for most listened Song for a user filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('user/songs')
  async getUserSongs(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getUserStats(
      filter.userId,
      'song',
      filter.period || 'total',
    );
  }

  @ApiOperation({
    summary:
      'Stats for most listened Album for a user filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('user/albums')
  async getUserAlbums(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getUserStats(
      filter.userId,
      'album',
      filter.period || 'total',
    );
  }

  @ApiOperation({
    summary:
      'Stats for most listened Artist for a user filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('user/artists')
  async getUserArtists(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getUserStats(
      filter.userId,
      'artist',
      filter.period || 'total',
    );
  }

  @ApiOperation({
    summary: 'Fetch most listened Song for User filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('user/most-listened/song')
  async getMostListenedSong(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getMostListened(
      filter.userId,
      'song',
      filter.period || 'total',
    );
  }

  @ApiOperation({
    summary: 'Fetch most listened Album for User filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('user/most-listened/album')
  async getMostListenedAlbum(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getMostListened(
      filter.userId,
      'album',
      filter.period || 'total',
    );
  }

  @ApiOperation({
    summary:
      'Fetch most listened Artist for User filter by day, month and year',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('user/most-listened/artist')
  async getMostListenedArtist(@Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getMostListened(
      filter.userId,
      'artist',
      filter.period || 'total',
    );
  }

  @ApiOperation({ summary: 'Fetch most popular Artist' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('artists/popular')
  async getMostListenedArtists() {
    return this.analyticsService.getMostListenedArtists();
  }

  @ApiOperation({ summary: 'Fetch User Statistics' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @GuardPremium()
  @Get('user/:userId/stats')
  async getUserStats(@Param('userId') userId: number) {
    return this.analyticsService.getUserStat(userId);
  }

  @ApiOperation({ summary: 'Fetch Artist Statistics' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.ARTIST)
  @GuardRoute()
  @GuardPremium()
  @Get('artist/:artistId/stats')
  async getArtistStats(@Param('artistId') artistId: number) {
    return this.analyticsService.getArtistStats(artistId);
  }
}
