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
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProtectUser } from 'src/library/decorator';
import { ArtistGuard } from 'src/library/guards/artist.jwt.guard';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseGuards(ArtistGuard)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDTO, @Req() request) {
    // console.log(createAlbumDto)
    return await this.albumService.createAlbum(createAlbumDto);
  }

  @Get()
  @ProtectUser()
  async findAll() {
    return await this.albumService.findAllAlbum();
  }

  @Get(':id')
  @ProtectUser()
  async findOne(@Param('id') id: number) {
    return await this.albumService.findAlbumById(id);
  }

  @Patch(':albumId/artists/:artistId')
  @UseGuards(ArtistGuard)
  update(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() updateAlbumDto: UpdateAlbumDTO,
  ): Promise<UpdateResult> {
    return this.albumService.updateAlbumById(albumId, artistId, updateAlbumDto);
  }

  @Delete(':albumId/artists/:artistId')
  @UseGuards(ArtistGuard)
  async delete(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<DeleteResult> {
    return await this.albumService.deleteAlbumById(albumId, artistId);
  }
}
