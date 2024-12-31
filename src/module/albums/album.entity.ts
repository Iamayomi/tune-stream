import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Song } from '../songs/song.entity';
import { Artist } from '../artists/artist.entity';

@Entity('albums')
export class Album {
  //   @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ManyToOne(() => Artist, (artist) => artist.albums)
  artist: Artist; // 2

  @Column({ type: 'date' })
  releaseDate: Date;

  @Column({ type: 'varchar', length: 100, default: 'Other' })
  genre: string;

  @Column({ type: 'varchar', nullable: true })
  coverImage: string;

  @OneToMany(() => Song, (song) => song.album)
  tracks: Song[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
