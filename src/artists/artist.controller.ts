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
import { ProtectUser } from 'src/library/decorator';

@ProtectUser()
@Controller('artists')
export class ArtistsController {
  constructor(private artistService: ArtistsService) {}

  @ApiBearerAuth('JWT-auth')
  @Post(':userId')
  createArtist(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() artistData: createArtistDTO,
  ) {
    return this.artistService.userUpgradeToArtist(userId, artistData);
  }

  @ApiBearerAuth('JWT-auth')
  @Get(':userId')
  getAnArtist(@Param('userId', ParseIntPipe) userId: number) {
    return this.artistService.findArtistById(userId);
  }
}
