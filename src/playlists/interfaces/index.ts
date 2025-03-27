import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

export interface IPlaylist {
  /** playlist's id **/
  id: number;

  /** playlist's name **/
  name: string;

  /** user creator to playlist**/
  creator: User;

  /** playlist's songs **/
  songs: Song[];

  /** is playlist public**/
  isPublic: Boolean;

  /** playlist's date created **/
  createdAt: Date;

  /** playlist's date updated **/
  updatedAt: Date;
}
