import { Album } from 'src/albums/album.entity';
import { Roles } from '../../library/types';
import { Artist } from 'src/artists/artist.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Song } from 'src/songs/song.entity';
import { Subscription } from 'src/subscriptions/subscription.entity';
import { SUBSCRIPTION_PLAN } from 'src/subscriptions/type';

export interface IUser {
  /** User's id **/
  id: number;

  /** User's fullname **/
  fullName: string;

  /** User's bio **/
  bio: string;

  /** user avatar url **/
  profileUrl: string;

  /** User's username **/
  username: string;

  /** User's suscription **/
  subscription: SUBSCRIPTION_PLAN;

  /** User's premium bool **/
  isPremium: boolean;

  /** User's promodeCode **/
  promoCode: string;

  /** User's phone number **/
  phone: string;

  /** User's email **/
  email: string;

  /** Status checking terms and conditions of service */
  terms_of_service: boolean;

  /** Roles */
  roles: Roles[];

  /** User' image public id **/
  imagePublicId: string;

  /** User's login password **/
  password: string;

  /** User's api key **/
  api_key: string;

  /** Email verification status. If email is not verified, their accounts cannot be accessed */
  verified_email: boolean;

  /** Phone verification status. If phone is not verified, their accounts cannot be accessed */
  verified_phone: boolean;

  /** user subscription */
  subscriptions: Partial<Subscription>;

  /** user's playlist **/
  playlists: Playlist[];

  /** user's songs likes **/
  likedSongs: Song[];

  /** user's album followed **/
  followedAlbums: Album[];

  /** user's Artist followed **/
  followedArtists: Artist[];

  /** user's artist **/
  artist: Artist;

  /** user's refresh_token **/
  refresh_token: string;

  /** user's date created **/
  createdAt: Date;

  /** user's date updated **/
  updatedAt: Date;
}

/** Interface describing custom methods associated with the `User` Entity */
export interface IUserMethods {
  /** Verifies the provided password by comparing it with the password of the user. */
  verifyPassword: (candidatePassword: string) => Promise<boolean>;
}
