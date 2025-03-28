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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

import { SongsService } from './song.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';

import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SearchSongDto } from './dto/search-song-dto';
import { ProtectUser, ProtectArtist } from 'src/library/decorator';

@Controller('songs')
export class SongsController {
  constructor(private songServices: SongsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post()
  @ProtectArtist()
  create(@Body() createSongDTO: CreateSongDTO): Promise<Song> {
    return this.songServices.createSong(createSongDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @Get()
  @ProtectUser()
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
  @ProtectUser()
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
  @ProtectUser()
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
  @ProtectArtist()
  update(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() updateSongDTO: UpdateSongDTO,
  ): Promise<UpdateResult> {
    return this.songServices.updateSongById(songId, artistId, updateSongDTO);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':songId/artists/:artistId')
  @ProtectArtist()
  async remove(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<DeleteResult> {
    return await this.songServices.deleteSongById(songId, artistId);
  }
}
