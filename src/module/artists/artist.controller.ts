import { Body, Controller, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { ArtistsService } from './artist.service';
import { createArtistDTO } from './dto/create-artist.dto';
import { artistType } from './artist.type';

@Controller('artists')
export class ArtistsController {
    constructor(private artistService: ArtistsService){}

    @Post(':userId')
    createArtist( @Param('userId', ParseIntPipe) userId: number, 
    @Body() artistData: createArtistDTO) {
        return this.artistService.createArtistForUser(userId, artistData);
    }
}
