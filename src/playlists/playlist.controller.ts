import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

import { DeleteResult } from 'typeorm';
import { PlaylistsService } from './playlist.service';
import {
  AddSongToPlaylist,
  CreatePlayListDto,
} from './dto/create-playlist-dto';
import { Playlist } from './playlist.entity';
import { GuardRoute } from 'src/library/decorator';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistService: PlaylistsService) {}

  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Post()
  async createPlaylist(
    @Req() req,
    @Body() playlistDTO: CreatePlayListDto,
  ): Promise<Playlist> {
    return await this.playlistService.createPlaylist(req.user.id, playlistDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Patch(':userId')
  async updateSongPlaylist(
    @Body() addSongToPlaylist: AddSongToPlaylist,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist> {
    return await this.playlistService.addSongToPlaylist(
      userId,
      addSongToPlaylist,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':playlistId/users/:userId')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  async findOne(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist> {
    return await this.playlistService.getUserPlaylistById(playlistId);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':playlistId/users/:userId')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  async delete(
    @Param('playlistId', ParseIntPipe) playlistId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<DeleteResult> {
    return await this.playlistService.deletePlaylistById(playlistId);
  }
}
