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
import { Express } from 'express';
import { UserService } from './user.service';
import { Playlist } from '../playlists/playlist.entity';
import { GuardRoute, Message } from 'src/library/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from 'src/library/cloudinary/cloudinary.service';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';
import { CustomLogger } from 'src/library';

// @ProtectUser()
@Controller('users')
export class UserController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Get user's profile
   * @route {GET} /api/v1/user/profile
   * @access protected
   */
  @Message('User profile fetch successfully')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
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

  @Message('User Fetched successfully')
  @ApiOperation({
    summary: 'Get a user',
  })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':userId')
  async getMe(@Param('userId', ParseIntPipe) userId: number) {
    this.logger.log(`user id: ${userId}`, 'UserService');
    return await this.userService.findById(userId);
  }

  /**
   * Get user's playlists
   * @route {GET} /api/v1/user/:userId/playlists
   * @access protected
   */
  @Message('user playlist Fetch successfully')
  @ApiOperation({ summary: 'Get user playlists' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':userId/playlists')
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Playlist[]> {
    return await this.userService.findUserPlaylistsById(userId);
  }

  @Message('Upload user profile successfully')
  @ApiOperation({
    summary: 'Upload User data',
  })
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Patch('profile')
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
