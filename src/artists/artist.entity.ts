import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Song } from 'src/songs/song.entity';
import { Album } from '../albums/album.entity';

@Entity('artists')
export class Artist {
  // @PrimaryGeneratedColumn('uuid')

  @PrimaryGeneratedColumn()
  artistId: number;

  @Column()
  stageName: string;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[]; // 1

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[]; // 2

  @OneToOne(() => User, (user) => user.artist, { cascade: true })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
