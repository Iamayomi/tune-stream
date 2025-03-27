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
import { IArtist } from './interfaces';

@Entity('artists')
export class Artist implements IArtist {
  // @PrimaryGeneratedColumn('uuid')

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageName: string;

  @Column({ nullable: true })
  bio: string;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[]; // 1

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[]; // 2

  @OneToOne(() => User, (user) => user.artist)
  @JoinColumn()
  user: User;

  @ManyToMany(() => User, (user) => user.followedArtists)
  @JoinTable()
  followers: User[];

  @Column({ default: 0 })
  totalFollowers: number;

  @Column({ default: 0 })
  monthlyListeners: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
