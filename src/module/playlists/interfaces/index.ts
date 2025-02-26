import { Song } from 'src/module/songs/song.entity';
import { User } from 'src/module/users/user.entity';

export interface IPlaylist {
  /** playlist's id **/
  id: number;

  /** playlist's name **/
  name: string;

  /** user reference to playlist**/
  user: User;

  /** playlist's songs **/
  songs: Song[];

  /** playlist's date created **/
  createdAt: Date;

  /** playlist's date updated **/
  updatedAt: Date;
}
