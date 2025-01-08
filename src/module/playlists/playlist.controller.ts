import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlist.service';
import { CreatePlayListDto } from './dto/create-playlist-dto';
import { Playlist } from './playlist.entity';
import { AuthGuard } from '@nestjs/passport';
import { JWTAuthGuard } from '../auth/auth.guide/jwt.guard';
import { DeleteResult } from 'typeorm';
import { CurrentUser } from 'src/common/decorator/decorator';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistService: PlaylistsService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(
    @Body() playlistDTO: CreatePlayListDto,
    @Body('user') userId: number,
    @CurrentUser() currentUserId: number,
  ): Promise<Playlist> {
    if (currentUserId !== userId) {
      throw new UnauthorizedException(`This user ${userId} id does not belong to you`);
    }
    return await this.playlistService.createPlaylist(playlistDTO);
  }


  @Get(":playlistId/users/:userId")
  @UseGuards(JWTAuthGuard)
  async findOne(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUserId: number,
  ): Promise<Playlist> {
    if (userId !== currentUserId) {
      throw new UnauthorizedException(`This user ${userId} id does not belong to you`);
    }
    return await this.playlistService.getPlaylistById(playlistId);
  }


  @Delete(':playlistId/users/:userId')
  @UseGuards(JWTAuthGuard)
  async delete(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUserId: number,
  ): Promise<DeleteResult> {
     if (currentUserId !== userId) {
      throw new UnauthorizedException(`This user ${userId} id does not belong to you`);
    }
    return await this.playlistService.deletePlaylistById(playlistId);
  }
}
