import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDTO } from './dto/create-album-dto';
import { JwtArtistGuard } from '../auth/auth.guide/artist.jwt.guard';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseGuards(JwtArtistGuard)
  async create(@Body() createAlbumDto: CreateAlbumDTO, @Req() request) {
    return await this.albumService.createAlbum(createAlbumDto);
  }

  @Get()
  async findAll() {
    return await this.albumService.findAllAlbum();
  }

  @Get(':id')
  @UseGuards(JwtArtistGuard)
  async findOne(@Param('id') id: string) {
    return await this.albumService.findAlbumById(id);
  }

//   @Put(':id')
//   @UseGuards(JwtArtistGuard)
//   async update(@Param('id') id: string, @Body() updateAlbumDto: CreateAlbumDTO) {
//     return await this.albumService.updateAlbumById(id, updateAlbumDto);
//   }

  @Delete(':id')
  @UseGuards(JwtArtistGuard)
  async delete(@Param('id') id: string) {
    return await this.albumService.deleteAlbumById(id);
  }
}
