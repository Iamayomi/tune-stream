import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArtistsService } from './artist.service';
import { createArtistDTO } from './dto/create-artist.dto';
import { artistType } from './artist.type';
import { JWTAuthGuard } from '../auth/auth.guide/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('artists')
export class ArtistsController {
  constructor(private artistService: ArtistsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post(':userId')
  @UseGuards(JWTAuthGuard)
  createArtist(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() artistData: createArtistDTO,
  ) {
    return this.artistService.userUpgradeToArtist(userId, artistData);
  }
}
