import { Body, Controller, Post } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamSongDto } from './dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleAllowed } from 'src/library/decorator/role-allowed';
import { GuardRoute } from 'src/library/decorator';
import { Roles } from 'src/library/types';

@Controller('stream')
export class StreamController {
  constructor(private streamService: StreamService) {}

  @ApiOperation({ summary: 'Stream Song' })
  @ApiBearerAuth('JWT-auth')
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Post('stream')
  async streamSong(@Body() streamSongDto: StreamSongDto) {
    return this.streamService.streamSong(streamSongDto);
  }
}
