import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../albums/album.entity';
import { User } from 'src/users/user.entity';
import { ISong } from './interfaces';
import { Comment } from 'src/comments/comment.entity';
import { SongGenre } from './types';
import { Stream } from '../stats/stream.entity';

@Entity('songs')
export class Song implements ISong {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'time' })
  duration: Date;

  @Column({ type: 'text' })
  lyrics: string;

  @Column({ type: 'varchar' })
  coverImgUrl: string;

  @Column({ default: 0 })
  popularity: number;

  @Column({ default: 0 })
  playCount: number;

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ type: 'varchar', enum: SongGenre, nullable: true })
  genre: SongGenre;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  @JoinTable({ name: 'songs_playlists' })
  playlists: Playlist[];

  @ManyToOne(() => Album, (album) => album.tracks, { onDelete: 'CASCADE' })
  album?: Album;

  @ManyToMany(() => User, (user) => user.likedSongs)
  @JoinTable()
  likedByUsers: User[];

  @OneToMany(() => Comment, (comment) => comment.song)
  comments: Comment[];

  @OneToMany(() => Stream, (stream) => stream.song)
  streams: Stream[];

  @Column({ default: 0 })
  totalLikes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
