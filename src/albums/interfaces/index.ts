import { Artist } from 'src/artists/artist.entity';
import { Song } from 'src/songs/song.entity';

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
  coverImage: string;

  /** album's genre **/
  genre: string;

  /** album's artists **/
  artist: Artist;

  /** album's date created **/
  createdAt: Date;

  /** album's date updated **/
  updatedAt: Date;
}
