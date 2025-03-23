import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

@Entity('playlists')
export class Playlist {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  playlistId: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;

  @ManyToMany(() => Song, (song) => song.playlists)
  songs: Song[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
