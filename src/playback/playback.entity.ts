import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Song } from '../songs/song.entity';
import { RepeatMode } from './type';

@Entity('playback')
export class PlaybackState {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.playbackStates)
  user: User;

  @ManyToOne(() => Song, { nullable: true })
  currentSong: Song;

  @Column({ type: 'time' })
  position: Date;

  @Column({ default: false })
  isPlaying: boolean;

  @Column('jsonb', { default: [] })
  queue: Song[];

  @Column({ default: false })
  shuffle: boolean;

  @Column({ type: 'enum', enum: RepeatMode, default: RepeatMode.OFF })
  repeat: RepeatMode;

  @Column('jsonb', { default: [] })
  history: number[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
