import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { PlaybackState } from './playback.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/library/cache/cache.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PLAYBACK, SESSION_SOCKET, TIME_IN } from 'src/library';
import { RepeatMode } from './type';
import { PlaybackActionDTO } from './dto/create-playback-dto';

@Injectable()
export class PlaybackService {
  constructor(
    @InjectRepository(PlaybackState)
    private playbackStateRepository: Repository<PlaybackState>,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private cache: CacheService,

    @InjectQueue('stream-queue')
    private streamQueue: Queue,
  ) {}

  public async joinSession(playbackDto: PlaybackActionDTO) {
    const { userId, socketId } = playbackDto;

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new BadRequestException('User not found');

    await this.cache.set(SESSION_SOCKET(`${userId}`, socketId), true, 0);
  }

  public async leaveSession(userId: number, socketId: string) {
    await this.cache.delete(SESSION_SOCKET(`${userId}`, socketId));
  }

  public async getPlaybackState(userId: number): Promise<PlaybackState> {
    let state = await this.playbackStateRepository.findOne({
      where: { user: { id: userId } },
      relations: ['currentSong', 'user', 'queue'],
    });

    if (!state) {
      state = this.playbackStateRepository.create({
        user: { id: userId },
        isPlaying: false,
        position: 0,
        queue: [],
        shuffle: false,
        repeat: RepeatMode.OFF,
        history: [],
      });
      await this.playbackStateRepository.save(state);
    }

    return state;
  }

  public async playSong(userId: number, songId: number) {
    const song = await this.songRepository.findOneBy({ id: songId });

    if (!song) throw new BadRequestException('Song not found');

    let state = await this.getPlaybackState(userId);

    if (state.currentSong) {
      state.history = [...state.history, state.currentSong.id].slice(-50);
    }

    state.currentSong = song;
    state.isPlaying = true;
    state.position = new Date();
    state.updatedAt = new Date();

    state = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), state, TIME_IN.hours[1]);

    await this.streamQueue.add('log-stream', {
      songId,
      userId,
      durationPlayed: 30,
      playedAt: new Date(),
    });

    return state;
  }

  public async pauseSong(sessionDto: PlaybackActionDTO) {
    const { userId } = sessionDto;

    const state = await this.getPlaybackState(userId);

    if (!state.currentSong) throw new BadRequestException('No song playing');

    state.isPlaying = false;
    state.updatedAt = new Date();
    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async stopSong(playbackDto: PlaybackActionDTO) {
    const { userId } = playbackDto;

    const state = await this.getPlaybackState(userId);

    state.currentSong = null;
    state.isPlaying = false;
    state.position = new Date();
    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async seekSong(playbackDto: PlaybackActionDTO) {
    const { userId, position } = playbackDto;
    const state = await this.getPlaybackState(userId);

    if (!state.currentSong) throw new BadRequestException('No song playing');

    if (position.getTime() < 0 || position > state.currentSong.duration)
      throw new BadRequestException('Invalid position');

    state.position = position;
    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), state, TIME_IN.hours[1]);

    return updatedState;
  }

  public async nextSong(userId: number) {
    const state = await this.getPlaybackState(userId);
    if (state.currentSong) {
      state.history = [...state.history, state.currentSong.id].slice(-50);
    }

    if (state.repeat === RepeatMode.TRACK && state.currentSong) {
      state.position = new Date();
      state.isPlaying = true;
    } else if (state.queue.length === 0) {
      if (state.repeat === RepeatMode.QUEUE && state.history.length > 0) {
        state.queue = await this.songRepository.findBy({
          id: In(state.history),
        });
        state.history = [];
      } else {
        state.currentSong = null;
        state.isPlaying = false;
        state.position = new Date();
      }
    } else {
      if (state.shuffle) {
        const randomIndex = Math.floor(Math.random() * state.queue.length);
        state.currentSong = state.queue.splice(randomIndex, 1)[0];
      } else {
        state.currentSong = state.queue.shift();
      }
      state.isPlaying = true;
      state.position = new Date();

      await this.streamQueue.add('log-stream', {
        songId: state.currentSong.id,
        userId,
        durationPlayed: 30,
        playedAt: new Date(),
      });
    }

    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async previousSong(userId: number) {
    const state = await this.getPlaybackState(userId);

    if (state.history.length === 0) {
      if (state.currentSong) {
        state.position = new Date();
        state.isPlaying = true;
      }
    } else {
      const previousSongId = state.history.pop();
      const previousSong = await this.songRepository.findOneBy({
        id: previousSongId,
      });
      if (previousSong) {
        if (state.currentSong) state.queue.unshift(state.currentSong);

        state.currentSong = previousSong;
        state.isPlaying = true;
        state.position = new Date();

        await this.streamQueue.add('log-stream', {
          songId: previousSong.id,
          userId,
          durationPlayed: 30,
          playedAt: new Date(),
        });
      }
    }

    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async addToQueue(userId: number, songId: number) {
    const song = await this.songRepository.findOneBy({ id: songId });

    if (!song) throw new BadRequestException('Song not found');

    const state = await this.getPlaybackState(userId);

    state.queue = [...state.queue, song];

    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async removeFromQueue(playbackDto: PlaybackActionDTO) {
    const { userId, songId } = playbackDto;

    const state = await this.getPlaybackState(userId);

    state.queue = state.queue.filter((song) => song.id !== songId);

    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async toggleShuffle(userId: number) {
    const state = await this.getPlaybackState(userId);

    state.shuffle = !state.shuffle;

    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async toggleRepeat(userId: number, mode: RepeatMode) {
    const state = await this.getPlaybackState(userId);

    state.repeat = mode;

    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }

  public async playFromQueue(playbackDto: PlaybackActionDTO) {
    const { userId, queueIndex } = playbackDto;
    const state = await this.getPlaybackState(userId);
    if (queueIndex < 0 || queueIndex >= state.queue.length)
      throw new BadRequestException('Invalid queue index');

    if (state.currentSong) {
      state.history = [...state.history, state.currentSong.id].slice(-50);
    }

    state.currentSong = state.queue.splice(queueIndex, 1)[0];
    state.isPlaying = true;
    state.position = new Date();

    await this.streamQueue.add('log-stream', {
      songId: state.currentSong.id,
      userId,
      durationPlayed: 30,
      playedAt: new Date(),
    });

    state.updatedAt = new Date();

    const updatedState = await this.playbackStateRepository.save(state);

    await this.cache.set(PLAYBACK(`${userId}`), updatedState, TIME_IN.hours[1]);

    return updatedState;
  }
}
