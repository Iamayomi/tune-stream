import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';

export interface ISong {
  /** song's id **/
  songId: number;

  /** song's title **/
  title: string;

  /** song's release date **/
  releaseDate: Date;

  /** song's duration time **/
  duration: Date;

  /** song's lyrics **/
  lyrics: string;

  /** song's url coverImg **/
  coverImage: string;

  /** song's popularity **/
  popularity: number;

  /** song's genre **/
  genre: string;

  /** song's artists **/
  artists: Artist[];

  /** song's playlist **/
  playlists: Playlist[];

  /** song's album **/
  album?: Album;

  /** song's date created **/
  createdAt: Date;

  /** song's date updated **/
  updatedAt: Date;
}
