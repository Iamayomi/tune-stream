import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDTO } from './dto/create-album-dto';
import { UpdateAlbumDTO } from './dto/update-album-dto';
import { JwtArtistGuard } from '../auth/auth.guide/artist.jwt.guard';
import { JWTAuthGuard } from '../auth/auth.guide/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseGuards(JwtArtistGuard)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDTO, @Req() request) {
    // console.log(createAlbumDto)
    return await this.albumService.createAlbum(createAlbumDto);
  }

  @Get()
  @UseGuards(JWTAuthGuard)
  async findAll() {
    return await this.albumService.findAllAlbum();
  }

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  async findOne(@Param('id') id: number) {
    return await this.albumService.findAlbumById(id);
  }

  @Patch(':albumId/artists/:artistId')
  @UseGuards(JwtArtistGuard)
  update(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() updateAlbumDto: UpdateAlbumDTO
  ): Promise<UpdateResult> {
    return this.albumService.updateAlbumById(albumId, artistId, updateAlbumDto);
  }

  @Delete(':albumId/artists/:artistId')
  @UseGuards(JwtArtistGuard)
  async delete(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('artistId', ParseIntPipe) artistId: number
  ): Promise<DeleteResult> {
    return await this.albumService.deleteAlbumById(albumId, artistId);
  }
}
