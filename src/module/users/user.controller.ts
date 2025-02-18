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
import { CurrentUser } from 'src/common/decorator/decorator';
import { UserService } from './user.service';
import { JWTAuthGuard } from 'src/module/auth/auth.guide/jwt.guard';
import { Playlist } from '../playlists/playlist.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

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

  @Get(':userId/playlists')
  @UseGuards(JWTAuthGuard)
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUserId: number,
  ): Promise<Playlist[]> {
    if (currentUserId !== userId) {
      throw new UnauthorizedException(
        `This id ${userId} does not belong to this user`,
      );
    }
    return await this.userService.findUserPlaylistsById(userId);
  }
}
