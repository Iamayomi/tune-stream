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
import { UserService } from './user.service';
import { Playlist } from '../playlists/playlist.entity';
import { ProtectUser } from 'src/library/decorator';

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
  @ProtectUser()
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
  @ProtectUser()
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist[]> {
    return await this.userService.findUserPlaylistsById(userId);
  }
}
