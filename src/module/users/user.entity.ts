import { Exclude } from 'class-transformer';
import { Artist } from 'src/module/artists/artist.entity';
import { Playlist } from 'src/module/playlists/playlist.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {

  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  email: string;

  
  @Column({ type: "varchar", default: "free" }) 
  subscription: string;
  
  @Column()
  @Exclude()
  password: string;

  @Column()
  apiKey: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];

  @OneToOne(() => Artist, (artist) => artist.user)
  artist: Artist;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
