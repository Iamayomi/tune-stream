import { BadRequestException, Injectable } from '@nestjs/common';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Stream } from '../stream/stream.entity';
import { TimeFrame } from 'src/library/types';
import { CacheService } from 'src/library/cache/cache.service';
import {
  STATS_ALBUM,
  STATS_ARTIST,
  STATS_POPULAR_ARTISTS,
  STATS_SONG,
  STATS_USER,
  STREAM_SONG_COUNT,
  // STATS_USER,
  TIME_IN,
} from 'src/library';
import { Song } from 'src/songs/song.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Stream) private streamRepository: Repository<Stream>,

    @InjectRepository(Song) private songRepository: Repository<Song>,

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
    const cacheKey = STATS_SONG(time);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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
          artist: s.song.artists[0]?.name || 'Unknown',
          album: s.song.album?.title || 'Single',
          streams: 0,
        });
      }
      stats.get(id).streams++;
    }

    const result = [...stats.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 10);

    await this.cache.set(cacheKey, result, TIME_IN.days[1]);
    return result;
  }

  public async topAlbums(time: TimeFrame) {
    const cacheKey = STATS_ALBUM(time);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const date = this.getDateRange(time);
    const streams = await this.streamRepository.find({
      relations: ['song', 'song.album', 'song.album.artist'],
      where: date ? { streamedAt: MoreThanOrEqual(date) } : {},
    });

    const stats = new Map();
    for (const s of streams) {
      if (!s.song.album) continue;
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

    const result = [...stats.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 10);

    await this.cache.set(cacheKey, result, TIME_IN.days[1]);
    return result;
  }

  public async topArtists(time: TimeFrame) {
    const cacheKey = STATS_ARTIST(time);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const date = this.getDateRange(time);
    const streams = await this.streamRepository.find({
      relations: ['song', 'song.artists'],
      where: date ? { streamedAt: MoreThanOrEqual(date) } : {},
    });

    const stats = new Map();
    for (const s of streams) {
      for (const artist of s.song.artists) {
        const id = artist.id;
        if (!stats.has(id)) {
          stats.set(id, {
            id,
            name: artist.name,
            streams: 0,
          });
        }
        stats.get(id).streams++;
      }
    }

    const result = [...stats.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 10);

    await this.cache.set(cacheKey, result, TIME_IN.days[1]);
    return result;
  }

  private async getStatsForUser(
    userId: number,
    category: 'song' | 'album' | 'artist',
    time: TimeFrame,
  ) {
    const cacheKey = STATS_USER(String(userId), category, time);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const date = this.getDateRange(time);
    const streams = await this.streamRepository.find({
      relations: [
        'song',
        'song.artists',
        'song.album',
        'song.album.artist',
        'user',
      ],
      where: {
        user: { id: userId },
        ...(date && { streamedAt: MoreThanOrEqual(date) }),
      },
    });

    const statsMap = new Map();

    for (const s of streams) {
      let id: number;
      let name: string | string[];
      let artistName: string | undefined;

      if (category === 'song') {
        id = s.song.id;
        name = s.song.title;
        artistName = s.song.artists[0]?.name;
      } else if (category === 'album') {
        if (!s.song.album) continue;
        id = s.song.album.id;
        name = s.song.album.title;
        artistName = s.song.album.artist.name;
      } else {
        id = s.song.artists[0]?.id;
        if (!id) continue;
        name = s.song.artists.map((a) => a.name);
      }

      if (!statsMap.has(id)) {
        statsMap.set(id, { id, name, artistName, streams: 0 });
      }

      statsMap.get(id).streams++;
    }

    const result = [...statsMap.values()]
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 5);

    await this.cache.set(cacheKey, result, TIME_IN.days[1]);
    return result;
  }

  public async getUserStats(
    userId: number,
    category: 'song' | 'album' | 'artist',
    time: TimeFrame,
  ) {
    if (!userId) throw new BadRequestException('User ID required');
    return await this.getStatsForUser(userId, category, time);
  }

  public async getMostListened(
    userId: number,
    category: 'song' | 'album' | 'artist',
    time: TimeFrame,
  ) {
    if (!userId) throw new BadRequestException('User ID required');
    const stats = await this.getStatsForUser(userId, category, time);
    return stats[0] || null;
  }

  public async getMostListenedArtists() {
    const cacheKey = STATS_POPULAR_ARTISTS;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const streams = await this.streamRepository.find({
      relations: ['song', 'song.artists', 'user'],
    });

    const stats = new Map();
    for (const s of streams) {
      for (const artist of s.song.artists) {
        const id = artist.id;
        if (!stats.has(id)) {
          stats.set(id, {
            id,
            name: artist.name,
            listener_count: new Set<number>(),
            streams: 0,
          });
        }
        stats.get(id).listener_count.add(s.user.id);
        stats.get(id).streams++;
      }
    }

    const result = [...stats.values()]
      .map((s) => ({
        id: s.id,
        name: s.name,
        listener_count: s.listener_count.size,
        stream_count: s.streams,
      }))
      .sort(
        (a, b) =>
          b.listener_count - a.listener_count ||
          b.stream_count - a.stream_count,
      )
      .slice(0, 10);

    await this.cache.set(cacheKey, result, TIME_IN.days[1]);
    return result;
  }

  public async getUserStat(userId: number) {
    const cacheKey = `user_stats:${userId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const stats = await this.getUserStats(userId, 'song', 'total');
    const totalStreams = await this.streamRepository.count({
      where: { user: { id: userId } },
    });

    const result = {
      totalStreams,
      topSongs: stats.map((s) => ({
        song: { id: s.id, title: s.name, artist: s.artistName },
        count: s.streams,
      })),
    };

    await this.cache.set(cacheKey, result, 3600);
    return result;
  }

  public async getArtistStats(artistId: number) {
    const songs = await this.songRepository.find({
      relations: ['streams', 'artists'],
      where: { artists: { id: artistId } },
    });

    const totalStreams = songs.reduce(
      (sum, song) => sum + song.streams.length,
      0,
    );
    const streamCounts = await Promise.all(
      songs.map(async (song) => ({
        song,
        streams: song.streams.length,
        cachedStreams:
          (await this.cache.get(STREAM_SONG_COUNT(`${song.id}`)))?.count || 0,
      })),
    );

    return { totalStreams, songs: streamCounts };
  }
}
