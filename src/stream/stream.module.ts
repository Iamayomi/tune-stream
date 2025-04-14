import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { Stream } from './stream.entity';
import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Stream, User]),
    BullModule.registerQueue({ name: 'stream-queue' }),
  ],
  providers: [StreamService],
  controllers: [StreamController],
})
export class StreamModule {}
