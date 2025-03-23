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

import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { DeleteResult } from 'typeorm';
import { PlaylistsService } from './playlist.service';
import { CreatePlayListDto } from './dto/create-playlist-dto';
import { Playlist } from './playlist.entity';
import { ProtectUser } from 'src/library/decorator';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistService: PlaylistsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ProtectUser()
  async create(
    @Body() playlistDTO: CreatePlayListDto,
    @Body('user') userId: number,
  ): Promise<Playlist> {
    return await this.playlistService.createPlaylist(playlistDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':playlistId/users/:userId')
  @ProtectUser()
  async findOne(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist> {
    return await this.playlistService.getPlaylistById(playlistId);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':playlistId/users/:userId')
  @ProtectUser()
  async delete(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<DeleteResult> {
    return await this.playlistService.deletePlaylistById(playlistId);
  }
}
