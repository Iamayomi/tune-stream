import { Artist } from 'src/artists/artist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

export interface IAlbum {
  /** album's id **/
  id: number;

  /** album's title **/
  title: string;

  /** album's songs **/
  tracks: Song[];

  /** album's release date **/
  releaseDate: Date;

  /** album's url coverImg **/
  coverImgUrl: string;

  /** album's genre **/
  genre: string;

  /** album's public image **/
  imagePublicId: string;

  /** album's artists **/
  artist: Artist;

  /** album's followers **/
  followers: User[];

  /** album's date created **/
  createdAt: Date;

  /** album's date updated **/
  updatedAt: Date;
}
