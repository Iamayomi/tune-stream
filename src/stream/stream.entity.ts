import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Album } from 'src/albums/album.entity';

@Entity('stream')
export class Stream {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @ManyToOne(() => User, (user) => user.streams)
  user: User;

  @ManyToOne(() => Song, (song) => song.streams)
  song: Song;

  @ManyToOne(() => Album, (album) => album.streams, { nullable: true })
  album: Album;

  @CreateDateColumn()
  streamedAt: Date;
}
