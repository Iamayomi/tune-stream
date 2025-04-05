import { Album } from 'src/albums/album.entity';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';

export interface ISong {
  /** song's id **/
  id: number;

  /** song's title **/
  title: string;

  /** song's release date **/
  releaseDate: Date;

  /** song's duration time **/
  duration: Date;

  /** song's lyrics **/
  lyrics: string;

  /** audio url **/
  audioUrl: string;

  /** song's url coverImg **/
  coverImgUrl: string;

  /** song's play count **/
  playCount: number;

  /** song's popularity **/
  popularity: number;

  /** song's genre **/
  genre: string[];

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
