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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

import { SongsService } from './song.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';

import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from '../auth/auth.guide/artist.jwt.guard';
import { JWTAuthGuard } from '../auth/auth.guide/jwt.guard';
import { CurrentUser } from 'src/common/decorator/decorator';
import { sendError } from '../../common/library/errors';
import { SearchSongDto } from './dto/search-song-dto';

@Controller('songs')
export class SongsController {
  constructor(private songServices: SongsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongDTO: CreateSongDTO, @Req() request): Promise<Song> {
    return this.songServices.createSong(createSongDTO);
  }

  @ApiBearerAuth('JWT-auth')
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

  @ApiBearerAuth('JWT-auth')
  @Get('search')
  @UseGuards(JWTAuthGuard)
  async searchsongs(@Query() searchSongDto: SearchSongDto) {
    // return await this.songServices.searchSong(query);
    // if (!query) sendError.BadRequestError('Query parameter is required');
    // const page = parseInt(searchSongDto.page);
    // const limit = parseInt(searchSongDto.limit);
    // return await this.songServices.searchSong(query, page, limit);
    return await this.songServices.searchSong(searchSongDto);
    // );
    // return this.songServices.searchSong(query, { genre, artist },
    //   sortBy,
    //   order,
    //   page,
    //   limit,
    // );
  }

  @ApiBearerAuth('JWT-auth')
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

  @ApiBearerAuth('JWT-auth')
  @Patch(':songId/artists/:artistId')
  @UseGuards(JwtArtistGuard)
  update(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() updateSongDTO: UpdateSongDTO,
    @CurrentUser() currentUserId: number,
  ): Promise<UpdateResult> {
    if (currentUserId !== artistId)
      sendError.unauthenticatedError(
        `This user ${artistId} id does not belong to you`,
      );

    return this.songServices.updateSongById(songId, artistId, updateSongDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':songId/artists/:artistId')
  @UseGuards(JwtArtistGuard)
  async remove(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @CurrentUser() currentUserId: number,
  ): Promise<DeleteResult> {
    if (currentUserId !== artistId)
      sendError.unauthenticatedError(
        `This user ${artistId} id does not belong to you`,
      );

    return await this.songServices.deleteSongById(songId, artistId);
  }
}
