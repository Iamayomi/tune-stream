import { Body, Controller, Post } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamSongDto } from './dto';

@Controller('stream')
export class StreamController {
  constructor(private streamService: StreamService) {}

  @Post('stream')
  async streamSong(@Body() streamSongDto: StreamSongDto) {
    return this.streamService.streamSong(streamSongDto);
  }
}
