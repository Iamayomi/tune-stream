import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { Repository } from 'typeorm';
import { StreamSongDto } from './dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from 'src/users/user.entity';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectQueue('stream-queue')
    private streamQueue: Queue,
  ) {}

  public async streamSong(streamSongDto: StreamSongDto) {
    const { userId, songId, durationPlayed } = streamSongDto;

    const song = await this.songRepository.findOneBy({ id: songId });

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!song || !user) throw new BadRequestException('Song or user not found');

    if (durationPlayed >= 30) {
      await this.streamQueue.add('log-stream', {
        songId,
        userId,
        durationPlayed,
        playedAt: new Date(),
      });
    }

    return { url: song.audioUrl };
  }
}
