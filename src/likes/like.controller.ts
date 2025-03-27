import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { LikeService } from './like.service';
import { Message, ProtectUser } from 'src/library/decorator';

@ApiBearerAuth('JWT-auth')
@ProtectUser()
@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  /**
   * @route {POST} /api/v1/like/song/:songId
   * @access public */
  @ApiOperation({ summary: 'Like a Song' })
  @ApiResponse({
    status: 201,
    description: 'It will return the liked song in the response',
  })
  @Message('User like song successfully')
  @Post('song/:songId')
  public async likeSong(@Param('songId') songId: number, @Req() req) {
    return this.likeService.likeSong(req.user.id, songId);
  }

  /**
   * @route {DELETE} /api/v1/like/song/:songId
   * @access public */
  @ApiOperation({ summary: 'Delete Song`s like successfully' })
  @ApiResponse({
    status: 200,
    description: 'It will return the unlike song in the response',
  })
  @Message('Song unlike')
  @Delete('song/:songId')
  public async unlikeSong(@Param('songId') songId: number, @Req() req) {
    return this.likeService.unlikeSong(req.user.id, songId);
  }

  /**
   * @route {GET} /api/v1/like/songs
   * @access public */
  @ApiOperation({ summary: 'Get Song`s likes' })
  @ApiResponse({
    status: 200,
    description: 'It will return the user liked songs response',
  })
  @Message('Song like fetch successfully')
  @Get('songs')
  public async getUserLikedSongs(@Req() req) {
    return this.likeService.getUserLikedSongs(req.user.id);
  }

  /**
   * @route {GET} /api/v1/like/song/:songId/status
   * @access public */
  @ApiOperation({ summary: 'Get Song`s likes status' })
  @ApiResponse({
    status: 200,
    description: 'It will return the song liked status response',
  })
  @Message('Song like status fetch successfully')
  @Get('song/:songId/status')
  public async checkSongLikedStatus(
    @Param('songId') songId: number,
    @Req() req,
  ) {
    return this.likeService.checkSongLikedStatus(req.user.id, songId);
  }
}
