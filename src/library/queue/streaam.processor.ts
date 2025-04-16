import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bull';
import { Stream } from '../../stream/stream.entity';
import { Song } from '../../songs/song.entity';
import { User } from '../../users/user.entity';
import { CacheService } from '../cache/cache.service';
import { JobDTO } from './dto/job-dto';
import { STREAM_ALBUM_COUNT, STREAM_SONG_COUNT, TIME_IN } from '../config';
import { Album } from 'src/albums/album.entity';

@Processor('stream-queue')
export class StreamProcessor {
  constructor(
    @InjectRepository(Stream)
    private streamRepository: Repository<Stream>,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Album)
    private albumRepository: Repository<Album>,

    private cache: CacheService,
  ) {}

  @Process('log-stream')
  public async logStream(job: JobDTO) {
    const { songId, userId, duration, streamedAt, albumId } = job;

    const song = await this.songRepository.findOneBy({ id: songId });

    const user = await this.userRepository.findOneBy({ id: userId });

    const album = albumId
      ? await this.albumRepository.findOneBy({ id: albumId })
      : null;

    if (!song || !user) return;

    const stream = this.streamRepository.create({
      streamedAt,
      duration,
      user,
      song,
      album,
    });

    await this.streamRepository.save(stream);

    const currentSong = await this.cache.get(STREAM_SONG_COUNT(`${songId}`));

    await this.cache.set(
      STREAM_SONG_COUNT(`${songId}`),
      { count: (currentSong?.count || 0) + 1 },
      TIME_IN.minutes[0],
    );

    if (albumId) {
      const currentAlbum = await this.cache.get(
        STREAM_ALBUM_COUNT(`${albumId}`),
      );
      await this.cache.set(
        STREAM_ALBUM_COUNT(`${albumId}`),
        { count: (currentAlbum?.count || 0) + 1 },
        TIME_IN.minutes[0],
      );
    }
  }
}
