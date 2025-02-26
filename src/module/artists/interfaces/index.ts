import { Album } from 'src/module/albums/album.entity';
import { Song } from 'src/module/songs/song.entity';
import { User } from 'src/module/users/user.entity';
import { Artist } from '../artist.entity';

export interface IArtist {
  /** album's id **/
  id: number;

  /** album's artists **/
  artist: Artist;

  /** artist's stageName **/
  stageName: string;

  /** artist's songs **/
  songs: Song[];

  /** artists's albums **/
  albums: Album[];

  /** user artists's **/
  user: User;

  /** artists's date created **/
  createdAt: Date;

  /** artists's date updated **/
  updatedAt: Date;
}
