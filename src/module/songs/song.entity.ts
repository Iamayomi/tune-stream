import { Artist } from 'src/module/artists/artist.entity';
import { Playlist } from 'src/module/playlists/playlist.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Album } from '../albums/album.entity';

@Entity('songs')
export class Song {
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // @Column('varchar', { array: true })
  // artists: string[];


  @Column({ type: 'date' })
  releasedDate: Date;

  @Column({ type: 'time' })
  duration: Date;

  @Column({ type: 'text' })
  lyrics: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: "songs_artists" })
  artists: Artist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  @JoinTable({ name: "songs_playlists" })
  playlists: Playlist[];

  @ManyToOne(() => Album, (album) => album.tracks)
  album: Album;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
