import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArtistsService } from './artist.service';
import { createArtistDTO } from './dto/create-artist.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GuardRoute, Message } from 'src/library/decorator';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';

@Controller('artists')
export class ArtistsController {
  constructor(private artistService: ArtistsService) {}

  @Message('User upgrade to artist successfully')
  @ApiOperation({ summary: 'Upgrade to artist' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Post(':userId')
  createArtist(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() artistData: createArtistDTO,
  ) {
    return this.artistService.userUpgradeToArtist(userId, artistData);
  }

  @Message('An Artist Fetch successfully')
  @ApiOperation({ summary: 'Get an artist' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':userId')
  getAnArtist(@Param('userId', ParseIntPipe) userId: number) {
    return this.artistService.findArtistById(userId);
  }
}
