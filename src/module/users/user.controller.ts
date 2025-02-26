import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/decorator';
import { UserService } from './user.service';
import { JWTAuthGuard } from 'src/module/auth/auth.guide/jwt.guard';
import { Playlist } from '../playlists/playlist.entity';
import { sendError } from '../../common/library/errors';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get user's profile
   * @route {GET} /api/v1/user/profile
   * @access protected
   */
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @UseGuards(JWTAuthGuard)
  getProfile(
    @Req()
    request,
  ) {
    return {
      msg: 'authenticated with api key',
      user: request.user,
    };
  }

  /**
   * Get user's playlists
   * @route {GET} /api/v1/user/:userId/playlists
   * @access protected
   */
  @ApiOperation({ summary: 'Get user playlists' })
  @Get(':userId/playlists')
  @UseGuards(JWTAuthGuard)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUserId: number,
  ): Promise<Playlist[]> {
    if (currentUserId !== userId)
      sendError.unauthenticatedError(
        `This id ${userId} does not belong to this user`,
      );

    return await this.userService.findUserPlaylistsById(userId);
  }
}
