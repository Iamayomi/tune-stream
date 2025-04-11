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
import { ApiBearerAuth } from '@nestjs/swagger';
import { GuardRoute } from 'src/library/decorator';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { Roles } from 'src/library/types';

@Controller('artists')
export class ArtistsController {
  constructor(private artistService: ArtistsService) {}

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

  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':userId')
  getAnArtist(@Param('userId', ParseIntPipe) userId: number) {
    return this.artistService.findArtistById(userId);
  }
}
