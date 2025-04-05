import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Patch,
  UploadedFiles,
  UseInterceptors,
  ConflictException,
  UploadedFile,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDTO } from './dto/create-album-dto';
import { UpdateAlbumDTO } from './dto/update-album-dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProtectArtist, ProtectUser } from 'src/library/decorator';
import { ArtistGuard } from 'src/library/guards/artist.jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/library/cloudinary/cloudinary.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('albums')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiBearerAuth('JWT-auth')
  @ProtectArtist()
  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload audio and cover image',
    type: CreateAlbumDTO, // <-- we'll define this next
  })
  async uploadSong(
    @UploadedFile() cover: Express.Multer.File,
    @Body() createAlbumDTO: CreateAlbumDTO,
  ) {
    const public_id = `album_img_${Date.now()}`;

    if (!cover) {
      throw new ConflictException(' cover files is required');
    }

    const uploadedCover = await this.cloudinaryService.uploadFile(
      cover.buffer,
      {
        folder: 'albums/covers',
        resource_type: 'image',
        public_id,
      },
    );

    return await this.albumService.createAlbum(
      createAlbumDTO,
      uploadedCover.secure_url,
      uploadedCover.public_id,
    );
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
