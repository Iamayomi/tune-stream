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
import { GuardRoute, Message } from 'src/library/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/library/cloudinary/cloudinary.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';

@Controller('albums')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Message('Album Created successfully')
  @ApiOperation({ summary: 'Artist Create an Album' })
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('cover'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload audio and cover image',
    type: CreateAlbumDTO, // <-- we'll define this next
  })
  @RoleAllowed(Roles.ARTIST)
  @GuardRoute()
  @Post()
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

  @Message('Albums Fetched successfully')
  @ApiOperation({ summary: 'User Get all Albums' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get()
  async findAll() {
    return await this.albumService.findAllAlbum();
  }

  @Message('Album Fetched successfully')
  @ApiOperation({ summary: 'User Get an Album' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.albumService.findAlbumById(id);
  }

  @Message('Album Update successfully')
  @ApiOperation({ summary: 'Artist Update an Albums' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.ARTIST, Roles.ADMIN)
  @GuardRoute()
  @Patch(':albumId/artists/:artistId')
  update(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
    @Body() updateAlbumDto: UpdateAlbumDTO,
  ): Promise<UpdateResult> {
    return this.albumService.updateAlbumById(albumId, artistId, updateAlbumDto);
  }

  @Message('Album Deleted successfully')
  @ApiOperation({ summary: 'Artist Artist an Albums' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.ARTIST, Roles.ADMIN)
  @GuardRoute()
  @Delete(':albumId/artists/:artistId')
  async delete(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<DeleteResult> {
    return await this.albumService.deleteAlbumById(albumId, artistId);
  }
}
