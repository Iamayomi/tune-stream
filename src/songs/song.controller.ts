import {
  BadRequestException,
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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import { DeleteResult, UpdateResult } from 'typeorm';

import { SongsService } from './song.service';
import { UploadSongDto } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';

import { Song } from './song.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SearchDto } from './dto/search-dto';
import { GuardRoute, Message } from 'src/library/decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/library/cloudinary/cloudinary.service';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';

@Controller('songs')
export class SongsController {
  constructor(
    private songServices: SongsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Message('Song Uploaded successfully')
  @ApiOperation({
    summary: 'Artist upload a song',
  })
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload audio and cover image',
    type: UploadSongDto, // <-- we'll define this next
  })
  @RoleAllowed(Roles.ARTIST)
  @GuardRoute()
  @Post('upload')
  async uploadSong(
    @UploadedFiles()
    files: {
      audio?: Express.Multer.File[];
      cover?: Express.Multer.File[];
    },
    @Body() uploadSongDto: UploadSongDto,
  ) {
    const audio = files.audio?.[0];
    const cover = files.cover?.[0];

    if (!audio || !cover) {
      throw new Error('Both audio and cover files are required');
    }

    const [uploadedAudio, uploadedCover] = await Promise.all([
      this.cloudinaryService.uploadFile(audio.buffer, {
        folder: 'tracks/audio',
        resource_type: 'video',
      }),
      this.cloudinaryService.uploadFile(cover.buffer, {
        folder: 'tracks/covers',
        resource_type: 'image',
      }),
    ]);

    return await this.songServices.uploadSong(
      uploadSongDto,
      uploadedAudio.secure_url,
      uploadedCover.secure_url,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Search for songs with filters, sorting, and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results for songs, artists, albums',
    type: [Song], // assuming Song is your response entity
  })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get('search')
  async searchsongs(@Query() searchDto: SearchDto) {
    return await this.songServices.search(searchDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'finds for songs with filters, sorting, and pagination',
  })
  @ApiResponse({
    status: 200,
    description:
      'Song results for songs with filters, sorting, and pagination ',
    type: [Song], // assuming Song is your response entity
  })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get()
  async findSongs(@Query() searchDto: SearchDto) {
    return await this.songServices.findSongs(searchDto);
  }

  @Message('Song Fetch successfully')
  @ApiOperation({
    summary: 'User Get a song',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':songId')
  async findOneSong(
    @Param(
      'songId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    songId: number,
  ): Promise<Song> {
    return this.songServices.findSongById(songId);
  }

  @Message('Song Update successfully')
  @ApiOperation({
    summary: 'Artist Update a song',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.ARTIST)
  @GuardRoute()
  @Patch(':songId/artists/:artistId')
  async updateSong(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() updateSongDTO: UpdateSongDTO,
  ): Promise<UpdateResult> {
    return this.songServices.updateSongById(songId, artistId, updateSongDTO);
  }

  @Message('Song Deleted successfully')
  @ApiOperation({
    summary: 'Artist Delete a song',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.ARTIST)
  @GuardRoute()
  @Delete(':songId/artists/:artistId')
  async remove(
    @Param('songId', ParseIntPipe) songId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<DeleteResult> {
    return await this.songServices.deleteSongById(songId, artistId);
  }
}
