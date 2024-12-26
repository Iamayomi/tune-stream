import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Song } from 'src/module/songs/song.entity';


@Entity('artists')
export class Artist {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageName: string;

  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];

  @OneToOne(() => User, (user) => user.artist, { cascade: true })
  @JoinColumn()
  user: User;
}
