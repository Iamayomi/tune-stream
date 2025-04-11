import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Playlist } from '../playlists/playlist.entity';
import { ProtectUser } from 'src/library/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './types/dto/update-user.dto';
import { CloudinaryService } from 'src/library/cloudinary/cloudinary.service';

// @ProtectUser()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Get user's profile
   * @route {GET} /api/v1/user/profile
   * @access protected
   */
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  getProfile(
    @Req()
    request,
  ) {
    return {
      msg: 'authenticated with api key',
      user: request.user,
    };
  }

  @Get(':userId')
  async getMe(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.findById(userId);
  }

  /**
   * Get user's playlists
   * @route {GET} /api/v1/user/:userId/playlists
   * @access protected
   */
  @ApiOperation({ summary: 'Get user playlists' })
  @Get(':userId/playlists')
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist[]> {
    return await this.userService.findUserPlaylistsById(userId);
  }

  @Patch('profile')
  @ApiBearerAuth('JWT-auth')
  @ProtectUser()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  async uploadProfileImage(
    @Req() req,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    let uploadedImage = null;
    const user = req.user;

    const public_id = `user_img_${Date.now()}`;

    if (image) {
      uploadedImage = await this.cloudinaryService.uploadFile(image.buffer, {
        folder: 'users/profile',
        resource_type: 'image',
        public_id,
      });

      if (user.imagePublicId) {
        await this.cloudinaryService.deleteFile(user.imagePublicId);
      }

      const userData = {
        profileUrl: uploadedImage?.secure_url,
        imagePublicId: uploadedImage?.public_id,
        ...updateUserDto,
      };
      return await this.userService.updateUser(req.user.id, userData);
    }
  }
}
