import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

export interface IComment {
  /** comment's id **/
  id: number;

  /** comment's content **/
  content: string;

  /** comment's date created **/
  createdAt: Date;

  /** comment's user **/
  user: User;

  /** comment's song **/
  song: Song;
}
