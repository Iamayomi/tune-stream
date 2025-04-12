import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Stream } from './stream.entity';
import { TimeFrame } from 'src/library/types';
import { CacheService } from 'src/library/cache/cache.service';
import {
  STATS_ALBUM,
  STATS_ARTIST,
  STATS_SONG,
  STATS_USER,
  // STATS_USER,
  TIME_IN,
} from 'src/library';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stream) private streamRepository: Repository<Stream>,

    private cache: CacheService,
  ) {}

  private getDateRange(filter: TimeFrame) {
    const now = new Date();
    if (filter === 'day') return new Date(now.setHours(0, 0, 0, 0));
    if (filter === 'month')
      return new Date(now.getFullYear(), now.getMonth(), 1);
    if (filter === 'year') return new Date(now.getFullYear(), 0, 1);
    return null;
  }

  public async topSongs(time: TimeFrame) {
    const date = this.getDateRange(time);

    const streams = await this.streamRepository.find({
      where: date ? { streamedAt: MoreThanOrEqual(date) } : {},
      relations: ['song', 'song.album', 'song.artists'],
    });

    const stats = new Map();
    for (const s of streams) {
      const id = s.song.id;
      if (!stats.has(id)) {
        stats.set(id, {
          id,
          title: s.song.title,
          artist: s.song.artists.find((val) => val.name),
          album: s.song.album.title,
          streams: 0,
        });
      }
      stats.get(id).streams++;
    }

    await this.cache.set(STATS_SONG(`${time}`), stats, TIME_IN.days[1]);

    return [...stats.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 10);
  }

  public async topAlbums(time: TimeFrame) {
    const date = this.getDateRange(time);

    const streams = await this.streamRepository.find({
      relations: ['song', 'song.album', 'song.album.artist'],
      where: date ? { streamedAt: MoreThanOrEqual(date) } : {},
    });

    const stats = new Map();
    for (const s of streams) {
      const id = s.song.album.id;
      if (!stats.has(id)) {
        stats.set(id, {
          id,
          title: s.song.album.title,
          artist: s.song.album.artist.name,
          streams: 0,
        });
      }
      stats.get(id).streams++;
    }

    await this.cache.set(STATS_ALBUM(`${time}`), stats, TIME_IN.days[1]);

    return [...stats.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 10);
  }

  public async topArtists(time: TimeFrame) {
    const date = this.getDateRange(time);

    const streams = await this.streamRepository.find({
      relations: ['song', 'song.artists'],
      where: date ? { streamedAt: MoreThanOrEqual(date) } : {},
    });

    const stats = new Map();
    for (const s of streams) {
      const id = s.song.artists.filter((val) => val.id);
      if (!stats.has(id)) {
        stats.set(id, {
          id,
          name: s.song.artists.filter((val) => val.name),
          streams: 0,
        });
      }
      stats.get(id).streams++;
    }

    await this.cache.set(STATS_ARTIST(`${time}`), stats, TIME_IN.days[1]);

    return [...stats.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 10);
  }

  private async getStatsForUser(
    userId: number,
    category: 'song' | 'album' | 'artist',
    time: TimeFrame,
  ) {
    const date = this.getDateRange(time);

    const streams = await this.streamRepository.find({
      relations: ['song', 'song.artists', 'song.album', 'user'],
      where: {
        user: { id: userId },
        ...(date && { streamedAt: MoreThanOrEqual(date) }),
      },
    });

    const statsMap = new Map();

    for (const s of streams) {
      let id;
      let name;
      let streamsCount = 0;

      // Based on category, we fetch the appropriate stats
      if (category === 'song') {
        id = s.song.id;
        name = s.song.title;
      } else if (category === 'album') {
        id = s.song.album.id;
        name = s.song.album.title;
      } else if (category === 'artist') {
        id = s.song.artists.filter((val) => val.id);
        name = s.song.artists.filter((val) => val.name);
      }

      if (!statsMap.has(id)) {
        statsMap.set(id, { id, name, streams: 0 });
      }

      statsMap.get(id).streams++;
    }

    await this.cache.set(
      STATS_USER(`${userId}`, `${category}`, `${time}`),
      statsMap,
      TIME_IN.days[1],
    );

    // Sort the stats by streams count and return top results
    return [...statsMap.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 5); // Return top 5 for dynamic categories
  }

  // Dynamic method to return top songs, albums, or artists for a user
  async getUserStats(
    userId: number,
    category: 'song' | 'album' | 'artist',
    time: 'day' | 'month' | 'year',
  ) {
    return await this.getStatsForUser(userId, category, time);
  }

  async getMostListened(
    userId: number,
    category: 'song' | 'album' | 'artist',
    time: 'day' | 'month' | 'year',
  ) {
    const stats = await this.getStatsForUser(userId, category, time);
    return stats[0]; // The first element is the most listened item
  }
}
