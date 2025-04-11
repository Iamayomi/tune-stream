import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { FollowService } from './follow.service';
import { Message, GuardRoute } from 'src/library/decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';

@ApiBearerAuth('JWT-auth')
@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  /////////////////////// Artist Follow Endpoints ///////////////////////////

  /**
   * @route {POST} /api/v1/follow/artist/:artistId
   * @access public */
  @ApiOperation({ summary: 'User follow artist' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user liked songs response',
  })
  @Message('User follow Artist successfully')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Post('artist/:artistId')
  public async followArtist(@Param('artistId') artistId: number, @Req() req) {
    return this.followService.followArtist(req.user.id, artistId);
  }

  /**
   * @route {DELETE} /api/v1/follow/artist/:artistId
   * @access public */
  @ApiOperation({ summary: 'User unfollow artist' })
  @ApiResponse({
    status: 200,
    description: 'It will return the user liked songs response',
  })
  @Message('User unfollow Artist successfully')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Delete('artist/:artistId')
  public async unfollowArtist(@Param('artistId') artistId: number, @Req() req) {
    return this.followService.unfollowArtist(req.user.id, artistId);
  }

  /**
   * @route {GET} /api/v1/follow/artists
   * @access public */
  @ApiOperation({ summary: 'Fetch User follows artist' })
  @ApiResponse({
    status: 200,
    description: 'It will return the user liked songs response',
  })
  @Message('User follow Artist successfully')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get('artists')
  public async getUserFollowedArtists(@Req() req) {
    return this.followService.getUserFollowedArtists(req.user.id);
  }

  /**
   * @route {GET} /api/v1/follow/artist/:artistId/status
   * @access public */
  @ApiOperation({ summary: 'check User follows artist status' })
  @ApiResponse({
    status: 200,
    description: 'It will return the user liked songs response',
  })
  @Message('User follow Artist successfully')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get('artist/:artistId/status')
  public async checkArtistFollowStatus(
    @Param('artistId') artistId: number,
    @Req() req,
  ) {
    return this.followService.checkArtistFollowStatus(req.user.id, artistId);
  }

  //////////////////////////// Album Follow Endpoints ////////////////////////////////////////

  /**
   * @route {POST} /api/v1/follow/album/:albumId
   * @access public */
  @ApiOperation({ summary: 'Fetch User Follows Album' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user liked songs response',
  })
  @Message('User follow Album successfully')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Post('album/:albumId')
  public async followAlbum(@Param('albumId') albumId: number, @Req() req) {
    return this.followService.followAlbum(req.user.id, albumId);
  }

  /**
   * @route {DELETE} /api/v1/follow/album/:albumId
   * @access public */
  @ApiOperation({ summary: 'User Unfollows Album' })
  @ApiResponse({
    status: 200,
    description: 'It will return the user liked songs response',
  })
  @Message('User unfollow Album successfully')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Delete('album/:albumId')
  public async unfollowAlbum(@Param('albumId') albumId: number, @Req() req) {
    return this.followService.unfollowAlbum(req.user.id, albumId);
  }

  /**
   * @route {GET} /api/v1/follow/albums
   * @access public */
  @ApiOperation({ summary: 'Fetch User Followed Album' })
  @ApiResponse({
    status: 200,
    description: 'It will return the user liked songs response',
  })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get('albums')
  public async getUserFollowedAlbums(@Req() req) {
    return this.followService.getUserFollowedAlbums(req.user.id);
  }

  /**
   * @route {GET} /api/v1/follow/album/:albumId/status
   * @access public */
  @ApiOperation({ summary: 'User check Follow Album`s status' })
  @ApiResponse({
    status: 200,
    description: 'It will return the user liked songs response',
  })
  @Get('album/:albumId/status')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  public async checkAlbumFollowStatus(
    @Param('albumId') albumId: number,
    @Req() req,
  ) {
    return this.followService.checkAlbumFollowStatus(req.user.id, albumId);
  }
}
