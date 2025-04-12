import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

@Entity('stream')
export class Stream {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Song, (song) => song.streams)
  song: Song;

  @ManyToOne(() => User, (user) => user.streams)
  user: User;

  @CreateDateColumn()
  streamedAt: Date;
}
