import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Song } from '../songs/song.entity';
import { Artist } from '../artists/artist.entity';
import { User } from 'src/users/user.entity';
import { IAlbum } from './interfaces';

@Entity('albums')
export class Album implements IAlbum {
  //   @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ManyToOne(() => Artist, (artist) => artist.albums)
  artist: Artist; // 2

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'varchar', length: 100, default: 'Other' })
  genre: string;

  @Column({ type: 'varchar', nullable: true })
  coverImgUrl: string;

  @Column({ type: 'varchar', nullable: true })
  imagePublicId: string;

  @OneToMany(() => Song, (song) => song.album, { cascade: true })
  tracks: Song[];

  @ManyToMany(() => User, (user) => user.followedAlbums)
  @JoinTable()
  followers: User[];

  @Column({ default: 0 })
  totalFollowers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
