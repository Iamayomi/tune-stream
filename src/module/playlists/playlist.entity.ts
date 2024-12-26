import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from 'src/module/songs/song.entity';
import { User } from 'src/module/users/user.entity';

@Entity('playlists')
export class Playlist {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.playlists)
  user: User;

  @ManyToOne(() => Song, (song) => song.playlists)
  songs: Song[];
}
