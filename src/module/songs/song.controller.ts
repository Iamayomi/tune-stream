import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SongsService } from './song.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';

import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from '../auth/auth.guide/artist.jwt.guard';
import { JWTAuthGuard } from '../auth/auth.guide/jwt.guard';
import { CurrentUser } from 'src/common/decorator/decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('songs')
export class SongsController {
  constructor(private songServices: SongsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDTO: CreateSongDTO, @Req() request): Promise<Song> {
    return this.songServices.createSong(createSongDTO);
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songServices.pagination({
      page,
      limit,
    });
  }

  @Get(':songId')
  @UseGuards(JWTAuthGuard)
  findOne(
    @Param(
      'songId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    songId: number,
  ): Promise<Song> {
    return this.songServices.findSongById(songId);
  }

  @Patch(':songId/artists/:artistId')
  @UseGuards(JwtArtistGuard)
  update(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() updateSongDTO: UpdateSongDTO,
    @CurrentUser() currentUserId: number,
  ): Promise<UpdateResult> {
    if (currentUserId !== artistId) {
      throw new UnauthorizedException(`This user ${artistId} id does not belong to you`);
    }
    return this.songServices.updateSongById(songId, artistId, updateSongDTO);
  }

  @Delete(':songId/artists/:artistId')
  @UseGuards(JwtArtistGuard)
  async remove(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @CurrentUser() currentUserId: number,
  ): Promise<DeleteResult> {
    if (currentUserId !== artistId) {
      throw new UnauthorizedException(`This user ${artistId} id does not belong to you`);
    }
    return await this.songServices.deleteSongById(songId, artistId);
  }
}
