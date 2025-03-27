import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { IComment } from './interface';

// Comment Entity to represent user comments
@Entity('comments')
export class Comment implements IComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Song, (song) => song.comments)
  song: Song;
}
